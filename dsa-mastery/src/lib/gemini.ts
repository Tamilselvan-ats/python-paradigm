// Gemini AI client utility for the frontend
// This handles API calls to our Express backend or directly to Gemini

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export interface AIResponse {
  success: boolean;
  data?: string;
  error?: string;
}

// Helper to make AI API calls through our Express backend
async function callAI(endpoint: string, body: Record<string, unknown>): Promise<AIResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    // If backend is not available, try direct Gemini API call
    return { success: false, error: 'Backend server not available. Please start the server.' };
  }
}

// Direct Gemini API call (when backend is not available)
export async function callGeminiDirect(
  prompt: string,
  apiKey: string,
  systemPrompt?: string
): Promise<AIResponse> {
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash'];

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemPrompt ? `${systemPrompt}\n\nUser: ${prompt}` : prompt },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8192,
            },
          }),
        }
      );

      if (!response.ok) continue;

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        return { success: true, data: text };
      }
    } catch {
      continue;
    }
  }

  return { success: false, error: 'All Gemini models failed. Please check your API key.' };
}

// ─── AI Feature Functions ──────────────────────────────────

export async function chatWithTutor(message: string, apiKey: string, context?: string): Promise<AIResponse> {
  if (!apiKey) return { success: false, error: 'Please set your Gemini API key in Settings.' };

  const systemPrompt = `You are DSA Mastery AI Tutor — an expert computer science professor specializing in Data Structures and Algorithms. 
You teach with patience, clarity, and enthusiasm. 
Use C programming language for code examples.
Format responses with markdown: use headers, bullet points, code blocks, and bold text.
Include visual ASCII diagrams where helpful.
${context ? `Context: The student is currently studying: ${context}` : ''}`;

  return callGeminiDirect(message, apiKey, systemPrompt);
}

export async function explainTopic(topic: string, level: string, apiKey: string): Promise<AIResponse> {
  if (!apiKey) return { success: false, error: 'Please set your Gemini API key in Settings.' };

  const levelPrompts: Record<string, string> = {
    beginner: 'Explain like I\'m a complete beginner. Use simple analogies, real-world examples, and avoid jargon. Make it fun and engaging.',
    college: 'Explain at a college/university level. Include formal definitions, proofs where relevant, mathematical analysis, and implementation details in C.',
    interview: 'Explain from a technical interview perspective. Cover what interviewers look for, common follow-up questions, edge cases, and optimization approaches.',
  };

  const systemPrompt = `You are a DSA expert. ${levelPrompts[level] || levelPrompts.college}
Format with markdown. Include code examples in C. Include time/space complexity analysis.`;

  return callGeminiDirect(`Explain: ${topic}`, apiKey, systemPrompt);
}

export async function generateExamQuestions(topic: string, marks: number, count: number, apiKey: string): Promise<AIResponse> {
  if (!apiKey) return { success: false, error: 'Please set your Gemini API key in Settings.' };

  const systemPrompt = `You are an SRM University exam paper setter for Data Structures course.
Generate ${count} questions worth ${marks} marks each on the topic: "${topic}".
For each question provide:
1. The question
2. A model answer appropriate for the marks allocated
3. Key points the examiner looks for
Format with markdown.`;

  return callGeminiDirect(`Generate ${marks}-mark exam questions on: ${topic}`, apiKey, systemPrompt);
}

export async function conductMockInterview(topic: string, difficulty: string, apiKey: string): Promise<AIResponse> {
  if (!apiKey) return { success: false, error: 'Please set your Gemini API key in Settings.' };

  const systemPrompt = `You are a FAANG technical interviewer conducting a DSA interview.
Difficulty: ${difficulty}
Topic: ${topic}
Ask one interview question, then provide:
1. What you're looking for in the answer
2. The optimal solution approach
3. Follow-up questions you might ask
4. Common mistakes candidates make
Format with markdown and include C code.`;

  return callGeminiDirect(`Mock interview on: ${topic}`, apiKey, systemPrompt);
}

export async function debugCode(code: string, error: string, apiKey: string): Promise<AIResponse> {
  if (!apiKey) return { success: false, error: 'Please set your Gemini API key in Settings.' };

  const systemPrompt = `You are a patient debugging assistant for C programming and DSA.
Don't give the answer directly. Instead:
1. Identify the bug(s)
2. Explain WHY the bug occurs
3. Give a hint about how to fix it
4. If asked again, provide the fix
Be encouraging and educational.`;

  return callGeminiDirect(
    `Debug this code:\n\`\`\`c\n${code}\n\`\`\`\n${error ? `Error: ${error}` : ''}`,
    apiKey,
    systemPrompt
  );
}

export async function analyzeComplexity(code: string, apiKey: string): Promise<AIResponse> {
  if (!apiKey) return { success: false, error: 'Please set your Gemini API key in Settings.' };

  const systemPrompt = `You are a complexity analysis expert. Analyze the given code and provide:
1. Time Complexity (Best, Average, Worst case) with Big O notation
2. Space Complexity (Auxiliary + Total)
3. Line-by-line breakdown of how you determined the complexity
4. Whether the solution is optimal
5. Suggestions for optimization if possible
Use clear mathematical notation and explain your reasoning.`;

  return callGeminiDirect(
    `Analyze the complexity of:\n\`\`\`c\n${code}\n\`\`\``,
    apiKey,
    systemPrompt
  );
}

export async function reviewCode(code: string, apiKey: string): Promise<AIResponse> {
  if (!apiKey) return { success: false, error: 'Please set your Gemini API key in Settings.' };

  const systemPrompt = `You are a senior software engineer reviewing C code for DSA assignments.
Provide:
1. Overall Rating (1-10)
2. Correctness: Does it work? Edge cases?
3. Code Style: Naming, formatting, readability
4. Efficiency: Time/space complexity, optimizations
5. Best Practices: Memory management, error handling
6. Specific line-by-line suggestions
Be constructive and educational.`;

  return callGeminiDirect(
    `Review this code:\n\`\`\`c\n${code}\n\`\`\``,
    apiKey,
    systemPrompt
  );
}

export async function getHints(problem: string, currentCode: string, hintLevel: number, apiKey: string): Promise<AIResponse> {
  if (!apiKey) return { success: false, error: 'Please set your Gemini API key in Settings.' };

  const hintPrompts: Record<number, string> = {
    1: 'Give a VAGUE hint - just point in the right direction without revealing the approach.',
    2: 'Give a SPECIFIC hint - mention the data structure or technique to use, but don\'t give the algorithm.',
    3: 'Give a DETAILED hint - walk through the approach step by step, but let the student write the code.',
  };

  const systemPrompt = `You are a helpful DSA tutor giving hints for a problem.
${hintPrompts[hintLevel] || hintPrompts[1]}
Never give the complete solution directly.`;

  return callGeminiDirect(
    `Problem: ${problem}\n${currentCode ? `Student's current code:\n\`\`\`c\n${currentCode}\n\`\`\`` : ''}`,
    apiKey,
    systemPrompt
  );
}

export async function generateStudyPlan(
  weakAreas: string[],
  strongAreas: string[],
  daysUntilExam: number,
  apiKey: string
): Promise<AIResponse> {
  if (!apiKey) return { success: false, error: 'Please set your Gemini API key in Settings.' };

  const systemPrompt = `You are a personalized DSA study planner. Create a detailed study plan.
Consider the student's strengths and weaknesses.
Include specific topics, practice problems, and time allocations.
Format as a day-by-day schedule with checkboxes.`;

  return callGeminiDirect(
    `Create a ${daysUntilExam}-day study plan.
Weak areas: ${weakAreas.join(', ')}
Strong areas: ${strongAreas.join(', ')}`,
    apiKey,
    systemPrompt
  );
}

export async function generateAlgorithm(problem: string, apiKey: string): Promise<AIResponse> {
  if (!apiKey) return { success: false, error: 'Please set your Gemini API key in Settings.' };

  const systemPrompt = `You are an algorithm design expert. Generate a step-by-step algorithm for the given problem.
Include:
1. Problem understanding
2. Approach / Strategy
3. Step-by-step algorithm in pseudocode
4. Complete C implementation
5. Time and Space complexity
6. Dry run with a small example
Format with markdown.`;

  return callGeminiDirect(`Generate algorithm for: ${problem}`, apiKey, systemPrompt);
}
