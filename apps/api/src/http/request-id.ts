import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';

export function getRequestId(request: Request, response: Response): string {
  const existing = request.id;
  if (typeof existing === 'string') return existing;

  const header = response.getHeader('x-request-id');
  if (typeof header === 'string') return header;

  const generated = randomUUID();
  response.setHeader('x-request-id', generated);
  return generated;
}
