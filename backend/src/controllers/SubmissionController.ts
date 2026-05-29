/**
 * Submission Controller
 * HTTP handlers for submission history and details.
 */
import { Request, Response, NextFunction } from 'express';
import { submissionService } from '../services/SubmissionService';

export class SubmissionController {
  /**
   * GET /submissions/:id
   * Get a specific submission by ID. Users can only see their own submissions.
   */
  static async getSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const submission = await submissionService.getSubmissionById(id, userId);

      if (!submission) {
        return res.status(404).json({ success: false, error: 'Submission not found' });
      }

      return res.json({ success: true, data: submission });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /submissions/user/me
   * Get the authenticated user's submission history.
   * Query: ?page=1&limit=20
   */
  static async getUserSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { page, limit } = req.query;

      const result = await submissionService.getUserSubmissions(
        userId,
        page ? parseInt(page as string) : undefined,
        limit ? parseInt(limit as string) : undefined
      );

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /submissions/question/:questionId/history
   * Get submission history for a specific question by the authenticated user.
   */
  static async getQuestionHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { questionId } = req.params;
      const userId = req.user!.id;

      const history = await submissionService.getSubmissionHistory(userId, questionId);

      res.json({ success: true, data: history });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /submissions/question/:questionId/latest
   * Get the latest accepted submission for a question by the authenticated user.
   */
  static async getLatestAccepted(req: Request, res: Response, next: NextFunction) {
    try {
      const { questionId } = req.params;
      const userId = req.user!.id;

      const submission = await submissionService.getLatestAccepted(userId, questionId);

      if (!submission) {
        return res.status(404).json({
          success: false,
          error: 'No accepted submission found for this question',
        });
      }

      return res.json({ success: true, data: submission });
    } catch (error) {
      return next(error);
    }
  }
}
