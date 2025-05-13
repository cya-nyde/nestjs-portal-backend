import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MsalService } from './msal.service';
import { AuthenticatedGuard } from './authenticated.guard';

@Module({
  providers: [MsalService, AuthenticatedGuard],
  controllers: [AuthController],
})
export class AuthModule {}