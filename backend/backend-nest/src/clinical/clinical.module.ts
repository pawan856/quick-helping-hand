import { Module } from '@nestjs/common';
import { ClinicalController } from './clinical.controller';
import { ClinicalService } from './clinical.service';
import { ClinicalGateway } from './clinical.gateway';

@Module({
  controllers: [ClinicalController],
  providers: [ClinicalService, ClinicalGateway],
})
export class ClinicalModule {}
