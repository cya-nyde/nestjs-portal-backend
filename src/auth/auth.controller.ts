import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  @Get('login')
  @UseGuards(AuthGuard('azuread-openidconnect'))
  login() {
    // Initiates Microsoft SSO login flow
  }

  @Post('redirect')
  @UseGuards(AuthGuard('azuread-openidconnect'))
  redirect(@Req() req: Request, @Res() res: Response) {
    // Handles ID token callback and session setup
    res.redirect('/');
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout(() => {
      res.redirect('/');
    });
  }
}