import { IsUUID, IsString, IsEnum } from 'class-validator';
import { LabStatus } from '../entities/lab-result.entity';

export class CreateLabResultDto {
  @IsUUID()
  patientId: string;

  @IsString()
  fileUrl: string;
}

export class UpdateLabResultStatusDto {
  @IsEnum(LabStatus)
  status: LabStatus;
}
