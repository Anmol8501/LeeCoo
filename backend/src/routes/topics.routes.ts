/**
 * Topics & Subtopics Routes
 * Learning Module API routes.
 */
import { Router } from 'express';
import { TopicController } from '../controllers/TopicController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', TopicController.getAllTopics);

// Protected routes (must be before /:id to avoid matching 'continue' as id)
router.get('/continue', authenticateJWT, TopicController.getContinueLearning);
router.get('/:id', authenticateJWT, TopicController.getTopicById);

export default router;
