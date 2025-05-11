// src/app.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  renderHome(@Res() res: Response) {
    res.render('home', { title: 'Welcome to the NestJS Portal' });
  }
}
