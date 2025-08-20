import { IsUUID, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreatePrescriptionDto {
  @IsUUID()
  doctorId: string;

  @IsUUID()
  patientId: string;

  @IsString()
  medication: string;

  @IsString()
  dosage: string;

  @IsString()
  instructions: string;
}

export class UpdatePrescriptionDto {
  @IsString()
  @IsOptional()
  medication?: string;

  @IsString()
  @IsOptional()
  dosage?: string;

  @IsString()
  @IsOptional()
  instructions?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
