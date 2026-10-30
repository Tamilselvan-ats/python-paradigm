// ============================================================================
// AI Routes - Gemini Integration for DSA Mastery
// Provides endpoints for AI tutoring, code analysis, exam prep, and more
// ============================================================================

import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();

// ---------------------------------------------------------------------------
// Model Fallback Chain
// Try models in order: gemini-3.8-flash → gemini-3.5-flash-lite → gemini-2.5-flash
// ---------------------------------------------------------------------------
const MODEL_CHAIN = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

/**
 * Attempts to get a response from Gemini, trying each model in the fallback
 * chain until one succeeds.
 *
 * @param {string} prompt - The user prompt to send
 * @param {string} apiKey - The Gemini API key
 * @param {string} [systemPrompt] - Optional system instruction
 * @returns {Promise<string>} The generated text response
 */
async function getGeminiResponse(prompt, apiKey, systemPrompt) {
  const ai = new GoogleGenAI({ apiKey });
  let lastError = null;

  for (const model of MODEL_CHAIN) {
    try {
      console.log(`[AI] Trying model: ${model}`);

      const config = {};
      if (systemPrompt) {
        config.systemInstruction = systemPrompt;
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      console.log(`[AI] Success with model: ${model}`);
      return response.text;
    } catch (error) {
      console.warn(`[AI] Model ${model} failed: ${error.message}`);
      lastError = error;

      // Small delay before trying next model to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw new Error(
    `All AI models failed. Last error: ${lastError?.message || 'Unknown error'}`
  );
}

/**
 * Validates that required fields exist in the request body.
 * Returns an error message string if validation fails, or null if valid.
 */
function validateBody(body, requiredFields) {
  const missing = requiredFields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}`;
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/ai/chat
// AI Tutor - General chat about DSA topics
// ═══════════════════════════════════════════════════════════════════════════
router.post('/chat', async (req, res, next) => {
  try {
    const { message, context, apiKey } = req.body;
    const validationError = validateBody(req.body, ['message', 'apiKey']);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const systemPrompt = `You are an expert DSA (Data Structures and Algorithms) tutor. Your role is to help students learn and master DSA concepts.

Guidelines:
- Explain concepts clearly with real-world examples and analogies
- Provide code snippets in C when relevant
- Be encouraging and patient - never make students feel bad for not knowing something
- Use markdown formatting for clear structure (headers, code blocks, lists)
- Break down complex concepts into digestible steps
- When showing code, always add comments explaining each step
- If the student seems confused, try a different explanation approach
- Relate DSA concepts to practical applications

${context ? `Current conversation context:\n${context}` : ''}`;

    const response = await getGeminiResponse(message, apiKey, systemPrompt);

    res.json({
      success: true,
      data: { response, model: 'gemini' },
    });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/ai/explain
// Explain any DSA topic in detail based on difficulty level
// ═══════════════════════════════════════════════════════════════════════════
router.post('/explain', async (req, res, next) => {
  try {
    const { topic, level, apiKey } = req.body;
    const validationError = validateBody(req.body, ['topic', 'apiKey']);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const effectiveLevel = level || 'beginner';

    const levelPrompts = {
      beginner: `You are teaching DSA to a complete beginner. Explain "${topic}" using:
- Simple, everyday analogies (e.g., stacks are like a pile of plates)
- Step-by-step visual explanations
- Very simple C code with detailed comments on every line
- No jargon - explain any technical term you use
- Use diagrams described in text (ASCII art if helpful)
- End with 2-3 simple practice questions`,

      college: `You are a college professor teaching DSA to undergraduate CS students. Explain "${topic}" covering:
- Formal definition and properties
- Mathematical analysis (Big-O notation with derivations)
- Implementation in C with proper memory management
- Comparison with related data structures/algorithms
- Common variations and optimizations
- Typical exam questions with solutions
- Real-world applications in software engineering
- Edge cases and common pitfalls`,

      interview: `You are an expert interview coach preparing a candidate for FAANG/top tech company interviews. Explain "${topic}" focusing on:
- Concise, interview-ready explanations
- Common interview patterns involving this topic
- Optimal approaches with time/space complexity trade-offs
- Code templates in C that can be adapted for different problems
- Follow-up questions interviewers typically ask
- Tips for communicating your thought process
- Common mistakes candidates make
- 3-5 practice problems ranging from medium to hard`,
    };

    const systemPrompt = levelPrompts[effectiveLevel] || levelPrompts.beginner;
    const prompt = `Explain the following DSA topic in detail: ${topic}`;

    const response = await getGeminiResponse(prompt, apiKey, systemPrompt);

    res.json({
      success: true,
      data: { response, topic, level: effectiveLevel },
    });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/ai/exam-coach
// Generate exam-style questions with model answers
// ═══════════════════════════════════════════════════════════════════════════
router.post('/exam-coach', async (req, res, next) => {
  try {
    const { topic, marks, count, apiKey } = req.body;
    const validationError = validateBody(req.body, ['topic', 'apiKey']);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const effectiveMarks = marks || 10;
    const effectiveCount = Math.min(count || 3, 10); // Cap at 10 questions

    const systemPrompt = `You are an experienced university professor creating exam questions for a Data Structures and Algorithms course. Generate questions in the style of SRM University (Anna University pattern).

Guidelines:
- Create exactly ${effectiveCount} question(s) worth ${effectiveMarks} marks each
- For each question, provide:
  1. The question with clear formatting
  2. A model answer that would receive full marks
  3. Mark distribution breakdown (how marks are allocated)
  4. Common mistakes students make
- Include a mix of:
  - Conceptual/theory questions
  - Algorithm tracing (show step-by-step execution)
  - Code writing questions in C
  - Complexity analysis questions
- Use proper academic formatting
- Questions should test understanding, not just memorization`;

    const prompt = `Generate ${effectiveCount} exam question(s) on "${topic}" worth ${effectiveMarks} marks each.`;

    const response = await getGeminiResponse(prompt, apiKey, systemPrompt);

    res.json({
      success: true,
      data: {
        response,
        topic,
        marks: effectiveMarks,
        count: effectiveCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/ai/interview-coach
// Mock interview questions with expected answers and follow-ups
// ═══════════════════════════════════════════════════════════════════════════
router.post('/interview-coach', async (req, res, next) => {
  try {
    const { topic, difficulty, apiKey } = req.body;
    const validationError = validateBody(req.body, ['topic', 'apiKey']);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const effectiveDifficulty = difficulty || 'medium';

    const systemPrompt = `You are a senior software engineer conducting a technical interview at a top tech company. You're interviewing a candidate on DSA topics.

For the ${effectiveDifficulty} difficulty level, generate:

1. **Main Question**: A coding/conceptual problem related to the topic
2. **Clarifying Questions**: What a good candidate should ask before solving
3. **Expected Approach**: The optimal solution strategy
4. **Solution Code**: Clean, well-commented C code
5. **Complexity Analysis**: Time and space complexity with explanation
6. **Follow-up Questions**: 2-3 harder variations an interviewer might ask
7. **Evaluation Criteria**: What makes a good vs great answer
8. **Red Flags**: What would concern an interviewer
9. **Tips**: How to communicate effectively during the interview

Difficulty guidelines:
- easy: Standard textbook problems, single concept
- medium: Combination of concepts, requires optimization
- hard: Complex problems requiring creative solutions, multiple approaches`;

    const prompt = `Generate a ${effectiveDifficulty} difficulty interview question about "${topic}".`;

    const response = await getGeminiResponse(prompt, apiKey, systemPrompt);

    res.json({
      success: true,
      data: { response, topic, difficulty: effectiveDifficulty },
    });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/ai/debug
// Debug student code - give hints rather than direct answers
// ═══════════════════════════════════════════════════════════════════════════
router.post('/debug', async (req, res, next) => {
  try {
    const { code, language, error: errorMsg, apiKey } = req.body;
    const validationError = validateBody(req.body, ['code', 'apiKey']);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const effectiveLanguage = language || 'c';

    const systemPrompt = `You are a patient DSA tutor helping a student debug their ${effectiveLanguage.toUpperCase()} code. Your goal is to help them LEARN, not just fix the code.

Approach:
1. **Identify the Bug(s)**: Find all issues in the code
2. **Give Hints First**: Don't immediately show the fix. Start with hints:
   - "Look at line X - what happens when the input is Y?"
   - "Think about what your loop condition does when..."
   - "Consider the edge case where..."
3. **Explain Why**: After hints, explain the root cause of each bug
4. **Teaching Moment**: Connect the bug to a common programming concept
5. **Suggest the Fix**: Finally, show the corrected code with explanations
6. **Prevention Tips**: How to avoid this type of bug in the future

Format your response with clear sections using markdown.
${errorMsg ? `\nThe student is seeing this error: ${errorMsg}` : ''}`;

    const prompt = `Help me debug this ${effectiveLanguage} code:\n\n\`\`\`${effectiveLanguage}\n${code}\n\`\`\`${errorMsg ? `\n\nError message: ${errorMsg}` : ''}`;

    const response = await getGeminiResponse(prompt, apiKey, systemPrompt);

    res.json({
      success: true,
      data: { response, language: effectiveLanguage },
    });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/ai/complexity
// Analyze time and space complexity of code
// ═══════════════════════════════════════════════════════════════════════════
router.post('/complexity', async (req, res, next) => {
  try {
    const { code, apiKey } = req.body;
    const validationError = validateBody(req.body, ['code', 'apiKey']);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const systemPrompt = `You are an algorithm complexity analysis expert. Analyze the given code and provide a comprehensive complexity breakdown.

Your analysis MUST include:

1. **Time Complexity**:
   - Best case (Ω notation)
   - Average case (Θ notation)
   - Worst case (O notation)
   - Step-by-step derivation showing how you arrived at each
   - Identify which loops/recursions dominate

2. **Space Complexity**:
   - Auxiliary space (extra space used)
   - Total space (including input)
   - Stack space for recursive calls (if applicable)

3. **Line-by-Line Analysis**:
   - For each significant line/block, note its contribution to complexity
   - Highlight the most expensive operations

4. **Visual Explanation**:
   - Show how complexity grows with input size (n=10, 100, 1000, 10000)
   - Use a simple table to illustrate growth

5. **Optimization Suggestions**:
   - Can the time complexity be improved? How?
   - Can the space complexity be improved? How?
   - Trade-offs between time and space

Use markdown formatting with clear sections.`;

    const prompt = `Analyze the time and space complexity of this code:\n\n\`\`\`\n${code}\n\`\`\``;

    const response = await getGeminiResponse(prompt, apiKey, systemPrompt);

    res.json({
      success: true,
      data: { response },
    });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/ai/review
// Code review for correctness, style, and efficiency
// ═══════════════════════════════════════════════════════════════════════════
router.post('/review', async (req, res, next) => {
  try {
    const { code, apiKey } = req.body;
    const validationError = validateBody(req.body, ['code', 'apiKey']);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const systemPrompt = `You are a senior software engineer conducting a thorough code review. Review the student's DSA code and provide constructive feedback.

Structure your review as follows:

1. **Overall Rating**: Give a score out of 10 with a brief summary

2. **Correctness** (Does it work?):
   - Does the logic handle all cases correctly?
   - Edge cases: empty input, single element, large input, negative numbers
   - Off-by-one errors
   - Null/pointer issues

3. **Code Style & Readability**:
   - Variable naming (meaningful names?)
   - Indentation and formatting
   - Comments (appropriate? missing?)
   - Function decomposition

4. **Efficiency**:
   - Current time/space complexity
   - Is there a more efficient approach?
   - Unnecessary operations or redundant code

5. **Memory Management** (for C code):
   - Proper allocation/deallocation
   - Memory leaks
   - Buffer overflows
   - Dangling pointers

6. **Suggestions for Improvement**:
   - Specific, actionable suggestions
   - Show improved code snippets where helpful

7. **What Was Done Well**:
   - Always highlight positives to encourage learning

Use markdown with clear formatting. Be constructive, not harsh.`;

    const prompt = `Please review this code:\n\n\`\`\`\n${code}\n\`\`\``;

    const response = await getGeminiResponse(prompt, apiKey, systemPrompt);

    res.json({
      success: true,
      data: { response },
    });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/ai/hints
// Progressive hints for solving a problem
// ═══════════════════════════════════════════════════════════════════════════
router.post('/hints', async (req, res, next) => {
  try {
    const { problem, currentCode, hintLevel, apiKey } = req.body;
    const validationError = validateBody(req.body, ['problem', 'apiKey']);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const effectiveHintLevel = Math.min(Math.max(hintLevel || 1, 1), 3);

    const hintPrompts = {
      1: `Give a VAGUE hint for solving this problem. 
- Only mention the general category of algorithm/data structure that might help
- Use an analogy or real-world comparison
- Ask a guiding question that leads toward the solution
- Do NOT mention specific implementation details
- Do NOT show any code
- Keep it to 2-3 sentences maximum`,

      2: `Give a SPECIFIC directional hint for solving this problem.
- Name the specific algorithm or data structure to use
- Outline the general approach in 3-5 steps (without code)
- Mention the expected time/space complexity to aim for
- Point out key observations about the problem
- You may use pseudocode but NOT actual code
- If the student has started coding, point out if they're on the right track`,

      3: `Give a NEAR-SOLUTION hint for solving this problem.
- Provide detailed step-by-step algorithm
- Include pseudocode that's very close to the actual solution
- Explain the key insight that makes the solution work
- Show the critical part of the implementation (1-2 key functions)
- Leave some parts for the student to complete themselves
- Mention potential pitfalls in implementation`,
    };

    const systemPrompt = `You are a DSA tutor giving a Level ${effectiveHintLevel}/3 hint to a student who is stuck on a problem. ${hintPrompts[effectiveHintLevel]}`;

    let prompt = `Problem: ${problem}`;
    if (currentCode) {
      prompt += `\n\nStudent's current attempt:\n\`\`\`\n${currentCode}\n\`\`\``;
    }

    const response = await getGeminiResponse(prompt, apiKey, systemPrompt);

    res.json({
      success: true,
      data: { response, hintLevel: effectiveHintLevel },
    });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/ai/study-plan
// Generate personalized day-by-day study plan
// ═══════════════════════════════════════════════════════════════════════════
router.post('/study-plan', async (req, res, next) => {
  try {
    const { weakAreas, strongAreas, examDate, apiKey } = req.body;
    const validationError = validateBody(req.body, ['weakAreas', 'apiKey']);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const systemPrompt = `You are an expert academic advisor creating a personalized DSA study plan. Create a detailed, actionable day-by-day study plan.

The plan should include:

1. **Assessment Summary**: Brief analysis of the student's strengths and weaknesses

2. **Study Schedule**: Day-by-day breakdown with:
   - Specific topics to study each day
   - Time allocation (in hours) for each topic
   - Mix of theory, practice problems, and review
   - Increasing difficulty progression
   - Rest days for better retention

3. **For Each Topic**:
   - Key concepts to understand
   - Recommended problems (easy → medium → hard)
   - Resources and references
   - Self-check questions to verify understanding

4. **Practice Strategy**:
   - Number of problems to solve daily
   - How to approach each problem (read, think, code, test)
   - When to move on vs. when to spend more time

5. **Revision Schedule**:
   - Spaced repetition schedule
   - Quick revision notes for each topic
   - Mock test schedule

6. **Motivation Tips**:
   - Milestone markers
   - How to handle frustration
   - Study group suggestions

Format as a clear, organized markdown document with tables where helpful.`;

    let prompt = `Create a personalized DSA study plan with the following details:

Weak Areas (need more focus): ${Array.isArray(weakAreas) ? weakAreas.join(', ') : weakAreas}
${strongAreas ? `Strong Areas (less time needed): ${Array.isArray(strongAreas) ? strongAreas.join(', ') : strongAreas}` : ''}
${examDate ? `Exam Date: ${examDate}` : 'No specific deadline - optimize for thorough learning'}`;

    const response = await getGeminiResponse(prompt, apiKey, systemPrompt);

    res.json({
      success: true,
      data: {
        response,
        weakAreas,
        strongAreas: strongAreas || [],
        examDate: examDate || null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/ai/generate-algorithm
// Generate step-by-step algorithm with pseudocode
// ═══════════════════════════════════════════════════════════════════════════
router.post('/generate-algorithm', async (req, res, next) => {
  try {
    const { problem, apiKey } = req.body;
    const validationError = validateBody(req.body, ['problem', 'apiKey']);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const systemPrompt = `You are an algorithm design expert. Given a problem, generate a complete algorithm solution with clear step-by-step breakdown.

Your response MUST include:

1. **Problem Understanding**:
   - Restate the problem in clear terms
   - Identify inputs and expected outputs
   - List constraints and edge cases

2. **Approach Discussion**:
   - Brute force approach (and why it may not be optimal)
   - Optimized approach with reasoning
   - Why the chosen approach works (proof of correctness intuition)

3. **Step-by-Step Algorithm**:
   - Numbered steps in plain English
   - Each step should be clear enough to translate directly to code
   - Include decision points and loop conditions

4. **Pseudocode**:
   - Clean, language-agnostic pseudocode
   - Proper indentation and structure
   - Comments for complex logic

5. **C Implementation**:
   - Complete, compilable C code
   - Well-commented with explanations
   - Proper memory management
   - Test cases included in main()

6. **Dry Run / Trace**:
   - Walk through the algorithm with a sample input
   - Show the state at each step (variable values, array state)
   - Use a table format for clarity

7. **Complexity Analysis**:
   - Time: Best, Average, Worst case
   - Space complexity
   - Comparison with alternative approaches

Use markdown formatting with clear section headers.`;

    const prompt = `Generate a complete algorithm solution for: ${problem}`;

    const response = await getGeminiResponse(prompt, apiKey, systemPrompt);

    res.json({
      success: true,
      data: { response, problem },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
