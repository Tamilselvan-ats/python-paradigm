// ============================================================================
// Next.js Route Handler: C Code Static Analyzer & Execution Simulator
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

interface Diagnostic {
  line: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  rule: string;
}

function analyzeCCode(code: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const lines = code.split('\n');

  let braceBalance = 0;
  let parenBalance = 0;
  let mallocCount = 0;
  let freeCount = 0;

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

    // Semicolon check on simple statements
    if (
      !trimmed.endsWith(';') &&
      !trimmed.endsWith('{') &&
      !trimmed.endsWith('}') &&
      !trimmed.endsWith(':') &&
      !trimmed.startsWith('#') &&
      !trimmed.match(/^(if|else|while|for|switch|case|default)/) &&
      trimmed.match(/^(int|char|float|double|long|return|printf|scanf|free)\b/)
    ) {
      diagnostics.push({
        line: lineNum,
        severity: 'error',
        message: 'Possible missing semicolon at the end of statement.',
        rule: 'missing-semicolon',
      });
    }

    // Bracket balance tracking
    for (const char of line) {
      if (char === '{') braceBalance++;
      if (char === '}') braceBalance--;
      if (char === '(') parenBalance++;
      if (char === ')') parenBalance--;
    }

    // Scanf missing address-of (&) check
    const scanfMatch = trimmed.match(/scanf\s*\(\s*"([^"]+)"\s*,\s*([^)]+)\)/);
    if (scanfMatch) {
      const formatStr = scanfMatch[1];
      const args = scanfMatch[2];
      if (formatStr.match(/%[dflc]/) && !args.includes('&') && !args.includes('[')) {
        diagnostics.push({
          line: lineNum,
          severity: 'warning',
          message: 'scanf() requires memory address (&) for primitive variables.',
          rule: 'scanf-missing-ampersand',
        });
      }
    }

    // Unsafe gets() check
    if (trimmed.includes('gets(')) {
      diagnostics.push({
        line: lineNum,
        severity: 'warning',
        message: 'gets() is unsafe and deprecated in C99/C11. Use fgets() to prevent buffer overflows.',
        rule: 'unsafe-gets',
      });
    }

    // Malloc/Free tracking
    if (trimmed.includes('malloc(') || trimmed.includes('calloc(')) mallocCount++;
    if (trimmed.includes('free(')) freeCount++;
  });

  if (braceBalance !== 0) {
    diagnostics.push({
      line: lines.length,
      severity: 'error',
      message: `Mismatched curly braces: ${Math.abs(braceBalance)} unclosed or extra brace(s).`,
      rule: 'unmatched-braces',
    });
  }

  if (parenBalance !== 0) {
    diagnostics.push({
      line: lines.length,
      severity: 'error',
      message: `Mismatched parentheses: ${Math.abs(parenBalance)} unclosed or extra parenthesis.`,
      rule: 'unmatched-parens',
    });
  }

  if (mallocCount > freeCount) {
    diagnostics.push({
      line: lines.length,
      severity: 'warning',
      message: `Potential memory leak: ${mallocCount} allocation(s) found but only ${freeCount} free() call(s).`,
      rule: 'memory-leak',
    });
  }

  if (code.includes('printf') && !code.includes('stdio.h')) {
    diagnostics.push({
      line: 1,
      severity: 'error',
      message: 'Missing #include <stdio.h> for printf/scanf functions.',
      rule: 'missing-include',
    });
  }

  return diagnostics;
}

export async function POST(req: NextRequest) {
  try {
    const { code, input = '', action = 'run' } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, error: 'No code submitted.' }, { status: 400 });
    }

    const diagnostics = analyzeCCode(code);
    const errors = diagnostics.filter((d) => d.severity === 'error');

    if (action === 'analyze') {
      return NextResponse.json({
        success: true,
        data: {
          diagnostics,
          score: Math.max(0, 100 - errors.length * 20 - (diagnostics.length - errors.length) * 5),
        },
      });
    }

    // Execution Simulation
    if (errors.length > 0) {
      return NextResponse.json({
        success: true,
        data: {
          output: '',
          errors: errors.map((e) => `Line ${e.line}: ${e.message}`).join('\n'),
          exitCode: 1,
          status: 'compilation_error',
        },
      });
    }

    // Extract basic printf output for simple interactive tracing
    const printfMatches = [...code.matchAll(/printf\s*\(\s*"([^"]*?)(?:\\n)?"\s*(?:,\s*[^)]+)?\s*\)/g)];
    let output = '';
    if (printfMatches.length > 0) {
      output = printfMatches
        .map((m) => m[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t'))
        .join('\n');
    } else {
      output = '[Program executed successfully with exit code 0]';
    }

    return NextResponse.json({
      success: true,
      data: {
        output,
        errors: '',
        exitCode: 0,
        executionTime: '12ms',
        memoryUsed: '256 KB',
        diagnostics,
        status: 'success',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
