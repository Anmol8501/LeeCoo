# CodeLearn MVP - Quick Reference Card
## Keep This Open While Building

---

# API ENDPOINTS AT A GLANCE

## Auth
```
POST   /api/auth/register          { name, email, roll_no, password, department }
POST   /api/auth/login             { email, password }
POST   /api/auth/refresh           { refreshToken }
GET    /api/auth/profile           [Protected]
```

## Questions
```
GET    /api/questions              ?page=1&difficulty=medium&topic=arrays
GET    /api/questions/:id          [With test cases]
```

## Submissions
```
POST   /api/submissions/run        { question_id, code, language } → instant results
POST   /api/submissions/submit     { question_id, code, language } → all test cases
GET    /api/submissions/:id        [With results]
```

## Topics
```
GET    /api/topics                 [By language]
GET    /api/topics/:id             [With subtopics]
POST   /api/subtopics/:id/mark-complete
```

## Classrooms
```
POST   /api/classrooms             { name, description } [Teacher only]
GET    /api/classrooms             [User's classrooms]
POST   /api/classrooms/:id/join    { roll_no } [Student]
POST   /api/classrooms/:id/assignments { title, questions, deadline }
GET    /api/classrooms/:id/assignments/:assignmentId/progress [Teacher only]
```

## Chat
```
POST   /api/classrooms/:id/messages { message }
GET    /api/classrooms/:id/messages ?page=1 [With pagination]
WS     /socket.io [For real-time chat]
```

## Sheets
```
GET    /api/sheets                 [All sheets by type]
GET    /api/sheets/:id             [With questions and progress]
```

## AI Tutor
```
POST   /api/ai-tutor/chat          { message, context } [Streaming]
POST   /api/ai-tutor/weak-areas    [Recommendations]
```

## Dashboard
```
GET    /api/dashboard/stats        [Solved, submissions, acceptance rate]
GET    /api/dashboard/heatmap      [365-day activity]
GET    /api/dashboard/weak-areas   [Topics needing practice]
GET    /api/dashboard/leaderboard  ?classroom_id=X
```

---

# DATABASE TABLES (SIMPLIFIED)

```
users
  ├─ id, name, email, roll_no, role (student|teacher)
  ├─ password_hash, department, created_at

topics
  ├─ id, language (js|python|java|cpp), title

subtopics
  ├─ id, topic_id, title, notes (HTML), youtube_link

questions
  ├─ id, title, difficulty (easy|medium|hard)
  ├─ problem_statement (HTML), topic_id

testcases
  ├─ id, question_id, input, expected_output, is_hidden

submissions
  ├─ id, user_id, question_id, code, language
  ├─ status (accepted|wrong_answer|error), testcases_passed

solved_questions
  ├─ user_id, question_id, solved_at (marks as solved)

classrooms
  ├─ id, name, teacher_id

classroom_students
  ├─ classroom_id, student_id (join table)

assignments
  ├─ id, classroom_id, title, deadline

sheets
  ├─ id, title, type (beginner|interview|placement|company)

sheet_questions
  ├─ sheet_id, question_id, position (ordering)

classroom_messages
  ├─ id, classroom_id, user_id, message, created_at

ai_chat_history
  ├─ id, user_id, user_message, ai_response, created_at
```

---

# FRONTEND PAGE ROUTES

```
/login                                    [Auth]
/signup                                   [Auth]
/profile                                  [User settings]

/dashboard                                [Main dashboard]
/learning                                 [Topics list]
/learning/[topicId]                       [Topic details]
/learning/continue                        [Resume topics]

/questions                                [Questions list]
/questions/[questionId]                   [Solve question]

/sheets                                   [Curated lists]
/sheets/[sheetId]                         [Practice sheet]

/classroom                                [My classrooms]
/classroom/[classroomId]                  [Classroom home]
/classroom/[classroomId]/assignments      [View assignments]
/classroom/[classroomId]/chat             [Classroom chat]

/teacher/dashboard                        [Teacher stats]
/teacher/classroom/[id]/manage            [Manage students]
```

---

# KEY COMPONENTS CHECKLIST

### Shared Components
- [ ] Button, Card, Modal, Input, Textarea, Select
- [ ] Navbar, Sidebar, Toast, LoadingSpinner
- [ ] ErrorBoundary, ConfirmDialog, CodeHighlighter

### Auth Pages
- [ ] LoginPage, SignupPage, ProfilePage
- [ ] LoginForm, SignupForm, ProfileForm

### Learning Pages
- [ ] TopicsPage, TopicDetailPage, ContinueLearningPage
- [ ] SubtopicCard, NotesViewer, YouTubeEmbed

### Questions Pages
- [ ] QuestionsListPage, QuestionDetailPage
- [ ] MonacoEditor, LanguageSelector, TestCasePanel
- [ ] ResultsPanel, SubmissionHistory, ErrorDisplay

### Sheets Pages
- [ ] SheetsListPage, SheetDetailPage
- [ ] SheetCard, SheetProgressBar

### Classroom Pages
- [ ] ClassroomListPage, ClassroomDetailPage
- [ ] JoinClassroomModal, CreateClassroomModal
- [ ] AssignmentsPage, AssignmentDetailPage
- [ ] ClassroomChatPage, ChatMessage, ChatInput

### Teacher Pages
- [ ] TeacherDashboardPage, ManageClassroomPage
- [ ] StudentListTable, CreateAssignmentPage

### Dashboard Page
- [ ] StatCard, HeatmapChart, TopicProgressChart
- [ ] WeakAreasList, LeaderboardTable

### AI Components
- [ ] FloatingChatbot (Always visible)
- [ ] ChatWindow, ChatMessage, ChatInput
- [ ] QuickActions, TypingIndicator

---

# RESPONSE FORMAT (All APIs)

### Success
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Optional message"
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email already exists"
  }
}
```

---

# AUTHENTICATION FLOW

```
1. User submits signup form
   ↓
2. Backend validates input, hashes password
   ↓
3. Returns: { token, refreshToken, user }
   ↓
4. Frontend stores in authStore (Zustand) + localStorage
   ↓
5. Add token to API headers: Authorization: Bearer {token}
   ↓
6. Protected routes check token, redirect if invalid
```

---

# CODE EXECUTION FLOW

```
1. User submits code from /questions/[id]
   ↓
2. Frontend sends to /api/submissions/run or /submit
   ↓
3. Backend creates submission record, sends to Judge0
   ↓
4. Polls Judge0 for result (max 60 polls, 1s interval)
   ↓
5. Parses response: status, memory, time, output
   ↓
6. Returns to frontend with test case results
   ↓
7. Frontend displays pass/fail for each test case
```

---

# DATABASE QUERY PATTERNS

### Get user's solved questions
```sql
SELECT sq.* FROM solved_questions sq
WHERE sq.user_id = $1
ORDER BY sq.solved_at DESC
```

### Get question with test cases
```sql
SELECT q.*, t.* FROM questions q
LEFT JOIN testcases t ON q.id = t.question_id
WHERE q.id = $1 AND (t.is_hidden = false OR t.id IS NULL)
```

### Get classroom progress for assignment
```sql
SELECT cs.student_id, 
       COUNT(DISTINCT CASE WHEN sq.user_id IS NOT NULL THEN aq.question_id END) as solved_count,
       COUNT(DISTINCT aq.question_id) as total_count
FROM classroom_students cs
LEFT JOIN assignment_questions aq ON cs.classroom_id = $1
LEFT JOIN solved_questions sq ON cs.student_id = sq.user_id 
                              AND aq.question_id = sq.question_id
WHERE cs.classroom_id = $1
GROUP BY cs.student_id
```

---

# ENVIRONMENT VARIABLES

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@localhost/codelearn
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-key-min-32-chars
JUDGE0_API_KEY=get-from-judge0-rapidapi
JUDGE0_BASE_URL=https://judge0-ce.p.rapidapi.com
CLAUDE_API_KEY=get-from-anthropic
NODE_ENV=development
PORT=3001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_JUDGE0_TIMEOUT=30000
```

---

# TESTING CHECKLIST PER DAY

### Day 1: Setup
- [ ] Backend starts without errors
- [ ] Frontend builds successfully
- [ ] Database connection works
- [ ] API responds to requests

### Day 2: Auth
- [ ] Register new user works
- [ ] Login with correct credentials works
- [ ] Login with wrong password fails
- [ ] Protected route redirects to login

### Day 3: Learning
- [ ] Topics load by language
- [ ] Subtopic marks as complete
- [ ] Progress updates correctly

### Day 4: Editor
- [ ] Monaco editor initializes
- [ ] Language switching works
- [ ] Code persists to localStorage

### Day 5: Execution
- [ ] Run code returns results
- [ ] Submit code evaluates all tests
- [ ] Test cases show pass/fail

### Day 6: Sheets
- [ ] Sheets load
- [ ] Progress calculates
- [ ] Jump to question works

### Day 7: Classroom
- [ ] Create classroom works
- [ ] Join classroom works
- [ ] Assignment creates/displays
- [ ] Chat sends/receives in real-time

### Day 8: AI
- [ ] Floating chatbot appears
- [ ] Send message returns response
- [ ] Streaming display works
- [ ] Works on mobile

### Day 9: Dashboard
- [ ] Stats load correctly
- [ ] Heatmap renders
- [ ] Charts display data
- [ ] Weak areas identified

### Day 10: Full Flow
- [ ] Signup → Login → Dashboard → Learn → Solve → Submit → Chat

---

# COMMON ERROR CODES

```
401 Unauthorized           - No/invalid token
403 Forbidden             - No permission for resource
404 Not Found             - Resource doesn't exist
422 Validation Error      - Bad input data
429 Too Many Requests     - Rate limit exceeded
500 Internal Error        - Server error
```

---

# PERFORMANCE TARGETS

- Page load: < 2 seconds
- API response: < 500ms
- Code execution: < 10 seconds
- Dashboard load: < 1 second
- Chat message send: < 1 second

---

# GIT WORKFLOW

```bash
# Daily commit (evening)
git add .
git commit -m "Day X: Feature complete"
git push origin main

# Deploy
# Frontend: Auto-deploys on push to Vercel
# Backend: Auto-deploys on push to Railway
```

---

# QUICK PROBLEM FIXES

| Problem | Solution |
|---------|----------|
| Code execution timeout | Increase JUDGE0_TIMEOUT env var |
| Chat messages not real-time | Check Socket.IO connection |
| Auth not persisting | Check localStorage in browser |
| API 401 errors | Verify token in localStorage and headers |
| Editor not saving | Check localStorage quota |
| Charts not rendering | Verify data format matches Recharts |
| Mobile layout broken | Check Tailwind responsive classes |
| Database locked | Restart PostgreSQL service |

---

# KEY METRICS TO TRACK

- [ ] Questions solved per user
- [ ] Submission success rate
- [ ] Average execution time
- [ ] Classroom size
- [ ] AI chat usage frequency
- [ ] Page load times
- [ ] Error rate
- [ ] Uptime

---

**Print this out! Keep it at your desk during the 10-day sprint.** 🚀
