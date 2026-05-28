import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  OneToMany, Index,
} from 'typeorm';
import { Subtopic } from './Subtopic';
import { Question } from './Question';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

@Entity('topics')
@Index(['language', 'title'], { unique: true })
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  language!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  difficulty_level!: DifficultyLevel | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @OneToMany(() => Subtopic, (s) => s.topic)
  subtopics!: Subtopic[];

  @OneToMany(() => Question, (q) => q.topic)
  questions!: Question[];
}
