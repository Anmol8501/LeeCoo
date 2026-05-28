import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, Unique,
} from 'typeorm';
import { Assignment } from './Assignment';
import { Question } from './Question';

@Entity('assignment_questions')
@Unique(['assignment_id', 'question_id'])
export class AssignmentQuestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  assignment_id!: string;

  @Column({ type: 'uuid' })
  question_id!: string;

  @Column({ type: 'int', nullable: true })
  position!: number | null;

  @ManyToOne(() => Assignment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignment_id' })
  assignment!: Assignment;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question!: Question;
}
