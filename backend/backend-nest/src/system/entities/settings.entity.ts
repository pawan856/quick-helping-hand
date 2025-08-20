import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: 'en' })
  language: string;

  @Column({ default: 'light' })
  theme: string;

  @Column({ default: false })
  accessibility: boolean;
}
