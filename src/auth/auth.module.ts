import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AzureAdStrategy } from './azure-ad.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule.register({ session: true })],
  providers: [AzureAdStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
