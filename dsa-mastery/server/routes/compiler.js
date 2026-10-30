// ============================================================================
// Compiler Routes - Code Execution & Static Analysis for DSA Mastery
// Provides simulated compilation and regex-based C code analysis
// ============================================================================

import { Router } from 'express';

const router = Router();

// ---------------------------------------------------------------------------
// POST /api/compiler/run
// Simulated code execution (actual sandbox compilation not available in browser)
// Returns a structured response mimicking real compiler output
// ---------------------------------------------------------------------------
router.post('/run', async (req, res, next) => {
  try {
    const { code, input, language } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: code',
      });
    }

    const effectiveLanguage = language || 'c';

    // Run static analysis to check for obvious errors first
    const errors = analyzeCode(code);
    const criticalErrors = errors.filter((e) => e.severity === 'error');

    if (criticalErrors.length > 0) {
      return res.json({
        success: true,
        data: {
          output: '',
          errors: criticalErrors.map(
            (e) => `Line ${e.line}: ${e.message}`
          ).join('\n'),
          exitCode: 1,
          executionTime: '0ms',
          memoryUsed: '0 KB',
          status: 'compilation_error',
        },
      });
    }

    // Simulate execution - in production, this would call a sandboxed compiler
    const simulatedOutput = simulateExecution(code, input || '');

    res.json({
      success: true,
      data: {
        output: simulatedOutput.output,
        errors: simulatedOutput.errors,
        exitCode: simulatedOutput.exitCode,
        executionTime: simulatedOutput.executionTime,
        memoryUsed: simulatedOutput.memoryUsed,
        status: simulatedOutput.status,
        note: 'This is a simulated execution. For actual compilation, connect a sandboxed compiler service.',
      },
    });
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// POST /api/compiler/analyze
// Static analysis using regex/pattern matching to detect common C errors
// ---------------------------------------------------------------------------
router.post('/analyze', async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: code',
      });
    }

    const diagnostics = analyzeCode(code);

    // Categorize diagnostics
    const errorCount = diagnostics.filter((d) => d.severity === 'error').length;
    const warningCount = diagnostics.filter((d) => d.severity === 'warning').length;
    const infoCount = diagnostics.filter((d) => d.severity === 'info').length;

    res.json({
      success: true,
      data: {
        diagnostics,
        summary: {
          total: diagnostics.length,
          errors: errorCount,
          warnings: warningCount,
          info: infoCount,
        },
        score: Math.max(0, 100 - errorCount * 20 - warningCount * 5 - infoCount * 1),
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Simulates code execution for basic C programs.
 * In production, this would be replaced by a sandboxed compiler service.
 */
function simulateExecution(code, input) {
  const startTime = Date.now();

  // Check for main function
  if (!code.includes('main')) {
    return {
      output: '',
      errors: "error: undefined reference to 'main'",
      exitCode: 1,
      executionTime: '0ms',
      memoryUsed: '0 KB',
      status: 'compilation_error',
    };
  }

  // Check for infinite loop patterns (basic detection)
  const infiniteLoopPatterns = [
    /while\s*\(\s*1\s*\)/,
    /while\s*\(\s*true\s*\)/,
    /for\s*\(\s*;\s*;\s*\)/,
  ];

  for (const pattern of infiniteLoopPatterns) {
    if (pattern.test(code) && !code.includes('break')) {
      return {
        output: '',
        errors: 'Warning: Potential infinite loop detected',
        exitCode: 1,
        executionTime: 'timeout (>5000ms)',
        memoryUsed: 'N/A',
        status: 'timeout',
      };
    }
  }

  // Try to extract printf/puts output strings for simple programs
  const printfMatches = [...code.matchAll(/printf\s*\(\s*"([^"]*?)(?:\\n)?"\s*(?:,\s*[^)]+)?\s*\)/g)];
  let simulatedOutput = '';

  if (printfMatches.length > 0) {
    simulatedOutput = printfMatches
      .map((match) => {
        let str = match[1];
        // Process basic escape sequences
        str = str.replace(/\\n/g, '\n');
        str = str.replace(/\\t/g, '\t');
        str = str.replace(/\\\\/g, '\\');

        // If there are format specifiers, replace with placeholder values
        str = str.replace(/%d/g, '<int>');
        str = str.replace(/%f/g, '<float>');
        str = str.replace(/%s/g, '<string>');
        str = str.replace(/%c/g, '<char>');
        str = str.replace(/%ld/g, '<long>');
        str = str.replace(/%lld/g, '<long long>');
        str = str.replace(/%p/g, '<pointer>');
        str = str.replace(/%x/g, '<hex>');
        return str;
      })
      .join('');
  }

  const executionTime = `${Date.now() - startTime}ms`;

  return {
    output: simulatedOutput || '[Simulated] Program executed successfully. Connect a compiler service for actual output.',
    errors: '',
    exitCode: 0,
    executionTime,
    memoryUsed: `${Math.floor(Math.random() * 500 + 100)} KB`,
    status: 'success',
  };
}

/**
 * Performs static analysis on C code using regex pattern matching.
 * Detects common errors, warnings, and style issues.
 *
 * @param {string} code - The source code to analyze
 * @returns {Array} Array of diagnostic objects with line, severity, message, and rule
 */
function analyzeCode(code) {
  const diagnostics = [];
  const lines = code.split('\n');

  // Track state for multi-line analysis
  let braceCount = 0;
  let parenCount = 0;
  let inMultiLineComment = false;
  let inSingleLineComment = false;
  let mallocCount = 0;
  let freeCount = 0;

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) return;

    // Track comment state
    if (trimmed.includes('/*')) inMultiLineComment = true;
    if (trimmed.includes('*/')) inMultiLineComment = false;
    if (trimmed.startsWith('//')) inSingleLineComment = true;
    else inSingleLineComment = false;

    // Skip analysis inside comments
    if (inMultiLineComment || inSingleLineComment) return;

    // --- ERROR CHECKS ---

    // Missing semicolons (check lines that look like statements)
    if (
      !trimmed.endsWith(';') &&
      !trimmed.endsWith('{') &&
      !trimmed.endsWith('}') &&
      !trimmed.endsWith(':') &&
      !trimmed.endsWith(',') &&
      !trimmed.endsWith('\\') &&
      !trimmed.startsWith('#') &&
      !trimmed.startsWith('//') &&
      !trimmed.startsWith('/*') &&
      !trimmed.startsWith('*') &&
      !trimmed.includes('*/') &&
      !trimmed.match(/^(if|else|while|for|do|switch|case|default)\b/) &&
      !trimmed.match(/^(int|void|char|float|double|long|struct|enum|union|typedef)\s+\w+\s*\(/) && // function declarations
      !trimmed.match(/^\w+\s*\(/) && // function calls on their own line... tricky
      trimmed.match(/^(return\s|int\s|char\s|float\s|double\s|long\s|printf|scanf|puts|free|malloc)/) &&
      !trimmed.endsWith(')')
    ) {
      diagnostics.push({
        line: lineNum,
        severity: 'error',
        message: 'Possible missing semicolon at end of statement',
        rule: 'missing-semicolon',
      });
    }

    // Track braces for mismatch detection
    for (const ch of line) {
      if (ch === '{') braceCount++;
      if (ch === '}') braceCount--;
      if (ch === '(') parenCount++;
      if (ch === ')') parenCount--;
    }

    // Assignment in condition (common mistake)
    const conditionMatch = trimmed.match(/\b(if|while)\s*\(([^)]+)\)/);
    if (conditionMatch) {
      const condition = conditionMatch[2];
      // Check for single = (not == or !=)
      if (condition.match(/[^!=<>]=[^=]/) && !condition.includes('==')) {
        diagnostics.push({
          line: lineNum,
          severity: 'warning',
          message: `Possible unintended assignment in '${conditionMatch[1]}' condition. Did you mean '=='?`,
          rule: 'assignment-in-condition',
        });
      }
    }

    // --- WARNING CHECKS ---

    // gets() usage - dangerous function
    if (trimmed.includes('gets(')) {
      diagnostics.push({
        line: lineNum,
        severity: 'warning',
        message: "Use of 'gets()' is dangerous and deprecated. Use 'fgets()' instead to prevent buffer overflow.",
        rule: 'unsafe-gets',
      });
    }

    // scanf without & for non-string types
    const scanfMatch = trimmed.match(/scanf\s*\(\s*"([^"]+)"\s*,\s*([^)]+)\)/);
    if (scanfMatch) {
      const formatStr = scanfMatch[1];
      const args = scanfMatch[2];
      // Check if format has %d, %f, etc. but args don't have &
      if (formatStr.match(/%[dflc]/) && !args.includes('&') && !args.includes('[')) {
        diagnostics.push({
          line: lineNum,
          severity: 'warning',
          message: "scanf() arguments for %d, %f, %c should use '&' (address-of operator)",
          rule: 'scanf-missing-ampersand',
        });
      }
    }

    // Track malloc/free for memory leak detection
    if (trimmed.includes('malloc(') || trimmed.includes('calloc(') || trimmed.includes('realloc(')) {
      mallocCount++;
    }
    if (trimmed.includes('free(')) {
      freeCount++;
    }

    // Unchecked malloc
    if (trimmed.match(/=\s*(\(.*?\))?\s*malloc\s*\(/) || trimmed.match(/=\s*(\(.*?\))?\s*calloc\s*\(/)) {
      // Check if there's a NULL check nearby (next 3 lines)
      const nextLines = lines.slice(index + 1, index + 4).join(' ');
      if (!nextLines.includes('NULL') && !nextLines.includes('null') && !nextLines.includes('!')) {
        diagnostics.push({
          line: lineNum,
          severity: 'warning',
          message: 'Memory allocation result should be checked for NULL before use',
          rule: 'unchecked-malloc',
        });
      }
    }

    // Array index out of bounds (basic check)
    const arrayAccessMatch = trimmed.match(/\w+\[(\d+)\]/);
    if (arrayAccessMatch) {
      const accessIndex = parseInt(arrayAccessMatch[1]);
      // Check if there's an array declaration with known size
      const arrayDeclMatch = code.match(
        new RegExp(`\\w+\\[\\s*(\\d+)\\s*\\]\\s*[=;]`)
      );
      if (arrayDeclMatch) {
        const arraySize = parseInt(arrayDeclMatch[1]);
        if (accessIndex >= arraySize) {
          diagnostics.push({
            line: lineNum,
            severity: 'warning',
            message: `Array index ${accessIndex} may be out of bounds (array size: ${arraySize})`,
            rule: 'array-bounds',
          });
        }
      }
    }

    // --- INFO / STYLE CHECKS ---

    // Magic numbers (numeric literals other than 0, 1, 2 in code, not in declarations)
    if (trimmed.match(/[=<>+\-*/]\s*\d{3,}/) && !trimmed.startsWith('#define') && !trimmed.startsWith('//')) {
      diagnostics.push({
        line: lineNum,
        severity: 'info',
        message: 'Consider using a named constant (#define) instead of a magic number',
        rule: 'magic-number',
      });
    }

    // TODO/FIXME/HACK comments
    if (trimmed.match(/\/\/\s*(TODO|FIXME|HACK|XXX)/i)) {
      diagnostics.push({
        line: lineNum,
        severity: 'info',
        message: `Found ${trimmed.match(/(TODO|FIXME|HACK|XXX)/i)[1]} comment - remember to address this`,
        rule: 'todo-comment',
      });
    }

    // Very long lines (>120 characters)
    if (line.length > 120) {
      diagnostics.push({
        line: lineNum,
        severity: 'info',
        message: `Line is ${line.length} characters long. Consider breaking it into multiple lines for readability.`,
        rule: 'long-line',
      });
    }

    // Unused variable detection (basic - declared but name not found elsewhere)
    const varDeclMatch = trimmed.match(/^(int|char|float|double|long)\s+(\w+)\s*[;=]/);
    if (varDeclMatch && !trimmed.includes('main')) {
      const varName = varDeclMatch[2];
      const restOfCode = lines.slice(index + 1).join('\n');
      // Check if variable is used at least once after declaration
      const usageRegex = new RegExp(`\\b${varName}\\b`);
      if (!usageRegex.test(restOfCode)) {
        diagnostics.push({
          line: lineNum,
          severity: 'warning',
          message: `Variable '${varName}' appears to be declared but never used`,
          rule: 'unused-variable',
        });
      }
    }
  });

  // Post-processing checks

  // Unmatched braces
  if (braceCount !== 0) {
    diagnostics.push({
      line: lines.length,
      severity: 'error',
      message: braceCount > 0
        ? `${braceCount} unmatched opening brace(s) '{' - missing closing '}'`
        : `${Math.abs(braceCount)} unmatched closing brace(s) '}' - extra or missing opening '{'`,
      rule: 'unmatched-braces',
    });
  }

  // Unmatched parentheses
  if (parenCount !== 0) {
    diagnostics.push({
      line: lines.length,
      severity: 'error',
      message: parenCount > 0
        ? `${parenCount} unmatched opening parenthesis '(' - missing closing ')'`
        : `${Math.abs(parenCount)} unmatched closing parenthesis ')' - extra or missing opening '('`,
      rule: 'unmatched-parens',
    });
  }

  // Potential memory leaks
  if (mallocCount > 0 && freeCount < mallocCount) {
    diagnostics.push({
      line: 0,
      severity: 'warning',
      message: `Potential memory leak: found ${mallocCount} allocation(s) but only ${freeCount} free() call(s)`,
      rule: 'memory-leak',
    });
  }

  // Missing #include for common functions
  if (code.includes('printf') && !code.includes('#include') && !code.includes('stdio.h')) {
    diagnostics.push({
      line: 1,
      severity: 'error',
      message: "Missing '#include <stdio.h>' for printf/scanf functions",
      rule: 'missing-include',
    });
  }

  if ((code.includes('malloc') || code.includes('free')) && !code.includes('stdlib.h')) {
    diagnostics.push({
      line: 1,
      severity: 'warning',
      message: "Missing '#include <stdlib.h>' for malloc/free functions",
      rule: 'missing-include',
    });
  }

  if (code.includes('strlen') && !code.includes('string.h')) {
    diagnostics.push({
      line: 1,
      severity: 'warning',
      message: "Missing '#include <string.h>' for string functions",
      rule: 'missing-include',
    });
  }

  // Sort diagnostics by line number then severity
  const severityOrder = { error: 0, warning: 1, info: 2 };
  diagnostics.sort((a, b) => {
    if (a.line !== b.line) return a.line - b.line;
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return diagnostics;
}

export default router;
