import 'express-session';
import type { AccountInfo } from '@azure/msal-node';

declare module 'express-session' {
  interface SessionData {
    /** PKCE verifier generated at login */
    codeVerifier?: string;
    /** MSAL account object stored on successful auth */
    user?: AccountInfo;
  }
}
