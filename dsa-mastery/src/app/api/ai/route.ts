// ============================================================================
// Secure Server-Side Gemini AI Route Handler
// Provides rate-limited, resilient AI features with model fallback
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// ── Rate Limiting (In-Memory Sliding Window) ──────────────────────────────────
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.count++;
  return false;
}

// ── Fallback Model Chain ──────────────────────────────────────────────────────
const MODEL_CHAIN = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

async function callGeminiWithFallback(
  prompt: string,
  systemPrompt: string,
  apiKey: string
): Promise<string> {
  let lastError: Error | null = null;

  for (const model of MODEL_CHAIN) {
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
                  { text: systemPrompt ? `${systemPrompt}\n\nUser Request:\n${prompt}` : prompt },
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        return text;
      }
    } catch (err: any) {
      console.warn(`[AI Route] Model ${model} failed: ${err.message}`);
      lastError = err;
      // Brief pause before trying next fallback model
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  throw new Error(lastError?.message || 'All AI model fallbacks exhausted.');
}

// ── Feature Prompt Builders ──────────────────────────────────────────────────
function getSystemPromptForFeature(feature: string, meta?: any): string {
  switch (feature) {
    case 'tutor':
      return `You are DSA Mastery AI Tutor, a friendly, encouraging, and world-class Data Structures and Algorithms Professor.
- Teach with extreme clarity using conceptual explanations, real-world analogies, and diagrams in ASCII.
- All code examples must be provided in clean, well-commented C programming language.
- Format responses cleanly with GitHub-flavored markdown.
- ${meta?.context ? `Student's current learning context: ${meta.context}` : ''}`;

    case 'mentor':
      return `You are an elite Senior FAANG Principal Engineer & DSA Mentor.
- Guide students toward deep architectural understanding, asymptotic efficiency, and trade-off evaluation.
- Emphasize production engineering: memory alignment, cache locality, CPU word boundaries, and Big-O derivations.
- Use encouraging, professional mentorship language.`;

    case 'quiz':
      return `You are an expert exam setter specializing in university DSA evaluations (SRM/Anna University curriculum).
- Generate challenging multiple-choice questions or viva questions.
- Include the question, 4 clear options, the correct answer, and an insightful explanation with complexity analysis.`;

    case 'interview':
      return `You are a Senior Technical Interviewer conducting a technical coding interview at Google / Meta / Amazon.
- Difficulty: ${meta?.difficulty || 'Medium'}.
- Provide:
  1. The interview challenge and clarifying edge-case questions.
  2. The candidate's expected thought process (Brute force -> Optimized).
  3. Clean C solution with detailed time and space complexity.
  4. Follow-up scalability and trade-off questions.`;

    case 'reviewer':
      return `You are a Senior Software Architect conducting a strict yet constructive C Code Review.
Analyze the provided code and output:
1. Overall Code Rating (1-10)
2. Correctness & Edge Cases (empty input, null pointers, buffer overflows)
3. Time & Space Complexity Analysis
4. C Memory Safety (malloc/free checks, memory leaks, dangling pointers)
5. Refactored, Clean Production Code in C.`;

    case 'debugger':
      return `You are an expert C DSA Debugger.
Do NOT just hand out the answer immediately:
1. Identify the exact line and logic causing the issue.
2. Explain the root theoretical reason WHY the bug manifests.
3. Provide a Socratic hint first.
4. Show the corrected C code with commentary.`;

    case 'complexity':
      return `You are a Theoretical Computer Science Professor specializing in Algorithm Complexity.
Provide an exhaustive complexity breakdown:
1. Time Complexity: Best (Omega), Average (Theta), Worst (Big-O) case with mathematical derivation.
2. Auxiliary Space & Total Space complexity (including call stack frames).
3. Line-by-line operation counts.
4. Optimization suggestions to reduce Big-O bounds.`;

    case 'planner':
      return `You are an Academic Study Advisor creating a customized DSA Exam Preparation Roadmap.
Format as a structured day-by-day study schedule with specific topics, target problems, and revision checkpoints.`;

    default:
      return 'You are an expert Data Structures and Algorithms professor.';
  }
}

// ── Main Route Handler ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait a moment before sending more requests.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { prompt, feature = 'tutor', apiKey: clientKey, meta } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing prompt string.' },
        { status: 400 }
      );
    }

    // 2. Resolve API Key: Prefer Server Environment Variable, fallback to Client Key if provided
    const apiKey = process.env.GEMINI_API_KEY || clientKey;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'No Gemini API key configured. Please add GEMINI_API_KEY in your environment or set it in Settings.',
        },
        { status: 401 }
      );
    }

    // 3. Formulate System Instruction
    const systemPrompt = getSystemPromptForFeature(feature, meta);

    // 4. Call Model with Fallback Resilience
    const result = await callGeminiWithFallback(prompt, systemPrompt, apiKey);

    return NextResponse.json({
      success: true,
      data: result,
      feature,
    });
  } catch (error: any) {
    console.error('[API /api/ai Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process AI request. Please check your network and API key.',
      },
      { status: 500 }
    );
  }
}
