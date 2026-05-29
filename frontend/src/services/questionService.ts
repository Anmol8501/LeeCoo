import api from './api';

export interface Question {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  problem_statement: string;
  constraints: string[] | string | null;
  examples: any;
  topic_id: string;
  acceptance_rate: number;
  total_submissions: number;
  total_solved: number;
  status?: 'solved' | 'not_attempted';
  user_status?: 'solved' | 'not_attempted';
  topic?: {
    id: string;
    title: string;
  };
}

export interface TestCase {
  id: string;
  question_id: string;
  input: string;
  expected_output: string;
  explanation?: string;
  is_hidden: boolean;
}

export interface RunResult {
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'runtime_error' | 'compile_error' | 'pending';
  testcases_passed: number;
  testcases_total: number;
  execution_time: number | null;
  memory_used: number | null;
  error_message: string | null;
  results: Array<{
    testcase_id: string;
    status: string;
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    error?: string;
  }>;
}

export interface Submission {
  id: string;
  user_id: string;
  question_id: string;
  code: string;
  language: string;
  status: string;
  testcases_passed: number;
  testcases_total: number;
  execution_time: number | null;
  memory_used: number | null;
  error_message: string | null;
  submitted_at: string;
  question?: {
    id: string;
    title: string;
    difficulty: string;
  };
}

export interface QuestionsResponse {
  questions: Question[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export const questionService = {
  /**
   * Get all questions (paginated and filtered).
   */
  async getQuestions(params: {
    page?: number;
    limit?: number;
    difficulty?: string;
    topic?: string;
    search?: string;
  } = {}): Promise<QuestionsResponse> {
    const response = await api.get('/questions', { params });
    return response.data.data;
  },

  /**
   * Get a single question by ID.
   */
  async getQuestionById(id: string): Promise<Question> {
    const response = await api.get(`/questions/${id}`);
    return response.data.data;
  },

  /**
   * Get visible test cases for a question.
   */
  async getTestCases(id: string): Promise<TestCase[]> {
    const response = await api.get(`/questions/${id}/testcases`);
    return response.data.data;
  },

  /**
   * Run code against sample test cases.
   */
  async runCode(id: string, code: string, language: string): Promise<RunResult> {
    const response = await api.post(`/questions/${id}/run`, { code, language });
    return response.data.data;
  },

  /**
   * Submit code for full evaluation.
   */
  async submitCode(id: string, code: string, language: string): Promise<any> {
    const response = await api.post(`/questions/${id}/submit`, { code, language });
    return response.data.data;
  },

  /**
   * Get a submission by ID.
   */
  async getSubmission(id: string): Promise<Submission> {
    const response = await api.get(`/submissions/${id}`);
    return response.data.data;
  },

  /**
   * Get user's submission history.
   */
  async getUserSubmissions(page = 1, limit = 20): Promise<{ submissions: Submission[]; pagination: any }> {
    const response = await api.get('/submissions/user/me', { params: { page, limit } });
    return response.data.data;
  },

  /**
   * Get submission history for a specific question.
   */
  async getQuestionHistory(questionId: string): Promise<Submission[]> {
    const response = await api.get(`/submissions/question/${questionId}/history`);
    return response.data.data;
  },

  /**
   * Get the latest accepted submission for a question.
   */
  async getLatestAccepted(questionId: string): Promise<Submission> {
    const response = await api.get(`/submissions/question/${questionId}/latest`);
    return response.data.data;
  },
};

export default questionService;
