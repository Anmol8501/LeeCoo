/**
 * Questions Routes
 * Question listing, detail, run, and submit endpoints.
 */
import { Router } from 'express';
import { QuestionController } from '../controllers/QuestionController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Public: listing and detail (auth optional for solved status)
router.get('/', QuestionController.getQuestions);
router.get('/:id', QuestionController.getQuestionById);
router.get('/:id/testcases', QuestionController.getTestCases);

// Protected: code execution
router.post('/:id/run', authenticateJWT, QuestionController.runCode);
router.post('/:id/submit', authenticateJWT, QuestionController.submitCode);

export default router;
