import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { Classroom } from './Classroom';
import { User } from './User';

@Entity('classroom_messages')
export class ClassroomMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  classroom_id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'text' })
  message!: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false })
  is_edited!: boolean;

  @ManyToOne(() => Classroom, (c) => c.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classroom_id' })
  classroom!: Classroom;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
