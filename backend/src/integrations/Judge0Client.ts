/**
 * Judge0 API Client
 * Handles all communication with the Judge0 code execution service.
 */
import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';
import {
  LANGUAGE_MAP,
  Judge0Response,
  JUDGE0_POLL_INTERVAL_MS,
  JUDGE0_MAX_POLLS,
} from '../types/submission.types';

const JUDGE0_BASE_URL = process.env.JUDGE0_BASE_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || '';
const JUDGE0_API_HOST = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';

class Judge0Client {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: JUDGE0_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': JUDGE0_API_HOST,
      },
      timeout: 30000,
    });
  }

  /**
   * Submit code to Judge0 for execution.
   * @returns The submission token used for polling.
   */
  async submitCode(
    code: string,
    language: string,
    stdin: string,
    expectedOutput?: string
  ): Promise<string> {
    const languageId = LANGUAGE_MAP[language.toLowerCase()];

    if (!languageId) {
      throw new Error(`Unsupported language: ${language}. Supported: ${Object.keys(LANGUAGE_MAP).join(', ')}`);
    }

    try {
      const payload: Record<string, any> = {
        source_code: Buffer.from(code).toString('base64'),
        language_id: languageId,
        stdin: Buffer.from(stdin).toString('base64'),
        // Set time and memory limits
        cpu_time_limit: 5, // 5 seconds
        wall_time_limit: 10,
        memory_limit: 128000, // 128 MB in KB
      };

      if (expectedOutput) {
        payload.expected_output = Buffer.from(expectedOutput).toString('base64');
      }

      const response = await this.client.post('/submissions?base64_encoded=true&wait=false', payload);

      if (!response.data?.token) {
        throw new Error('Judge0 did not return a submission token');
      }

      logger.info(`Judge0 submission created: ${response.data.token}`);
      return response.data.token;
    } catch (error: any) {
      if (error.response) {
        logger.error(`Judge0 API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        throw new Error(`Judge0 API error (${error.response.status}): ${error.response.data?.message || 'Unknown error'}`);
      }
      logger.error(`Judge0 request failed: ${error.message}`);
      throw new Error(`Failed to submit code to Judge0: ${error.message}`);
    }
  }

  /**
   * Poll Judge0 for the result of a submission until it completes or times out.
   */
  async pollResult(token: string): Promise<Judge0Response> {
    let polls = 0;

    while (polls < JUDGE0_MAX_POLLS) {
      try {
        const response = await this.client.get(
          `/submissions/${token}?base64_encoded=true&fields=token,stdout,stderr,compile_output,message,status,time,memory`
        );

        const data = response.data;

        // Decode base64 fields
        const decoded: Judge0Response = {
          token: data.token,
          stdout: data.stdout ? Buffer.from(data.stdout, 'base64').toString('utf-8') : null,
          stderr: data.stderr ? Buffer.from(data.stderr, 'base64').toString('utf-8') : null,
          compile_output: data.compile_output ? Buffer.from(data.compile_output, 'base64').toString('utf-8') : null,
          message: data.message ? Buffer.from(data.message, 'base64').toString('utf-8') : null,
          status: data.status,
          time: data.time,
          memory: data.memory,
        };

        // Status 1 = In Queue, 2 = Processing — keep polling
        if (decoded.status.id <= 2) {
          polls++;
          await this.sleep(JUDGE0_POLL_INTERVAL_MS);
          continue;
        }

        // Terminal status reached
        return decoded;
      } catch (error: any) {
        logger.error(`Judge0 poll error for token ${token}: ${error.message}`);
        polls++;
        await this.sleep(JUDGE0_POLL_INTERVAL_MS);
      }
    }

    // Timeout — return a timeout response
    logger.warn(`Judge0 polling timed out for token: ${token}`);
    return {
      token,
      stdout: null,
      stderr: null,
      compile_output: null,
      message: 'Execution timed out waiting for Judge0 response',
      status: { id: 5, description: 'Time Limit Exceeded' },
      time: null,
      memory: null,
    };
  }

  /**
   * Get list of supported languages from Judge0.
   */
  async getLanguages(): Promise<Array<{ id: number; name: string }>> {
    try {
      const response = await this.client.get('/languages');
      return response.data;
    } catch (error: any) {
      logger.error(`Failed to fetch Judge0 languages: ${error.message}`);
      throw new Error('Failed to fetch supported languages');
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const judge0Client = new Judge0Client();
