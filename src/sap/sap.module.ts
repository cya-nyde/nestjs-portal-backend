import { Module } from '@nestjs/common';
import { SapService } from './sap.service';

@Module({
  providers: [SapService]
})
export class SapModule {}
