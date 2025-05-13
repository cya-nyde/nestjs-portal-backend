import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticatedGuard } from './auth/authenticated.guard';

@Controller()
export class AppController {
  @Get()
  renderHome(@Req() req: Request, @Res() res: Response) {
    res.render('home', {
      title: 'NestJS Internal Portal',
      user: req.session.user,
    });
  }

  @Get('dashboard')
  @UseGuards(AuthenticatedGuard)
  renderDashboard(@Req() req: Request, @Res() res: Response) {
    res.render('dashboard', {
      title: 'Dashboard',
      user: req.session.user,
    });
  }
}