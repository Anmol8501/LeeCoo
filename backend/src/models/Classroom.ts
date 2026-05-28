import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, JoinColumn, Index,
} from 'typeorm';
import { User } from './User';
import { ClassroomStudent } from './ClassroomStudent';
import { Assignment } from './Assignment';
import { Contest } from './Contest';
import { ClassroomMessage } from './ClassroomMessage';

@Entity('classrooms')
export class Classroom {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'uuid' })
  @Index()
  teacher_id!: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacher_id' })
  teacher!: User;

  @OneToMany(() => ClassroomStudent, (cs) => cs.classroom)
  classroom_students!: ClassroomStudent[];

  @OneToMany(() => Assignment, (a) => a.classroom)
  assignments!: Assignment[];

  @OneToMany(() => Contest, (c) => c.classroom)
  contests!: Contest[];

  @OneToMany(() => ClassroomMessage, (m) => m.classroom)
  messages!: ClassroomMessage[];
}
