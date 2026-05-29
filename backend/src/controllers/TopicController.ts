/**
 * Topic Controller
 * HTTP request handlers for the Learning Module.
 */
import { Request, Response, NextFunction } from 'express';
import { topicService } from '../services/TopicService';

export class TopicController {
  /**
   * GET /topics
   * Query: ?language=javascript
   */
  static async getAllTopics(req: Request, res: Response, next: NextFunction) {
    try {
      const { language } = req.query;
      const topics = await topicService.getAllTopics(language as string | undefined);

      res.json({ success: true, data: topics });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /topics/continue
   * Protected — returns topics where user has partial progress.
   */
  static async getContinueLearning(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const topics = await topicService.getContinueLearning(userId);

      res.json({ success: true, data: topics });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /topics/:id
   * Protected — includes user progress if authenticated.
   */
  static async getTopicById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const topic = await topicService.getTopicById(id, userId);

      if (!topic) {
        return res.status(404).json({ success: false, error: 'Topic not found' });
      }

      return res.json({ success: true, data: topic });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * POST /subtopics/:id/mark-complete
   * Protected.
   */
  static async markComplete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const result = await topicService.markSubtopicComplete(userId, id);

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /subtopics/:id/mark-complete
   * Protected.
   */
  static async unmarkComplete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const result = await topicService.unmarkSubtopicComplete(userId, id);

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
