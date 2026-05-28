import axios, { AxiosInstance } from 'axios';
import { env } from './env';

/**
 * Judge0 API client configuration.
 * Supports both self-hosted Judge0 CE and RapidAPI-hosted instances.
 */
export const createJudge0Client = (): AxiosInstance => {
  const isRapidAPI = !!env.JUDGE0_RAPIDAPI_KEY;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (isRapidAPI) {
    headers['X-RapidAPI-Key'] = env.JUDGE0_RAPIDAPI_KEY;
    headers['X-RapidAPI-Host'] = env.JUDGE0_RAPIDAPI_HOST;
  }

  return axios.create({
    baseURL: env.JUDGE0_API_URL,
    headers,
    timeout: 30000,
  });
};

/** Language ID mapping for Judge0 CE */
export const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  javascript: 63,  // Node.js
  python: 71,      // Python 3
  java: 62,        // Java (OpenJDK)
  cpp: 54,         // C++ (GCC)
  c: 50,           // C (GCC)
};
