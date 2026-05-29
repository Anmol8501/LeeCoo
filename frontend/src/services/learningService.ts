import api from './api';

export interface Subtopic {
  id: string;
  title: string;
  content: string; // Markdown notes
  video_url: string | null;
  order_position: number;
  is_completed?: boolean;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  language: string;
  difficulty_level: string;
  order_position: number;
  subtopics?: Subtopic[];
  progress?: {
    completed: number;
    total: number;
    percentage: number;
  };
}

export const learningService = {
  /**
   * Get all topics, optionally filtered by programming language.
   */
  async getTopics(language?: string): Promise<Topic[]> {
    const params = language ? { language } : {};
    const response = await api.get('/topics', { params });
    return response.data.data;
  },

  /**
   * Get topics in progress to continue learning.
   */
  async getContinueLearning(): Promise<Topic[]> {
    const response = await api.get('/topics/continue');
    return response.data.data;
  },

  /**
   * Get details of a single topic including subtopics and progress.
   */
  async getTopicById(id: string): Promise<Topic> {
    const response = await api.get(`/topics/${id}`);
    return response.data.data;
  },

  /**
   * Mark a subtopic as completed.
   */
  async markSubtopicComplete(subtopicId: string): Promise<{ success: boolean; completed_subtopics_count: number }> {
    const response = await api.post(`/subtopics/${subtopicId}/mark-complete`);
    return response.data.data;
  },

  /**
   * Unmark a subtopic as completed.
   */
  async unmarkSubtopicComplete(subtopicId: string): Promise<{ success: boolean; completed_subtopics_count: number }> {
    const response = await api.delete(`/subtopics/${subtopicId}/mark-complete`);
    return response.data.data;
  },
};

export default learningService;
