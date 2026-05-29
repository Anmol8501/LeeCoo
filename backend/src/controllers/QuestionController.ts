/**
 * Question Controller
 * HTTP handlers for question listing, detail, and code execution.
 */
import { Request, Response, NextFunction } from 'express';
import { questionService } from '../services/QuestionService';
import { submissionService } from '../services/SubmissionService';
import { SUPPORTED_LANGUAGES, MAX_CODE_SIZE } from '../types/submission.types';

export class QuestionController {
  /**
   * GET /questions
   * Query: ?page=1&limit=20&difficulty=medium&topic=uuid&search=two+sum
   */
  static async getQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, difficulty, topic, search } = req.query;
      const userId = req.user?.id;

      const result = await questionService.getQuestions(
        {
          page: page ? parseInt(page as string) : undefined,
          limit: limit ? parseInt(limit as string) : undefined,
          difficulty: difficulty as any,
          topic: topic as string,
          search: search as string,
        },
        userId
      );

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /questions/:id
   * Returns full question with visible test cases.
   */
  static async getQuestionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const question = await questionService.getQuestionById(id, userId);

      if (!question) {
        return res.status(404).json({ success: false, error: 'Question not found' });
      }

      return res.json({ success: true, data: question });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /questions/:id/testcases
   * Returns visible test cases only.
   */
  static async getTestCases(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const testcases = await questionService.getVisibleTestCases(id);

      res.json({ success: true, data: testcases });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /questions/:id/run
   * Body: { code: string, language: string }
   * Runs code against visible (sample) test cases — no submission record created.
   */
  static async runCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { code, language } = req.body;
      const userId = req.user!.id;

      // Validation
      if (!code || !language) {
        return res.status(400).json({
          success: false,
          error: 'Both "code" and "language" are required',
        });
      }

      if (!SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
        return res.status(400).json({
          success: false,
          error: `Unsupported language: ${language}. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`,
        });
      }

      if (Buffer.byteLength(code, 'utf-8') > MAX_CODE_SIZE) {
        return res.status(400).json({
          success: false,
          error: `Code exceeds maximum size of ${MAX_CODE_SIZE / 1024}KB`,
        });
      }

      const result = await submissionService.runCode(userId, id, code, language);
      return res.json({ success: true, data: result });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * POST /questions/:id/submit
   * Body: { code: string, language: string }
   * Full submission against all test cases (hidden + visible).
   */
  static async submitCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { code, language } = req.body;
      const userId = req.user!.id;

      // Validation
      if (!code || !language) {
        return res.status(400).json({
          success: false,
          error: 'Both "code" and "language" are required',
        });
      }

      if (!SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
        return res.status(400).json({
          success: false,
          error: `Unsupported language: ${language}`,
        });
      }

      if (Buffer.byteLength(code, 'utf-8') > MAX_CODE_SIZE) {
        return res.status(400).json({
          success: false,
          error: `Code exceeds maximum size of ${MAX_CODE_SIZE / 1024}KB`,
        });
      }

      const { submission, result } = await submissionService.submitCode(
        userId, id, code, language
      );

      return res.json({
        success: true,
        data: {
          submission_id: submission.id,
          status: result.status,
          testcases_passed: result.testcases_passed,
          testcases_total: result.testcases_total,
          execution_time: result.execution_time,
          memory_used: result.memory_used,
          error_message: result.error_message,
          results: result.results,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
}
