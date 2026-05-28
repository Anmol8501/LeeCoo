import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, JoinColumn, Index,
} from 'typeorm';
import { User } from './User';
import { SheetQuestion } from './SheetQuestion';

export type SheetType = 'beginner' | 'smart' | 'interview' | 'placement' | 'company';

@Entity('sheets')
export class Sheet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 20 })
  @Index()
  type!: SheetType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Index()
  company_name!: string | null;

  @Column({ type: 'uuid', nullable: true })
  created_by!: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: true })
  is_public!: boolean;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator!: User | null;

  @OneToMany(() => SheetQuestion, (sq) => sq.sheet)
  sheet_questions!: SheetQuestion[];
}
