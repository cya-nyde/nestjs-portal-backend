import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { BankModule } from './bank/bank.module';
import { SapModule } from './sap/sap.module';

@Module({
  imports: [AuthModule, DatabaseModule, BankModule, SapModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
