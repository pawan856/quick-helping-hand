import { IsUUID, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateTreatmentPlanDto {
  @IsUUID()
  patientId: string;

  @IsString()
  plan: string;

  @IsArray()
  @IsOptional()
  milestones?: any[];

  @IsArray()
  @IsOptional()
  assignedDoctors?: string[];

  @IsArray()
  @IsOptional()
  departments?: string[];
}
