# CodeLearn MVP - 10-Day Execution Guide
## Quick Reference for Rapid Development

---

# EXECUTIVE OVERVIEW

**Goal**: Build production-ready MVP in 10 days using Antigravity Editor

**Team Size**: 2-3 developers (1 frontend, 1 backend, 1 full-stack)

**Deliverable**: College-focused AI coding platform (LeetCode + Classroom + AI Tutor)

**Tech Stack**:
- Frontend: Next.js, TypeScript, Tailwind CSS, ShadCN UI
- Backend: Node.js, Express, PostgreSQL, Socket.IO
- External: Judge0 API (code execution), Claude API (AI tutor)

---

# DAY-BY-DAY ROADMAP WITH ANTIGRAVITY MAPPING

## DAY 1: Setup & Database (6-8 hours)

### Tasks:
- [ ] Project initialization (git, dependencies, folder structure)
- [ ] Database schema creation
- [ ] PostgreSQL connection setup
- [ ] Environment variables configuration
- [ ] API framework setup

### Antigravity Prompts to Use:
1. **Backend Setup Prompt**:
   ```
   Create Node.js + Express project with folder structure, TypeORM config, 
   PostgreSQL connection, environment variables, error handling middleware.
   ```

2. **Database Schema Prompt** (Use: `ANTIGRAVITY_PROMPTS.md` - Prompt 1.1):
   ```
   Complete PostgreSQL schema with all 20+ tables, relationships, constraints, indexes.
   ```

3. **Frontend Setup Prompt**:
   ```
   Create Next.js project with TypeScript, Tailwind CSS, ShadCN UI setup,
   folder structure, API client (Axios), authentication store (Zustand).
   ```

### Deliverables:
- Git repository initialized
- Backend and frontend projects running locally
- PostgreSQL database created
- All tables created with proper relationships

### Testing:
- Run `npm start` both sides without errors
- Check database connections
- Test API responding to basic requests

---

## DAY 2: Authentication (6-8 hours)

### Tasks:
- [ ] User registration endpoint
- [ ] User login endpoint
- [ ] JWT token generation
- [ ] Login/signup frontend pages
- [ ] Auth middleware and protected routes

### Antigravity Prompts to Use:
1. **Backend Auth** (Use: `ANTIGRAVITY_PROMPTS.md` - Prompt 2.1):
   ```
   Complete authentication system with JWT, bcrypt, refresh tokens, 
   all services and controllers.
   ```

2. **Frontend Auth** (Use: `ANTIGRAVITY_PROMPTS.md` - Prompt 4.1):
   ```
   Beautiful login, signup, profile pages with form validation, 
   auth hooks, Zustand store.
   ```

### Deliverables:
- Users can register with email, password, roll number, department
- Users can login and receive JWT tokens
- Authentication persists in localStorage
- Protected routes require authentication
- Logout functionality works

### Testing:
- Register new user
- Login with correct and incorrect credentials
- Navigate to protected route without login (should redirect)
- Token refresh works
- Logout clears session

---

## DAY 3: Learning Module (6-8 hours)

### Tasks:
- [ ] Topics listing by language
- [ ] Subtopics with notes and YouTube links
- [ ] Mark subtopic as complete
- [ ] Learning progress tracking
- [ ] Continue learning page

### Antigravity Prompts to Use:
1. **Backend Learning** (Create custom prompt from architecture doc):
   ```
   Topics and Subtopics APIs with TypeORM entities, repositories, 
   controllers, services for progress tracking.
   ```

2. **Frontend Learning Pages** (Create custom prompt):
   ```
   Topics landing page, topic detail page with subtopics, 
   notes viewer, YouTube embeds, mark complete button, continue learning page.
   All with Tailwind styling.
   ```

### Deliverables:
- /api/topics endpoint returning topics by language
- /api/topics/:id endpoint with subtopics
- /api/subtopics/:id/mark-complete endpoint
- Topics page with language filter
- Topic detail page with subtopic list
- Subtopic viewer with notes and YouTube
- Continue learning page showing in-progress topics

### Testing:
- Navigate learning flow: Language → Topic → Subtopic → Mark Complete
- Verify progress percentage increases
- Test back/forward navigation
- Verify YouTube embeds load

---

## DAY 4: Code Editor & Questions (8-10 hours)

### Tasks:
- [ ] Questions listing with filters
- [ ] Question detail page
- [ ] Monaco editor integration
- [ ] Language selector
- [ ] Test case display

### Antigravity Prompts to Use:
1. **Backend Questions** (Use: `ANTIGRAVITY_PROMPTS.md` - Prompt 3.1 - Part 1):
   ```
   Questions and TestCases entities, repositories, controllers.
   No code execution yet, just data modeling.
   ```

2. **Frontend Editor** (Use: `ANTIGRAVITY_PROMPTS.md` - Prompt 5.1):
   ```
   Complete question detail page with Monaco editor, test case display,
   problem statement formatting, all with Tailwind.
   ```

### Deliverables:
- /api/questions endpoint with pagination and filters
- /api/questions/:id endpoint with full details
- Questions listing page with search/filter
- Question detail page with problem statement
- Monaco editor with language selection
- Test case display component
- Auto-save code to localStorage

### Testing:
- Filter questions by difficulty and topic
- Load question and view problem statement
- Switch languages in editor
- Code persists on page refresh
- Test case inputs display correctly

---

## DAY 5: Code Execution (8-10 hours)

### Tasks:
- [ ] Judge0 API integration
- [ ] Run code against sample test cases
- [ ] Submit code for evaluation
- [ ] Handle execution results
- [ ] Display errors with highlighting

### Antigravity Prompts to Use:
1. **Backend Code Execution** (Use: `ANTIGRAVITY_PROMPTS.md` - Prompt 3.1 - Part 2):
   ```
   Judge0Client, CodeExecutionService, SubmissionService with run and submit.
   Error parsing, status mapping, result caching.
   ```

2. **Frontend Results Display** (Create custom prompt):
   ```
   Results panel showing test case pass/fail, error messages, 
   execution time, memory usage. Error highlighting in editor.
   Submission history component.
   ```

### Deliverables:
- /api/submissions/run endpoint (test mode)
- /api/submissions/submit endpoint (evaluation mode)
- Run button functionality with instant feedback
- Submit button with all test case evaluation
- Results panel with pass/fail indicators
- Error message display
- Submission history

### Testing:
- Submit simple correct solution (should pass)
- Submit wrong solution (should show failure)
- Submit code with syntax error (should show CE)
- Test infinite loop handling (TLE)
- Verify execution time and memory display

---

## DAY 6: Sheets System (5-6 hours)

### Tasks:
- [ ] Sheets model and repository
- [ ] Sheets listing by type
- [ ] Sheet detail with ordered questions
- [ ] Progress calculation
- [ ] Sheets UI pages

### Antigravity Prompts to Use:
1. **Backend Sheets** (Create custom prompt):
   ```
   Sheets and SheetQuestions entities, repositories, controllers.
   Progress calculation, filtering by type, question ordering.
   ```

2. **Frontend Sheets** (Use: `ANTIGRAVITY_PROMPTS.md` - Prompt 7 - Sheets):
   ```
   Sheets landing page with cards, sheet detail page with 
   ordered question list and progress tracking.
   ```

### Deliverables:
- /api/sheets endpoint returning all sheet types
- /api/sheets/:id endpoint with questions and progress
- Sheets listing page with type filter
- Sheet detail page with progress bar
- Ordered question list with solved status
- Jump-to-question links

### Testing:
- View all sheet types
- Check progress percentage accuracy
- Verify questions are in correct order
- Click through to solve question from sheet

---

## DAY 7: Classroom System (8-10 hours)

### Tasks:
- [ ] Classroom creation (teacher)
- [ ] Join classroom (student by roll number)
- [ ] Student list management
- [ ] Create assignments
- [ ] Assignment progress tracking
- [ ] Real-time classroom chat setup

### Antigravity Prompts to Use:
1. **Backend Classroom** (Use: `ANTIGRAVITY_PROMPTS.md` - Prompt 8.1):
   ```
   Classroom, Assignment, ClassroomMessage entities and services.
   Join, create, add students, create assignments, track progress.
   ```

2. **Frontend Classroom** (Use: `ANTIGRAVITY_PROMPTS.md` - Prompt 8.1):
   ```
   Classroom pages, join modal, manage students, create assignment form,
   assignment detail page, chat page layout.
   ```

3. **Socket.IO Chat** (Create custom prompt):
   ```
   Socket.IO setup for classroom chat namespace, message handlers,
   persistent message storage, message history on join.
   ```

### Deliverables:
- /api/classrooms endpoints (create, list, join)
- /api/classrooms/:id/assignments (create, list, progress)
- /api/classrooms/:id/messages (send, history)
- Teacher dashboard for classroom management
- Join classroom flow for students
- Create assignment page with question selector
- Assignment progress view (teacher)
- Classroom chat page with real-time messages
- WebSocket connected and messaging works

### Testing:
- Teacher creates classroom
- Student joins with roll number
- Teacher adds students individually and via CSV
- Create assignment with specific questions
- View assignment progress as teacher
- Send and receive messages in real-time

---

## DAY 8: AI Tutor (8-10 hours)

### Tasks:
- [ ] Claude API integration
- [ ] Context building from submissions
- [ ] Prompt engineering for code help
- [ ] Floating chatbot component
- [ ] Message streaming
- [ ] Chat history storage

### Antigravity Prompts to Use:
1. **Backend AI Tutor** (Create custom prompt):
   ```
   AITutorService with Claude API integration, prompt building,
   context extraction from submissions, error analysis.
   Chat endpoint with streaming responses, message history storage.
   ```

2. **Frontend Floating Chatbot** (Use: `ANTIGRAVITY_PROMPTS.md` - Prompt 6.1):
   ```
   Floating chatbot component with messaging, streaming display,
   quick actions, clear history, responsive design.
   ```

### Deliverables:
- /api/ai-tutor/chat endpoint (streaming)
- /api/ai-tutor/analyze-submission endpoint
- /api/ai-tutor/weak-areas endpoint
- AITutorService with Claude API calls
- Context builder for error analysis
- Floating chatbot component on all pages
- Message streaming for better UX
- Chat history storage

### Testing:
- Send code-related question, get helpful response
- Send unrelated question, get polite rejection
- Get analysis of failed submission
- Check weak areas recommendations
- Verify streaming works
- Test on mobile (full-screen modal)

---

## DAY 9: Dashboard & Analytics (8-10 hours)

### Tasks:
- [ ] User statistics
- [ ] Activity heatmap (365 days)
- [ ] Topic progress charts
- [ ] Weak areas identification
- [ ] Leaderboard generation
- [ ] Dashboard page design

### Antigravity Prompts to Use:
1. **Backend Dashboard** (Create custom prompt):
   ```
   DashboardService with methods: getStats, getHeatmap, getTopicProgress,
   getWeakAreas, getLeaderboard, getContinueLearning.
   Efficient queries with caching.
   ```

2. **Frontend Dashboard** (Use: `ANTIGRAVITY_PROMPTS.md` - Prompt 7.1):
   ```
   Complete dashboard page with stat cards, heatmap, charts,
   weak areas, upcoming events, leaderboard preview. All with Recharts.
   ```

### Deliverables:
- /api/dashboard/stats endpoint
- /api/dashboard/heatmap endpoint
- /api/dashboard/progress endpoint
- /api/dashboard/weak-areas endpoint
- /api/dashboard/leaderboard endpoint
- Dashboard page with all visualizations
- Stat cards showing key metrics
- Activity heatmap (365 days)
- Topic progress pie chart
- Weak areas with recommendations
- Leaderboard preview

### Testing:
- Dashboard loads all data
- Stats update after solving questions
- Heatmap shows daily activity
- Charts render correctly
- Weak areas identified accurately
- Leaderboard sorted correctly

---

## DAY 10: Polish, Testing & Deployment (8-10 hours)

### Tasks:
- [ ] Bug fixes and edge cases
- [ ] Error handling review
- [ ] Performance optimization
- [ ] Responsive design verification
- [ ] End-to-end testing
- [ ] Production build and deployment

### Focus Areas:
1. **Backend Hardening**:
   - Input validation on all endpoints
   - Rate limiting
   - Error messages consistent
   - Database query optimization
   - Logging setup

2. **Frontend Polish**:
   - Loading states on all async operations
   - Error boundaries
   - Network error handling
   - Keyboard accessibility
   - Mobile responsiveness
   - Dark theme consistency

3. **Integration Testing**:
   - Full student journey (signup → solve problem)
   - Teacher workflow (create class → assign → track)
   - Chat real-time sync
   - Code execution edge cases
   - AI tutor responses

4. **Deployment**:
   - Frontend: Deploy to Vercel
   - Backend: Deploy to Railway/Render
   - Database: PostgreSQL on managed service
   - Environment variables configured
   - Monitoring setup

### Deliverables:
- Zero critical bugs
- Comprehensive error messages
- Optimized bundle size
- Mobile-responsive design
- Production deployment URLs
- Monitoring dashboards

### Testing:
- Complete end-to-end flows
- Test on multiple browsers
- Test on mobile devices
- Performance profiling
- Security audit
- Load testing (optional)

---

# DAILY STANDUP TEMPLATE

Use this daily (takes 5 minutes):

```
### Day X Standup

**Completed Today**:
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

**Blockers**:
- Issue: [describe]
  Solution: [planned or applied]

**Tomorrow's Focus**:
- [ ] Task A
- [ ] Task B

**Code Quality Checklist**:
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Error handling complete
- [ ] No console errors/warnings
- [ ] Responsive on mobile
```

---

# CRITICAL SUCCESS FACTORS

1. **Stick to Scope**
   - ❌ NO contests yet (Day 7 can skip if tight)
   - ❌ NO video hosting
   - ❌ NO plagiarism detection
   - ✅ Focus on core 5: Auth → Learning → Questions → Classroom → Dashboard

2. **Use Antigravity Effectively**
   - Copy prompts EXACTLY from `ANTIGRAVITY_PROMPTS.md`
   - Don't modify prompts mid-generation
   - Test immediately after generation
   - Use follow-ups for refinements

3. **Daily Deploys**
   - Deploy at end of each day
   - Even if incomplete, ship working code
   - This keeps momentum and catches issues early

4. **Communication**
   - Sync 1x daily (morning 10 min standup)
   - Frontend and backend coordinate on API contracts
   - Test together at day end

5. **Quality Over Speed**
   - No hardcoded values
   - Proper error messages
   - Input validation everywhere
   - Comments on complex logic

---

# ANTIGRAVITY PROMPT MAPPING

Quick reference for which prompt to use for each module:

| Module | Day | Prompt File | Prompt Section |
|--------|-----|------------|-----------------|
| Auth Backend | 2 | ANTIGRAVITY_PROMPTS.md | Prompt 2.1 |
| Auth Frontend | 2 | ANTIGRAVITY_PROMPTS.md | Prompt 4.1 |
| Learning Backend | 3 | ANTIGRAVITY_PROMPTS.md | Prompt 3 (custom) |
| Learning Frontend | 3 | ANTIGRAVITY_PROMPTS.md | Prompt 3 (custom) |
| Questions Backend | 4 | ANTIGRAVITY_PROMPTS.md | Prompt 3.1 Part 1 |
| Editor Frontend | 4 | ANTIGRAVITY_PROMPTS.md | Prompt 5.1 |
| Execution Backend | 5 | ANTIGRAVITY_PROMPTS.md | Prompt 3.1 Part 2 |
| Results Frontend | 5 | ANTIGRAVITY_PROMPTS.md | Prompt 3.1 Part 2 |
| Sheets Backend | 6 | ANTIGRAVITY_PROMPTS.md | Custom |
| Sheets Frontend | 6 | ANTIGRAVITY_PROMPTS.md | Prompt 7 |
| Classroom Backend | 7 | ANTIGRAVITY_PROMPTS.md | Prompt 8.1 |
| Classroom Frontend | 7 | ANTIGRAVITY_PROMPTS.md | Prompt 8.1 |
| Chat Backend | 7 | ANTIGRAVITY_PROMPTS.md | Custom |
| AI Tutor Backend | 8 | ANTIGRAVITY_PROMPTS.md | Custom |
| AI Chatbot Frontend | 8 | ANTIGRAVITY_PROMPTS.md | Prompt 6.1 |
| Dashboard Backend | 9 | ANTIGRAVITY_PROMPTS.md | Custom |
| Dashboard Frontend | 9 | ANTIGRAVITY_PROMPTS.md | Prompt 7.1 |

---

# COMMON ANTIGRAVITY MISTAKES TO AVOID

1. ❌ **Incomplete Prompt**: Skipping requirements sections
   - ✅ Always include full requirements

2. ❌ **Wrong Context**: Not mentioning what this fits into
   - ✅ Start with "You are building [full context]"

3. ❌ **Vague Deliverables**: "Create auth system"
   - ✅ "Create AuthService with register, login, refreshToken methods"

4. ❌ **Missing Tech Stack**: "Create API"
   - ✅ "Node.js Express API with TypeORM and PostgreSQL"

5. ❌ **Asking for Snippets**: "Show me the JWT implementation"
   - ✅ "Create complete JwtService with all methods"

6. ❌ **Not Testing Immediately**: Wait until all modules done
   - ✅ Test each module the day it's built

7. ❌ **Modifying Prompts**: Change prompt mid-generation
   - ✅ Use full prompt, iterate with follow-ups

8. ❌ **Ignoring Errors**: Code has TODOs or warnings
   - ✅ Generation must be production-ready

---

# DEPLOYMENT QUICK START

### Frontend (Vercel)
```bash
# 1. Push to GitHub
git add .
git commit -m "MVP Day 10"
git push origin main

# 2. Connect GitHub to Vercel
# 3. Vercel auto-deploys on push
# 4. Set environment variables in Vercel dashboard
```

### Backend (Railway)
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Connect project
railway link

# 3. Add environment variables
railway variable set DATABASE_URL=...
railway variable set JWT_SECRET=...

# 4. Deploy
git push
```

### Database (Railway/Neon)
```bash
# 1. Create PostgreSQL database on managed service
# 2. Run migrations: npm run migrate:prod
# 3. Run seeds: npm run seed:prod
# 4. Update DATABASE_URL in backend env
```

---

# FINAL CHECKLIST

Before Day 10 evening:

### Backend
- [ ] All endpoints working
- [ ] No console errors
- [ ] Database migrations complete
- [ ] Seeds loaded
- [ ] Error handling on all routes
- [ ] Input validation everywhere
- [ ] Rate limiting configured
- [ ] CORS configured
- [ ] Logging setup
- [ ] API documentation (Swagger optional)

### Frontend
- [ ] All pages loading
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Dark theme consistent
- [ ] Forms validate correctly
- [ ] Loading states show
- [ ] Error messages display
- [ ] Keyboard navigation works
- [ ] Images optimized
- [ ] Build succeeds

### Integration
- [ ] Auth flow complete
- [ ] Questions solve end-to-end
- [ ] Classroom workflow tested
- [ ] Chat real-time works
- [ ] AI tutor responds
- [ ] Dashboard calculates correctly
- [ ] No missing features from MVP spec

---

# NEXT STEPS (After MVP)

1. **Gather User Feedback** (1 week)
   - 10-15 student users
   - Real classroom test
   - Bug reports and improvement requests

2. **Phase 2 Features** (2-4 weeks)
   - Team contests
   - Advanced analytics
   - Plagiarism detection
   - Mobile app (React Native)

3. **Scale & Optimize**
   - Database indexing
   - Caching strategy
   - Load testing
   - CDN for static assets

---

# SUPPORT & RESOURCES

- **Antigravity Editor Docs**: Check official documentation for latest updates
- **Tech Docs**:
  - Next.js: https://nextjs.org/docs
  - Express: https://expressjs.com
  - TypeORM: https://typeorm.io
  - Socket.IO: https://socket.io/docs
- **Architecture Document**: `ARCHITECTURE_AND_IMPLEMENTATION_PLAN.md`
- **Detailed Prompts**: `ANTIGRAVITY_PROMPTS.md`

---

**Remember**: Focus on shipping working features every day. Good architecture and code quality now saves days later. You've got this! 🚀

Good luck! 💪
