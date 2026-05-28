import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { Topic } from './Topic';

@Entity('subtopics')
export class Subtopic {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  topic_id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  youtube_link!: string | null;

  @Column({ type: 'int', nullable: true })
  @Index()
  order_position!: number | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => Topic, (t) => t.subtopics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topic_id' })
  topic!: Topic;
}
