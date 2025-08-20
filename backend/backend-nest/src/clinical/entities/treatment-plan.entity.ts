import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('treatment_plans')
export class TreatmentPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  patient: User;

  @Column()
  plan: string;

  @Column('jsonb', { nullable: true })
  milestones: any[];

  @Column('jsonb', { nullable: true })
  assignedDoctors: string[];

  @Column('jsonb', { nullable: true })
  departments: string[];

  @CreateDateColumn()
  createdAt: Date;
}
