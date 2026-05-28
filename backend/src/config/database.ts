import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { logger } from '../utils/logger';
import { env } from './env';

// Import all entities
import { User } from '../models/User';
import { Topic } from '../models/Topic';
import { Subtopic } from '../models/Subtopic';
import { UserSubtopicProgress } from '../models/UserSubtopicProgress';
import { Question } from '../models/Question';
import { TestCase } from '../models/TestCase';
import { Submission } from '../models/Submission';
import { SolvedQuestion } from '../models/SolvedQuestion';
import { Sheet } from '../models/Sheet';
import { SheetQuestion } from '../models/SheetQuestion';
import { Classroom } from '../models/Classroom';
import { ClassroomStudent } from '../models/ClassroomStudent';
import { Assignment } from '../models/Assignment';
import { AssignmentQuestion } from '../models/AssignmentQuestion';
import { Contest } from '../models/Contest';
import { ContestQuestion } from '../models/ContestQuestion';
import { ContestSubmission } from '../models/ContestSubmission';
import { ContestLeaderboard } from '../models/ContestLeaderboard';
import { ClassroomMessage } from '../models/ClassroomMessage';
import { AIChatHistory } from '../models/AIChatHistory';
import { UserActivity } from '../models/UserActivity';

const allEntities = [
  User,
  Topic,
  Subtopic,
  UserSubtopicProgress,
  Question,
  TestCase,
  Submission,
  SolvedQuestion,
  Sheet,
  SheetQuestion,
  Classroom,
  ClassroomStudent,
  Assignment,
  AssignmentQuestion,
  Contest,
  ContestQuestion,
  ContestSubmission,
  ContestLeaderboard,
  ClassroomMessage,
  AIChatHistory,
  UserActivity,
];

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: env.NODE_ENV === 'development', // Auto-create tables in dev
  logging: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  entities: allEntities,
  migrations: [],
  subscribers: [],
});

export const connectDatabase = async (): Promise<DataSource> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      logger.info(`PostgreSQL connected — ${allEntities.length} entities loaded.`);
    }
    return AppDataSource;
  } catch (error) {
    logger.error(`Database connection failed: ${(error as Error).message}`);
    throw error;
  }
};
