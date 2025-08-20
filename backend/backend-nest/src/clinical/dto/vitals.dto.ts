import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateVitalsDto {
  @IsUUID()
  patientId: string;

  @IsNumber()
  heartRate: number;

  @IsString()
  bloodPressure: string;

  @IsNumber()
  spo2: number;

  @IsNumber()
  temperature: number;
}
