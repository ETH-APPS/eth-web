import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

export type GoogleIdentity = {
  sub: string;
  email: string;
  firstName: string;
  lastName: string | null;
};

@Injectable()
export class GoogleTokenVerifier {
  private readonly client = new OAuth2Client();

  async verify(idToken: string): Promise<GoogleIdentity> {
    const audience = process.env.GOOGLE_WEB_CLIENT_ID;
    if (!audience) {
      throw new ServiceUnavailableException({
        code: 'GOOGLE_AUTH_NOT_CONFIGURED',
        message: 'Google sign-in is not configured',
      });
    }

    try {
      const ticket = await this.client.verifyIdToken({ idToken, audience });
      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email || payload.email_verified !== true) {
        throw new Error('Missing verified Google identity');
      }
      const email = payload.email.trim().toLowerCase();
      return {
        sub: payload.sub,
        email,
        firstName: (
          payload.given_name ||
          payload.name ||
          email.split('@')[0]
        ).slice(0, 100),
        lastName: payload.family_name?.slice(0, 100) || null,
      };
    } catch {
      throw new UnauthorizedException({
        code: 'INVALID_GOOGLE_TOKEN',
        message: 'Invalid Google ID token',
      });
    }
  }
}
