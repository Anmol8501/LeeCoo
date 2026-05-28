// Shared domain types used across the application

export type UserRole = 'student' | 'teacher' | 'admin';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type SubmissionStatus =
  | 'pending'
  | 'accepted'
  | 'wrong_answer'
  | 'runtime_error'
  | 'time_limit_exceeded'
  | 'memory_limit_exceeded'
  | 'compilation_error';

export type SheetType = 'beginner' | 'smart' | 'interview' | 'placement' | 'company';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type SupportedLanguage = 'javascript' | 'python' | 'java' | 'cpp';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: unknown[];
}
