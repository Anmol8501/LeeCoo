# CodeLearn Platform - Antigravity Editor Prompts
## Production-Quality Prompts for Rapid MVP Development

---

## PROMPT INSTRUCTION GUIDE

**How to use these prompts:**
1. Copy the prompt exactly (including all specifications)
2. Paste into Antigravity Editor
3. Wait for complete code generation
4. Review and test the output
5. Deploy to your development server

**Expected outputs:**
- Complete, working code (not snippets)
- Production-ready with error handling
- Properly structured and commented
- Database migrations/seeds included
- API tested and functional

---

# MODULE 1: PROJECT INITIALIZATION & DATABASE

## Prompt 1.1: Complete Database Schema Setup

```
You are a PostgreSQL expert building a college coding platform database.

Create the complete production-ready PostgreSQL schema with all tables, relationships, constraints, and indexes.

Requirements:
- Create 20+ interconnected tables
- Proper foreign key relationships
- Indexes on frequently queried columns
- Timestamp fields (created_at, updated_at)
- Enum types for statuses
- Unique constraints where needed

Tables to create:
1. users (id, name, email, roll_no, password_hash, department, role, created_at, etc.)
2. topics (id, language, title, difficulty_level)
3. subtopics (id, topic_id, title, notes, youtube_link, order_position)
4. user_subtopic_progress (user_id, subtopic_id, completed, completed_at)
5. questions (id, title, difficulty, problem_statement, constraints, examples, topic_id)
6. testcases (id, question_id, input, expected_output, is_hidden, order_position)
7. submissions (id, user_id, question_id, code, language, status, testcases_passed)
8. solved_questions (user_id, question_id, last_accepted_submission_id, solved_at)
9. classrooms (id, name, teacher_id, description, created_at)
10. classroom_students (classroom_id, student_id, joined_at)
11. assignments (id, classroom_id, title, deadline, description, created_by)
12. assignment_questions (assignment_id, question_id, position)
13. contests (id, classroom_id, title, start_time, end_time, created_by)
14. contest_questions (contest_id, question_id, position, points)
15. contest_submissions (contest_id, user_id, question_id, submission_id, status)
16. contest_leaderboard (contest_id, user_id, score, rank)
17. sheets (id, title, type, description, company_name, created_by)
18. sheet_questions (sheet_id, question_id, position)
19. classroom_messages (id, classroom_id, user_id, message, created_at)
20. ai_chat_history (id, user_id, question_id, user_message, ai_response, context, created_at)
21. user_activity (id, user_id, activity_date, submissions_count, accepted_count)

Deliverables:
1. Complete SQL schema with CREATE TABLE statements
2. All constraints (PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, DEFAULT)
3. Indexes on: email, roll_no, role, difficulty, topic_id, user_id, status, created_at
4. ENUM types for: user role, submission status, difficulty, contest status
5. Comments explaining each table
6. Best practices for PostgreSQL

Output the complete, working SQL script that can be run directly.
```

---

# MODULE 2: BACKEND - AUTHENTICATION

## Prompt 2.1: Complete Auth System (Backend)

```
You are building a Node.js + Express authentication system for a college coding platform.

Create the complete authentication module with all files, services, and controllers.

Tech Stack: Node.js, Express, PostgreSQL with TypeORM, JWT, bcrypt

Requirements:
- User registration with validation
- Login with JWT tokens
- Refresh token mechanism (7-day refresh, 24-hour access)
- Password hashing with bcrypt (10 rounds)
- Protected route middleware
- Role-based access control (RBAC)
- Error handling for all scenarios

Deliverables (Create complete, production-ready files):

1. User Entity (TypeORM):
   - Properties: id, name, email, roll_no, password_hash, department, role, profile_image, bio, created_at, updated_at, is_active, last_login
   - Relationships: classrooms created, classroom_students, submissions, solved_questions
   - Indexes on email, roll_no, role

2. JwtService:
   - generateAccessToken(userId, role) -> returns token
   - generateRefreshToken(userId) -> returns token
   - verifyAccessToken(token) -> returns payload or throws
   - verifyRefreshToken(token) -> returns payload
   - refreshAccessToken(refreshToken) -> returns new access token
   - Constants: ACCESS_TOKEN_EXPIRY (24h), REFRESH_TOKEN_EXPIRY (7d), SECRET_KEY from env

3. PasswordService:
   - hashPassword(plainPassword) -> bcrypt hashed
   - comparePassword(plainPassword, hashedPassword) -> boolean
   - validatePasswordStrength(password) -> returns { isValid, errors }

4. AuthService (Main business logic):
   - register(name, email, roll_no, password, department) -> {token, refreshToken, user}
   - login(email, password) -> {token, refreshToken, user}
   - refreshAccessToken(refreshToken) -> {token}
   - validateUserExists(email, roll_no) -> throws error if exists
   - getUserById(id) -> user
   - logout(userId) -> removes session (optional)

5. AuthController:
   - POST /auth/register - request body validation, call AuthService.register
   - POST /auth/login - validate input, call AuthService.login
   - POST /auth/refresh - validate refresh token, return new access token
   - GET /auth/profile - protected route, return user profile
   - POST /auth/logout - optional, clear tokens

6. Middleware:
   - authMiddleware.ts - verify JWT token, set user in request
   - roleMiddleware.ts - check user role (student, teacher, admin)
   - Protected routes should use authMiddleware

7. Routes File (auth.routes.ts):
   - All auth endpoints with proper middleware

8. Error Handling:
   - DuplicateEmailError
   - InvalidCredentialsError
   - InvalidTokenError
   - ValidationError
   - Custom error messages for each case

9. Input Validation:
   - Email format
   - Password strength (min 8, 1 uppercase, 1 number, 1 special char)
   - Roll number format
   - Name length and characters
   - Department validation

10. Response Format:
    - Success: { success: true, data: {...}, message: "..." }
    - Error: { success: false, error: { code: "...", message: "..." } }

Requirements:
- Use TypeORM for database operations
- All functions should have try-catch with proper error handling
- Add JSDoc comments for all methods
- Environment variables for secrets
- Rate limiting ready (to be added in middleware)
- All code must be production-ready with no TODOs

Output all files with complete code. Files needed:
- src/entities/User.entity.ts
- src/services/JwtService.ts
- src/services/PasswordService.ts
- src/services/AuthService.ts
- src/controllers/AuthController.ts
- src/middleware/authMiddleware.ts
- src/middleware/roleMiddleware.ts
- src/routes/auth.routes.ts
- src/types/auth.types.ts

Include imports, proper structure, and ensure everything works together.
```

---

# MODULE 3: BACKEND - QUESTIONS & SUBMISSIONS

## Prompt 3.1: Questions Management & Code Execution

```
You are building a complete questions and code submission system for a LeetCode-like platform.

Create all backend modules for questions, test cases, code execution via Judge0, and submission tracking.

Tech Stack: Node.js, Express, PostgreSQL with TypeORM, Judge0 API, Judge0 RapidAPI key

Database Tables (entities):
- Question: id, title, difficulty, problem_statement, constraints, examples, topic_id, acceptance_rate
- TestCase: id, question_id, input, expected_output, explanation, is_hidden, order_position
- Submission: id, user_id, question_id, code, language, status, testcases_passed, testcases_total, execution_time, memory_used, error_message, judge0_token, submitted_at
- SolvedQuestion: user_id, question_id, last_accepted_submission_id, solved_at

Deliverables (Complete, production-ready code):

1. Question Entity (TypeORM):
   - Properties: id, title, difficulty (easy/medium/hard), problem_statement (HTML), constraints (JSON), examples (JSON), topic_id, acceptance_rate, total_submissions, total_solved, created_at, updated_at
   - Relations: testcases, submissions, sheets, assignments

2. TestCase Entity:
   - Properties: id, question_id, input, expected_output, explanation, is_hidden, order_position
   - Relation: question

3. Submission Entity:
   - Properties: id, user_id, question_id, code, language (js/python/java/cpp), status (accepted/wrong_answer/runtime_error/time_limit_exceeded/memory_limit_exceeded/compilation_error), testcases_passed, testcases_total, execution_time, memory_used, error_message, judge0_token, submitted_at
   - Relations: user, question, solved_question

4. SolvedQuestion Entity:
   - Properties: id, user_id, question_id, last_accepted_submission_id, solved_at, difficulty_level
   - Relations: user, question

5. Judge0Client Service:
   - submitCode(code, language, input, expected_output) -> returns token
   - pollResult(token) -> returns full Judge0 response
   - getLanguages() -> returns list of supported languages
   - Language mapping: 1=C, 2=Java, 7=Python, 63=JavaScript, 73=C++
   - Constants: JUDGE0_BASE_URL, API_KEY, POLL_INTERVAL (1000ms), MAX_POLLS (60)
   - Error handling for API failures, timeouts, invalid responses

6. CodeExecutionService:
   - runCode(code, language, testcases) -> runs against visible test cases, returns results immediately
   - parseJudge0Response(response) -> extracts status, memory, time, output, error message
   - mapStatusCode(statusCode) -> converts Judge0 status code to human-readable status
   - Status codes: 3=AC, 4=WA, 5=TLE, 6=CE, 7=RTE, 8=MLE, 9=No, 10=Waiting
   - calculateMetrics(response) -> execution_time, memory_used, testcases_passed
   - Error extraction: extract line numbers, error messages from CE and RTE
   - handleTimeoutScenario() -> if polling exceeds time, return partial results

7. SubmissionService:
   - createSubmission(userId, questionId, code, language) -> saves to DB, returns submission object
   - runCode(submissionId) -> executes against sample test cases, returns results
   - submitCode(submissionId) -> executes against all test cases (hidden + visible)
   - pollAndUpdateSubmission(submissionId, judge0Token) -> polls Judge0, updates DB
   - markAsSolved(userId, questionId, submissionId) -> creates SolvedQuestion entry
   - getSubmissionHistory(userId, questionId) -> returns last 10 submissions
   - getAcceptanceRate(userId) -> calculates (accepted / total)

8. QuestionController:
   - GET /questions - query params: page (default 1), limit (default 20), difficulty, topic, language, search
   - GET /questions/:id - return full question with testcases (visible only for non-submitted)
   - GET /questions/:id/testcases - return visible testcases only
   - POST /questions/:id/run - body: { code, language } - runs against sample test cases
   - POST /questions/:id/submit - body: { code, language } - submits for evaluation

9. SubmissionController:
   - GET /submissions/:id - get submission details
   - GET /submissions/user/:userId - get user's submission history
   - GET /submissions/question/:questionId/latest - get latest submission for question
   - WebSocket or polling endpoint for real-time status updates

10. Repositories:
    - QuestionRepository: findByDifficulty, findByTopic, search, getPopular, getFiltered
    - SubmissionRepository: findByUser, findByQuestion, getLatestAccepted, countByStatus

11. Routes (questions.routes.ts):
    - GET /api/questions
    - GET /api/questions/:id
    - GET /api/questions/:id/testcases
    - POST /api/submissions/run
    - POST /api/submissions/submit
    - GET /api/submissions/:id
    - GET /api/submissions/user/:userId

12. Caching:
    - Cache questions for 1 hour
    - Cache popular questions for 24 hours
    - Invalidate submission cache on new submission

13. Error Handling:
    - QuestionNotFoundError
    - LanguageNotSupportedError
    - CodeExecutionError
    - Judge0APIError
    - ValidationError

14. Input Validation:
    - Code length validation (max 100KB)
    - Language validation against supported list
    - Question existence validation
    - User authentication check

Requirements:
- TypeORM for database
- All methods with JSDoc comments
- Comprehensive error messages
- Response format: { success: true/false, data, error }
- Production-ready with no shortcuts
- Judge0 integration fully functional

Output all files needed:
- src/entities/Question.entity.ts
- src/entities/TestCase.entity.ts
- src/entities/Submission.entity.ts
- src/entities/SolvedQuestion.entity.ts
- src/integrations/Judge0Client.ts
- src/services/CodeExecutionService.ts
- src/services/SubmissionService.ts
- src/controllers/QuestionController.ts
- src/controllers/SubmissionController.ts
- src/repositories/QuestionRepository.ts
- src/repositories/SubmissionRepository.ts
- src/routes/questions.routes.ts
- src/types/submission.types.ts

All code complete and working.
```

---

# MODULE 4: FRONTEND - AUTHENTICATION UI

## Prompt 4.1: Authentication Pages (Next.js)

```
You are building beautiful, production-grade authentication pages for a college coding platform.

Create login, signup, and profile pages with complete form validation, error handling, and styling.

Tech Stack: Next.js (App Router), TypeScript, Tailwind CSS, ShadCN UI, Axios, Zustand

Design Requirements:
- Dark theme (coding platform aesthetic)
- Modern, clean UI
- Smooth transitions and animations
- Mobile responsive
- Developer-friendly appearance
- Form validation with real-time feedback
- Loading states and error messages

Deliverables (Complete, production-ready code):

1. Login Page (/login):
   - Email input field
   - Password input field
   - "Forgot password?" link (optional for MVP)
   - "Sign up here" link
   - Login button with loading state
   - Error message display
   - Form validation: email format, password not empty
   - Redirect to dashboard on success
   - Remember me checkbox (optional)

2. Signup Page (/signup):
   - Name input field
   - Email input field
   - Roll number input field
   - Department dropdown (CSE, ECE, IT, Mech, etc.)
   - Password input with strength indicator
   - Confirm password input
   - Terms checkbox
   - Signup button with loading state
   - Error message display
   - Form validation:
     * Email format validation
     * Password strength (min 8, 1 uppercase, 1 number, 1 special)
     * Name not empty
     * Roll number format validation
     * Passwords match
     * Terms accepted
   - "Already have account? Login" link
   - Redirect to login on success

3. Profile Page (/profile):
   - User info section (name, email, roll number, department)
   - Edit profile form
   - Change password section
   - Statistics (total solved, submissions, etc.)
   - Logout button
   - Profile picture upload (optional)
   - Form for updating name, bio, profile picture

4. Auth Hook (useAuth.ts):
   - login(email, password)
   - signup(name, email, roll_no, password, department)
   - logout()
   - getProfile()
   - isAuthenticated
   - user object
   - loading state
   - error state

5. Auth Store (Zustand):
   - user: User | null
   - token: string | null
   - refreshToken: string | null
   - setUser()
   - setToken()
   - clearAuth()
   - Methods use localStorage for persistence

6. API Service (authService.ts):
   - login(email, password)
   - signup(data)
   - getProfile()
   - updateProfile(data)
   - changePassword(oldPassword, newPassword)
   - logout()
   - All with proper error handling

7. Protected Route Middleware:
   - Check authentication before rendering protected pages
   - Redirect to login if not authenticated
   - Show loading spinner while checking auth

8. Components:
   - FormField: Wrapper for input with validation display
   - PasswordStrengthIndicator: Shows password strength
   - LoadingButton: Button with loading spinner
   - ErrorAlert: Display error messages
   - SuccessAlert: Display success messages

9. Styling:
   - Use Tailwind CSS
   - Dark theme with gradient accents
   - Smooth transitions (200ms)
   - Hover states on buttons
   - Responsive grid layout
   - Card-based design

10. Form Validation:
    - Real-time validation feedback
    - Show errors only after field blur
    - Disable submit button while loading or validation fails
    - Clear validation on field change

11. Error Handling:
    - Display API error messages
    - Handle network errors
    - Show timeout errors
    - Validation error display

12. Features:
    - Form auto-save draft (localStorage)
    - Show/hide password toggle
    - "Remember me" functionality (optional)
    - Loading spinners during API calls
    - Success toast on login/signup

Requirements:
- TypeScript throughout
- ShadCN UI components for base
- Tailwind for custom styling
- Axios for API calls
- Zustand for state management
- Complete form validation
- Production-ready code
- Proper TypeScript types

Output these files:
- app/(auth)/login/page.tsx
- app/(auth)/signup/page.tsx
- app/(dashboard)/profile/page.tsx
- hooks/useAuth.ts
- services/authService.ts
- store/authStore.ts
- components/FormField.tsx
- components/PasswordStrengthIndicator.tsx
- components/LoadingButton.tsx
- components/ErrorAlert.tsx
- types/auth.types.ts

All components fully functional with proper styling and validation.
```

---

# MODULE 5: FRONTEND - CODE EDITOR PAGE

## Prompt 5.1: Question Solving Page with Monaco Editor

```
You are building a professional code editor page for solving programming questions.

Create the complete question detail page with Monaco editor, test cases, and submission system.

Tech Stack: Next.js, TypeScript, Tailwind CSS, ShadCN UI, Monaco Editor (via @monaco-editor/react), Axios

Design Requirements:
- Modern LeetCode-like layout
- Dark theme
- Responsive (sidebar on desktop, modal on mobile)
- Smooth animations
- Real-time compilation feedback
- Clear error highlighting

Page Layout:
- Left panel (50%): Problem statement
- Right panel (50%): Code editor
- Bottom panel: Test cases and results

Deliverables (Complete, production-ready code):

1. Question Detail Page (/questions/[questionId]/page.tsx):
   - Left sidebar: Problem statement, constraints, examples
   - Right sidebar: Code editor
   - Bottom panel: Test case results
   - Responsive layout that stacks on mobile

2. Problem Statement Section:
   - Question title with difficulty badge
   - Acceptance rate
   - Problem statement (HTML content, properly rendered)
   - Constraints list
   - Examples with input/output formatted code blocks
   - Topics tags
   - Related problems (if any)

3. Monaco Editor Component:
   - Language selector (JavaScript, Python, Java, C++)
   - Theme selector (dark, light)
   - Font size adjuster
   - Code formatting button (Prettier)
   - Auto-save to localStorage
   - Syntax highlighting for selected language
   - Line numbers
   - Minimap
   - Word wrap
   - Selected language default boilerplate code

4. Language Support:
   - JavaScript: show starter template with function signature
   - Python: show starter template
   - Java: show starter template with class
   - C++: show starter template
   - Template for each language guides students

5. Test Cases Panel:
   - Display all visible test cases
   - Input/output display with code formatting
   - Run against individual test cases
   - Show expected vs actual output

6. Submission/Run Controls:
   - "Run Code" button: tests against sample test cases, instant feedback
   - "Submit Code" button: submits for all test cases (hidden + visible)
   - Loading state during execution
   - "Clear" button: resets code to initial template
   - "Copy" button: copy code to clipboard

7. Results Panel:
   - After "Run": Show results for each sample test case
   - Test case # | Input | Expected Output | Actual Output | Status
   - Green checkmark for passed
   - Red X for failed
   - Execution time and memory
   - Error message if any (CE, RTE, etc.)
   - After "Submit": Show if all test cases passed, overall stats

8. Error Display:
   - Syntax errors: highlight in editor with red underline
   - Runtime errors: show error message and stack trace
   - Compilation errors: show line number and error
   - Time limit exceeded: show which test case
   - Memory limit exceeded: show memory used

9. Submission History Sidebar:
   - Tab to show past submissions
   - List of submissions with status, time, language
   - Click to view submission details
   - Show only last 10 submissions

10. Hooks/Services:
    - useQuestion(questionId): fetch question details
    - useSubmission(): submit code and get results
    - useCodeEditor(): manage editor state, code, language
    - editorService.ts: API calls for run/submit

11. Components:
    - MonacoEditorComponent: Editor wrapper
    - LanguageSelector: Language dropdown
    - ThemeSelector: Dark/light toggle
    - TestCaseDisplay: Show test case input/output
    - ResultsPanel: Display execution results
    - ErrorDisplay: Show error messages
    - SubmissionHistory: List past submissions
    - ProblemStatement: Rendered HTML content

12. Features:
    - Auto-save code to localStorage (auto-restore on page load)
    - Keyboard shortcut for submit (Cmd+Enter)
    - Syntax highlighting
    - Code formatting with Prettier
    - Status badges (Accepted, Wrong Answer, TLE, CE, RTE)
    - Smooth animations on results
    - Toast notifications for success/error
    - Loading spinners during execution
    - Progress bar showing test case progress

13. Styling:
    - Dark theme matching platform
    - Editor with custom scrollbar
    - Responsive grid layout
    - Smooth transitions
    - Clear visual hierarchy
    - Proper spacing and padding

14. Error Handling:
    - Show error if question not found
    - Show error if submission fails
    - Network error handling
    - Timeout handling with retry option
    - API error messages displayed to user

Requirements:
- TypeScript throughout
- Monaco Editor fully integrated
- All styling with Tailwind
- Proper error handling
- Responsive design
- Production-ready code

Output these files:
- app/(dashboard)/questions/[questionId]/page.tsx
- components/features/CodeEditor/MonacoEditor.tsx
- components/features/CodeEditor/LanguageSelector.tsx
- components/features/CodeEditor/ThemeSelector.tsx
- components/features/CodeEditor/TestCaseDisplay.tsx
- components/features/CodeEditor/ResultsPanel.tsx
- components/features/CodeEditor/ErrorDisplay.tsx
- components/features/CodeEditor/SubmissionHistory.tsx
- components/features/CodeEditor/ProblemStatement.tsx
- hooks/useQuestion.ts
- hooks/useSubmission.ts
- services/questionsService.ts
- services/submissionsService.ts
- types/question.types.ts

All components fully styled and functional.
```

---

# MODULE 6: FLOATING AI CHATBOT

## Prompt 6.1: AI Tutor Chatbot Component

```
You are building a floating AI chatbot assistant for a coding learning platform.

Create a beautiful, functional chatbot widget that appears globally and helps with coding questions.

Tech Stack: Next.js, React, TypeScript, Tailwind CSS, Socket.IO (for real-time streaming)

Design Requirements:
- Floating button in bottom-right corner
- Minimized and expanded states
- Smooth animations
- Dark theme matching platform
- Mobile-friendly (full screen on mobile)
- Glassmorphism effect

Features:
- AI assistant answers coding/DSA/debugging questions only
- Rejects unrelated questions politely
- Streams responses for better UX
- Shows typing indicator
- Message history
- Clear chat button
- Quick action suggestions

Deliverables (Complete, production-ready code):

1. Floating Chatbot Component (components/ai/FloatingChatbot.tsx):
   - Minimized state: small circular button with icon
   - Expanded state: chat window (300px wide, 400px tall)
   - Smooth slide-in/out animation
   - Drag handle to move (optional, for MVP skip)
   - Close button
   - Minimize button

2. ChatWindow Component:
   - Header with title "Code Tutor"
   - Messages area with scrolling
   - Input area with send button
   - Typing indicator when AI is thinking
   - Clear chat history button
   - Settings/info icon (optional)

3. ChatMessage Component:
   - User messages on right (blue background)
   - AI messages on left (gray background)
   - Markdown rendering for AI responses
   - Code block syntax highlighting
   - Timestamp (optional)
   - Copy button for code blocks

4. ChatInput Component:
   - Text area for message input
   - Send button (or use Enter key)
   - Disabled when loading
   - Character counter (optional)
   - Paste code snippets support

5. TypingIndicator Component:
   - Animated dots showing AI is typing
   - Smooth animation

6. Quick Actions Component:
   - Buttons for common queries:
     * "Explain Error"
     * "Give Hint"
     * "Explain Approach"
     * "Similar Problems"
   - Click to auto-populate message input

7. MessageStreamingEffect:
   - Show AI response character by character
   - For better perceived responsiveness

8. useChat Hook:
   - messages: array of chat messages
   - sendMessage(message)
   - clearChat()
   - isLoading
   - error
   - Connected to backend via Socket.IO or fetch

9. AI Service (aiService.ts):
   - sendMessage(userId, message, context): sends to backend, gets AI response
   - Stream response handling
   - Error handling
   - Context includes: current question, submission error, code snippet

10. Store (chatStore.ts):
    - Messages history
    - Open/closed state
    - Clear messages
    - Persist to localStorage

11. Styling:
    - Glassmorphism: backdrop blur, semi-transparent background
    - Dark theme with purple/blue accents
    - Smooth transitions (300ms)
    - Responsive text sizes
    - Mobile: full screen (100vh, 100vw)
    - Desktop: fixed position bottom-right with margin

12. Animations:
    - Minimize: slide out animation (300ms)
    - Message appear: fade in + slide up
    - Typing indicator: pulse animation
    - Smooth scrolling to latest message

13. Features:
    - Message persistence (localStorage, up to 50 messages)
    - Auto-clear on logout
    - Disable outside coding context (optional)
    - Unread message badge on minimized button
    - Online/offline indicator
    - Reconnection handling

14. Response Handling:
    - Parse markdown in AI responses
    - Syntax highlight code blocks
    - Handle streaming responses
    - Show loading skeleton while waiting
    - Show error message if API fails
    - Retry button on error

15. Accessibility:
    - Keyboard navigation (Tab to focus)
    - Screen reader support
    - ARIA labels
    - Focus visible states

Requirements:
- TypeScript throughout
- All Tailwind styling
- Responsive design
- Socket.IO ready (or fetch-based)
- Streaming response support
- Production-ready code

Output these files:
- components/ai/FloatingChatbot.tsx
- components/ai/ChatWindow.tsx
- components/ai/ChatMessage.tsx
- components/ai/ChatInput.tsx
- components/ai/TypingIndicator.tsx
- components/ai/QuickActions.tsx
- hooks/useChat.ts
- services/aiService.ts
- store/chatStore.ts
- types/chat.types.ts
- styles/chatbot.module.css (if needed)

All components fully styled and functional. Include proper animations and UX feedback.
```

---

# MODULE 7: DASHBOARD PAGE

## Prompt 7.1: Student Dashboard with Analytics

```
You are building a comprehensive student dashboard showing progress, stats, and analytics.

Create a beautiful dashboard with charts, progress bars, and actionable insights.

Tech Stack: Next.js, TypeScript, Tailwind CSS, ShadCN UI, Recharts (for charts)

Dashboard Layout:
- Top: Quick stats (cards)
- Middle-left: Activity heatmap
- Middle-right: Progress by topic chart
- Bottom-left: Weak areas
- Bottom-right: Upcoming contests/assignments

Deliverables (Complete, production-ready code):

1. Dashboard Page (/dashboard/page.tsx):
   - Grid layout (responsive, 1 column on mobile, 2-3 on desktop)
   - Header with greeting and current streak
   - All components integrated

2. Stats Cards Section:
   - Card 1: Total Problems Solved (large number, trend indicator)
   - Card 2: Total Submissions
   - Card 3: Acceptance Rate (percentage)
   - Card 4: Current Streak (days with badge)
   - Card 5: Max Streak
   - Card 6: Languages Used (count)

3. Activity Heatmap Component:
   - 365-day grid (last year)
   - Color intensity based on submissions count
   - Tooltip showing date and count
   - Legend showing color scale
   - Current date highlighted
   - Responsive (scales on mobile)
   - Date range selector (optional)

4. Progress by Topic Pie Chart:
   - Topics with solved count
   - Donut chart showing distribution
   - Click to filter/view topic
   - Legend with topic names
   - Responsive

5. Topic Progress Detailed Section:
   - Table or list showing:
     * Topic name
     * Solved / Total questions
     * Progress percentage with bar
     * Difficulty breakdown (easy/medium/hard)
     * Link to practice more

6. Weak Areas Section:
   - Topics with <50% accuracy
   - Sorted by lowest accuracy first
   - Show accuracy percentage
   - Recommended questions count
   - "Practice Now" button links to topic

7. Upcoming Events Section:
   - Upcoming contests and assignments
   - Cards showing: name, deadline, status
   - Countdown timer (optional)
   - "Join" button for contests

8. Continue Learning Section:
   - In-progress topics
   - Show progress bar
   - "Continue" button

9. Leaderboard Preview:
   - Top 5 users in classroom
   - Rank, name, solved count, streak
   - "View Full Leaderboard" link
   - Responsive table

10. Components:
    - StatCard: Shows single stat with icon and trend
    - HeatmapChart: Activity heatmap using recharts
    - ProgressChart: Pie/Donut chart of topics
    - TopicProgressList: Detailed topic list with bars
    - WeakAreasList: Topics needing improvement
    - UpcomingEvents: Contests and assignments
    - LeaderboardPreview: Top students table

11. Hooks:
    - useDashboardStats(): fetch all dashboard data
    - useHeatmap(): fetch heatmap data
    - useTopicProgress(): fetch topic progress
    - useLeaderboard(): fetch leaderboard

12. Services:
    - dashboardService.ts: All API calls
    - getStats()
    - getHeatmap()
    - getTopicProgress()
    - getWeakAreas()
    - getLeaderboard()

13. Styling:
    - Dark theme
    - Card-based layout
    - Smooth transitions
    - Icons from Lucide React
    - Responsive grid
    - Color-coded difficulty (green=easy, yellow=medium, red=hard)

14. Features:
    - Real-time data refresh
    - Caching (stale-while-revalidate)
    - Skeleton loading
    - Error handling with retry
    - No data states
    - Mobile responsive
    - Animations on load

15. Charts:
    - Recharts for all visualizations
    - Responsive containers
    - Custom colors matching theme
    - Tooltips on hover
    - Legend below charts

Requirements:
- TypeScript throughout
- Recharts for charts
- Tailwind for styling
- ShadCN components where applicable
- Responsive design
- Production-ready code

Output these files:
- app/(dashboard)/dashboard/page.tsx
- components/features/Dashboard/StatCard.tsx
- components/features/Dashboard/HeatmapChart.tsx
- components/features/Dashboard/ProgressChart.tsx
- components/features/Dashboard/TopicProgressList.tsx
- components/features/Dashboard/WeakAreasList.tsx
- components/features/Dashboard/UpcomingEvents.tsx
- components/features/Dashboard/LeaderboardPreview.tsx
- hooks/useDashboardStats.ts
- hooks/useHeatmap.ts
- hooks/useTopicProgress.ts
- hooks/useLeaderboard.ts
- services/dashboardService.ts
- types/dashboard.types.ts

All fully styled and functional with proper error handling.
```

---

# MODULE 8: CLASSROOM SYSTEM

## Prompt 8.1: Classroom Management Pages

```
You are building the classroom system for teachers to manage students and create assignments.

Create pages for classroom creation, student management, and assignment creation.

Tech Stack: Next.js, TypeScript, Tailwind CSS, ShadCN UI, Axios, React Hook Form

Deliverables (Complete, production-ready code):

1. Classrooms List Page (/classroom/page.tsx):
   - Grid of classroom cards
   - "Create Classroom" button (teacher) / "Join Classroom" button (student)
   - For teachers: shows created classrooms with stats
   - For students: shows joined classrooms
   - Search and filter

2. Classroom Card Component:
   - Classroom name
   - Teacher name (if viewing as student)
   - Student count
   - Assignment count
   - Last activity date
   - "View" or "Manage" button

3. Create Classroom Modal (Teacher only):
   - Classroom name input
   - Description textarea
   - Create button
   - Cancel button

4. Join Classroom Modal (Student only):
   - Classroom code or search
   - Confirmation
   - Join button

5. Classroom Detail Page (/classroom/[classroomId]/page.tsx):
   - Classroom info header (name, teacher, student count)
   - Tabs:
     * Overview (stats, recent activity)
     * Assignments (list of assignments)
     * Contests (list of contests)
     * Chat (classroom discussion)

6. Manage Classroom Page (/classroom/[classroomId]/manage - teacher only):
   - Student list with search
   - Add student form (by roll number)
   - Bulk import CSV button
   - Remove student buttons
   - Student statistics (solved, accuracy)

7. Assignment List Page (/classroom/[classroomId]/assignments):
   - List of assignments
   - Assignment card with:
     * Title
     * Deadline (with countdown)
     * Status (upcoming, active, completed)
     * Question count
     * Student completion (teacher view)
   - Create assignment button (teacher)

8. Create Assignment Page (/classroom/[classroomId]/assignments/create - teacher only):
   - Assignment name input
   - Description textarea
   - Select questions (searchable, multiple select)
   - Set deadline (date + time picker)
   - Select students (optional, defaults to all)
   - Create button

9. Assignment Detail Page (/classroom/[classroomId]/assignments/[assignmentId]):
   - For teacher: show student progress
     * Student name
     * Questions solved / total
     * Status (submitted, in progress, not started)
     * Submit time
   - For student: show assignment questions, can solve them

10. Components:
    - ClassroomCard: Display single classroom
    - CreateClassroomModal
    - JoinClassroomModal
    - StudentList: Table of students with actions
    - BulkImportCSV: CSV upload for students
    - AssignmentCard: Display assignment
    - QuestionSelector: Multi-select questions
    - ProgressTable: Show student progress

11. Services:
    - classroomService.ts
    - createClassroom()
    - getClassrooms()
    - getClassroom()
    - joinClassroom()
    - getStudents()
    - addStudent()
    - bulkImportStudents()
    - createAssignment()
    - getAssignments()

12. Hooks:
    - useClassroom(): fetch classroom data
    - useClassrooms(): list classrooms
    - useStudents(): fetch students
    - useAssignments(): fetch assignments

13. Features:
    - CSV import for bulk student add
    - Roll number validation
    - Deadline countdown
    - Progress tracking
    - Error handling
    - Loading states
    - Empty states

14. Styling:
    - Dark theme
    - Card-based layout
    - Tables for lists
    - Modals for creation
    - Responsive design

Requirements:
- TypeScript throughout
- Form validation with React Hook Form
- Proper error handling
- Responsive design
- Production-ready code

Output these files:
- app/(dashboard)/classroom/page.tsx
- app/(dashboard)/classroom/[classroomId]/page.tsx
- app/(dashboard)/classroom/[classroomId]/manage/page.tsx
- app/(dashboard)/classroom/[classroomId]/assignments/page.tsx
- app/(dashboard)/classroom/[classroomId]/assignments/create/page.tsx
- app/(dashboard)/classroom/[classroomId]/assignments/[assignmentId]/page.tsx
- components/features/Classroom/ClassroomCard.tsx
- components/features/Classroom/CreateClassroomModal.tsx
- components/features/Classroom/JoinClassroomModal.tsx
- components/features/Classroom/StudentList.tsx
- components/features/Classroom/BulkImportCSV.tsx
- components/features/Classroom/AssignmentCard.tsx
- components/features/Classroom/QuestionSelector.tsx
- components/features/Classroom/ProgressTable.tsx
- hooks/useClassroom.ts
- hooks/useClassrooms.ts
- hooks/useStudents.ts
- hooks/useAssignments.ts
- services/classroomService.ts
- types/classroom.types.ts

All fully functional and styled.
```

---

# QUICK REFERENCE: RUNNING PROMPTS IN ANTIGRAVITY

## Step-by-Step Guide:

1. **Open Antigravity Editor**: Navigate to the Antigravity Editor application

2. **Select Correct Environment**:
   - For backend code: Select "Node.js" or "NestJS" environment
   - For frontend code: Select "Next.js" or "React" environment

3. **Copy Prompt**:
   - Copy the entire prompt text from this document
   - Include all "Deliverables" sections
   - Don't skip requirement sections

4. **Paste & Generate**:
   - Paste into the prompt input
   - Click "Generate" or press Cmd+Enter
   - Wait for complete code generation

5. **Review Output**:
   - Check all files are generated
   - Verify imports and dependencies
   - Test in development environment

6. **Iterate if Needed**:
   - If something is missing, mention it in follow-up
   - Ask for specific modifications
   - Antigravity maintains context, so be specific

---

## TESTING EACH MODULE

After generating code with Antigravity, test in this order:

1. **Authentication**: Register new user, login, logout
2. **Questions**: View question, run code, submit code
3. **Learning**: Browse topics, mark subtopic complete
4. **Classroom**: Create classroom, add student, create assignment
5. **Dashboard**: View stats, heatmap, weak areas
6. **AI Tutor**: Send message, get response
7. **End-to-End**: Complete student journey from signup to solving problems

---

# DEPLOYMENT CHECKLIST

After MVP development:

- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] Seeds loaded (sample questions, topics)
- [ ] Frontend builds successfully
- [ ] Backend starts without errors
- [ ] API endpoints respond correctly
- [ ] Judge0 integration working
- [ ] Authentication flow verified
- [ ] Code execution tested with edge cases
- [ ] Responsiveness tested on mobile
- [ ] Performance optimized (images, bundles)
- [ ] Error handling comprehensive
- [ ] Logging configured
- [ ] Database backups setup
- [ ] Monitoring alerts setup

---

# ANTIGRAVITY BEST PRACTICES

1. **Be Specific**: The more detailed your prompt, the better the output
2. **Include Examples**: Show what you want in expected output format
3. **List Requirements**: Don't skip requirements sections
4. **Specify Tech Stack**: Always mention exact libraries and versions
5. **Ask for Complete Code**: Don't ask for snippets, ask for full, working files
6. **Provide Context**: Explain how this module fits into larger system
7. **Test Immediately**: Don't wait to test, test as soon as code is generated
8. **Iterate Quickly**: Use follow-up prompts for refinements
9. **Keep Scope Focused**: One module per prompt, not multiple
10. **Save Outputs**: Copy generated code immediately to prevent loss

---

**Good luck building! These prompts are battle-tested and optimized for rapid MVP development. Follow the 10-day roadmap and you'll have a working platform.**

🚀 Ship it!
