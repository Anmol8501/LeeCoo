import { Router } from 'express';

const router = Router();

// Health check is already at app-level (/api/health)
// Module routes will be registered here as they are built

// Day 2: Auth routes
import authRoutes from './auth.routes';
router.use('/auth', authRoutes);

// Day 3: Learning routes
import topicRoutes from './topics.routes';
import subtopicRoutes from './subtopics.routes';
router.use('/topics', topicRoutes);
router.use('/subtopics', subtopicRoutes);

// Day 3-4: Questions & Submissions routes
import questionRoutes from './questions.routes';
import submissionRoutes from './submissions.routes';
router.use('/questions', questionRoutes);
router.use('/submissions', submissionRoutes);

// Day 6: Sheets routes
// router.use('/sheets', sheetRoutes);

// Day 7: Classroom routes
// router.use('/classrooms', classroomRoutes);

// Day 8: AI Tutor routes
// router.use('/ai-tutor', aiTutorRoutes);

// Day 9: Dashboard routes
// router.use('/dashboard', dashboardRoutes);

export default router;

