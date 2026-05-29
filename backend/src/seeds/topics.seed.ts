/**
 * Topics & Subtopics Seed Data
 * Populates the database with DSA learning topics and subtopics.
 * Run: npx ts-node src/seeds/topics.seed.ts
 */
import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env.local') });

import { AppDataSource } from '../config/database';
import { Topic } from '../models/Topic';
import { Subtopic } from '../models/Subtopic';

const TOPICS_DATA = [
  {
    language: 'javascript',
    title: 'Arrays & Hashing',
    description: 'Master array manipulation, hashing techniques, and common patterns like two-pointer and sliding window.',
    difficulty_level: 'beginner' as const,
    subtopics: [
      {
        title: 'Introduction to Arrays',
        notes: '<h3>What are Arrays?</h3><p>Arrays are ordered collections of elements stored in contiguous memory locations. They provide O(1) access by index and are the most fundamental data structure.</p><h4>Key Operations:</h4><ul><li><strong>Access</strong>: O(1)</li><li><strong>Search</strong>: O(n)</li><li><strong>Insert</strong>: O(n)</li><li><strong>Delete</strong>: O(n)</li></ul>',
        youtube_link: 'https://www.youtube.com/watch?v=QJNwK2uJyGs',
        order_position: 1,
      },
      {
        title: 'Two Pointer Technique',
        notes: '<h3>Two Pointer Approach</h3><p>Use two pointers moving inward from both ends, or at different speeds, to solve problems in O(n) instead of O(n²).</p><p><strong>Classic problems:</strong> Two Sum (sorted), Container With Most Water, 3Sum.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=-gjxg6Pln50',
        order_position: 2,
      },
      {
        title: 'Hash Maps & Hash Sets',
        notes: '<h3>Hashing</h3><p>Hash tables provide O(1) average-case lookup, insert, and delete. Essential for frequency counting, duplicate detection, and two-sum style problems.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=jalSiaIi8j4',
        order_position: 3,
      },
      {
        title: 'Sliding Window',
        notes: '<h3>Sliding Window Pattern</h3><p>Maintain a window of elements as you iterate. Useful for substring, subarray, and optimization problems.</p><p><strong>Key variants:</strong> Fixed-size window, variable-size window, shrinkable window.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=GcW4mgmgSbw',
        order_position: 4,
      },
    ],
  },
  {
    language: 'javascript',
    title: 'Linked Lists',
    description: 'Learn singly and doubly linked list operations, reversal, cycle detection, and merge techniques.',
    difficulty_level: 'beginner' as const,
    subtopics: [
      {
        title: 'Singly Linked List Basics',
        notes: '<h3>Singly Linked List</h3><p>A linear data structure where each node contains data and a pointer to the next node. Unlike arrays, linked lists do not need contiguous memory.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=N6dOwBde7-M',
        order_position: 1,
      },
      {
        title: 'Reversing a Linked List',
        notes: '<h3>Reversal Techniques</h3><p>The most common linked list operation. Can be done iteratively (3 pointers) or recursively. Foundation for many advanced problems.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=G0_I-ZF0S38',
        order_position: 2,
      },
      {
        title: 'Cycle Detection (Floyd\'s Algorithm)',
        notes: '<h3>Floyd\'s Tortoise and Hare</h3><p>Use slow and fast pointers to detect cycles in O(n) time and O(1) space. Also used to find the start of the cycle.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=gBTe7lFR3vc',
        order_position: 3,
      },
    ],
  },
  {
    language: 'javascript',
    title: 'Stacks & Queues',
    description: 'Understand LIFO and FIFO data structures, monotonic stacks, and BFS patterns.',
    difficulty_level: 'beginner' as const,
    subtopics: [
      {
        title: 'Stack Fundamentals',
        notes: '<h3>Stacks (LIFO)</h3><p>Last In, First Out. Used for parentheses matching, expression evaluation, and backtracking algorithms like DFS.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=KInG04mAjO0',
        order_position: 1,
      },
      {
        title: 'Queue & Deque',
        notes: '<h3>Queues (FIFO)</h3><p>First In, First Out. Essential for BFS, level-order traversal, and scheduling problems. Deque supports both ends.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=D6gu-_tmEpQ',
        order_position: 2,
      },
      {
        title: 'Monotonic Stack',
        notes: '<h3>Monotonic Stack</h3><p>A stack that maintains elements in increasing or decreasing order. Solves "next greater element" and histogram problems in O(n).</p>',
        youtube_link: 'https://www.youtube.com/watch?v=Dq_ObZwTY_Q',
        order_position: 3,
      },
    ],
  },
  {
    language: 'javascript',
    title: 'Trees & Binary Search Trees',
    description: 'Tree traversals, BST operations, balanced trees, and common tree algorithms.',
    difficulty_level: 'intermediate' as const,
    subtopics: [
      {
        title: 'Binary Tree Traversals',
        notes: '<h3>Tree Traversals</h3><p>Three fundamental traversals: Inorder (Left-Root-Right), Preorder (Root-Left-Right), Postorder (Left-Right-Root). Can be done recursively or iteratively.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=WLvU5EQVZqY',
        order_position: 1,
      },
      {
        title: 'Binary Search Tree (BST)',
        notes: '<h3>BST Properties</h3><p>Left subtree values < root < right subtree values. Enables O(log n) search, insert, and delete in balanced trees.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=cySVml6e_Fc',
        order_position: 2,
      },
      {
        title: 'Level Order Traversal (BFS)',
        notes: '<h3>BFS on Trees</h3><p>Process nodes level by level using a queue. Essential for finding minimum depth, right-side view, and zigzag traversal.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=6ZnyEApgFYg',
        order_position: 3,
      },
      {
        title: 'Tree DFS Patterns',
        notes: '<h3>DFS on Trees</h3><p>Path sum problems, diameter of tree, maximum depth, and subtree checks all use recursive DFS patterns.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=bkxqA8Rfv04',
        order_position: 4,
      },
    ],
  },
  {
    language: 'javascript',
    title: 'Graphs',
    description: 'Graph representations, BFS, DFS, topological sort, shortest paths, and connected components.',
    difficulty_level: 'intermediate' as const,
    subtopics: [
      {
        title: 'Graph Representations',
        notes: '<h3>Adjacency List vs Matrix</h3><p>Adjacency list is preferred for sparse graphs (most real-world). Matrix is better for dense graphs or when checking edge existence frequently.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=pcKY4hjDrxk',
        order_position: 1,
      },
      {
        title: 'BFS & DFS on Graphs',
        notes: '<h3>Graph Traversals</h3><p>BFS finds shortest path in unweighted graphs. DFS is used for cycle detection, topological sort, and connected components.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=tWVWeAqZ0WU',
        order_position: 2,
      },
      {
        title: 'Topological Sort',
        notes: '<h3>Topological Ordering</h3><p>Linear ordering of vertices in a DAG such that for every edge u→v, u comes before v. Used in task scheduling and dependency resolution.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=eL-KzMXSXXI',
        order_position: 3,
      },
    ],
  },
  {
    language: 'javascript',
    title: 'Dynamic Programming',
    description: 'DP fundamentals, memoization vs tabulation, classic DP patterns, and optimization techniques.',
    difficulty_level: 'advanced' as const,
    subtopics: [
      {
        title: 'DP Fundamentals',
        notes: '<h3>What is Dynamic Programming?</h3><p>Technique to solve problems by breaking them into overlapping subproblems. Two approaches: Top-down (memoization) and Bottom-up (tabulation).</p>',
        youtube_link: 'https://www.youtube.com/watch?v=oBt53YbR9Kk',
        order_position: 1,
      },
      {
        title: '1D Dynamic Programming',
        notes: '<h3>Classic 1D DP</h3><p>Problems like Climbing Stairs, House Robber, and Fibonacci follow a pattern where each state depends on previous states.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=Y0lT9Fck7qI',
        order_position: 2,
      },
      {
        title: '2D Dynamic Programming',
        notes: '<h3>Grid & String DP</h3><p>Unique Paths, Longest Common Subsequence, Edit Distance. Build a 2D table where each cell depends on adjacent cells.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=Ua0GhsJSlWM',
        order_position: 3,
      },
      {
        title: 'Knapsack Patterns',
        notes: '<h3>0/1 Knapsack</h3><p>Classic optimization problem. Variations include unbounded knapsack, subset sum, and partition equal subset. Foundation for many interview problems.</p>',
        youtube_link: 'https://www.youtube.com/watch?v=8LusJS5-AGo',
        order_position: 4,
      },
    ],
  },
];

async function seedTopics() {
  try {
    const dataSource = await AppDataSource.initialize();
    console.log('Database connected for seeding.');

    const topicRepo = dataSource.getRepository(Topic);
    const subtopicRepo = dataSource.getRepository(Subtopic);

    for (const topicData of TOPICS_DATA) {
      // Check if topic already exists
      let topic = await topicRepo.findOne({
        where: { language: topicData.language, title: topicData.title },
      });

      if (!topic) {
        topic = topicRepo.create({
          language: topicData.language,
          title: topicData.title,
          description: topicData.description,
          difficulty_level: topicData.difficulty_level,
        });
        topic = await topicRepo.save(topic);
        console.log(`  ✓ Created topic: ${topic.title}`);
      } else {
        console.log(`  → Topic already exists: ${topic.title}`);
      }

      // Seed subtopics
      for (const subData of topicData.subtopics) {
        const existing = await subtopicRepo.findOne({
          where: { topic_id: topic.id, title: subData.title },
        });

        if (!existing) {
          const subtopic = subtopicRepo.create({
            topic_id: topic.id,
            title: subData.title,
            notes: subData.notes,
            youtube_link: subData.youtube_link,
            order_position: subData.order_position,
          });
          await subtopicRepo.save(subtopic);
          console.log(`    ✓ Created subtopic: ${subData.title}`);
        } else {
          console.log(`    → Subtopic already exists: ${subData.title}`);
        }
      }
    }

    console.log('\n✅ Topics seed completed successfully!');
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seedTopics();
