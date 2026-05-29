import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Classroom } from './Classroom';
import { ClassroomStudent } from './ClassroomStudent';
import { Submission } from './Submission';
import { SolvedQuestion } from './SolvedQuestion';

export type UserRole = 'student' | 'teacher' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  roll_no!: string | null;

  @Column({ type: 'varchar', length: 255 })
  password_hash!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department!: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'student',
  })
  role!: UserRole;

  @Column({ type: 'text', nullable: true })
  profile_image_url!: string | null;

  @Column({ type: 'text', nullable: true })
  bio!: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at!: Date | null;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @OneToMany(() => Classroom, (c) => c.teacher)
  classrooms_created!: Classroom[];

  @OneToMany(() => ClassroomStudent, (cs) => cs.student)
  classroom_students!: ClassroomStudent[];

  @OneToMany(() => Submission, (s) => s.user)
  submissions!: Submission[];

  @OneToMany(() => SolvedQuestion, (sq) => sq.user)
  solved_questions!: SolvedQuestion[];
}
