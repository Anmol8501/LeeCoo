/**
 * Questions & Test Cases Seed Data
 * Populates the database with sample coding problems.
 * Run: npx ts-node src/seeds/questions.seed.ts
 */
import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env.local') });

import { AppDataSource } from '../config/database';
import { Question } from '../models/Question';
import { TestCase } from '../models/TestCase';
import { Topic } from '../models/Topic';

const QUESTIONS_DATA = [
  {
    title: 'Two Sum',
    difficulty: 'easy' as const,
    topic_title: 'Arrays & Hashing',
    problem_statement: `<h2>Two Sum</h2>
<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
<p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
<p>You can return the answer in any order.</p>`,
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' },
    ],
    testcases: [
      { input: '4\n2 7 11 15\n9', expected_output: '0 1', is_hidden: false, order_position: 1 },
      { input: '3\n3 2 4\n6', expected_output: '1 2', is_hidden: false, order_position: 2 },
      { input: '2\n3 3\n6', expected_output: '0 1', is_hidden: false, order_position: 3 },
      { input: '5\n1 5 3 7 2\n8', expected_output: '0 3', is_hidden: true, order_position: 4 },
      { input: '4\n-1 -2 -3 -4\n-6', expected_output: '1 3', is_hidden: true, order_position: 5 },
    ],
  },
  {
    title: 'Valid Parentheses',
    difficulty: 'easy' as const,
    topic_title: 'Stacks & Queues',
    problem_statement: `<h2>Valid Parentheses</h2>
<p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p>
<p>An input string is valid if:</p>
<ol><li>Open brackets must be closed by the same type of brackets.</li><li>Open brackets must be closed in the correct order.</li><li>Every close bracket has a corresponding open bracket of the same type.</li></ol>`,
    constraints: '1 <= s.length <= 10^4\ns consists of parentheses only: ()[]{}',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    testcases: [
      { input: '()', expected_output: 'true', is_hidden: false, order_position: 1 },
      { input: '()[]{}', expected_output: 'true', is_hidden: false, order_position: 2 },
      { input: '(]', expected_output: 'false', is_hidden: false, order_position: 3 },
      { input: '([)]', expected_output: 'false', is_hidden: true, order_position: 4 },
      { input: '{[]}', expected_output: 'true', is_hidden: true, order_position: 5 },
    ],
  },
  {
    title: 'Reverse Linked List',
    difficulty: 'easy' as const,
    topic_title: 'Linked Lists',
    problem_statement: `<h2>Reverse Linked List</h2>
<p>Given the <code>head</code> of a singly linked list, reverse the list, and return <em>the reversed list</em>.</p>`,
    constraints: 'The number of nodes in the list is in the range [0, 5000].\n-5000 <= Node.val <= 5000',
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
      { input: 'head = []', output: '[]' },
    ],
    testcases: [
      { input: '1 2 3 4 5', expected_output: '5 4 3 2 1', is_hidden: false, order_position: 1 },
      { input: '1 2', expected_output: '2 1', is_hidden: false, order_position: 2 },
      { input: '', expected_output: '', is_hidden: false, order_position: 3 },
      { input: '1', expected_output: '1', is_hidden: true, order_position: 4 },
      { input: '1 2 3 4 5 6 7 8 9 10', expected_output: '10 9 8 7 6 5 4 3 2 1', is_hidden: true, order_position: 5 },
    ],
  },
  {
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'easy' as const,
    topic_title: 'Trees & Binary Search Trees',
    problem_statement: `<h2>Maximum Depth of Binary Tree</h2>
<p>Given the <code>root</code> of a binary tree, return <em>its maximum depth</em>.</p>
<p>A binary tree's <strong>maximum depth</strong> is the number of nodes along the longest path from the root node down to the farthest leaf node.</p>`,
    constraints: 'The number of nodes in the tree is in the range [0, 10^4].\n-100 <= Node.val <= 100',
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '3' },
      { input: 'root = [1,null,2]', output: '2' },
    ],
    testcases: [
      { input: '3 9 20 null null 15 7', expected_output: '3', is_hidden: false, order_position: 1 },
      { input: '1 null 2', expected_output: '2', is_hidden: false, order_position: 2 },
      { input: '', expected_output: '0', is_hidden: true, order_position: 3 },
    ],
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium' as const,
    topic_title: 'Arrays & Hashing',
    problem_statement: `<h2>Longest Substring Without Repeating Characters</h2>
<p>Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.</p>`,
    constraints: '0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' },
    ],
    testcases: [
      { input: 'abcabcbb', expected_output: '3', is_hidden: false, order_position: 1 },
      { input: 'bbbbb', expected_output: '1', is_hidden: false, order_position: 2 },
      { input: 'pwwkew', expected_output: '3', is_hidden: false, order_position: 3 },
      { input: '', expected_output: '0', is_hidden: true, order_position: 4 },
      { input: 'abcdefg', expected_output: '7', is_hidden: true, order_position: 5 },
    ],
  },
  {
    title: 'Number of Islands',
    difficulty: 'medium' as const,
    topic_title: 'Graphs',
    problem_statement: `<h2>Number of Islands</h2>
<p>Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of <code>'1'</code>s (land) and <code>'0'</code>s (water), return <em>the number of islands</em>.</p>
<p>An <strong>island</strong> is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.</p>`,
    constraints: 'm == grid.length\nn == grid[i].length\n1 <= m, n <= 300\ngrid[i][j] is \'0\' or \'1\'.',
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' },
    ],
    testcases: [
      { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', expected_output: '1', is_hidden: false, order_position: 1 },
      { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', expected_output: '3', is_hidden: false, order_position: 2 },
      { input: '1 1\n1', expected_output: '1', is_hidden: true, order_position: 3 },
    ],
  },
  {
    title: 'Climbing Stairs',
    difficulty: 'easy' as const,
    topic_title: 'Dynamic Programming',
    problem_statement: `<h2>Climbing Stairs</h2>
<p>You are climbing a staircase. It takes <code>n</code> steps to reach the top.</p>
<p>Each time you can either climb <code>1</code> or <code>2</code> steps. In how many distinct ways can you climb to the top?</p>`,
    constraints: '1 <= n <= 45',
    examples: [
      { input: 'n = 2', output: '2', explanation: 'There are two ways: 1+1 and 2.' },
      { input: 'n = 3', output: '3', explanation: 'There are three ways: 1+1+1, 1+2, and 2+1.' },
    ],
    testcases: [
      { input: '2', expected_output: '2', is_hidden: false, order_position: 1 },
      { input: '3', expected_output: '3', is_hidden: false, order_position: 2 },
      { input: '5', expected_output: '8', is_hidden: true, order_position: 3 },
      { input: '10', expected_output: '89', is_hidden: true, order_position: 4 },
    ],
  },
  {
    title: 'Merge Intervals',
    difficulty: 'medium' as const,
    topic_title: 'Arrays & Hashing',
    problem_statement: `<h2>Merge Intervals</h2>
<p>Given an array of <code>intervals</code> where <code>intervals[i] = [start_i, end_i]</code>, merge all overlapping intervals, and return <em>an array of the non-overlapping intervals that cover all the intervals in the input</em>.</p>`,
    constraints: '1 <= intervals.length <= 10^4\nintervals[i].length == 2\n0 <= start_i <= end_i <= 10^4',
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]' },
    ],
    testcases: [
      { input: '4\n1 3\n2 6\n8 10\n15 18', expected_output: '1 6\n8 10\n15 18', is_hidden: false, order_position: 1 },
      { input: '2\n1 4\n4 5', expected_output: '1 5', is_hidden: false, order_position: 2 },
      { input: '1\n1 1', expected_output: '1 1', is_hidden: true, order_position: 3 },
    ],
  },
];

async function seedQuestions() {
  try {
    const dataSource = await AppDataSource.initialize();
    console.log('Database connected for seeding questions.');

    const questionRepo = dataSource.getRepository(Question);
    const testCaseRepo = dataSource.getRepository(TestCase);
    const topicRepo = dataSource.getRepository(Topic);

    for (const qData of QUESTIONS_DATA) {
      // Find the topic
      const topic = await topicRepo.findOne({
        where: { title: qData.topic_title, language: 'javascript' },
      });

      // Check if question already exists
      let question = await questionRepo.findOne({
        where: { title: qData.title },
      });

      if (!question) {
        question = questionRepo.create({
          title: qData.title,
          difficulty: qData.difficulty,
          problem_statement: qData.problem_statement,
          constraints: qData.constraints,
          examples: qData.examples,
          topic_id: topic?.id || null,
          acceptance_rate: Math.round(Math.random() * 30 + 40), // 40-70%
        });
        question = await questionRepo.save(question);
        console.log(`  ✓ Created question: ${question.title} (${question.difficulty})`);
      } else {
        console.log(`  → Question already exists: ${question.title}`);
      }

      // Seed test cases
      for (const tcData of qData.testcases) {
        const existing = await testCaseRepo.findOne({
          where: {
            question_id: question.id,
            order_position: tcData.order_position,
          },
        });

        if (!existing) {
          const testCase = testCaseRepo.create({
            question_id: question.id,
            input: tcData.input,
            expected_output: tcData.expected_output,
            is_hidden: tcData.is_hidden,
            order_position: tcData.order_position,
          });
          await testCaseRepo.save(testCase);
          console.log(`    ✓ Test case #${tcData.order_position} (${tcData.is_hidden ? 'hidden' : 'visible'})`);
        }
      }
    }

    console.log('\n✅ Questions seed completed successfully!');
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seedQuestions();
