/**
 * Question Service
 * Business logic for question listing, filtering, and retrieval.
 */
import { AppDataSource } from '../config/database';
import { Question } from '../models/Question';
import { TestCase } from '../models/TestCase';
import { SolvedQuestion } from '../models/SolvedQuestion';
import { cache } from '../config/redis';
import { QuestionsQueryParams } from '../types/submission.types';

export class QuestionService {
  private questionRepo = AppDataSource.getRepository(Question);
  private testCaseRepo = AppDataSource.getRepository(TestCase);
  private solvedRepo = AppDataSource.getRepository(SolvedQuestion);

  /**
   * Get paginated, filtered list of questions.
   */
  async getQuestions(params: QuestionsQueryParams, userId?: string) {
    const { page = 1, limit = 20, difficulty, topic, search } = params;
    const skip = (page - 1) * limit;

    // Check cache for non-user-specific queries
    const cacheKey = `questions:${page}:${limit}:${difficulty || ''}:${topic || ''}:${search || ''}`;
    if (!userId) {
      const cached = await cache.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const qb = this.questionRepo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.topic', 'topic')
      .orderBy('q.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (difficulty) {
      qb.andWhere('q.difficulty = :difficulty', { difficulty });
    }

    if (topic) {
      qb.andWhere('q.topic_id = :topic', { topic });
    }

    if (search) {
      qb.andWhere('LOWER(q.title) LIKE :search', { search: `%${search.toLowerCase()}%` });
    }

    const [questions, total] = await qb.getManyAndCount();

    // If user is authenticated, attach solved status
    let questionsWithStatus = questions;
    if (userId) {
      const solvedQuestions = await this.solvedRepo.find({
        where: { user_id: userId },
        select: ['question_id'],
      });
      const solvedSet = new Set(solvedQuestions.map((s) => s.question_id));

      questionsWithStatus = questions.map((q) => ({
        ...q,
        status: solvedSet.has(q.id) ? 'solved' : 'not_attempted',
      })) as any;
    }

    const result = {
      questions: questionsWithStatus,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };

    // Cache for 1 hour (non-user-specific only)
    if (!userId) {
      await cache.set(cacheKey, JSON.stringify(result), 3600);
    }

    return result;
  }

  /**
   * Get full question details by ID, including visible test cases.
   */
  async getQuestionById(questionId: string, userId?: string) {
    const question = await this.questionRepo.findOne({
      where: { id: questionId },
      relations: ['topic'],
    });

    if (!question) return null;

    // Get visible test cases only
    const testcases = await this.testCaseRepo.find({
      where: { question_id: questionId, is_hidden: false },
      order: { order_position: 'ASC' },
    });

    // Check if user has solved this question
    let userStatus = 'not_attempted';
    if (userId) {
      const solved = await this.solvedRepo.findOne({
        where: { user_id: userId, question_id: questionId },
      });
      userStatus = solved ? 'solved' : 'not_attempted';
    }

    return {
      ...question,
      testcases,
      user_status: userStatus,
    };
  }

  /**
   * Get visible test cases for a question.
   */
  async getVisibleTestCases(questionId: string) {
    return this.testCaseRepo.find({
      where: { question_id: questionId, is_hidden: false },
      order: { order_position: 'ASC' },
    });
  }

  /**
   * Get ALL test cases for a question (used during submission).
   */
  async getAllTestCases(questionId: string) {
    return this.testCaseRepo.find({
      where: { question_id: questionId },
      order: { order_position: 'ASC' },
    });
  }

  /**
   * Increment total_submissions count for a question.
   */
  async incrementSubmissions(questionId: string) {
    await this.questionRepo.increment({ id: questionId }, 'total_submissions', 1);
  }

  /**
   * Increment total_solved count and recalculate acceptance_rate.
   */
  async incrementSolved(questionId: string) {
    await this.questionRepo.increment({ id: questionId }, 'total_solved', 1);

    // Recalculate acceptance rate
    const question = await this.questionRepo.findOne({ where: { id: questionId } });
    if (question && question.total_submissions > 0) {
      const rate = (question.total_solved / question.total_submissions) * 100;
      await this.questionRepo.update(questionId, {
        acceptance_rate: Math.round(rate * 100) / 100,
      });
    }
  }
}

export const questionService = new QuestionService();
