import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Index, Unique,
} from 'typeorm';
import { Classroom } from './Classroom';
import { User } from './User';

@Entity('classroom_students')
@Unique(['classroom_id', 'student_id'])
export class ClassroomStudent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  classroom_id!: string;

  @Column({ type: 'uuid' })
  @Index()
  student_id!: string;

  @CreateDateColumn({ type: 'timestamp' })
  joined_at!: Date;

  @Column({ type: 'varchar', length: 10, default: 'student' })
  role!: 'student' | 'ta';

  @ManyToOne(() => Classroom, (c) => c.classroom_students, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classroom_id' })
  classroom!: Classroom;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student!: User;
}
