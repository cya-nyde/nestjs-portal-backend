import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AzureAdStrategy } from './azure-ad.strategy';
import { AuthController } from './auth.controller';
import { AuthenticatedGuard } from './authenticated.guard';

@Module({
  imports: [PassportModule.register({ session: true })],
  providers: [AzureAdStrategy, AuthenticatedGuard],
  controllers: [AuthController],
})
export class AuthModule {}