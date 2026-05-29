/**
 * Type definitions for the Questions & Submissions system.
 */

/** Supported programming languages and their Judge0 IDs */
export const LANGUAGE_MAP: Record<string, number> = {
  c: 50,
  cpp: 54,
  java: 62,
  javascript: 63,
  python: 71,
  typescript: 74,
};

export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_MAP);

/** Judge0 status codes */
export enum Judge0Status {
  IN_QUEUE = 1,
  PROCESSING = 2,
  ACCEPTED = 3,
  WRONG_ANSWER = 4,
  TIME_LIMIT_EXCEEDED = 5,
  COMPILATION_ERROR = 6,
  RUNTIME_ERROR_SIGSEGV = 7,
  RUNTIME_ERROR_SIGXFSZ = 8,
  RUNTIME_ERROR_SIGFPE = 9,
  RUNTIME_ERROR_SIGABRT = 10,
  RUNTIME_ERROR_NZEC = 11,
  RUNTIME_ERROR_OTHER = 12,
  INTERNAL_ERROR = 13,
  EXEC_FORMAT_ERROR = 14,
}

/** Human-readable submission status */
export type SubmissionStatusType =
  | 'pending'
  | 'accepted'
  | 'wrong_answer'
  | 'runtime_error'
  | 'time_limit_exceeded'
  | 'memory_limit_exceeded'
  | 'compilation_error';

/** Judge0 submission response */
export interface Judge0Response {
  token: string;
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string | null;
  memory: number | null;
}

/** Result for a single test case execution */
export interface TestCaseResult {
  testcase_id: string;
  input: string;
  expected_output: string;
  actual_output: string | null;
  status: SubmissionStatusType;
  execution_time: number | null;
  memory_used: number | null;
  error_message: string | null;
  is_hidden: boolean;
}

/** Overall code execution result */
export interface ExecutionResult {
  status: SubmissionStatusType;
  testcases_passed: number;
  testcases_total: number;
  execution_time: number | null;
  memory_used: number | null;
  error_message: string | null;
  results: TestCaseResult[];
}

/** Request body for running/submitting code */
export interface CodeSubmissionRequest {
  code: string;
  language: string;
}

/** Paginated questions query params */
export interface QuestionsQueryParams {
  page?: number;
  limit?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
  search?: string;
}

/** Standard API response wrapper */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** Max code size: 100KB */
export const MAX_CODE_SIZE = 100 * 1024;

/** Judge0 polling config */
export const JUDGE0_POLL_INTERVAL_MS = 1500;
export const JUDGE0_MAX_POLLS = 40;
