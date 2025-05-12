import { Injectable } from '@nestjs/common';
import { ConfidentialClientApplication, AuthorizationUrlRequest, AuthorizationCodeRequest } from '@azure/msal-node';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MsalService {
  private pca: ConfidentialClientApplication;
  constructor() {
    this.pca = new ConfidentialClientApplication({
      auth: {
        clientId: process.env.AZURE_CLIENT_ID!,
        authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
        clientSecret: process.env.AZURE_CLIENT_SECRET!,
      }
    });
  }

  async getAuthCodeUrl(codeChallenge: string): Promise<string> {
    const authCodeUrlParams: AuthorizationUrlRequest = {
      redirectUri: process.env.AZURE_REDIRECT_URI!,
      scopes: ['openid', 'profile', 'email'],
      codeChallenge,
      codeChallengeMethod: 'S256',
    };
    return this.pca.getAuthCodeUrl(authCodeUrlParams);
  }

  async acquireToken(code: string, codeVerifier: string) {
    const tokenRequest: AuthorizationCodeRequest = {
      code,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: process.env.AZURE_REDIRECT_URI!,
      codeVerifier,
    };
    return this.pca.acquireTokenByCode(tokenRequest);
  }
}