import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, JoinColumn, Index,
} from 'typeorm';
import { Topic } from './Topic';
import { TestCase } from './TestCase';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  title!: string;

  @Column({ type: 'varchar', length: 10 })
  @Index()
  difficulty!: QuestionDifficulty;

  @Column({ type: 'text' })
  problem_statement!: string;

  @Column({ type: 'text', nullable: true })
  constraints!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  examples!: Array<{ input: string; output: string; explanation?: string }> | null;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  topic_id!: string | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  acceptance_rate!: number | null;

  @Column({ type: 'int', default: 0 })
  total_submissions!: number;

  @Column({ type: 'int', default: 0 })
  total_solved!: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => Topic, (t) => t.questions, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'topic_id' })
  topic!: Topic | null;

  @OneToMany(() => TestCase, (tc) => tc.question)
  testcases!: TestCase[];
}
