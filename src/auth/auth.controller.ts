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
    const verifier = randomBytes(32).toString('hex');
    const challenge = this.base64URLEncode(
      createHash('sha256').update(verifier).digest(),
    );
    req.session.codeVerifier = verifier;
    const authCodeUrl = await this.msalService.getAuthCodeUrl(challenge);
    res.redirect(authCodeUrl);
  }

  @Get('redirect')
  async redirect(@Req() req: Request, @Res() res: Response) {
    const code = req.query.code as string;
    const tokenResponse = await this.msalService.acquireToken(
      code,
      req.session.codeVerifier,
    );
    req.session.user = tokenResponse.account;
    res.redirect('/');
  }

  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => res.redirect('/'));
  }

  private base64URLEncode(buffer: Buffer) {
    return buffer.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}