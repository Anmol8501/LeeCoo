import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, Index, Unique,
} from 'typeorm';
import { Sheet } from './Sheet';
import { Question } from './Question';

@Entity('sheet_questions')
@Unique(['sheet_id', 'question_id'])
export class SheetQuestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  sheet_id!: string;

  @Column({ type: 'uuid' })
  question_id!: string;

  @Column({ type: 'int' })
  @Index()
  position!: number;

  @ManyToOne(() => Sheet, (s) => s.sheet_questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sheet_id' })
  sheet!: Sheet;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question!: Question;
}
