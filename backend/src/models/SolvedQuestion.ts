import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Index, Unique,
} from 'typeorm';
import { User } from './User';
import { Question } from './Question';
import { Submission } from './Submission';

@Entity('solved_questions')
@Unique(['user_id', 'question_id'])
export class SolvedQuestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  user_id!: string;

  @Column({ type: 'uuid' })
  question_id!: string;

  @Column({ type: 'uuid' })
  last_accepted_submission_id!: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  solved_at!: Date;

  @Column({ type: 'varchar', length: 10, nullable: true })
  difficulty_level!: string | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question!: Question;

  @ManyToOne(() => Submission, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'last_accepted_submission_id' })
  last_accepted_submission!: Submission;
}
