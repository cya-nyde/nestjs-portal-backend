import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { MsalService } from './msal.service';
import { randomBytes, createHash } from 'crypto';
import { AuthenticatedGuard } from './authenticated.guard';

@Controller('auth')
export class AuthController {
  constructor(private msalService: MsalService) {}

  @Get('login')
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const verifier = randomBytes(32).toString('hex');
      const challenge = this.base64URLEncode(
        createHash('sha256').update(verifier).digest(),
      );
      req.session.codeVerifier = verifier;
      const authCodeUrl = await this.msalService.getAuthCodeUrl(challenge);
      return res.redirect(authCodeUrl);
    } catch (error) {
      console.error('Error generating auth code URL', error);
      return res.status(500).send('Error initiating login. Check server logs.');
    }
  }

  @Get('redirect')
  async redirect(@Req() req: Request, @Res() res: Response) {
    try {
      const code = req.query.code as string;
      const codeVerifier = req.session.codeVerifier;
      if (!codeVerifier) {
        return res.status(400).send('Invalid request: missing code verifier');
      }
      const tokenResponse = await this.msalService.acquireToken(
        code,
        codeVerifier,
      );
      const account = tokenResponse.account;
      if (!account) {
        return res.status(401).send('Authentication failed: no account info');
      }
      req.session.user = account;
      return res.redirect('/');
    } catch (error) {
      console.error('Error handling redirect:', error);
      return res.status(500).send('Error completing login. Check server logs.');
    }
  }

  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(err => {
      if (err) console.error('Error destroying session', err);
      res.redirect('/');
    });
  }

  private base64URLEncode(buffer: Buffer) {
    return buffer.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
