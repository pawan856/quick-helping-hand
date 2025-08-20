import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('vitals')
export class Vitals {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  patient: User;

  @Column()
  heartRate: number;

  @Column()
  bloodPressure: string;

  @Column()
  spo2: number;

  @Column()
  temperature: number;

  @CreateDateColumn()
  recordedAt: Date;
}
