import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

type SpacesConfig = {
  bucket: string;
  cdnBaseUrl: string;
  keyPrefix: string;
};

@Injectable()
export class ArticleObjectStorage {
  private client?: S3Client;
  private config?: SpacesConfig;

  async put(objectKey: string, body: Buffer, contentType: string): Promise<void> {
    const { bucket } = this.getConfig();
    await this.getClient().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: body,
        ContentType: contentType,
        ACL: 'public-read',
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
  }

  async remove(objectKey: string): Promise<void> {
    const { bucket } = this.getConfig();
    await this.getClient().send(
      new DeleteObjectCommand({ Bucket: bucket, Key: objectKey }),
    );
  }

  objectKey(folder: 'covers' | 'body' | 'banners', fileName: string): string {
    return `${this.getConfig().keyPrefix}/${folder}/${fileName}`;
  }

  publicUrl(objectKey: string): string {
    const base = this.getConfig().cdnBaseUrl.replace(/\/+$/, '');
    const encodedKey = objectKey
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');
    return `${base}/${encodedKey}`;
  }

  private getConfig(): SpacesConfig {
    if (this.config) return this.config;

    const region = this.required('SPACES_REGION');
    const endpoint = this.requiredUrl('SPACES_ENDPOINT');
    const bucket = this.required('SPACES_BUCKET');
    const accessKeyId = this.required('SPACES_ACCESS_KEY_ID');
    const secretAccessKey = this.required('SPACES_SECRET_ACCESS_KEY');
    const cdnBaseUrl = this.requiredUrl('SPACES_CDN_BASE_URL');
    const keyPrefix = this.required('SPACES_ARTICLE_PREFIX').replace(
      /^\/+|\/+$/g,
      '',
    );
    if (
      !keyPrefix ||
      keyPrefix.includes('..') ||
      !/^[a-zA-Z0-9/_-]+$/.test(keyPrefix)
    ) {
      throw new Error('SPACES_ARTICLE_PREFIX is invalid');
    }

    this.client = new S3Client({
      region,
      endpoint,
      forcePathStyle: false,
      credentials: { accessKeyId, secretAccessKey },
    });
    this.config = { bucket, cdnBaseUrl, keyPrefix };
    return this.config;
  }

  private getClient(): S3Client {
    this.getConfig();
    return this.client!;
  }

  private required(name: string): string {
    const value = process.env[name]?.trim();
    if (!value) throw new Error(`${name} is required for article uploads`);
    return value;
  }

  private requiredUrl(name: string): string {
    const value = this.required(name);
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      throw new Error(`${name} must be a valid URL`);
    }
    if (url.protocol !== 'https:') {
      throw new Error(`${name} must use HTTPS`);
    }
    return url.href;
  }
}
