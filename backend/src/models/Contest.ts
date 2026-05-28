import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { Classroom } from './Classroom';
import { User } from './User';

@Entity('contests')
export class Contest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  classroom_id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'timestamp' })
  @Index()
  start_time!: Date;

  @Column({ type: 'timestamp' })
  end_time!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by!: string | null;

  @ManyToOne(() => Classroom, (c) => c.contests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classroom_id' })
  classroom!: Classroom;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator!: User | null;
}
