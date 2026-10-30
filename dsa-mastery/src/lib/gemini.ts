// ============================================================================
// Gemini AI Client Service
// Calls internal /api/ai server-side route handler with rate-limiting & security
// ============================================================================

export interface AIResponse {
  success: boolean;
  data?: string;
  error?: string;
}

async function callInternalAI(
  prompt: string,
  feature: string,
  apiKey?: string,
  meta?: Record<string, any>
): Promise<AIResponse> {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        feature,
        apiKey: apiKey || '',
        meta,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to communicate with AI server.' };
    }
    return { success: true, data: data.data };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error connecting to AI endpoint.',
    };
  }
}

export async function chatWithTutor(message: string, apiKey: string = '', context?: string): Promise<AIResponse> {
  return callInternalAI(message, 'tutor', apiKey, { context });
}

export async function chatWithMentor(message: string, apiKey: string = '', context?: string): Promise<AIResponse> {
  return callInternalAI(message, 'mentor', apiKey, { context });
}

export async function explainTopic(topic: string, level: string = 'college', apiKey: string = ''): Promise<AIResponse> {
  return callInternalAI(`Explain the topic "${topic}" in comprehensive detail.`, 'tutor', apiKey, {
    context: `Level: ${level}`,
  });
}

export async function generateExamQuestions(
  topic: string,
  marks: number = 10,
  count: number = 2,
  apiKey: string = ''
): Promise<AIResponse> {
  return callInternalAI(
    `Generate ${count} questions worth ${marks} marks each on topic: "${topic}". Include complete model answers.`,
    'quiz',
    apiKey,
    { marks, count }
  );
}

export async function conductMockInterview(
  topic: string,
  difficulty: string = 'Medium',
  apiKey: string = ''
): Promise<AIResponse> {
  return callInternalAI(
    `Conduct a technical interview problem on "${topic}".`,
    'interview',
    apiKey,
    { difficulty }
  );
}

export async function reviewCode(code: string, apiKey: string = ''): Promise<AIResponse> {
  return callInternalAI(`Please review this C code:\n\`\`\`c\n${code}\n\`\`\``, 'reviewer', apiKey);
}

export async function debugCode(code: string, errorMsg: string = '', apiKey: string = ''): Promise<AIResponse> {
  return callInternalAI(
    `Help me debug this C code:\n\`\`\`c\n${code}\n\`\`\`\nError: ${errorMsg}`,
    'debugger',
    apiKey
  );
}

export async function analyzeComplexity(code: string, apiKey: string = ''): Promise<AIResponse> {
  return callInternalAI(`Analyze the complexity of this code:\n\`\`\`c\n${code}\n\`\`\``, 'complexity', apiKey);
}

export async function generateStudyPlan(
  weakAreas: string[],
  strongAreas: string[],
  daysUntilExam: number,
  apiKey: string = ''
): Promise<AIResponse> {
  return callInternalAI(
    `Generate a ${daysUntilExam}-day study plan. Weak topics: ${weakAreas.join(', ')}. Strong topics: ${strongAreas.join(', ')}.`,
    'planner',
    apiKey
  );
}

export async function generateAlgorithm(problem: string, apiKey: string = ''): Promise<AIResponse> {
  return callInternalAI(`Generate algorithm and C code for: ${problem}`, 'tutor', apiKey);
}
