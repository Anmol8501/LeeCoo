/**
 * Submission Service
 * Manages the full lifecycle of code submissions:
 * create → execute → poll → update → mark solved.
 */
import { AppDataSource } from '../config/database';
import { Submission } from '../models/Submission';
import { SolvedQuestion } from '../models/SolvedQuestion';
import { codeExecutionService } from './CodeExecutionService';
import { questionService } from './QuestionService';
import { logger } from '../utils/logger';
import {
  SUPPORTED_LANGUAGES,
  MAX_CODE_SIZE,
  ExecutionResult,
} from '../types/submission.types';

export class SubmissionService {
  private submissionRepo = AppDataSource.getRepository(Submission);
  private solvedRepo = AppDataSource.getRepository(SolvedQuestion);

  /**
   * Validate and create a new submission record in the database.
   */
  async createSubmission(
    userId: string,
    questionId: string,
    code: string,
    language: string
  ): Promise<Submission> {
    // Validate language
    if (!SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
      throw new Error(
        `Unsupported language: ${language}. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    // Validate code size
    if (Buffer.byteLength(code, 'utf-8') > MAX_CODE_SIZE) {
      throw new Error(`Code exceeds maximum size of ${MAX_CODE_SIZE / 1024}KB`);
    }

    // Validate question exists
    const question = await questionService.getQuestionById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    const submission = this.submissionRepo.create({
      user_id: userId,
      question_id: questionId,
      code,
      language: language.toLowerCase(),
      status: 'pending',
      testcases_passed: 0,
      testcases_total: 0,
    });

    return this.submissionRepo.save(submission);
  }

  /**
   * Run code against visible (sample) test cases only.
   * Does NOT create a formal submission record — used for "Run Code".
   */
  async runCode(
    userId: string,
    questionId: string,
    code: string,
    language: string
  ): Promise<ExecutionResult> {
    logger.info(`User ${userId} requested code execution for question ${questionId}`);
    // Validate
    if (!SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
      throw new Error(`Unsupported language: ${language}`);
    }
    if (Buffer.byteLength(code, 'utf-8') > MAX_CODE_SIZE) {
      throw new Error(`Code exceeds maximum size of ${MAX_CODE_SIZE / 1024}KB`);
    }

    // Get only visible test cases
    const testcases = await questionService.getVisibleTestCases(questionId);

    if (testcases.length === 0) {
      return {
        status: 'accepted',
        testcases_passed: 0,
        testcases_total: 0,
        execution_time: null,
        memory_used: null,
        error_message: 'No sample test cases available for this question',
        results: [],
      };
    }

    const formattedTestCases = testcases.map((tc) => ({
      id: tc.id,
      input: tc.input,
      expected_output: tc.expected_output,
      is_hidden: tc.is_hidden,
    }));

    return codeExecutionService.runCode(code, language.toLowerCase(), formattedTestCases);
  }

  /**
   * Submit code for full evaluation against ALL test cases (hidden + visible).
   * Creates a submission record, executes, updates, and marks as solved if accepted.
   */
  async submitCode(
    userId: string,
    questionId: string,
    code: string,
    language: string
  ): Promise<{ submission: Submission; result: ExecutionResult }> {
    // Create submission
    const submission = await this.createSubmission(userId, questionId, code, language);

    // Increment question submission count
    await questionService.incrementSubmissions(questionId);

    // Get ALL test cases (hidden + visible)
    const testcases = await questionService.getAllTestCases(questionId);

    const formattedTestCases = testcases.map((tc) => ({
      id: tc.id,
      input: tc.input,
      expected_output: tc.expected_output,
      is_hidden: tc.is_hidden,
    }));

    // Execute code
    const result = await codeExecutionService.runCode(
      code,
      language.toLowerCase(),
      formattedTestCases
    );

    // Update submission with results
    submission.status = result.status;
    submission.testcases_passed = result.testcases_passed;
    submission.testcases_total = result.testcases_total;
    submission.execution_time = result.execution_time;
    submission.memory_used = result.memory_used;
    submission.error_message = result.error_message;

    await this.submissionRepo.save(submission);

    // If accepted, mark question as solved
    if (result.status === 'accepted') {
      await this.markAsSolved(userId, questionId, submission.id);
      await questionService.incrementSolved(questionId);
    }

    logger.info(
      `Submission ${submission.id}: ${result.status} (${result.testcases_passed}/${result.testcases_total})`
    );

    return { submission, result };
  }

  /**
   * Mark a question as solved for a user. Upserts the SolvedQuestion record.
   */
  async markAsSolved(userId: string, questionId: string, submissionId: string) {
    try {
      let solved = await this.solvedRepo.findOne({
        where: { user_id: userId, question_id: questionId },
      });

      if (solved) {
        solved.last_accepted_submission_id = submissionId;
        solved.solved_at = new Date();
      } else {
        // Get question difficulty for the record
        const question = await questionService.getQuestionById(questionId);
        solved = this.solvedRepo.create({
          user_id: userId,
          question_id: questionId,
          last_accepted_submission_id: submissionId,
          difficulty_level: question?.difficulty || null,
        });
      }

      await this.solvedRepo.save(solved);
      logger.info(`User ${userId} solved question ${questionId}`);
    } catch (error: any) {
      logger.error(`Failed to mark question as solved: ${error.message}`);
    }
  }

  /**
   * Get submission history for a user on a specific question.
   */
  async getSubmissionHistory(userId: string, questionId: string, limit = 10) {
    return this.submissionRepo.find({
      where: { user_id: userId, question_id: questionId },
      order: { submitted_at: 'DESC' },
      take: limit,
      select: [
        'id', 'status', 'language', 'testcases_passed', 'testcases_total',
        'execution_time', 'memory_used', 'submitted_at',
      ],
    });
  }

  /**
   * Get a single submission by ID.
   */
  async getSubmissionById(submissionId: string, userId?: string) {
    const where: any = { id: submissionId };
    if (userId) where.user_id = userId;

    return this.submissionRepo.findOne({
      where,
      relations: ['question'],
    });
  }

  /**
   * Get all submissions for a user across all questions.
   */
  async getUserSubmissions(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [submissions, total] = await this.submissionRepo.findAndCount({
      where: { user_id: userId },
      order: { submitted_at: 'DESC' },
      relations: ['question'],
      skip,
      take: limit,
      select: {
        id: true,
        status: true,
        language: true,
        testcases_passed: true,
        testcases_total: true,
        execution_time: true,
        memory_used: true,
        submitted_at: true,
        question: {
          id: true,
          title: true,
          difficulty: true,
        },
      },
    });

    return {
      submissions,
      pagination: { page, limit, total, total_pages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get latest accepted submission for a question by user.
   */
  async getLatestAccepted(userId: string, questionId: string) {
    return this.submissionRepo.findOne({
      where: { user_id: userId, question_id: questionId, status: 'accepted' as any },
      order: { submitted_at: 'DESC' },
    });
  }
}

export const submissionService = new SubmissionService();
