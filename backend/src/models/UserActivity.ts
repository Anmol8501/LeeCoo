import {
  Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn,
  ManyToOne, JoinColumn, Index, Unique,
} from 'typeorm';
import { User } from './User';

@Entity('user_activity')
@Unique(['user_id', 'activity_date'])
export class UserActivity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  user_id!: string;

  @Column({ type: 'date' })
  @Index()
  activity_date!: string;

  @Column({ type: 'int', default: 0 })
  submissions_count!: number;

  @Column({ type: 'int', default: 0 })
  accepted_count!: number;

  @UpdateDateColumn({ type: 'timestamp' })
  last_activity_at!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
