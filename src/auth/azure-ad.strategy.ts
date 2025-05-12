// src/auth/azure-ad.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { OIDCStrategy, IOIDCStrategyOptionWithReq } from 'passport-azure-ad';
import { Profile } from 'passport-azure-ad';

@Injectable()
export class AzureAdStrategy extends PassportStrategy(
  OIDCStrategy,
  'azuread-openidconnect',
) {
  constructor() {
    super({
      identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
      clientID: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,

      // <-- Switch to code-only flow
      responseType: 'code',
      responseMode: 'form_post',

      redirectUrl: process.env.AZURE_REDIRECT_URI,

      allowHttpForRedirectUrl: true,
      scope: ['openid', 'profile', 'email'],  // add 'offline_access' if you need refresh tokens
      loggingLevel: 'info',
      passReqToCallback: false,
    } as IOIDCStrategyOptionWithReq);
  }

  async validate(
    iss: string,
    sub: string,
    profile: Profile,
    accessToken: string,
    refreshToken: string,
    params: any,
    done: Function,
  ) {
    const user = {
      oid: profile.oid,
      displayName: profile.displayName,
      email: profile._json.preferred_username,
    };
    done(null, user);
  }
}