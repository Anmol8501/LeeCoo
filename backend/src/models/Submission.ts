import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from './User';
import { Question } from './Question';

export type SubmissionStatus =
  | 'pending' | 'accepted' | 'wrong_answer'
  | 'runtime_error' | 'time_limit_exceeded'
  | 'memory_limit_exceeded' | 'compilation_error';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  user_id!: string;

  @Column({ type: 'uuid' })
  @Index()
  question_id!: string;

  @Column({ type: 'text' })
  code!: string;

  @Column({ type: 'varchar', length: 50 })
  language!: string;

  @Column({ type: 'varchar', length: 30, default: 'pending' })
  @Index()
  status!: SubmissionStatus;

  @Column({ type: 'int', default: 0 })
  testcases_passed!: number;

  @Column({ type: 'int', default: 0 })
  testcases_total!: number;

  @Column({ type: 'float', nullable: true })
  execution_time!: number | null;

  @Column({ type: 'float', nullable: true })
  memory_used!: number | null;

  @Column({ type: 'text', nullable: true })
  error_message!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  judge0_token!: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  submitted_at!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question!: Question;
}
