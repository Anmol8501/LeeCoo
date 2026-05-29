/**
 * Topic Service
 * Business logic for the Learning Module: topics, subtopics, and progress tracking.
 */
import { AppDataSource } from '../config/database';
import { Topic } from '../models/Topic';
import { Subtopic } from '../models/Subtopic';
import { UserSubtopicProgress } from '../models/UserSubtopicProgress';
import { logger } from '../utils/logger';

export class TopicService {
  private topicRepo = AppDataSource.getRepository(Topic);
  private subtopicRepo = AppDataSource.getRepository(Subtopic);
  private progressRepo = AppDataSource.getRepository(UserSubtopicProgress);

  /**
   * Fetch all topics, optionally filtered by language.
   * Includes computed subtopics_count.
   */
  async getAllTopics(language?: string) {
    const qb = this.topicRepo
      .createQueryBuilder('topic')
      .loadRelationCountAndMap('topic.subtopics_count', 'topic.subtopics')
      .orderBy('topic.created_at', 'ASC');

    if (language) {
      qb.where('topic.language = :language', { language: language.toLowerCase() });
    }

    return qb.getMany();
  }

  /**
   * Fetch a single topic with its subtopics.
   * If userId is provided, include completion status for each subtopic.
   */
  async getTopicById(topicId: string, userId?: string) {
    const topic = await this.topicRepo.findOne({
      where: { id: topicId },
      relations: ['subtopics'],
    });

    if (!topic) return null;

    // Sort subtopics by order_position
    topic.subtopics.sort((a, b) => (a.order_position ?? 0) - (b.order_position ?? 0));

    if (userId) {
      // Get progress for this user on all subtopics of this topic
      const progress = await this.progressRepo.find({
        where: {
          user_id: userId,
        },
      });

      const progressMap = new Map(progress.map((p) => [p.subtopic_id, p.completed]));

      // Attach completion status to each subtopic
      const subtopicsWithProgress = topic.subtopics.map((sub) => ({
        ...sub,
        completed: progressMap.get(sub.id) ?? false,
      }));

      return {
        ...topic,
        subtopics: subtopicsWithProgress,
        total_subtopics: topic.subtopics.length,
        completed_subtopics: subtopicsWithProgress.filter((s) => s.completed).length,
      };
    }

    return {
      ...topic,
      total_subtopics: topic.subtopics.length,
      completed_subtopics: 0,
    };
  }

  /**
   * Mark a subtopic as complete for a user.
   */
  async markSubtopicComplete(userId: string, subtopicId: string) {
    const subtopic = await this.subtopicRepo.findOne({ where: { id: subtopicId } });
    if (!subtopic) {
      throw new Error('Subtopic not found');
    }

    // Upsert progress record
    let progress = await this.progressRepo.findOne({
      where: { user_id: userId, subtopic_id: subtopicId },
    });

    if (progress) {
      progress.completed = true;
      progress.completed_at = new Date();
    } else {
      progress = this.progressRepo.create({
        user_id: userId,
        subtopic_id: subtopicId,
        completed: true,
        completed_at: new Date(),
      });
    }

    await this.progressRepo.save(progress);
    logger.info(`User ${userId} marked subtopic ${subtopicId} as complete`);
    return { completed: true, completed_at: progress.completed_at };
  }

  /**
   * Unmark a subtopic as complete for a user.
   */
  async unmarkSubtopicComplete(userId: string, subtopicId: string) {
    const progress = await this.progressRepo.findOne({
      where: { user_id: userId, subtopic_id: subtopicId },
    });

    if (progress) {
      progress.completed = false;
      progress.completed_at = null;
      await this.progressRepo.save(progress);
    }

    return { completed: false };
  }

  /**
   * Get topics where the user has partial progress (at least one completed subtopic
   * but not all subtopics completed).
   */
  async getContinueLearning(userId: string) {
    // Get all topics with their subtopics
    const topics = await this.topicRepo.find({ relations: ['subtopics'] });

    // Get all progress for this user
    const allProgress = await this.progressRepo.find({
      where: { user_id: userId, completed: true },
    });

    const progressSet = new Set(allProgress.map((p) => p.subtopic_id));

    const inProgressTopics = topics
      .map((topic) => {
        const totalSubtopics = topic.subtopics.length;
        const completedSubtopics = topic.subtopics.filter((sub) => progressSet.has(sub.id)).length;
        const progressPercent = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;

        return {
          id: topic.id,
          title: topic.title,
          language: topic.language,
          description: topic.description,
          difficulty_level: topic.difficulty_level,
          total_subtopics: totalSubtopics,
          completed_subtopics: completedSubtopics,
          progress_percent: progressPercent,
        };
      })
      .filter((t) => t.completed_subtopics > 0 && t.completed_subtopics < t.total_subtopics)
      .sort((a, b) => b.progress_percent - a.progress_percent);

    return inProgressTopics;
  }
}

export const topicService = new TopicService();
