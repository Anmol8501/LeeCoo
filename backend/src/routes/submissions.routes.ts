/**
 * Submissions Routes
 * Submission history and detail endpoints.
 */
import { Router } from 'express';
import { SubmissionController } from '../controllers/SubmissionController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// All submission routes are protected
router.use(authenticateJWT);

router.get('/user/me', SubmissionController.getUserSubmissions);
router.get('/question/:questionId/history', SubmissionController.getQuestionHistory);
router.get('/question/:questionId/latest', SubmissionController.getLatestAccepted);
router.get('/:id', SubmissionController.getSubmission);

export default router;
