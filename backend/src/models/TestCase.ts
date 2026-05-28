import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { Question } from './Question';

@Entity('testcases')
export class TestCase {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  question_id!: string;

  @Column({ type: 'text' })
  input!: string;

  @Column({ type: 'text' })
  expected_output!: string;

  @Column({ type: 'text', nullable: true })
  explanation!: string | null;

  @Column({ type: 'boolean', default: false })
  @Index()
  is_hidden!: boolean;

  @Column({ type: 'int', nullable: true })
  order_position!: number | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @ManyToOne(() => Question, (q) => q.testcases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question!: Question;
}
