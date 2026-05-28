import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { Contest } from './Contest';
import { User } from './User';
import { Question } from './Question';
import { Submission } from './Submission';

@Entity('contest_submissions')
export class ContestSubmission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  contest_id!: string;

  @Column({ type: 'uuid' })
  @Index()
  user_id!: string;

  @Column({ type: 'uuid' })
  question_id!: string;

  @Column({ type: 'uuid', nullable: true })
  submission_id!: string | null;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: 'accepted' | 'wrong_answer' | 'pending';

  @CreateDateColumn({ type: 'timestamp' })
  submitted_at!: Date;

  @ManyToOne(() => Contest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contest_id' })
  contest!: Contest;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question!: Question;

  @ManyToOne(() => Submission, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'submission_id' })
  submission!: Submission | null;
}
