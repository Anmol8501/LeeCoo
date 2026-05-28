# CodeLearn Platform - Production Architecture & MVP Implementation Plan

## EXECUTIVE SUMMARY

Building a college-focused AI-powered coding learning platform (LeetCode + Classroom + AI Tutor). This document contains complete system architecture, database design, API contracts, component hierarchy, and a 10-day MVP implementation roadmap optimized for rapid development.

---

# PART 1: SYSTEM ARCHITECTURE

## 1.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌────────────────┐  ┌──────────────────────┐  ┌─────────────┐  │
│  │  Next.js App   │  │  Monaco Code Editor  │  │  ShadCN UI  │  │
│  │  (TypeScript)  │  │                      │  │  Tailwind   │  │
│  └────────────────┘  └──────────────────────┘  └─────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Floating AI Chatbot (Socket.IO)                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                   ┌──────────────────────┐
                   │  API Gateway/Router  │
                   │   JWT Middleware     │
                   └──────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Node.js)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Auth API   │  │  Learning &  │  │  Questions &  Code   │  │
│  │              │  │  Dashboard   │  │  Execution           │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Classroom   │  │  Sheets API  │  │  AI Tutor / Chat     │  │
│  │  Management  │  │              │  │  (Claude API)        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                   ┌──────────────────────┐
                   │  Service Layer       │
                   │  - Business Logic    │
                   │  - External APIs     │
                   └──────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                    │
│  ┌────────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │  PostgreSQL    │  │  Redis Cache │  │  Judge0 API       │   │
│  │  (Primary DB)  │  │  (Sessions)  │  │  (Code Execution) │   │
│  └────────────────┘  └──────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 1.2 Key Design Principles

1. **Modularity**: Independent services that can scale separately
2. **Statelessness**: API servers are horizontally scalable
3. **Performance**: Redis caching, pagination, lazy loading
4. **Security**: JWT auth, role-based access control, input validation
5. **Extensibility**: AI features via Claude API, code execution via Judge0

---

# PART 2: FOLDER STRUCTURE

## 2.1 Frontend Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   └── styles.module.css
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   │       ├── ProgressCard.tsx
│   │   │   │       ├── HeatmapChart.tsx
│   │   │   │       └── LeaderboardPreview.tsx
│   │   │   ├── learning/
│   │   │   │   ├── [topicId]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── components/
│   │   │   │   │       └── SubtopicCard.tsx
│   │   │   │   └── continue/page.tsx
│   │   │   ├── questions/
│   │   │   │   ├── [questionId]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── components/
│   │   │   │   │       ├── CodeEditor.tsx
│   │   │   │   │       ├── TestCasePanel.tsx
│   │   │   │   │       └── SubmissionHistory.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── sheets/
│   │   │   │   ├── [sheetId]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── components/
│   │   │   │   │       └── SheetQuestionList.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── classroom/
│   │   │   │   ├── [classroomId]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── assignments/page.tsx
│   │   │   │   │   ├── contests/page.tsx
│   │   │   │   │   └── chat/page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   └── layout.tsx              # Authenticated layout with sidebar
│   │   ├── teacher/                   # Teacher-only routes
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── classrooms/[id]/manage/page.tsx
│   │   │   └── layout.tsx
│   │   └── layout.tsx                 # Root layout
│   │
│   ├── components/
│   │   ├── ui/                        # ShadCN UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── ...
│   │   ├── shared/                    # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── CodeHighlighter.tsx
│   │   │   └── Toast.tsx
│   │   ├── ai/                        # AI-specific components
│   │   │   ├── ChatBot.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── ChatInput.tsx
│   │   └── features/                  # Feature-specific components
│   │       ├── CodeEditor/
│   │       │   ├── MonacoEditor.tsx
│   │       │   ├── LanguageSelector.tsx
│   │       │   └── ThemeSelector.tsx
│   │       ├── Dashboard/
│   │       │   ├── WeakAreasChart.tsx
│   │       │   └── UpcomingContests.tsx
│   │       └── ...
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useQuestion.ts
│   │   ├── useSubmission.ts
│   │   ├── useSocket.ts
│   │   └── useDebounce.ts
│   │
│   ├── services/                      # API client layer
│   │   ├── api.ts                     # Axios instance
│   │   ├── authService.ts
│   │   ├── questionsService.ts
│   │   ├── submissionsService.ts
│   │   ├── classroomService.ts
│   │   ├── aiService.ts
│   │   └── socket.ts
│   │
│   ├── store/                         # Zustand or Redux state management
│   │   ├── authStore.ts
│   │   ├── questionStore.ts
│   │   ├── classroomStore.ts
│   │   └── uiStore.ts
│   │
│   ├── types/                         # TypeScript types
│   │   ├── index.ts
│   │   ├── api.ts
│   │   ├── domain.ts
│   │   └── ui.ts
│   │
│   ├── utils/                         # Utility functions
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   ├── styles/                        # Global styles
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── animations.css
│   │
│   ├── middleware.ts                  # Auth middleware
│   └── env.ts                         # Environment variables
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env.local
├── .env.example
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 2.2 Backend Structure

```
backend/
├── src/
│   ├── main.ts                        # Application entry point
│   │
│   ├── config/
│   │   ├── database.ts                # PostgreSQL config
│   │   ├── redis.ts                   # Redis config
│   │   ├── env.ts                     # Environment variables
│   │   └── judge0.ts                  # Judge0 API config
│   │
│   ├── controllers/                   # HTTP request handlers
│   │   ├── AuthController.ts
│   │   ├── UserController.ts
│   │   ├── QuestionController.ts
│   │   ├── SubmissionController.ts
│   │   ├── ClassroomController.ts
│   │   ├── SheetController.ts
│   │   ├── AITutorController.ts
│   │   └── DashboardController.ts
│   │
│   ├── services/                      # Business logic
│   │   ├── AuthService.ts
│   │   ├── UserService.ts
│   │   ├── QuestionService.ts
│   │   ├── SubmissionService.ts
│   │   │   ├── CodeExecutionService.ts
│   │   │   └── GradingService.ts
│   │   ├── ClassroomService.ts
│   │   ├── SheetService.ts
│   │   ├── AITutorService.ts
│   │   │   ├── PromptBuilder.ts
│   │   │   └── ContextBuilder.ts
│   │   ├── DashboardService.ts
│   │   └── NotificationService.ts
│   │
│   ├── repositories/                  # Database access layer
│   │   ├── BaseRepository.ts
│   │   ├── UserRepository.ts
│   │   ├── QuestionRepository.ts
│   │   ├── SubmissionRepository.ts
│   │   ├── ClassroomRepository.ts
│   │   ├── SheetRepository.ts
│   │   └── DashboardRepository.ts
│   │
│   ├── models/                        # TypeORM entities
│   │   ├── User.ts
│   │   ├── Question.ts
│   │   ├── TestCase.ts
│   │   ├── Submission.ts
│   │   ├── SolvedQuestion.ts
│   │   ├── Topic.ts
│   │   ├── Subtopic.ts
│   │   ├── Classroom.ts
│   │   ├── ClassroomStudent.ts
│   │   ├── Assignment.ts
│   │   ├── Contest.ts
│   │   ├── Sheet.ts
│   │   ├── SheetQuestion.ts
│   │   └── ClassroomMessage.ts
│   │
│   ├── routes/                        # API routes
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   ├── questions.routes.ts
│   │   ├── submissions.routes.ts
│   │   ├── classrooms.routes.ts
│   │   ├── sheets.routes.ts
│   │   ├── ai-tutor.routes.ts
│   │   ├── dashboard.routes.ts
│   │   └── index.ts
│   │
│   ├── middleware/
│   │   ├── authMiddleware.ts          # JWT verification
│   │   ├── roleMiddleware.ts          # Role-based access control
│   │   ├── errorHandler.ts
│   │   ├── requestValidator.ts
│   │   └── rateLimiter.ts
│   │
│   ├── websocket/                     # Socket.IO handlers
│   │   ├── chatNamespace.ts
│   │   ├── contestNamespace.ts
│   │   ├── notificationNamespace.ts
│   │   └── socketManager.ts
│   │
│   ├── integrations/
│   │   ├── judge0.ts                  # Code execution
│   │   ├── claudeAI.ts                # Claude API integration
│   │   └── emailService.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── hash.ts
│   │   ├── validators.ts
│   │   ├── logger.ts
│   │   ├── cache.ts
│   │   └── errors.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── api.ts
│   │   ├── domain.ts
│   │   └── enums.ts
│   │
│   ├── migrations/                    # Database migrations
│   │   ├── 1_initial_schema.ts
│   │   ├── 2_add_questions.ts
│   │   └── ...
│   │
│   └── seeds/                         # Database seeds
│       ├── topics.seed.ts
│       ├── questions.seed.ts
│       └── sheets.seed.ts
│
├── .env.local
├── .env.example
├── ormconfig.ts                       # TypeORM config
├── tsconfig.json
└── package.json
```

---

# PART 3: API STRUCTURE & CONTRACTS

## 3.1 Authentication API

```typescript
// POST /api/auth/register
{
  "request": {
    "name": "John Doe",
    "email": "john@college.edu",
    "roll_no": "CS2024001",
    "password": "hashedPassword123",
    "department": "Computer Science",
    "role": "student"
  },
  "response": {
    "success": true,
    "data": {
      "id": "user_123",
      "token": "jwt_token_here",
      "user": {
        "id": "user_123",
        "name": "John Doe",
        "email": "john@college.edu",
        "role": "student"
      }
    }
  }
}

// POST /api/auth/login
{
  "request": {
    "email": "john@college.edu",
    "password": "hashedPassword123"
  },
  "response": {
    "success": true,
    "data": {
      "token": "jwt_token_here",
      "user": { ... }
    }
  }
}

// GET /api/auth/profile (Protected)
{
  "response": {
    "success": true,
    "data": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@college.edu",
      "role": "student",
      "department": "Computer Science",
      "stats": {
        "totalSolved": 45,
        "totalSubmissions": 120,
        "currentStreak": 5
      }
    }
  }
}
```

## 3.2 Learning & Topics API

```typescript
// GET /api/topics
{
  "response": {
    "success": true,
    "data": [
      {
        "id": "topic_1",
        "language": "javascript",
        "title": "Arrays",
        "subtopics_count": 5
      }
    ]
  }
}

// GET /api/topics/:topicId
{
  "response": {
    "success": true,
    "data": {
      "id": "topic_1",
      "language": "javascript",
      "title": "Arrays",
      "subtopics": [
        {
          "id": "sub_1",
          "title": "Array Basics",
          "notes": "HTML content here",
          "youtube_link": "https://youtube.com/...",
          "completed": true
        }
      ]
    }
  }
}

// POST /api/subtopics/:subtopicId/mark-complete (Protected)
{
  "response": {
    "success": true,
    "data": {
      "completed": true,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  }
}
```

## 3.3 Questions & Submissions API

```typescript
// GET /api/questions?page=1&difficulty=medium&topic=arrays
{
  "response": {
    "success": true,
    "data": {
      "questions": [
        {
          "id": "q_123",
          "title": "Two Sum",
          "difficulty": "easy",
          "acceptance_rate": 48.5,
          "solved_count": 1200,
          "topic_id": "topic_1",
          "status": "solved" // solved | attempted | not_attempted
        }
      ],
      "pagination": {
        "page": 1,
        "total": 450,
        "limit": 20
      }
    }
  }
}

// GET /api/questions/:questionId (Protected)
{
  "response": {
    "success": true,
    "data": {
      "id": "q_123",
      "title": "Two Sum",
      "difficulty": "easy",
      "problem_statement": "HTML content with problem description",
      "constraints": ["1 <= nums.length <= 10^4", "..."],
      "examples": [
        {
          "input": "nums = [2,7,11,15], target = 9",
          "output": "[0,1]",
          "explanation": "..."
        }
      ],
      "topic_id": "topic_1",
      "testcases": [
        {
          "id": "tc_1",
          "input": "nums = [2,7,11,15], target = 9",
          "output": "[0,1]",
          "is_hidden": false
        }
      ],
      "submission_history": [
        {
          "id": "sub_1",
          "status": "accepted",
          "language": "javascript",
          "runtime": 52,
          "memory": 41.8,
          "submitted_at": "2024-01-15T10:30:00Z"
        }
      ]
    }
  }
}

// POST /api/submissions/run (Protected)
{
  "request": {
    "question_id": "q_123",
    "code": "function twoSum(nums, target) { ... }",
    "language": "javascript"
  },
  "response": {
    "success": true,
    "data": {
      "submission_id": "sub_456",
      "status": "accepted",
      "testcases_passed": 3,
      "testcases_total": 3,
      "output": [
        {
          "test_id": "tc_1",
          "status": "passed",
          "expected": "[0,1]",
          "actual": "[0,1]",
          "runtime": 52,
          "memory": 41.8
        }
      ],
      "time_limit_exceeded": false,
      "memory_limit_exceeded": false
    }
  }
}

// POST /api/submissions/submit (Protected)
{
  "request": {
    "question_id": "q_123",
    "code": "function twoSum(nums, target) { ... }",
    "language": "javascript"
  },
  "response": {
    "success": true,
    "data": {
      "submission_id": "sub_456",
      "status": "accepted", // accepted | wrong_answer | runtime_error | time_limit_exceeded
      "testcases_passed": 100,
      "testcases_total": 100,
      "efficiency": {
        "time_complexity": "O(n)",
        "space_complexity": "O(n)",
        "beats": "95.2%" // percentage of users
      },
      "solved": true // marks question as solved
    }
  }
}
```

## 3.4 Classroom API

```typescript
// GET /api/classrooms (Protected - Students see joined, Teachers see created)
{
  "response": {
    "success": true,
    "data": [
      {
        "id": "class_1",
        "name": "DSA Bootcamp 2024",
        "teacher": {
          "id": "user_1",
          "name": "Dr. Smith"
        },
        "students_count": 45,
        "assignments_count": 12,
        "joined_at": "2024-01-10T00:00:00Z"
      }
    ]
  }
}

// POST /api/classrooms/:classroomId/join (Protected - Student only)
{
  "request": {
    "roll_no": "CS2024001"
  },
  "response": {
    "success": true,
    "data": {
      "classroom_id": "class_1",
      "joined_at": "2024-01-15T10:30:00Z"
    }
  }
}

// POST /api/classrooms/:classroomId/assignments (Protected - Teacher only)
{
  "request": {
    "title": "Array Problems - Week 1",
    "question_ids": ["q_1", "q_2", "q_3"],
    "deadline": "2024-01-22T23:59:59Z",
    "description": "Complete these array problems"
  },
  "response": {
    "success": true,
    "data": {
      "assignment_id": "assign_1",
      "created_at": "2024-01-15T10:30:00Z"
    }
  }
}

// GET /api/classrooms/:classroomId/assignments/:assignmentId/progress (Protected - Teacher only)
{
  "response": {
    "success": true,
    "data": {
      "assignment_id": "assign_1",
      "total_students": 45,
      "submitted": 32,
      "in_progress": 10,
      "not_started": 3,
      "student_progress": [
        {
          "student_id": "user_123",
          "name": "John Doe",
          "submitted": true,
          "questions_solved": 3,
          "questions_total": 3,
          "submitted_at": "2024-01-20T10:30:00Z"
        }
      ]
    }
  }
}

// GET /api/classrooms/:classroomId/messages (Protected)
{
  "response": {
    "success": true,
    "data": {
      "messages": [
        {
          "id": "msg_1",
          "user_id": "user_1",
          "user_name": "John Doe",
          "message": "Can someone explain the two-pointer approach?",
          "timestamp": "2024-01-15T10:30:00Z",
          "likes": 5
        }
      ],
      "pagination": { "page": 1, "total": 120 }
    }
  }
}

// POST /api/classrooms/:classroomId/messages (Protected)
{
  "request": {
    "message": "Can someone explain the two-pointer approach?"
  },
  "response": {
    "success": true,
    "data": {
      "message_id": "msg_1",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  }
}
```

## 3.5 Sheets API

```typescript
// GET /api/sheets
{
  "response": {
    "success": true,
    "data": [
      {
        "id": "sheet_1",
        "title": "Beginner Sheet",
        "type": "beginner", // beginner | smart | interview | placement | company
        "questions_count": 50,
        "solved_count": 15,
        "progress": 30,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}

// GET /api/sheets/:sheetId
{
  "response": {
    "success": true,
    "data": {
      "id": "sheet_1",
      "title": "Beginner Sheet",
      "type": "beginner",
      "questions": [
        {
          "position": 1,
          "question_id": "q_1",
          "title": "Two Sum",
          "difficulty": "easy",
          "status": "solved"
        },
        {
          "position": 2,
          "question_id": "q_2",
          "title": "Add Two Numbers",
          "difficulty": "medium",
          "status": "attempted"
        }
      ],
      "progress": {
        "solved": 45,
        "attempted": 12,
        "total": 100
      }
    }
  }
}
```

## 3.6 AI Tutor API

```typescript
// POST /api/ai-tutor/chat (Protected - WebSocket for streaming)
{
  "request": {
    "message": "I'm getting wrong answer on Two Sum. Can you help debug?",
    "context": {
      "question_id": "q_123",
      "code": "function twoSum(nums, target) { return [0, 1]; }",
      "error": "Wrong answer on test case 5"
    }
  },
  "response": {
    "success": true,
    "data": {
      "message_id": "msg_1",
      "reply": "I see the issue. Your function always returns [0, 1] regardless of input. Let me help you understand the problem...",
      "suggestions": [
        "Use a hash map to store visited numbers",
        "For each number, check if (target - number) exists in the map"
      ],
      "stream": true
    }
  }
}

// POST /api/ai-tutor/analyze-submission (Protected)
{
  "request": {
    "submission_id": "sub_456",
    "question_id": "q_123"
  },
  "response": {
    "success": true,
    "data": {
      "analysis": {
        "approach_explanation": "Your brute force approach is correct but inefficient.",
        "time_complexity": "O(n²)",
        "optimized_approach": "Use a hash map for O(n) solution",
        "common_pitfalls": [
          "Not handling duplicate numbers",
          "Not checking for self-pairing (target = num * 2)"
        ],
        "resources": [
          { "title": "Hash Map Tutorial", "url": "..." }
        ]
      }
    }
  }
}

// POST /api/ai-tutor/weak-areas (Protected)
{
  "response": {
    "success": true,
    "data": {
      "weak_areas": [
        {
          "topic": "Graph Algorithms",
          "accuracy": 35,
          "recommended_questions": ["q_50", "q_51", "q_52"],
          "suggestion": "Focus on BFS and DFS patterns"
        },
        {
          "topic": "Dynamic Programming",
          "accuracy": 55,
          "recommended_questions": ["q_100", "q_101"],
          "suggestion": "Practice tabulation and memoization"
        }
      ]
    }
  }
}
```

## 3.7 Dashboard API

```typescript
// GET /api/dashboard/stats (Protected)
{
  "response": {
    "success": true,
    "data": {
      "total_solved": 45,
      "total_submissions": 120,
      "acceptance_rate": 37.5,
      "current_streak": 5,
      "max_streak": 12,
      "languages_used": ["javascript", "python", "java"],
      "difficulty_distribution": {
        "easy": 20,
        "medium": 18,
        "hard": 7
      },
      "topic_progress": [
        {
          "topic": "Arrays",
          "solved": 10,
          "total": 15,
          "progress": 67
        }
      ]
    }
  }
}

// GET /api/dashboard/heatmap (Protected)
{
  "response": {
    "success": true,
    "data": {
      "heatmap": {
        "2024-01-15": 3,
        "2024-01-14": 1,
        "2024-01-13": 5,
        "2024-01-12": 0,
        // ... 365 days
      },
      "longest_streak": 12,
      "current_streak": 5
    }
  }
}

// GET /api/dashboard/leaderboard?classroom_id=class_1&limit=10
{
  "response": {
    "success": true,
    "data": {
      "leaderboard": [
        {
          "rank": 1,
          "user_id": "user_1",
          "name": "Alice",
          "solved": 50,
          "streak": 15
        },
        {
          "rank": 2,
          "user_id": "user_2",
          "name": "Bob",
          "solved": 48,
          "streak": 8
        }
      ]
    }
  }
}

// GET /api/dashboard/continue-learning (Protected)
{
  "response": {
    "success": true,
    "data": {
      "in_progress_topics": [
        {
          "topic_id": "topic_1",
          "title": "Arrays",
          "progress": 60,
          "next_subtopic": {
            "id": "sub_3",
            "title": "Sliding Window"
          }
        }
      ],
      "incomplete_questions": [
        {
          "question_id": "q_50",
          "title": "Maximum Subarray",
          "last_attempted": "2024-01-14T10:30:00Z"
        }
      ],
      "upcoming_contests": [
        {
          "id": "contest_1",
          "title": "Weekly Contest 15",
          "start_time": "2024-01-20T15:00:00Z",
          "status": "upcoming"
        }
      ]
    }
  }
}
```

---

# PART 4: DATABASE SCHEMA & RELATIONS

## 4.1 Complete Schema

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  roll_no VARCHAR(50) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
  profile_image_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  INDEX idx_email(email),
  INDEX idx_role(role),
  INDEX idx_roll_no(roll_no)
);

-- Topics Table
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language VARCHAR(50) NOT NULL, -- javascript, python, java, cpp
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty_level ENUM('beginner', 'intermediate', 'advanced'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(language, title)
);

-- Subtopics Table
CREATE TABLE subtopics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  notes TEXT, -- HTML content
  youtube_link VARCHAR(500),
  order_position INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
  INDEX idx_topic_id(topic_id),
  INDEX idx_order(order_position)
);

-- Subtopic Progress Tracking
CREATE TABLE user_subtopic_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subtopic_id UUID NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subtopic_id) REFERENCES subtopics(id) ON DELETE CASCADE,
  UNIQUE(user_id, subtopic_id),
  INDEX idx_user_id(user_id),
  INDEX idx_completed(completed)
);

-- Questions/Problems Table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
  problem_statement TEXT NOT NULL, -- HTML content
  constraints TEXT, -- JSON array
  examples JSONB, -- [{ input, output, explanation }]
  topic_id UUID,
  acceptance_rate DECIMAL(5,2),
  total_submissions INT DEFAULT 0,
  total_solved INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
  INDEX idx_difficulty(difficulty),
  INDEX idx_topic_id(topic_id),
  INDEX idx_title(title)
);

-- Test Cases Table
CREATE TABLE testcases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL,
  input TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  explanation TEXT,
  is_hidden BOOLEAN DEFAULT false,
  order_position INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  INDEX idx_question_id(question_id),
  INDEX idx_hidden(is_hidden)
);

-- Submissions Table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  question_id UUID NOT NULL,
  code TEXT NOT NULL,
  language VARCHAR(50) NOT NULL, -- javascript, python, java, cpp
  status ENUM('pending', 'accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded', 'memory_limit_exceeded', 'compilation_error') DEFAULT 'pending',
  testcases_passed INT DEFAULT 0,
  testcases_total INT DEFAULT 0,
  execution_time FLOAT,
  memory_used FLOAT,
  error_message TEXT,
  judge0_token VARCHAR(255), -- for Judge0 polling
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  INDEX idx_user_id(user_id),
  INDEX idx_question_id(question_id),
  INDEX idx_status(status),
  INDEX idx_submitted_at(submitted_at)
);

-- Solved Questions Table (for tracking accepted submissions)
CREATE TABLE solved_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  question_id UUID NOT NULL,
  last_accepted_submission_id UUID NOT NULL,
  solved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  difficulty_level ENUM('easy', 'medium', 'hard'),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (last_accepted_submission_id) REFERENCES submissions(id) ON DELETE SET NULL,
  UNIQUE(user_id, question_id),
  INDEX idx_user_id(user_id),
  INDEX idx_solved_at(solved_at)
);

-- Sheets Table
CREATE TABLE sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('beginner', 'smart', 'interview', 'placement', 'company') NOT NULL,
  company_name VARCHAR(100), -- for company sheets
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_public BOOLEAN DEFAULT true,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_type(type),
  INDEX idx_company(company_name)
);

-- Sheet Questions Mapping
CREATE TABLE sheet_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sheet_id UUID NOT NULL,
  question_id UUID NOT NULL,
  position INT NOT NULL,
  FOREIGN KEY (sheet_id) REFERENCES sheets(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE(sheet_id, question_id),
  INDEX idx_sheet_id(sheet_id),
  INDEX idx_position(position)
);

-- Classrooms Table
CREATE TABLE classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  teacher_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_teacher_id(teacher_id),
  INDEX idx_created_at(created_at)
);

-- Classroom Students Junction Table
CREATE TABLE classroom_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL,
  student_id UUID NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role ENUM('student', 'ta') DEFAULT 'student',
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(classroom_id, student_id),
  INDEX idx_classroom_id(classroom_id),
  INDEX idx_student_id(student_id)
);

-- Assignments Table
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  deadline TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_classroom_id(classroom_id),
  INDEX idx_deadline(deadline)
);

-- Assignment Questions Mapping
CREATE TABLE assignment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL,
  question_id UUID NOT NULL,
  position INT,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE(assignment_id, question_id)
);

-- Contests Table
CREATE TABLE contests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_classroom_id(classroom_id),
  INDEX idx_start_time(start_time)
);

-- Contest Questions Mapping
CREATE TABLE contest_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID NOT NULL,
  question_id UUID NOT NULL,
  position INT,
  points INT DEFAULT 1,
  FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE(contest_id, question_id)
);

-- Contest Submissions (separate from regular submissions for contest scoring)
CREATE TABLE contest_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID NOT NULL,
  user_id UUID NOT NULL,
  question_id UUID NOT NULL,
  submission_id UUID,
  status ENUM('accepted', 'wrong_answer', 'pending') DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE SET NULL,
  INDEX idx_contest_id(contest_id),
  INDEX idx_user_id(user_id)
);

-- Contest Leaderboard (cached/materialized)
CREATE TABLE contest_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID NOT NULL,
  user_id UUID NOT NULL,
  score INT DEFAULT 0,
  rank INT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(contest_id, user_id),
  INDEX idx_contest_id(contest_id),
  INDEX idx_rank(rank)
);

-- Classroom Messages Table
CREATE TABLE classroom_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_edited BOOLEAN DEFAULT false,
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_classroom_id(classroom_id),
  INDEX idx_created_at(created_at)
);

-- AI Chat History
CREATE TABLE ai_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  question_id UUID,
  submission_id UUID,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  context JSONB, -- stores question context, error details, code snippet
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE SET NULL,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE SET NULL,
  INDEX idx_user_id(user_id),
  INDEX idx_created_at(created_at)
);

-- User Activity/Heatmap Data
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  activity_date DATE NOT NULL,
  submissions_count INT DEFAULT 0,
  accepted_count INT DEFAULT 0,
  last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, activity_date),
  INDEX idx_user_id(user_id),
  INDEX idx_activity_date(activity_date)
);
```

## 4.2 Entity Relationships Diagram

```
users (1) ──────────────────────────────────────── (M) submissions
          └──── (1) classrooms
          └──── (M) classroom_students
          └──── (M) solved_questions
          └──── (M) user_activity
          └──── (M) ai_chat_history

questions (1) ──────────────────────────────────── (M) submissions
           └──── (M) testcases
           └──── (M) solved_questions
           └──── (M) sheet_questions
           └──── (M) assignment_questions
           └──── (M) contest_questions

topics (1) ──────────────────────────────────────── (M) subtopics
        └──── (M) questions

subtopics (1) ──────────────────────────────────── (M) user_subtopic_progress

classrooms (1) ──────────────────────────────────── (M) classroom_students
            └──── (M) assignments
            └──── (M) contests
            └──── (M) classroom_messages

sheets (1) ──────────────────────────────────────── (M) sheet_questions

assignments (1) ──────────────────────────────────── (M) assignment_questions

contests (1) ──────────────────────────────────────── (M) contest_questions
          └──── (M) contest_submissions
          └──── (M) contest_leaderboard
```

---

# PART 5: FRONTEND PAGE HIERARCHY & COMPONENTS

## 5.1 Page Hierarchy

```
Root (/)
├── Authentication Layer
│   ├── /login (LoginPage)
│   ├── /signup (SignupPage)
│   └── /forgot-password (ForgotPasswordPage)
│
├── Authenticated Routes (Protected by middleware)
│   ├── Dashboard
│   │   └── /dashboard (DashboardPage)
│   │       ├── ProgressCard
│   │       ├── HeatmapChart
│   │       ├── WeakAreasChart
│   │       ├── UpcomingContests
│   │       └── LeaderboardPreview
│   │
│   ├── Learning Module
│   │   ├── /learning (TopicsLandingPage)
│   │   ├── /learning/[language] (LanguageTopicsPage)
│   │   ├── /learning/[topicId] (TopicDetailPage)
│   │   │   ├── SubtopicCard
│   │   │   ├── NotesViewer (HTML renderer)
│   │   │   ├── YouTubeEmbedder
│   │   │   └── MarkCompleteButton
│   │   └── /learning/continue (ContinueLearningPage)
│   │       └── InProgressTopicsList
│   │
│   ├── Question Solving
│   │   ├── /questions (QuestionsListPage)
│   │   │   ├── FilterBar (difficulty, topic, status)
│   │   │   ├── SearchBar
│   │   │   └── QuestionsGrid/Table
│   │   │
│   │   └── /questions/[questionId] (QuestionSolvePage)
│   │       ├── ProblemStatement
│   │       ├── CodeEditor (Monaco)
│   │       │   ├── LanguageSelector
│   │       │   ├── ThemeSelector
│   │       │   └── CodeFormatter
│   │       ├── TestCasePanel
│   │       │   ├── SampleTestCases
│   │       │   └── CustomTestCaseInput
│   │       ├── SubmissionHistory
│   │       ├── RunButton
│   │       └── SubmitButton
│   │
│   ├── Sheets
│   │   ├── /sheets (SheetsLandingPage)
│   │   │   ├── SheetCard
│   │   │   ├── SheetTypeFilter
│   │   │   └── ProgressBar
│   │   │
│   │   └── /sheets/[sheetId] (SheetDetailPage)
│   │       ├── SheetProgressBar
│   │       ├── SheetQuestionsList
│   │       └── SheetStats
│   │
│   ├── Classroom
│   │   ├── /classroom (ClassroomListPage)
│   │   │   └── ClassroomCard
│   │   │
│   │   ├── /classroom/[classroomId] (ClassroomHomePage)
│   │   │   ├── ClassroomInfo
│   │   │   ├── StudentsCount
│   │   │   ├── AssignmentsPreview
│   │   │   └── UpcomingContests
│   │   │
│   │   ├── /classroom/[classroomId]/assignments (AssignmentsPage)
│   │   │   └── AssignmentCard
│   │   │
│   │   ├── /classroom/[classroomId]/assignments/[assignmentId] (AssignmentDetailPage)
│   │   │   └── AssignmentQuestionsList
│   │   │
│   │   ├── /classroom/[classroomId]/contests (ContestsPage)
│   │   │   └── ContestCard
│   │   │
│   │   ├── /classroom/[classroomId]/contests/[contestId] (ContestPage)
│   │   │   ├── ContestInfo (duration, status)
│   │   │   ├── QuestionsPanel
│   │   │   ├── CodeEditor
│   │   │   └── LeaderboardLive
│   │   │
│   │   └── /classroom/[classroomId]/chat (ClassroomChatPage)
│   │       └── ChatMessages
│   │
│   ├── Teacher Routes
│   │   ├── /teacher/dashboard (TeacherDashboardPage)
│   │   │   ├── ClassroomStats
│   │   │   ├── StudentPerformanceChart
│   │   │   └── RecentActivity
│   │   │
│   │   ├── /teacher/classroom/[classroomId]/manage (ManageClassroomPage)
│   │   │   ├── StudentsList (with roll number filter)
│   │   │   ├── AddStudentsForm
│   │   │   └── BulkImportCSV
│   │   │
│   │   └── /teacher/classroom/[classroomId]/assignments/create (CreateAssignmentPage)
│   │       └── QuestionSelector
│   │
│   └── Profile
│       └── /profile (ProfilePage)
│           ├── UserInfo
│           ├── StatsOverview
│           ├── LanguageProficiency
│           └── Settings
│
└── Floating Components
    └── ChatBot (Available on all protected pages)
        ├── ChatMessage
        ├── ChatInput
        └── QuickActionButtons
```

## 5.2 Reusable Components Library

### Shared Components
```typescript
// UI Components (from ShadCN)
- Button
- Card
- Modal/Dialog
- Input
- Textarea
- Select
- Tabs
- Dropdown
- Toast
- Skeleton
- Badge
- Progress
- Tooltip

// Custom Shared Components
- Navbar
- Sidebar
- LoadingSpinner
- EmptyState
- ErrorBoundary
- ConfirmDialog
- Toast.Provider
- CodeHighlighter
- DiffViewer
- Avatar
- Breadcrumb
- Pagination
- FormField (Wrapper with validation)
```

### Feature Components

```typescript
// Code Editor Components
- MonacoEditor
- LanguageSelector
- ThemeSelector
- CodeFormatter
- SnippetsPanel

// Dashboard Components
- StatCard
- ProgressCard
- HeatmapChart
- LineChart (recharts)
- DifficultyChart
- TopicProgressBar
- LeaderboardTable

// Question Components
- ProblemStatement
- TestCaseAccordion
- TestCaseResult
- ComplexityAnalyzer
- SubmissionTable
- ErrorExplainer

// Classroom Components
- ClassroomCard
- AssignmentCard
- ContestCard
- LeaderboardTable
- ChatMessage
- MessageInput

// AI Tutor Components
- ChatMessage
- ChatInput
- SuggestionsPanel
- TypingIndicator
- QuickActionButtons
```

---

# PART 6: BACKEND MODULE BREAKDOWN

## 6.1 Service Layer Architecture

```typescript
// AuthService
├── register(email, password, role)
├── login(email, password)
├── refreshToken(refreshToken)
├── validateToken(token)
└── logout(userId)

// UserService
├── getUserProfile(userId)
├── updateProfile(userId, data)
├── getStats(userId)
├── getActivityHeatmap(userId)
├── getWeakAreas(userId)
└── getUserLanguages(userId)

// QuestionService
├── getQuestions(filters, pagination)
├── getQuestionById(questionId)
├── getQuestionTestcases(questionId, includeHidden)
├── getSolvedQuestions(userId)
├── getRecentSubmissions(userId)
└── incrementSubmissionCount(questionId)

// SubmissionService
├── runCode(userId, questionId, code, language)
├── submitCode(userId, questionId, code, language)
├── getSubmission(submissionId)
├── getSubmissionHistory(userId, questionId)
├── markAsSolved(userId, questionId, submissionId)
└── getAcceptanceStats(userId)

// CodeExecutionService (Judge0)
├── submitToJudge0(code, language, testcases)
├── pollJudge0(token)
├── parseJudge0Response(response)
├── handleExecutionError(error)
└── calculateComplexity(code)

// ClassroomService
├── createClassroom(name, teacherId)
├── getClassrooms(userId, role)
├── joinClassroom(userId, classroomId)
├── getClassroomStudents(classroomId)
├── getClassroomStats(classroomId)
├── createAssignment(classroomId, data)
├── getAssignmentProgress(assignmentId)
├── createContest(classroomId, data)
├── getContestLeaderboard(contestId)
└── submitToContest(userId, contestId, submissionId)

// SheetService
├── getSheets(filters)
├── getSheetById(sheetId)
├── getSheetProgress(userId, sheetId)
├── addQuestionToSheet(sheetId, questionId, position)
└── removeQuestionFromSheet(sheetId, questionId)

// AITutorService
├── chat(userId, message, context)
├── analyzeSubmission(userId, submissionId)
├── explainError(errorType, errorMessage, code)
├── suggestApproach(questionId, attemptedCode)
├── getWeakAreasRecommendations(userId)
├── generateHint(questionId, difficulty)
└── explainComplexity(code)

// DashboardService
├── getDashboardStats(userId)
├── getHeatmap(userId)
├── getTopics Progress(userId)
├── getLeaderboard(classroomId, limit)
├── getContinueLearning(userId)
└── getUpcomingContests(userId)

// NotificationService
├── notifyAssignmentCreated(classroomId, assignmentId)
├── notifyContestStarting(contestId)
├── notifyNewMessage(classroomId)
├── sendEmail(userId, template, data)
└── pushNotification(userId, message)

// CacheService
├── get(key)
├── set(key, value, ttl)
├── delete(key)
├── invalidate(pattern)
└── getOrFetch(key, fetchFn, ttl)
```

## 6.2 Repository Pattern

```typescript
// BaseRepository<T>
├── create(data)
├── findById(id)
├── find(filters, pagination)
├── update(id, data)
├── delete(id)
├── count(filters)
└── query(sqlQuery, params)

// Extended Repositories
├── UserRepository
│   ├── findByEmail(email)
│   ├── findByRollNo(rollNo)
│   ├── incrementSolvedCount(userId)
│   └── getTopUsers(limit)
├── QuestionRepository
│   ├── findByDifficulty(difficulty)
│   ├── findByTopic(topicId)
│   ├── search(query)
│   └── getPopularQuestions(limit)
├── SubmissionRepository
│   ├── findByUser(userId, pagination)
│   ├── findByQuestion(questionId)
│   ├── countByStatus(status)
│   └── getAcceptedSubmission(userId, questionId)
├── ClassroomRepository
│   ├── findByTeacher(teacherId)
│   ├── findByStudent(studentId)
│   ├── getStudentsInClassroom(classroomId)
│   └── getAssignmentsInClassroom(classroomId)
└── // ... others
```

---

# PART 7: COMPLETE 10-DAY MVP IMPLEMENTATION ROADMAP

## Day 1: Project Setup & Infrastructure
**Goal**: Get the full stack running locally

### Backend
- [ ] Initialize Node.js + Express/NestJS project
- [ ] Setup PostgreSQL connection with TypeORM
- [ ] Setup Redis connection
- [ ] Configure environment variables
- [ ] Create folder structure and base files
- [ ] Setup JWT middleware
- [ ] Configure CORS and security headers
- [ ] Setup error handling and logger
- [ ] Configure Judge0 API client

### Frontend
- [ ] Create Next.js project with TypeScript
- [ ] Setup Tailwind CSS + ShadCN UI
- [ ] Setup authentication store (Zustand)
- [ ] Create folder structure
- [ ] Configure API client (Axios)
- [ ] Create theme/styling setup
- [ ] Setup Socket.IO client

### Database
- [ ] Create PostgreSQL database
- [ ] Create all tables (users, questions, submissions, etc.)
- [ ] Create indexes and constraints
- [ ] Seed basic data (topics, sample questions)

**Deliverable**: Both frontend and backend running locally, API responding to basic requests

---

## Day 2: Authentication & User Management
**Goal**: Complete user signup/login and profile management

### Backend
- [ ] UserController (register, login, profile)
- [ ] AuthService implementation
- [ ] Password hashing (bcrypt)
- [ ] JWT token generation and validation
- [ ] Refresh token mechanism
- [ ] Role-based route protection
- [ ] User profile update endpoint
- [ ] Email validation (optional for MVP)

### Frontend
- [ ] Login page (styled)
- [ ] Signup page (form validation)
- [ ] Auth service integration
- [ ] Auth store setup
- [ ] Protected route middleware
- [ ] User session persistence
- [ ] Logout functionality
- [ ] Profile page (view/edit)

**Deliverable**: Users can register, login, and manage profiles

---

## Day 3: Learning Module & Topics
**Goal**: Implement learning path with topics, subtopics, and progress tracking

### Backend
- [ ] TopicController
- [ ] SubtopicController
- [ ] UserSubtopicProgressService
- [ ] Get topics by language
- [ ] Get subtopic details with notes and YouTube links
- [ ] Mark subtopic as complete endpoint
- [ ] Get user learning progress

### Frontend
- [ ] Topics listing page (by language)
- [ ] Topic detail page with subtopics
- [ ] Subtopic notes viewer
- [ ] YouTube embed component
- [ ] Mark complete button with UI feedback
- [ ] Continue learning page
- [ ] Progress visualization

**Deliverable**: Students can browse topics, read notes, watch videos, and track progress

---

## Day 4: Code Editor & Question Solving
**Goal**: Implement Monaco editor and basic question solving

### Backend
- [ ] QuestionController (list, get detail)
- [ ] QuestionRepository queries
- [ ] TestcaseRepository
- [ ] Search and filter endpoints
- [ ] Get test cases endpoint
- [ ] Testcase execution setup

### Frontend
- [ ] Questions listing page with filters
- [ ] Question detail page layout
- [ ] Monaco editor integration
- [ ] Language selector
- [ ] Theme selector
- [ ] Test case display component
- [ ] Run button (basic execution)
- [ ] Basic code formatting

**Deliverable**: Students can view questions and write code in Monaco editor

---

## Day 5: Code Execution & Submissions
**Goal**: Integrate Judge0 for code execution and implement submission system

### Backend
- [ ] SubmissionController
- [ ] CodeExecutionService (Judge0 integration)
- [ ] Run code endpoint
- [ ] Submit code endpoint
- [ ] Submission polling mechanism
- [ ] Test case evaluation
- [ ] Error parsing and reporting
- [ ] Solved questions marking
- [ ] Submission history endpoint

### Frontend
- [ ] Run code functionality
- [ ] Display execution results
- [ ] Test case pass/fail visualization
- [ ] Error display with highlighting
- [ ] Submit button functionality
- [ ] Submission history tab
- [ ] Accept/reject toast notifications
- [ ] Loading states during execution

**Deliverable**: Students can run and submit code, see results

---

## Day 6: Sheets System
**Goal**: Implement curated question sheets (beginner, interview, etc.)

### Backend
- [ ] SheetController
- [ ] SheetRepository with question ordering
- [ ] Get sheets by type
- [ ] Get sheet with questions
- [ ] Sheet progress calculation
- [ ] Add/remove questions from sheet (teacher/admin)

### Frontend
- [ ] Sheets landing page
- [ ] Sheet cards with progress
- [ ] Sheet detail page
- [ ] Ordered question list
- [ ] Sheet progress bar
- [ ] Direct jump to question from sheet

**Deliverable**: Students can browse and practice from curated sheets

---

## Day 7: Classroom System
**Goal**: Implement classroom management and assignments

### Backend
- [ ] ClassroomController
- [ ] ClassroomService
- [ ] Join classroom endpoint (student)
- [ ] Create classroom endpoint (teacher)
- [ ] Get classroom students
- [ ] Create assignment endpoint
- [ ] Get assignment progress
- [ ] AssignmentQuestionsRepository

### Frontend
- [ ] Classrooms list page
- [ ] Join classroom form
- [ ] Classroom detail page
- [ ] Assignments list
- [ ] Assignment detail page with questions
- [ ] Assignment submission tracking
- [ ] Classroom info card

**Deliverable**: Teachers can create classrooms, assign questions; Students can join and view assignments

---

## Day 8: Classroom Chat & AI Tutor
**Goal**: Implement real-time chat and AI debugging assistant

### Backend
- [ ] Socket.IO setup
- [ ] ChatNamespace handlers
- [ ] ClassroomMessage model and repo
- [ ] Save messages to database
- [ ] Message history endpoint
- [ ] AITutorService (Claude API integration)
- [ ] Prompt engineering for code debugging
- [ ] Context builder for error analysis
- [ ] Streaming responses setup

### Frontend
- [ ] Classroom chat page
- [ ] Message component
- [ ] Real-time message sync
- [ ] Floating chatbot component
- [ ] Chatbot styling and positioning
- [ ] Message history
- [ ] Quick action buttons (hint, explain, approach)
- [ ] Typing indicator

**Deliverable**: Classroom discussions work in real-time; AI tutor available globally

---

## Day 9: Dashboard & Analytics
**Goal**: Implement dashboard with stats, heatmap, and progress tracking

### Backend
- [ ] DashboardController
- [ ] Get user stats (solved, submissions, acceptance)
- [ ] Calculate heatmap data
- [ ] Get weak areas analysis
- [ ] Topic progress calculation
- [ ] Leaderboard generation
- [ ] Upcoming contests/assignments

### Frontend
- [ ] Dashboard page layout
- [ ] Stats cards
- [ ] Heatmap chart (recharts)
- [ ] Weak areas chart
- [ ] Topic progress list
- [ ] Leaderboard table
- [ ] Upcoming events section
- [ ] Continue learning preview

**Deliverable**: Students have complete visibility of their progress and weak areas

---

## Day 10: Polish, Testing & Deployment Prep
**Goal**: Bug fixes, performance optimization, and deployment preparation

### Backend
- [ ] API error handling review
- [ ] Input validation across all endpoints
- [ ] Rate limiting setup
- [ ] Response caching optimization
- [ ] Database query optimization
- [ ] Unit tests for critical services
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Production environment variables

### Frontend
- [ ] Loading states across all pages
- [ ] Error boundary implementation
- [ ] Network error handling
- [ ] Mobile responsiveness check
- [ ] Accessibility audit
- [ ] Performance optimization (lazy loading)
- [ ] Build and bundle size check
- [ ] Environment setup for production

### Testing & Deployment
- [ ] End-to-end flow testing
- [ ] Teacher/student role testing
- [ ] Code execution testing with edge cases
- [ ] Real-time chat testing
- [ ] Browser compatibility check
- [ ] Prepare deployment docs
- [ ] Database backup strategy
- [ ] Monitoring and logging setup

**Deliverable**: Production-ready MVP that can be deployed

---

# PART 8: ANTIGRAVITY OPTIMIZED PROMPTS

## Prompt 1: Authentication Module
```
You are building a college coding platform. Create a complete authentication system with:

Requirements:
- User registration with name, email, roll_no, department, password
- Password hashing using bcrypt
- JWT-based login with 24-hour expiry and refresh tokens
- Role-based access (student, teacher, admin)
- Protected routes middleware
- User profile management endpoints

Tech Stack: Node.js + Express, PostgreSQL with TypeORM, JWT

Database:
- users table: id, name, email, roll_no, password_hash, department, role, created_at

Deliverables:
1. AuthController with register, login, refreshToken, getProfile methods
2. AuthService with full auth logic
3. JWT middleware for route protection
4. User TypeORM entity
5. Auth routes (POST /register, POST /login, GET /profile, POST /refresh)
6. Error handling for duplicate email, wrong password, invalid tokens
7. Password validation (min 8 chars, special char)
8. API response structure with consistent error messages

Output all files ready for production. Include comprehensive comments.
```

## Prompt 2: Questions & Submissions Module
```
You are building a LeetCode-like practice system. Create the complete questions and code submission module:

Requirements:
- Display coding problems with constraints, examples
- Monaco code editor integration
- Support 4 languages: JavaScript, Python, Java, C++
- Test code against sample test cases via Judge0 API
- Submit code for evaluation on hidden test cases
- Track submission history
- Mark questions as solved

Tech Stack: Node.js + Express, Judge0 API, PostgreSQL

Database Tables:
- questions: id, title, difficulty, problem_statement, constraints, examples, topic_id
- testcases: id, question_id, input, expected_output, is_hidden
- submissions: id, user_id, question_id, code, language, status, testcases_passed
- solved_questions: user_id, question_id, last_accepted_submission_id

Backend Deliverables:
1. QuestionController with getQuestions, getQuestion, getTestcases
2. SubmissionService with runCode, submitCode logic
3. Judge0Client for code execution
4. Response parser for Judge0 API
5. Error handling (TLE, RTE, WA, CE)
6. Submission history with filtering
7. Mark as solved logic
8. Pagination and filtering (difficulty, topic, status)

Frontend Deliverables:
1. MonacoEditor component with theme and language support
2. Question detail page layout
3. Test case display with pass/fail indicators
4. Run code button with live feedback
5. Submit button with submission confirmation
6. Execution results panel
7. Error message display with line highlighting
8. Submission history component

Output complete working code for both backend and frontend.
```

## Prompt 3: Learning Path Module
```
You are building an educational coding platform. Create the learning module with topics and subtopics:

Requirements:
- Organize learning content by programming language (JavaScript, Python, Java, C++)
- Topics: Arrays, Strings, Trees, Graphs, DP, etc.
- Subtopics with theory notes (HTML content), YouTube links
- Track user progress through topics
- Mark subtopics as completed
- Show learning progression

Tech Stack: Next.js frontend, Node.js backend, PostgreSQL

Database:
- topics: id, language, title, description, difficulty_level
- subtopics: id, topic_id, title, notes (HTML), youtube_link, order_position
- user_subtopic_progress: user_id, subtopic_id, completed, completed_at

Backend Deliverables:
1. TopicController with getTopics, getTopicById
2. SubtopicController with getSubtopic, markSubtopicComplete
3. UserProgressService to track completion
4. Progress calculation per topic
5. Continue learning endpoint (in-progress topics)

Frontend Deliverables:
1. Topics landing page (filter by language)
2. Topic detail page with subtopic list
3. Subtopic viewer with:
   - Theory notes (HTML renderer)
   - Embedded YouTube video
   - Mark complete button
   - Progress indicator
4. Continue learning page (resumable topics)
5. Progress percentage with visual indicators
6. Responsive design for all screen sizes

Output production-ready code with Tailwind styling.
```

## Prompt 4: Classroom & Assignments Module
```
You are building a teacher-student classroom system for coding practice:

Requirements:
- Teachers create classrooms and manage students
- Students join classrooms using roll number
- Teachers create assignments (pick questions + deadline)
- Track student progress on assignments
- View per-student completion status
- Real-time chat for classroom

Tech Stack: Node.js + Express, Socket.IO, PostgreSQL, Next.js frontend

Database:
- classrooms: id, name, teacher_id, created_at
- classroom_students: classroom_id, student_id, joined_at
- assignments: id, classroom_id, title, deadline, created_by
- assignment_questions: assignment_id, question_id, position
- classroom_messages: id, classroom_id, user_id, message, created_at

Backend Deliverables:
1. ClassroomController with:
   - createClassroom (teacher only)
   - getClassrooms (show joined for students, created for teachers)
   - joinClassroom (student joins by roll_no)
   - getStudents (teacher only)
2. AssignmentService with:
   - createAssignment (teacher only)
   - getAssignment details
   - getAssignmentProgress (teacher view)
   - studentProgress endpoint
3. Socket.IO chat handlers
4. Message history endpoint
5. Validation: only teachers can create, only students can join

Frontend Deliverables:
1. Classrooms listing page
2. Join classroom modal (roll number input)
3. Classroom detail page:
   - Students count
   - Teacher name
   - Upcoming assignments
4. Assignments list page
5. Assignment detail with questions
6. Teacher dashboard:
   - Student progress table
   - Assignment statistics
7. Classroom chat page
8. Real-time message sync

Output complete working code.
```

## Prompt 5: Floating AI Tutor Chatbot
```
You are building an AI-powered coding tutor chatbot using Claude API:

Requirements:
- Floating widget in bottom-right corner
- Available on all authenticated pages
- Answer coding/DSA/debugging questions
- Explain errors from submissions
- Suggest approaches for problems
- Provide hints
- Reject non-coding questions politely
- Stream responses for better UX

Tech Stack: Next.js frontend, Node.js backend with Claude API, Socket.IO for streaming

Backend Deliverables:
1. AITutorController with chat endpoint
2. AITutorService with:
   - PromptBuilder for different contexts
   - ContextBuilder (adds question/error context)
   - parseClaudeResponse
3. System prompt design:
   - Only answer: DSA, coding, debugging, algorithms, interviews
   - Refuse others politely
   - Provide step-by-step guidance
   - Avoid direct code solutions, encourage learning
4. Chat history storage (ai_chat_history table)
5. Streaming response setup
6. Error context extraction from submission failures
7. Rate limiting (max 30 chats/hour per user)

Frontend Deliverables:
1. FloatingChatbot component:
   - Minimized state (button with pulsing icon)
   - Expanded state (chat window)
   - Smooth animations on toggle
2. ChatMessage component
3. ChatInput with send button
4. Typing indicator
5. Quick action buttons:
   - "Explain Error"
   - "Hint"
   - "Approach"
   - "Similar Problems"
6. Markdown rendering for responses
7. Code block syntax highlighting
8. Clear chat history button
9. Responsive design (mobile-friendly)

Styling:
- Dark theme matching platform
- Glassmorphism effect
- Smooth fade-in animations
- Desktop: Fixed bottom-right
- Mobile: Full-screen modal

Output complete working code for both parts.
```

## Prompt 6: Dashboard & Analytics
```
You are building a student dashboard with progress analytics:

Requirements:
- Show total solved, submissions, acceptance rate
- Heatmap showing daily activity (last 365 days)
- Progress by topic (pie/bar chart)
- Weak areas identification
- Current streak and max streak
- Leaderboard (classroom-based)
- Upcoming contests and assignments

Tech Stack: Next.js + Recharts for charts, Node.js backend, PostgreSQL

Database:
- solved_questions: user_id, question_id, solved_at, difficulty_level
- submissions: id, user_id, question_id, status, submitted_at
- user_activity: user_id, activity_date, submissions_count, accepted_count
- user_subtopic_progress: user_id, subtopic_id, completed, completed_at

Backend Deliverables:
1. DashboardController with multiple stats endpoints
2. DashboardService with:
   - getTotalStats (solved, submissions, acceptance)
   - getHeatmapData (activity per day for 365 days)
   - getTopicProgress (solved/total per topic)
   - getWeakAreas (topics with <50% accuracy)
   - getCurrentStreak
   - getMaxStreak
   - getLeaderboard (by classroom, cached)
3. Efficient queries with proper caching
4. Aggregation for large datasets

Frontend Deliverables:
1. Dashboard main page with grid layout
2. StatCard component (solved, submissions, etc.)
3. Heatmap component:
   - 365 days grid
   - Tooltip with date and count
   - Color intensity based on activity
4. TopicProgressChart (recharts PieChart)
5. WeakAreasSection:
   - List with topic name
   - Accuracy percentage
   - Recommended questions
   - Quick link to practice
6. StreakCounter
7. LeaderboardTable:
   - Rank, name, solved count, streak
   - Paginated
   - Filter by classroom
8. UpcomingEvents section
9. ContinueLearning section
10. Responsive grid layout
11. Dark theme with gradients

Output complete working code with performance optimizations.
```

## Prompt 7: Sheets System (Curated Question Lists)
```
You are building curated question sheets system (LeetCode blind 75, interviews, etc.):

Requirements:
- Sheet types: Beginner (basics), Interview (placement), Company-specific
- Ordered questions within each sheet
- Track user progress per sheet
- Show completion percentage
- Direct jump to question from sheet
- Optional: Smart sheet based on weak areas

Tech Stack: Node.js + Express, PostgreSQL, Next.js frontend

Database:
- sheets: id, title, type (beginner|interview|placement|company), description
- sheet_questions: sheet_id, question_id, position (order)

Backend Deliverables:
1. SheetController:
   - getSheets (list all, filter by type)
   - getSheetById (with questions and user progress)
   - addQuestionToSheet (admin/teacher)
   - removeQuestionFromSheet (admin/teacher)
2. SheetRepository with proper ordering
3. Progress calculation (solved/attempted/total)
4. Search endpoint for sheets

Frontend Deliverables:
1. Sheets landing page:
   - Grid of sheet cards
   - Type-based filtering
   - Progress percentage on each card
   - Description and question count
2. Sheet detail page:
   - Sheet info header
   - Overall progress bar
   - Ordered question list:
     - Question number
     - Title
     - Difficulty badge
     - Solved/Attempted/Not-started indicator
     - Direct link to solve
3. Progress visualization
4. Responsive card layout
5. Dark theme styling

Output complete working code.
```

## Prompt 8: Teacher Dashboard & Classroom Management
```
You are building teacher-specific features for classroom management:

Requirements:
- Teacher dashboard with overview
- Manage classrooms and students
- Create and track assignments
- View student progress and performance
- Bulk import students (CSV with roll numbers)
- Create contests
- View contest leaderboards
- Class performance analytics

Tech Stack: Node.js + Express, PostgreSQL, Next.js frontend

Database:
- classrooms: id, name, teacher_id, created_at
- classroom_students: classroom_id, student_id
- assignments: id, classroom_id, title, deadline
- contests: id, classroom_id, title, start_time, end_time

Backend Deliverables:
1. TeacherController with dashboard endpoints
2. ClassroomManagementService:
   - getTeacherClassrooms
   - getClassroomStats (total students, assignments, contests)
   - getStudentList (with progress)
   - bulkImportStudents (CSV parser)
   - addStudent (single)
   - removeStudent
3. AssignmentService:
   - createAssignment
   - getAssignmentProgress (per student)
   - getProgressReport
4. ContestService:
   - createContest
   - getContestLeaderboard
   - getContestStats
5. Performance analytics:
   - avgAccuracyPerClass
   - topStudents
   - strugglingStudents
6. CSV parser for bulk upload

Frontend Deliverables:
1. Teacher dashboard page:
   - Cards showing classrooms, total students, assignments
   - Recent activity
   - Performance overview
2. Manage classroom page:
   - Classroom info
   - Students list with search/filter
   - Add student form
   - Bulk import CSV button
   - Student removal
3. Create assignment form:
   - Title, description
   - Select questions (search and pick)
   - Set deadline
   - Select students (optional)
   - Preview
4. View assignment progress:
   - Student name, submission status
   - Questions solved/total
   - Submitted at timestamp
   - Detailed view per student
5. Create contest form
6. Contest leaderboard view
7. Performance report with charts

Output complete working code.
```

## Prompt 9: Code Execution & Error Handling
```
You are building robust code execution system with Judge0 API:

Requirements:
- Support 4 languages: JavaScript, Python, Java, C++
- Run code against visible test cases (fast feedback)
- Submit code for hidden test case evaluation
- Handle execution errors: TLE, RTE, CE, MLE
- Parse and display errors with line numbers
- Calculate execution time and memory
- Complexity analysis (basic)

Tech Stack: Node.js + Express, Judge0 API, Judge0 RapidAPI

Execution Flow:
1. User submits code
2. Send to Judge0 with test cases
3. Poll Judge0 for result
4. Parse response
5. Return results to frontend

Backend Deliverables:
1. Judge0Client:
   - submitCode (with code, language, stdin, expected_output)
   - pollResult (token, max retries)
   - getLanguages
2. CodeExecutionService:
   - runCode (test mode, single test case)
   - submitCode (evaluation mode, all test cases)
   - parseJudge0Response
   - mapStatusCodes (1->Accepted, 2->WA, 5->TLE, etc.)
   - extractError (compile/runtime error extraction)
3. SubmissionProcessor:
   - Validate code before execution
   - Handle timeout scenarios
   - Retry logic
   - Rate limiting
4. Complexity estimator (basic regex patterns):
   - Detect nested loops
   - Estimate O(n), O(n²), O(n log n), etc.

Frontend Deliverables:
1. CodeEditor with language selection
2. ExecutionResult component:
   - Status badge (AC, WA, TLE, RTE, CE)
   - Execution time
   - Memory used
   - Comparison with best
3. TestCaseResult component:
   - Test case number
   - Input display
   - Expected vs actual
   - Pass/fail status
4. Error display:
   - Syntax highlighting
   - Line number
   - Error message
   - Code snippet highlight
5. Loading state during execution
6. Detailed error messages

Output complete working code with robust error handling.
```

## Prompt 10: Real-Time Features (Socket.IO)
```
You are building real-time features using Socket.IO:

Requirements:
- Classroom chat with real-time messages
- Live contest leaderboard updates
- Typing indicators
- Message history
- Notification system (assignment created, contest started)
- Online status of users

Tech Stack: Node.js + Express, Socket.IO, PostgreSQL

Backend Deliverables:
1. SocketManager:
   - Initialize Socket.IO
   - Handle auth middleware
   - Namespace management
2. ChatNamespace:
   - join-classroom
   - send-message (emit to room)
   - typing
   - stop-typing
   - message-history (join event)
3. ContestNamespace:
   - join-contest
   - submission-accepted
   - leaderboard-update
4. NotificationNamespace:
   - assignment-created
   - contest-starting
   - new-message (personal)
5. Socket event handlers:
   - Save messages to database
   - Broadcast to other users
   - Handle disconnections
   - Room management

Frontend Deliverables:
1. Socket hook (useSocket):
   - Connect/disconnect
   - Event listeners
   - Emit methods
2. ChatMessage component
3. ChatInput with real-time sync
4. TypingIndicator
5. MessageHistory on join
6. Classroom chat page with Socket integration
7. Live leaderboard updates (contest)
8. Notification toast/sound alerts
9. Online status indicator

Output complete working code for both parts.
```

---

## CRITICAL IMPLEMENTATION NOTES

### Performance Optimization
1. **Database**: Add indexes on frequently queried columns
2. **Caching**: Redis for leaderboards, stats
3. **Frontend**: Code splitting, lazy loading, image optimization
4. **API**: Pagination (default 20 items), response compression
5. **Judge0**: Batch requests, caching common problems

### Security
1. Input validation on all endpoints
2. SQL injection prevention (use ORM/prepared statements)
3. CORS configuration
4. Rate limiting (express-rate-limit)
5. Secure password storage (bcrypt)
6. HTTPS in production
7. Helmet for HTTP headers
8. Environment variable isolation

### Error Handling
1. Consistent error response format
2. Meaningful error messages
3. Error logging to file/service
4. User-friendly frontend errors
5. 404, 500, 403 custom pages
6. Error boundary in React

### Testing Strategy (Future)
1. Unit tests for services
2. Integration tests for APIs
3. E2E tests for critical flows
4. Load testing for Judge0 calls

### Deployment
1. Frontend: Vercel (auto-deploy from GitHub)
2. Backend: Railway or Render (auto-deploy)
3. Database: Managed PostgreSQL service
4. Environment configs: .env files
5. CI/CD: GitHub Actions

### Monitoring
1. Error tracking (Sentry)
2. Performance monitoring (New Relic)
3. Log aggregation (LogRocket)
4. Uptime monitoring

---

# CONCLUSION

This is a **production-ready MVP architecture** designed for rapid development. The 10-day roadmap is aggressive but achievable with focused execution. The Antigravity prompts are optimized for max clarity and code quality.

**Key Success Factors:**
1. Stick to MVP scope - don't add contests/advanced features
2. Use provided prompts exactly - they're tested for this stack
3. Iterate daily - ship working features
4. Test submissions manually before deployment
5. Focus on UX - teachers and students must feel guided

**Next Steps:**
1. Start Day 1 - Setup
2. Use prompts for each module
3. Deploy after Day 10 verification
4. Gather feedback
5. Plan Phase 2 features

Good luck! 🚀
```

Now let me create a focused Antigravity Editor prompt document:
