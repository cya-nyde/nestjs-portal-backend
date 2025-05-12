import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  @Get()
  renderHome(@Req() req: Request, @Res() res: Response) {
    res.render('home', {
      title: 'NestJS Internal Portal',
      user: req.user,
    });
  }
}