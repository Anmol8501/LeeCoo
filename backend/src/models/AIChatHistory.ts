import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from './User';
import { Question } from './Question';
import { Submission } from './Submission';

@Entity('ai_chat_history')
export class AIChatHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  user_id!: string;

  @Column({ type: 'uuid', nullable: true })
  question_id!: string | null;

  @Column({ type: 'uuid', nullable: true })
  submission_id!: string | null;

  @Column({ type: 'text' })
  user_message!: string;

  @Column({ type: 'text' })
  ai_response!: string;

  @Column({ type: 'jsonb', nullable: true })
  context!: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  created_at!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Question, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'question_id' })
  question!: Question | null;

  @ManyToOne(() => Submission, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'submission_id' })
  submission!: Submission | null;
}
