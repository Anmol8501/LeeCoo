import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, Unique,
} from 'typeorm';
import { Contest } from './Contest';
import { Question } from './Question';

@Entity('contest_questions')
@Unique(['contest_id', 'question_id'])
export class ContestQuestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  contest_id!: string;

  @Column({ type: 'uuid' })
  question_id!: string;

  @Column({ type: 'int', nullable: true })
  position!: number | null;

  @Column({ type: 'int', default: 1 })
  points!: number;

  @ManyToOne(() => Contest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contest_id' })
  contest!: Contest;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question!: Question;
}
