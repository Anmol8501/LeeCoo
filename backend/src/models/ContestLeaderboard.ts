import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, Index, Unique, UpdateDateColumn,
} from 'typeorm';
import { Contest } from './Contest';
import { User } from './User';

@Entity('contest_leaderboard')
@Unique(['contest_id', 'user_id'])
export class ContestLeaderboard {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  contest_id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'int', default: 0 })
  score!: number;

  @Column({ type: 'int', nullable: true })
  @Index()
  rank!: number | null;

  @UpdateDateColumn({ type: 'timestamp' })
  last_updated!: Date;

  @ManyToOne(() => Contest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contest_id' })
  contest!: Contest;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
