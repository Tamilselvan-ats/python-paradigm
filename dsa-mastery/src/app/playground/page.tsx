'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  CheckCircle,
  AlertTriangle,
  Bug,
  Brain,
  FileCode,
  Sparkles,
  Terminal,
  Activity,
  Copy,
  RotateCcw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { reviewCode, debugCode, analyzeComplexity } from '@/lib/gemini';

const DEFAULT_C_CODE = `#include <stdio.h>
#include <stdlib.h>

// Singly Linked List Node
struct Node {
    int data;
    struct Node *next;
};

void insertHead(struct Node **head, int val) {
    struct Node *newNode = (struct Node*)malloc(sizeof(struct Node));
    if (!newNode) return;
    newNode->data = val;
    newNode->next = *head;
    *head = newNode;
}

void printList(struct Node *head) {
    printf("Linked List: ");
    while (head != NULL) {
        printf("%d -> ", head->data);
        head = head->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node *head = NULL;
    insertHead(&head, 30);
    insertHead(&head, 20);
    insertHead(&head, 10);

    printList(head);
    return 0;
}`;

export default function PlaygroundPage() {
  const [code, setCode] = useState(DEFAULT_C_CODE);
  const [output, setOutput] = useState('');
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // AI Feature State
  const [aiActiveTab, setAiActiveTab] = useState<'none' | 'review' | 'debug' | 'complexity'>('none');
  const [aiResult, setAiResult] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Compiling and analyzing C source code...');
    try {
      const res = await fetch('/api/compiler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, action: 'run' }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.data.status === 'compilation_error') {
          setOutput(`Compilation Errors:\n${data.data.errors}`);
          toast.error('Compilation errors detected.');
        } else {
          setOutput(data.data.output);
          setDiagnostics(data.data.diagnostics || []);
          toast.success('Executed successfully!');
        }
      }
    } catch (err: any) {
      setOutput(`Execution failed: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleStaticAnalyze = async () => {
    try {
      const res = await fetch('/api/compiler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, action: 'analyze' }),
      });
      const data = await res.json();
      if (data.success) {
        setDiagnostics(data.data.diagnostics);
        toast.success(`Static Analysis Complete: Score ${data.data.score}/100`);
      }
    } catch (err) {
      toast.error('Analysis failed.');
    }
  };

  const handleAICall = async (type: 'review' | 'debug' | 'complexity') => {
    setAiActiveTab(type);
    setIsAiLoading(true);
    setAiResult('');
    toast.loading(`Running AI ${type.toUpperCase()}...`, { id: 'ai-toast' });

    try {
      let res;
      if (type === 'review') res = await reviewCode(code);
      else if (type === 'debug') res = await debugCode(code);
      else res = await analyzeComplexity(code);

      if (res.success && res.data) {
        setAiResult(res.data);
        toast.success('AI Analysis Ready!', { id: 'ai-toast' });
      } else {
        setAiResult(`Error: ${res.error}`);
        toast.error(res.error || 'AI Failed', { id: 'ai-toast' });
      }
    } catch (err: any) {
      setAiResult(`AI Call Failed: ${err.message}`);
      toast.error('AI Call Failed', { id: 'ai-toast' });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileCode className="w-8 h-8 text-purple-500" />
            C Programming Playground & AI Sandbox
          </h1>
          <p className="text-muted text-sm mt-1">
            Write, compile, statically analyze C algorithms, and receive real-time Gemini AI architectural reviews.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleStaticAnalyze}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-card-border hover:bg-card text-xs font-semibold transition-all"
          >
            <Activity size={14} className="text-amber-500" /> Static Audit
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
          >
            <Play size={14} /> Run Code
          </button>
        </div>
      </div>

      {/* Editor & Console Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Code Editor */}
        <div className="rounded-2xl bg-card border border-card-border overflow-hidden flex flex-col">
          <div className="p-3 bg-gray-900 border-b border-gray-800 flex items-center justify-between text-xs text-gray-400 font-mono">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              solution.c
            </span>
            <button
              onClick={() => setCode(DEFAULT_C_CODE)}
              className="hover:text-white flex items-center gap-1"
            >
              <RotateCcw size={12} /> Reset Template
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={22}
            className="w-full p-4 bg-gray-950 text-gray-100 font-mono text-xs focus:outline-none resize-none leading-relaxed"
            spellCheck={false}
          />

          {/* AI Helper Bar */}
          <div className="p-3 bg-gray-900 border-t border-gray-800 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
              <Sparkles size={12} className="text-purple-400" /> AI Insights:
            </span>
            <button
              onClick={() => handleAICall('review')}
              className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-semibold transition-all"
            >
              AI Code Review
            </button>
            <button
              onClick={() => handleAICall('debug')}
              className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white text-xs font-semibold transition-all"
            >
              AI Debugger
            </button>
            <button
              onClick={() => handleAICall('complexity')}
              className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold transition-all"
            >
              Complexity Analysis
            </button>
          </div>
        </div>

        {/* Right Side: Output Terminal & AI Report Panel */}
        <div className="space-y-4 flex flex-col">
          {/* Terminal Output */}
          <div className="rounded-2xl bg-gray-950 border border-gray-800 p-4 font-mono text-xs text-gray-300 min-h-[220px] space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800 text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <Terminal size={12} /> Execution Output
              </span>
              <span>exit code 0</span>
            </div>
            <pre className="whitespace-pre-wrap text-emerald-400 font-mono">
              {output || 'Click "Run Code" to compile and execute program.'}
            </pre>
          </div>

          {/* Static Analysis Diagnostics List */}
          {diagnostics.length > 0 && (
            <div className="rounded-2xl bg-card border border-card-border p-4 space-y-2">
              <span className="text-xs font-bold flex items-center gap-1.5 text-muted">
                <Activity size={14} className="text-amber-500" /> Static Diagnostics ({diagnostics.length})
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {diagnostics.map((d, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800/60 text-xs flex items-center justify-between"
                  >
                    <span className="font-mono text-muted">
                      Line {d.line}: {d.message}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        d.severity === 'error'
                          ? 'bg-red-500/20 text-red-400'
                          : d.severity === 'warning'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {d.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Result Stream Panel */}
          {aiActiveTab !== 'none' && (
            <div className="rounded-2xl bg-purple-500/10 border border-purple-500/30 p-4 space-y-2 flex-1">
              <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
                <span className="text-xs font-bold text-purple-400 uppercase flex items-center gap-1.5">
                  <Brain size={14} /> AI {aiActiveTab.toUpperCase()} Report
                </span>
                <button
                  onClick={() => setAiActiveTab('none')}
                  className="text-xs text-muted hover:text-foreground"
                >
                  Close
                </button>
              </div>

              {isAiLoading ? (
                <div className="p-6 text-center text-xs text-muted flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                  Gemini Flash is analyzing your code...
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none text-xs text-muted max-h-72 overflow-y-auto space-y-2">
                  <pre className="whitespace-pre-wrap font-sans leading-relaxed text-foreground">
                    {aiResult}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
