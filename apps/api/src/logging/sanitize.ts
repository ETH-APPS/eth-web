import { stdSerializers } from 'pino';

const REDACTED = '[REDACTED]';
export const MAX_BODY_BYTES = 8192;

function isSensitiveKey(key: string): boolean {
  return /password|passwd|passphrase|token|secret|authorization|cookie|apikey|credential/i.test(
    key.replace(/[^a-z0-9]/gi, ''),
  );
}

function redactQueryCredentials(text: string): string {
  // Framework errors can reflect the original URL in their message/stack.
  return text.replace(
    /([?&])([^=&\s]+)=([^&\s"'<>]*)/g,
    (match, separator: string, key: string) => {
      let decoded = key;
      try {
        decoded = decodeURIComponent(key);
      } catch {
        /* Keep malformed keys as sent. */
      }
      return isSensitiveKey(decoded) ? `${separator}${key}=${REDACTED}` : match;
    },
  );
}

/** Sanitize a copy; logging must never mutate the request or response. */
export function sanitize(
  value: unknown,
  seen = new WeakSet<object>(),
  depth = 0,
): unknown {
  if (typeof value === 'string') return redactQueryCredentials(value);
  if (value === null || typeof value !== 'object') {
    return typeof value === 'bigint' ? value.toString() : value;
  }
  if (Buffer.isBuffer(value)) return '[Binary omitted]';
  if (value instanceof Date) return value.toJSON();
  if (depth >= 10) return '[Max depth]';
  if (seen.has(value)) return '[Circular]';
  seen.add(value);

  let result: unknown;
  if (value instanceof Error) {
    result = sanitize(stdSerializers.err(value), seen, depth + 1);
  } else if (Array.isArray(value)) {
    result = value.map((item) => sanitize(item, seen, depth + 1));
  } else {
    result = Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        isSensitiveKey(key) ? REDACTED : sanitize(item, seen, depth + 1),
      ]),
    );
  }

  seen.delete(value);
  return result;
}

export function bodyForLog(value: unknown): unknown {
  if (value === undefined) return undefined;
  if (
    typeof value === 'string' &&
    (value.trimStart().startsWith('{') || value.trimStart().startsWith('['))
  ) {
    try {
      value = JSON.parse(value);
    } catch {
      // Do not persist partially parsed JSON, which may contain credentials.
      return { omitted: true, reason: 'unparsed_json' };
    }
  }
  const safe = sanitize(value);
  const json = JSON.stringify(safe);
  const bytes = Buffer.byteLength(json ?? '');
  return bytes > MAX_BODY_BYTES
    ? { omitted: true, reason: 'body_too_large', bytes, limit: MAX_BODY_BYTES }
    : safe;
}
