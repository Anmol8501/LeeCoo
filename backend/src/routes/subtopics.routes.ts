/**
 * Subtopics Routes
 * Mark complete / unmark endpoints.
 */
import { Router } from 'express';
import { TopicController } from '../controllers/TopicController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.post('/:id/mark-complete', authenticateJWT, TopicController.markComplete);
router.delete('/:id/mark-complete', authenticateJWT, TopicController.unmarkComplete);

export default router;
