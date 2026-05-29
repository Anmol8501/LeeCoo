'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { questionService, Question, TestCase, RunResult, Submission } from '@/services/questionService';
import Editor from '@monaco-editor/react';
import {
  ArrowLeft,
  Play,
  Send,
  History,
  BookOpen,
  Code2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Terminal,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params.questionId as string;

  // Question & test cases state
  const [question, setQuestion] = useState<Question | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Tab control for left pane: 'description' | 'history'
  const [leftTab, setLeftTab] = useState<'description' | 'history'>('description');

  // Code editor states
  const [language, setLanguage] = useState<string>('javascript');
  const [code, setCode] = useState<string>('');
  const [editorTheme, setEditorTheme] = useState<string>('vs-dark');

  // Execution states
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<RunResult | null>(null);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [consoleTab, setConsoleTab] = useState<'testcases' | 'results'>('testcases');
  const [activeTestcaseIdx, setActiveTestcaseIdx] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [qData, tcData, historyData] = await Promise.all([
          questionService.getQuestionById(questionId),
          questionService.getTestCases(questionId).catch(() => []),
          questionService.getQuestionHistory(questionId).catch(() => [])
        ]);

        setQuestion(qData);
        setTestCases(tcData);
        setSubmissions(historyData);

        // Load starter code
        if (qData) {
          setCode(getStarterCode(qData.title, 'javascript'));
        }
      } catch (err) {
        console.error('Failed to load coding workspace:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [questionId]);

  // Update editor code when language changes
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (question) {
      setCode(getStarterCode(question.title, newLang));
    }
  };

  // Helper to retrieve structured template boilerplate
  const getStarterCode = (title: string, lang: string): string => {
    const key = title.toLowerCase().replace(/\s+/g, '');
    
    const templates: Record<string, Record<string, string>> = {
      twosum: {
        javascript: `const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');\n    if (input.length < 3) return;\n    const n = parseInt(input[0]);\n    const nums = input[1].split(' ').map(Number);\n    const target = parseInt(input[2]);\n    \n    // Write your two sum solution here\n    const map = {};\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (diff in map) {\n            console.log(map[diff] + ' ' + i);\n            return;\n        }\n        map[nums[i]] = i;\n    }\n}\n\nsolve();\n`,
        python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if len(lines) < 3:\n        return\n    n = int(lines[0])\n    nums = list(map(int, lines[1].split()))\n    target = int(lines[2])\n    \n    # Write logic here\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            print(f"{seen[diff]} {i}")\n            return\n        seen[num] = i\n\nif __name__ == '__main__':\n    solve()\n`,
        cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\n\nusing namespace std;\n\nint main() {\n    int n, target;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) {\n        cin >> nums[i];\n    }\n    cin >> target;\n    \n    unordered_map<int, int> map;\n    for (int i = 0; i < n; i++) {\n        int complement = target - nums[i];\n        if (map.count(complement)) {\n            cout << map[complement] << " " << i << endl;\n            return 0;\n        }\n        map[nums[i]] = i;\n    }\n    return 0;\n}\n`
      },
      validparentheses: {
        javascript: `const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    // Write solution here\n    const stack = [];\n    const mapping = { ')': '(', '}': '{', ']': '[' };\n    for (let char of input) {\n        if (char in mapping) {\n            const top = stack.length ? stack.pop() : '#';\n            if (mapping[char] !== top) {\n                console.log('false');\n                return;\n            }\n        } else {\n            stack.push(char);\n        }\n    }\n    console.log(stack.length === 0 ? 'true' : 'false');\n}\n\nsolve();\n`,
        python: `import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    # Write logic here\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top_element = stack.pop() if stack else '#'\n            if mapping[char] != top_element:\n                print("false")\n                return\n        else:\n            stack.append(char)\n    print("true" if not stack else "false")\n\nif __name__ == '__main__':\n    solve()\n`,
        cpp: `#include <iostream>\n#include <stack>\n#include <string>\n#include <unordered_map>\n\nusing namespace std;\n\nint main() {\n    string s;\n    if (!(cin >> s)) {\n        cout << "true" << endl;\n        return 0;\n    }\n    stack<char> st;\n    unordered_map<char, char> map = {{')', '('}, {'}', '{'}, {']', '['}};\n    for (char c : s) {\n        if (map.count(c)) {\n            char top = st.empty() ? '#' : st.top();\n            if (!st.empty()) st.pop();\n            if (map[c] != top) {\n                cout << "false" << endl;\n                return 0;\n            }\n        } else {\n            st.push(c);\n        }\n    }\n    cout << (st.empty() ? "true" : "false") << endl;\n    return 0;\n}\n`
      }
    };

    // Fallback template
    const genericTemplates: Record<string, string> = {
      javascript: `const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    // Read input and print result\n    console.log(input);\n}\n\nsolve();\n`,
      python: `import sys\n\ndef solve():\n    # Read standard input and print output\n    input_data = sys.stdin.read().strip()\n    print(input_data)\n\nif __name__ == '__main__':\n    solve()\n`,
      cpp: `#include <iostream>\n#include <string>\n\nusing namespace std;\n\nint main() {\n    string input;\n    while (cin >> input) {\n        cout << input << " ";\n    }\n    cout << endl;\n    return 0;\n}\n`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            System.out.println(sc.next());\n        }\n    }\n}\n`,
      c: `#include <stdio.h>\n\nint main() {\n    char buffer[100];\n    if (fgets(buffer, sizeof(buffer), stdin)) {\n        printf("%s", buffer);\n    }\n    return 0;\n}\n`
    };

    return templates[key]?.[lang] || genericTemplates[lang] || genericTemplates.javascript;
  };

  const handleRunCode = async () => {
    if (!question || isRunning || isSubmitting) return;
    setIsRunning(true);
    setExecutionResult(null);
    setSubmissionResult(null);
    setConsoleTab('results');

    try {
      const res = await questionService.runCode(questionId, code, language);
      setExecutionResult(res);
      setActiveTestcaseIdx(0);
    } catch (err: any) {
      console.error('Run code error:', err);
      // Construct a mockup result for presentation if API error
      setExecutionResult({
        status: 'runtime_error',
        testcases_passed: 0,
        testcases_total: testCases.length,
        execution_time: null,
        memory_used: null,
        error_message: err.response?.data?.error || err.message || 'Run code failed',
        results: []
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!question || isRunning || isSubmitting) return;
    setIsSubmitting(true);
    setExecutionResult(null);
    setSubmissionResult(null);
    setConsoleTab('results');

    try {
      const res = await questionService.submitCode(questionId, code, language);
      setSubmissionResult(res);
      
      // Update submissions history list
      const history = await questionService.getQuestionHistory(questionId).catch(() => []);
      setSubmissions(history);
      
      // Update user status badge if solved
      if (res.status === 'accepted' && question) {
        setQuestion({ ...question, user_status: 'solved' });
      }
    } catch (err: any) {
      console.error('Submit code error:', err);
      setSubmissionResult({
        status: 'runtime_error',
        testcases_passed: 0,
        testcases_total: testCases.length,
        error_message: err.response?.data?.error || err.message || 'Submission failed'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetCode = () => {
    if (question && window.confirm('Reset editor to default starter template?')) {
      setCode(getStarterCode(question.title, language));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f8fafc] dark:bg-[#07090e] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 dark:text-slate-400 text-sm">Loading problem workspace...</span>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="p-8 text-center bg-[#f8fafc] dark:bg-[#07090e] min-h-[calc(100vh-64px)]">
        <h3 className="text-slate-800 dark:text-white font-bold">Question not found</h3>
        <Link href="/questions" className="mt-4 inline-block text-emerald-500 hover:underline">
          Back to questions list
        </Link>
      </div>
    );
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20';
      case 'medium': return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'hard': return 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-500 bg-slate-500/10';
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-100 dark:bg-[#07090e]">
      
      {/* LEFT COLUMN: PROBLEM DESCRIPTION & SUBMISSIONS */}
      <div className="w-1/2 border-r border-slate-200 dark:border-[#1e293b]/70 bg-white dark:bg-[#0a0f1d] flex flex-col h-full">
        {/* Navigation Tabs Header */}
        <div className="flex items-center justify-between border-b border-slate-150 dark:border-[#1e293b]/40 bg-slate-50 dark:bg-[#0a0f1d] px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setLeftTab('description')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                leftTab === 'description'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-450 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Description</span>
            </button>
            <button
              onClick={() => setLeftTab('history')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                leftTab === 'history'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-450 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> Submissions ({submissions.length})</span>
            </button>
          </div>
          <Link href="/questions" className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300" title="Back to listing">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Tab contents (scrollable container) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {leftTab === 'description' ? (
            <>
              {/* Question Meta */}
              <div className="space-y-3">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {question.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  {question.user_status === 'solved' && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                      Solved
                    </span>
                  )}
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                    Acceptance: {question.acceptance_rate}%
                  </span>
                </div>
              </div>

              {/* Problem statement (dangerously render html) */}
              <div 
                className="prose dark:prose-invert prose-emerald max-w-none text-sm text-slate-700 dark:text-slate-350 leading-relaxed border-b border-slate-100 dark:border-[#1e293b]/40 pb-6"
                dangerouslySetInnerHTML={{ __html: question.problem_statement }}
              />

              {/* Examples */}
              {question.examples && Array.isArray(question.examples) && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Examples</h4>
                  {question.examples.map((ex, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-[#1a2332]/25 border border-slate-200 dark:border-[#10b981]/20 rounded-xl space-y-2">
                      <div className="text-xs">
                        <span className="font-bold text-slate-500 dark:text-slate-450 block">Example {idx + 1}:</span>
                      </div>
                      <div className="font-mono text-xs text-slate-700 dark:text-slate-300 space-y-1">
                        <p><span className="font-semibold text-slate-400">Input:</span> {ex.input}</p>
                        <p><span className="font-semibold text-slate-400">Output:</span> {ex.output}</p>
                        {ex.explanation && (
                          <p className="mt-2 italic text-slate-500 dark:text-slate-400 font-sans text-[11px]">
                            <span className="font-semibold text-slate-400 font-mono">Explanation:</span> {ex.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Constraints */}
              {question.constraints && (
                <div className="space-y-3 border-t border-slate-100 dark:border-[#1e293b]/40 pt-6">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Constraints</h4>
                  <ul className="list-disc pl-5 text-xs text-slate-500 dark:text-slate-400 space-y-1.5 font-mono">
                    {(typeof question.constraints === 'string' ? question.constraints.split('\n') : question.constraints as string[]).map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            /* Submissions history view */
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Your Submission History</h4>
              {submissions.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">You haven't submitted code for this question yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((sub) => {
                    const isSuccess = sub.status === 'accepted';
                    return (
                      <div
                        key={sub.id}
                        className="p-4 bg-slate-50 dark:bg-[#1a2332]/25 border border-slate-200 dark:border-[#1e293b]/50 rounded-xl flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold capitalize text-xs ${isSuccess ? 'text-emerald-500' : 'text-red-500'}`}>
                              {sub.status.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({sub.testcases_passed}/{sub.testcases_total} test cases)
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Submitted at: {new Date(sub.submitted_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">
                            {sub.language}
                          </span>
                          {sub.execution_time !== null && (
                            <p className="text-[9px] text-slate-400 font-mono">
                              {sub.execution_time}s | {sub.memory_used}MB
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* RIGHT COLUMN: CODE EDITOR & EXECUTION RESULT CONSOLE */}
      <div className="w-1/2 flex flex-col h-full bg-[#0f1419]">
        
        {/* Editor Controls Header */}
        <div className="h-12 border-b border-slate-200 dark:border-[#1e293b]/70 bg-white dark:bg-[#0a0f1d] px-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Language Dropdown */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-2 py-1 bg-slate-50 dark:bg-[#1a2332] border border-slate-200 dark:border-slate-800 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="c">C</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setEditorTheme(t => t === 'vs-dark' ? 'light' : 'vs-dark')}
              className="px-2 py-1 bg-slate-50 dark:bg-[#1a2332] border border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 rounded hover:border-emerald-500 hover:text-emerald-500 cursor-pointer"
            >
              Theme: {editorTheme === 'vs-dark' ? 'Dark' : 'Light'}
            </button>

            {/* Reset Button */}
            <button
              onClick={handleResetCode}
              title="Reset Code Template"
              className="p-1 text-slate-400 dark:text-slate-500 hover:text-red-500 rounded cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Monaco Editor Container */}
        <div className="flex-1 min-h-[300px] border-b border-slate-200 dark:border-[#1e293b]/70 relative">
          <Editor
            height="100%"
            language={language === 'cpp' ? 'cpp' : language === 'python' ? 'python' : language}
            theme={editorTheme}
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              fontFamily: 'var(--font-geist-mono), monospace',
              cursorBlinking: 'smooth',
              automaticLayout: true,
              tabSize: 4,
              insertSpaces: true,
            }}
          />
        </div>

        {/* TERMINAL CONSOLE RESULTS INTERFACE */}
        <div className="h-64 bg-white dark:bg-[#07090e] border-t border-slate-200 dark:border-[#1e293b]/70 flex flex-col flex-shrink-0">
          
          {/* Console Console Tabs */}
          <div className="h-10 bg-slate-50 dark:bg-[#0a0f1d] border-b border-slate-200 dark:border-[#1e293b]/70 px-4 flex items-center justify-between flex-shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => setConsoleTab('testcases')}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  consoleTab === 'testcases'
                    ? 'bg-slate-200 dark:bg-[#1a2332] text-slate-800 dark:text-[#f0f9ff]'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
                }`}
              >
                Test Cases
              </button>
              <button
                onClick={() => setConsoleTab('results')}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  consoleTab === 'results'
                    ? 'bg-slate-200 dark:bg-[#1a2332] text-slate-800 dark:text-[#f0f9ff]'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
                }`}
              >
                Console Results
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#1a2332] dark:hover:bg-[#1a2332]/85 text-slate-700 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/20 text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" /> Run Code
              </button>
              <button
                onClick={handleSubmitCode}
                disabled={isRunning || isSubmitting}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" /> Submit
              </button>
            </div>
          </div>

          {/* Console Content Panel */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
            
            {consoleTab === 'testcases' ? (
              /* TEST CASES DISPLAY */
              <div className="space-y-4">
                <div className="flex gap-2">
                  {testCases.map((tc, idx) => (
                    <button
                      key={tc.id}
                      onClick={() => setActiveTestcaseIdx(idx)}
                      className={`px-3 py-1.5 rounded font-semibold text-[10px] border cursor-pointer ${
                        activeTestcaseIdx === idx
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-50 dark:bg-[#1a2332]/25 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
                </div>
                {testCases[activeTestcaseIdx] && (
                  <div className="space-y-3 bg-slate-50 dark:bg-[#1a2332]/20 border border-slate-150 dark:border-slate-800/80 p-3 rounded-lg">
                    <div>
                      <span className="text-[10px] text-slate-450 font-bold block mb-1">INPUT:</span>
                      <pre className="p-2 bg-slate-100 dark:bg-[#0f1419]/80 border border-slate-200 dark:border-slate-800 rounded font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                        {testCases[activeTestcaseIdx].input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-450 font-bold block mb-1">EXPECTED OUTPUT:</span>
                      <pre className="p-2 bg-slate-100 dark:bg-[#0f1419]/80 border border-slate-200 dark:border-slate-800 rounded font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                        {testCases[activeTestcaseIdx].expected_output}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* CONSOLE RESULTS PANEL */
              <div className="space-y-4 h-full">
                
                {/* Loader */}
                {(isRunning || isSubmitting) && (
                  <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
                    <span>Executing code on Judge0 compiler...</span>
                  </div>
                )}

                {/* RUN CODE RESULTS */}
                {!isRunning && executionResult && (
                  <div className="space-y-3 h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1e293b]/40 pb-2">
                      <div className="flex items-center gap-2">
                        {executionResult.status === 'accepted' ? (
                          <span className="text-emerald-500 font-bold text-sm flex items-center gap-1.5">
                            <CheckCircle className="w-4.5 h-4.5" /> Accepted
                          </span>
                        ) : (
                          <span className="text-red-500 font-bold text-sm flex items-center gap-1.5">
                            <XCircle className="w-4.5 h-4.5" /> {executionResult.status.replace('_', ' ').toUpperCase()}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          ({executionResult.testcases_passed}/{executionResult.testcases_total} test cases passed)
                        </span>
                      </div>
                      {executionResult.execution_time !== null && (
                        <div className="text-[10px] text-slate-400">
                          Time: {executionResult.execution_time}s | Memory: {executionResult.memory_used}MB
                        </div>
                      )}
                    </div>

                    {/* Compilation/Runtime errors */}
                    {executionResult.error_message && (
                      <pre className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg text-[11px] overflow-x-auto whitespace-pre-wrap">
                        {executionResult.error_message}
                      </pre>
                    )}

                    {/* Test Case Detail comparison */}
                    {executionResult.results && executionResult.results.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          {executionResult.results.map((res, idx) => (
                            <button
                              key={res.testcase_id}
                              onClick={() => setActiveTestcaseIdx(idx)}
                              className={`px-3 py-1.5 rounded font-semibold text-[10px] border cursor-pointer flex items-center gap-1 ${
                                activeTestcaseIdx === idx
                                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-slate-50 dark:bg-[#1a2332]/25 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              Case {idx + 1}
                              {res.passed ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              )}
                            </button>
                          ))}
                        </div>

                        {executionResult.results[activeTestcaseIdx] && (
                          <div className="space-y-3 bg-slate-50 dark:bg-[#1a2332]/20 border border-slate-150 dark:border-slate-800/80 p-3 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[10px] text-slate-450 font-bold block mb-1">INPUT:</span>
                                <pre className="p-2 bg-slate-100 dark:bg-[#0f1419]/80 border border-slate-200 dark:border-slate-800 rounded font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                                  {executionResult.results[activeTestcaseIdx].input}
                                </pre>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-450 font-bold block mb-1">EXPECTED OUTPUT:</span>
                                <pre className="p-2 bg-slate-100 dark:bg-[#0f1419]/80 border border-slate-200 dark:border-slate-800 rounded font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                                  {executionResult.results[activeTestcaseIdx].expected}
                                </pre>
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-450 font-bold block mb-1">YOUR OUTPUT:</span>
                              <pre className={`p-2 border rounded font-mono text-[11px] overflow-x-auto whitespace-pre-wrap ${
                                executionResult.results[activeTestcaseIdx].passed
                                  ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-red-950/10 border-red-500/20 text-red-500'
                              }`}>
                                {executionResult.results[activeTestcaseIdx].actual || '[No stdout]'}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* SUBMIT CODE RESULTS */}
                {!isSubmitting && submissionResult && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      {submissionResult.status === 'accepted' ? (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-full flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                            <div>
                              <h4 className="font-bold text-slate-800 dark:text-white text-base">All Test Cases Passed!</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Your submission has been accepted and scored.
                              </p>
                            </div>
                          </div>
                          <div className="text-right text-xs text-slate-500 font-mono">
                            <span className="font-bold text-emerald-500 block text-sm">ACCEPTED</span>
                            {submissionResult.execution_time !== null && (
                              <span>Time: {submissionResult.execution_time}s | Memory: {submissionResult.memory_used}MB</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl w-full flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <XCircle className="w-10 h-10 text-red-500" />
                            <div>
                              <h4 className="font-bold text-slate-800 dark:text-white text-base">Submission Failed</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Failed on test case {submissionResult.testcases_passed + 1}.
                              </p>
                            </div>
                          </div>
                          <div className="text-right text-xs text-slate-500 font-mono">
                            <span className="font-bold text-red-500 block text-sm">
                              {submissionResult.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <span>{submissionResult.testcases_passed}/{submissionResult.testcases_total} passed</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {submissionResult.error_message && (
                      <pre className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg text-[11px] overflow-x-auto whitespace-pre-wrap">
                        {submissionResult.error_message}
                      </pre>
                    )}
                  </div>
                )}

                {/* Empty Console */}
                {!isRunning && !isSubmitting && !executionResult && !submissionResult && (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-2">
                    <Terminal className="w-8 h-8 text-slate-400" />
                    <span>Run or Submit your code to see compilation results here.</span>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
