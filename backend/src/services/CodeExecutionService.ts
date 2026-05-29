/**
 * Code Execution Service
 * Orchestrates running code against test cases via Judge0 and parsing results.
 */
import { judge0Client } from '../integrations/Judge0Client';
import { logger } from '../utils/logger';
import {
  Judge0Response,
  Judge0Status,
  SubmissionStatusType,
  TestCaseResult,
  ExecutionResult,
} from '../types/submission.types';

export class CodeExecutionService {
  /**
   * Run code against a set of test cases sequentially.
   * For "Run" mode, we use only visible test cases.
   * For "Submit" mode, we use all test cases including hidden ones.
   */
  async runCode(
    code: string,
    language: string,
    testcases: Array<{
      id: string;
      input: string;
      expected_output: string;
      is_hidden: boolean;
    }>
  ): Promise<ExecutionResult> {
    if (testcases.length === 0) {
      return {
        status: 'accepted',
        testcases_passed: 0,
        testcases_total: 0,
        execution_time: null,
        memory_used: null,
        error_message: 'No test cases available',
        results: [],
      };
    }

    const results: TestCaseResult[] = [];
    let totalTime = 0;
    let maxMemory = 0;
    let passed = 0;
    let overallStatus: SubmissionStatusType = 'accepted';
    let overallError: string | null = null;

    for (const tc of testcases) {
      try {
        // Submit to Judge0
        const token = await judge0Client.submitCode(code, language, tc.input, tc.expected_output);

        // Poll for result
        const response = await judge0Client.pollResult(token);

        // Parse the response
        const status = this.mapStatusCode(response.status.id);
        const errorMsg = this.extractError(response);

        const result: TestCaseResult = {
          testcase_id: tc.id,
          input: tc.is_hidden ? '[hidden]' : tc.input,
          expected_output: tc.is_hidden ? '[hidden]' : tc.expected_output,
          actual_output: tc.is_hidden ? '[hidden]' : (response.stdout?.trim() || null),
          status,
          execution_time: response.time ? parseFloat(response.time) : null,
          memory_used: response.memory ? response.memory / 1024 : null, // Convert KB to MB
          error_message: errorMsg,
          is_hidden: tc.is_hidden,
        };

        results.push(result);

        if (status === 'accepted') {
          passed++;
        } else if (overallStatus === 'accepted') {
          // First failure determines overall status
          overallStatus = status;
          overallError = errorMsg;
        }

        if (response.time) totalTime += parseFloat(response.time);
        if (response.memory) maxMemory = Math.max(maxMemory, response.memory);

        // If compilation error, no need to run remaining test cases
        if (status === 'compilation_error') {
          // Fill remaining with same error
          const remaining = testcases.slice(testcases.indexOf(tc) + 1);
          for (const rem of remaining) {
            results.push({
              testcase_id: rem.id,
              input: rem.is_hidden ? '[hidden]' : rem.input,
              expected_output: rem.is_hidden ? '[hidden]' : rem.expected_output,
              actual_output: null,
              status: 'compilation_error',
              execution_time: null,
              memory_used: null,
              error_message: errorMsg,
              is_hidden: rem.is_hidden,
            });
          }
          break;
        }
      } catch (error: any) {
        logger.error(`Test case execution failed for ${tc.id}: ${error.message}`);
        results.push({
          testcase_id: tc.id,
          input: tc.is_hidden ? '[hidden]' : tc.input,
          expected_output: tc.is_hidden ? '[hidden]' : tc.expected_output,
          actual_output: null,
          status: 'runtime_error',
          execution_time: null,
          memory_used: null,
          error_message: `Execution error: ${error.message}`,
          is_hidden: tc.is_hidden,
        });

        if (overallStatus === 'accepted') {
          overallStatus = 'runtime_error';
          overallError = error.message;
        }
      }
    }

    return {
      status: passed === testcases.length ? 'accepted' : overallStatus,
      testcases_passed: passed,
      testcases_total: testcases.length,
      execution_time: totalTime > 0 ? Math.round(totalTime * 1000) / 1000 : null,
      memory_used: maxMemory > 0 ? Math.round((maxMemory / 1024) * 100) / 100 : null, // MB
      error_message: overallError,
      results,
    };
  }

  /**
   * Map Judge0 status code to our internal status type.
   */
  mapStatusCode(statusCode: number): SubmissionStatusType {
    switch (statusCode) {
      case Judge0Status.ACCEPTED:
        return 'accepted';
      case Judge0Status.WRONG_ANSWER:
        return 'wrong_answer';
      case Judge0Status.TIME_LIMIT_EXCEEDED:
        return 'time_limit_exceeded';
      case Judge0Status.COMPILATION_ERROR:
        return 'compilation_error';
      case Judge0Status.RUNTIME_ERROR_SIGSEGV:
      case Judge0Status.RUNTIME_ERROR_SIGXFSZ:
      case Judge0Status.RUNTIME_ERROR_SIGFPE:
      case Judge0Status.RUNTIME_ERROR_SIGABRT:
      case Judge0Status.RUNTIME_ERROR_NZEC:
      case Judge0Status.RUNTIME_ERROR_OTHER:
        return 'runtime_error';
      case Judge0Status.INTERNAL_ERROR:
      case Judge0Status.EXEC_FORMAT_ERROR:
        return 'runtime_error';
      default:
        return 'pending';
    }
  }

  /**
   * Extract a meaningful error message from a Judge0 response.
   */
  extractError(response: Judge0Response): string | null {
    if (response.compile_output) {
      return `Compilation Error:\n${response.compile_output}`;
    }
    if (response.stderr) {
      return response.stderr;
    }
    if (response.message) {
      return response.message;
    }
    if (response.status.id === Judge0Status.WRONG_ANSWER) {
      return 'Wrong Answer: Output does not match expected result';
    }
    if (response.status.id === Judge0Status.TIME_LIMIT_EXCEEDED) {
      return 'Time Limit Exceeded: Your solution took too long to execute';
    }
    return null;
  }
}

export const codeExecutionService = new CodeExecutionService();
