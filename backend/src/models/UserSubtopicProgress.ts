import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, Index, Unique,
} from 'typeorm';
import { User } from './User';
import { Subtopic } from './Subtopic';

@Entity('user_subtopic_progress')
@Unique(['user_id', 'subtopic_id'])
export class UserSubtopicProgress {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  user_id!: string;

  @Column({ type: 'uuid' })
  subtopic_id!: string;

  @Column({ type: 'boolean', default: false })
  completed!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  completed_at!: Date | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Subtopic, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subtopic_id' })
  subtopic!: Subtopic;
}
