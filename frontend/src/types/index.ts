// Frontend shared domain types

export type UserRole = 'student' | 'teacher' | 'admin';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type SubmissionStatus =
  | 'pending' | 'accepted' | 'wrong_answer'
  | 'runtime_error' | 'time_limit_exceeded'
  | 'memory_limit_exceeded' | 'compilation_error';

export type SheetType = 'beginner' | 'smart' | 'interview' | 'placement' | 'company';

export type SupportedLanguage = 'javascript' | 'python' | 'java' | 'cpp';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roll_no?: string;
  department?: string;
  profile_image_url?: string;
  bio?: string;
}

export interface Question {
  id: string;
  title: string;
  difficulty: QuestionDifficulty;
  problem_statement: string;
  constraints?: string;
  examples?: Array<{ input: string; output: string; explanation?: string }>;
  topic_id?: string;
  acceptance_rate?: number;
  total_submissions: number;
  total_solved: number;
  status?: 'solved' | 'attempted' | 'not_attempted';
}

export interface TestCase {
  id: string;
  input: string;
  expected_output: string;
  explanation?: string;
  is_hidden: boolean;
}

export interface Submission {
  id: string;
  status: SubmissionStatus;
  language: string;
  testcases_passed: number;
  testcases_total: number;
  execution_time?: number;
  memory_used?: number;
  error_message?: string;
  submitted_at: string;
}

export interface Topic {
  id: string;
  language: string;
  title: string;
  description?: string;
  subtopics_count?: number;
}

export interface Sheet {
  id: string;
  title: string;
  type: SheetType;
  description?: string;
  questions_count: number;
  solved_count: number;
  progress: number;
}

export interface Classroom {
  id: string;
  name: string;
  description?: string;
  teacher: { id: string; name: string };
  students_count: number;
  assignments_count: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    page: number;
    total: number;
    limit: number;
    totalPages: number;
  };
}
