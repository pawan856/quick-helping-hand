import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum LabStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  CRITICAL = 'Critical',
}

@Entity('lab_results')
export class LabResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  patient: User;

  @Column()
  fileUrl: string;

  @Column({ type: 'enum', enum: LabStatus, default: LabStatus.PENDING })
  status: LabStatus;

  @CreateDateColumn()
  uploadedAt: Date;
}
