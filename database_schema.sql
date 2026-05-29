-- ============================================================================
-- CODELearn - Complete Database Schema Setup (PostgreSQL)
-- Matches Prompt 1.1 Specifications (21 Interconnected Tables)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- ENUMS (Custom Types)
-- ----------------------------------------------------------------------------

CREATE TYPE user_role_enum AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE difficulty_enum AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE submission_status_enum AS ENUM (
  'pending', 
  'accepted', 
  'wrong_answer', 
  'time_limit_exceeded', 
  'memory_limit_exceeded', 
  'runtime_error', 
  'compile_error'
);
CREATE TYPE contest_status_enum AS ENUM ('upcoming', 'active', 'ended');

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- TABLES
-- ----------------------------------------------------------------------------

-- 1. users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  roll_no VARCHAR(50) UNIQUE DEFAULT NULL,
  password_hash VARCHAR(255) NOT NULL,
  department VARCHAR(100) DEFAULT NULL,
  role user_role_enum NOT NULL DEFAULT 'student',
  profile_image_url TEXT DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);
COMMENT ON TABLE users IS 'Saves registered student, teacher, and administrator credentials and system states.';

-- 2. topics
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  icon VARCHAR(100) DEFAULT NULL,
  difficulty_level difficulty_enum NOT NULL DEFAULT 'easy',
  order_position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE topics IS 'Holds curriculum modules categorizing data structures & algorithm domains.';

-- 3. subtopics
CREATE TABLE subtopics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  video_url VARCHAR(255) DEFAULT NULL,
  order_position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE subtopics IS 'Contains sequential reading pages, markdown documentation study sheets, and video references.';

-- 4. user_subtopic_progress
CREATE TABLE user_subtopic_progress (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subtopic_id UUID NOT NULL REFERENCES subtopics(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT TRUE,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, subtopic_id)
);
COMMENT ON TABLE user_subtopic_progress IS 'Tracks student syllabus progression by marking individual subtopics complete.';

-- 5. questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  difficulty difficulty_enum NOT NULL DEFAULT 'easy',
  problem_statement TEXT NOT NULL,
  constraints TEXT DEFAULT NULL,
  examples JSONB DEFAULT NULL,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  acceptance_rate DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  total_submissions INT NOT NULL DEFAULT 0,
  total_solved INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE questions IS 'Contains problem specifications, markdown explanations, examples, and metadata.';

-- 6. testcases
CREATE TABLE testcases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  explanation TEXT DEFAULT NULL,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  order_position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE testcases IS 'Stores compiler assertion validations. Distinguishes between sample (visible) and hidden test suites.';

-- 7. submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language VARCHAR(50) NOT NULL,
  status submission_status_enum NOT NULL DEFAULT 'pending',
  testcases_passed INT NOT NULL DEFAULT 0,
  testcases_total INT NOT NULL DEFAULT 0,
  execution_time DECIMAL(6,3) DEFAULT NULL,
  memory_used DECIMAL(6,2) DEFAULT NULL,
  error_message TEXT DEFAULT NULL,
  judge0_token VARCHAR(255) DEFAULT NULL,
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE submissions IS 'Saves records of user code runs and submissions evaluated by the compiler compiler runtime.';

-- 8. solved_questions
CREATE TABLE solved_questions (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  last_accepted_submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
  solved_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  difficulty_level VARCHAR(20) DEFAULT NULL,
  PRIMARY KEY (user_id, question_id)
);
COMMENT ON TABLE solved_questions IS 'Maps resolved problems per student to ensure efficient stats rendering and badge calculations.';

-- 9. classrooms
CREATE TABLE classrooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
  description TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE classrooms IS 'Manages courses led by teacher accounts.';

-- 10. classroom_students
CREATE TABLE classroom_students (
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (classroom_id, student_id)
);
COMMENT ON TABLE classroom_students IS 'Acts as a junction mapping students enrolled in various classrooms.';

-- 11. assignments
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  deadline TIMESTAMP NOT NULL,
  description TEXT DEFAULT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE assignments IS 'Saves classroom assignments containing code sheets created by teachers.';

-- 12. assignment_questions
CREATE TABLE assignment_questions (
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  position INT NOT NULL DEFAULT 0,
  PRIMARY KEY (assignment_id, question_id)
);
COMMENT ON TABLE assignment_questions IS 'Interlinks questions assigned in student problem-solving checklists.';

-- 13. contests
CREATE TABLE contests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  status contest_status_enum NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE contests IS 'Saves schedule coding challenges created by instructors.';

-- 14. contest_questions
CREATE TABLE contest_questions (
  contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  position INT NOT NULL DEFAULT 0,
  points INT NOT NULL DEFAULT 100,
  PRIMARY KEY (contest_id, question_id)
);
COMMENT ON TABLE contest_questions IS 'Maps points and configurations per problem inside active contests.';

-- 15. contest_submissions
CREATE TABLE contest_submissions (
  contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  points_awarded INT NOT NULL DEFAULT 0,
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (contest_id, user_id, question_id, submission_id)
);
COMMENT ON TABLE contest_submissions IS 'Filters submissions made specifically during competitive programming windows.';

-- 16. contest_leaderboard
CREATE TABLE contest_leaderboard (
  contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INT NOT NULL DEFAULT 0,
  rank INT DEFAULT NULL,
  last_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (contest_id, user_id)
);
COMMENT ON TABLE contest_leaderboard IS 'Stores calculated scores and rankings during contest completions.';

-- 17. sheets
CREATE TABLE sheets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  company_name VARCHAR(255) DEFAULT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE sheets IS 'Saves curated preparation lists (like FAANG sheets, Blind 75, and company bundles).';

-- 18. sheet_questions
CREATE TABLE sheet_questions (
  sheet_id UUID NOT NULL REFERENCES sheets(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  position INT NOT NULL DEFAULT 0,
  PRIMARY KEY (sheet_id, question_id)
);
COMMENT ON TABLE sheet_questions IS 'Maps question order configuration inside custom interview sheets.';

-- 19. classroom_messages
CREATE TABLE classroom_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE classroom_messages IS 'Handles messages posted inside classroom message boards/chat feeds.';

-- 20. ai_chat_history
CREATE TABLE ai_chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  context TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE ai_chat_history IS 'Stores logs of coding support chats with the virtual AI tutor.';

-- 21. user_activity
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  submissions_count INT NOT NULL DEFAULT 0,
  accepted_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, activity_date)
);
COMMENT ON TABLE user_activity IS 'Aggregates counts of daily user activity to render the dashboard heatmap graph.';

-- ----------------------------------------------------------------------------
-- INDEXES (Optimization Layer)
-- ----------------------------------------------------------------------------

-- Indexes on users (Search & Auth)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_roll_no ON users(roll_no) WHERE roll_no IS NOT NULL;
CREATE INDEX idx_users_role ON users(role);

-- Indexes on curriculum module maps
CREATE INDEX idx_subtopics_topic_id ON subtopics(topic_id);

-- Indexes on coding content catalog
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_topic_id ON questions(topic_id) WHERE topic_id IS NOT NULL;

-- Indexes on test suites
CREATE INDEX idx_testcases_question_id ON testcases(question_id);

-- Indexes on code runs/submissions (Heavy read-writes)
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_question_id ON submissions(question_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at DESC);

-- Indexes on classroom junctions
CREATE INDEX idx_classroom_students_student_id ON classroom_students(student_id);

-- Indexes on assignments
CREATE INDEX idx_assignments_classroom_id ON assignments(classroom_id);

-- Indexes on competitive programming
CREATE INDEX idx_contests_classroom_id ON contests(classroom_id);
CREATE INDEX idx_contest_submissions_user_id ON contest_submissions(user_id);
CREATE INDEX idx_contest_leaderboard_score ON contest_leaderboard(contest_id, score DESC);

-- Indexes on prep sheets
CREATE INDEX idx_sheet_questions_question_id ON sheet_questions(question_id);

-- Indexes on classroom message threads
CREATE INDEX idx_classroom_messages_classroom_id ON classroom_messages(classroom_id);
CREATE INDEX idx_classroom_messages_created_at ON classroom_messages(created_at DESC);

-- Indexes on interactive AI tutor chat histories
CREATE INDEX idx_ai_chat_history_user_id ON ai_chat_history(user_id);
CREATE INDEX idx_ai_chat_history_created_at ON ai_chat_history(created_at DESC);

-- Indexes on heatmaps
CREATE INDEX idx_user_activity_user_date ON user_activity(user_id, activity_date DESC);

-- ============================================================================
-- POSTGRESQL BEST PRACTICES SUMMARY
-- ============================================================================
-- 1. UUID v4 Primary Keys: UUIDs prevent auto-increment enumeration vulnerability,
--    ideal for microservices and database clustering.
-- 2. Indexing Strategy: Indexes are applied to fields inside WHERE clauses, JOIN conditions,
--    and ORDER BY operations. Non-null conditions and sorted sequences are supported.
-- 3. Foreign Key Cascades: Cascade deletes enforce database integrity. Cascade deletes 
--    clean up junction dependencies automatically, while SET NULL preserves records.
-- 4. Jsonb Support: Examples inside coding questions utilize the jsonb datatype, 
--    which stores data in a binary format, allowing fast indexing and key lookups.
-- 5. Aggregate Activity Tables: The user_activity table stores daily aggregations,
--    allowing fast loading of heatmap charts without scaning the entire submissions table.
-- ============================================================================
