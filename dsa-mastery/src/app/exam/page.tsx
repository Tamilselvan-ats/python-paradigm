'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Clock,
  Layers,
  Award,
} from 'lucide-react';
import { EXAM_QUESTIONS, ExamQuestion } from '@/data/examQuestions';
import { TOPICS } from '@/data/curriculum';
import { useAppStore } from '@/lib/store';
import { generateExamQuestions } from '@/lib/gemini';
import toast from 'react-hot-toast';

export default function ExamPage() {
  const [selectedMarks, setSelectedMarks] = useState<number>(0); // 0 = all
  const [selectedUnit, setSelectedUnit] = useState<number>(0);
  const [aiTopic, setAiTopic] = useState('AVL Trees');
  const [aiMarks, setAiMarks] = useState(13);
  const [aiOutput, setAiOutput] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const { progress } = useAppStore();
  const readinessPercent = Math.min(
    100,
    Math.round((progress.completedTopics.length / (TOPICS.length || 1)) * 100)
  );

  const filteredQuestions = EXAM_QUESTIONS.filter((q) => {
    if (selectedMarks !== 0 && q.marks !== selectedMarks) return false;
    if (selectedUnit !== 0 && q.unit !== selectedUnit) return false;
    return true;
  });

  const handleGenerateAIExam = async () => {
    setIsAiGenerating(true);
    setAiOutput('');
    toast.loading('Generating university exam paper with model answers...', { id: 'exam-toast' });
    try {
      const res = await generateExamQuestions(aiTopic, aiMarks, 2);
      if (res.success && res.data) {
        setAiOutput(res.data);
        toast.success('Exam Questions Generated!', { id: 'exam-toast' });
      } else {
        toast.error(res.error || 'Generation failed', { id: 'exam-toast' });
      }
    } catch (err: any) {
      toast.error('AI call failed', { id: 'exam-toast' });
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header & Readiness Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-indigo-500" />
            University Exam Master
          </h1>
          <p className="text-muted text-sm">
            Practice with genuine SRM & Anna University format questions (Part A 2 marks, Part B 13 & 16 marks) with model answers.
          </p>
        </div>

        {/* Exam Readiness Tracker Card */}
        <div className="p-5 rounded-2xl bg-card border border-card-border flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted">
            <span className="flex items-center gap-1.5">
              <Award size={14} className="text-amber-500" /> Exam Readiness Score
            </span>
            <span className="font-bold text-foreground text-sm">{readinessPercent}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-muted">
            {progress.completedTopics.length} of {TOPICS.length} curriculum topics mastered.
          </p>
        </div>
      </div>

      {/* AI Exam Question Generator Section */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-500/20 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-base">AI University Exam Question Setter (SRM Pattern)</h3>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted">Topic</label>
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="e.g. AVL Rotations"
              className="px-3 py-2 rounded-xl bg-background border border-card-border text-xs w-48"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted">Marks Allocation</label>
            <select
              value={aiMarks}
              onChange={(e) => setAiMarks(Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-background border border-card-border text-xs"
            >
              <option value={2}>2 Marks (Short Definition)</option>
              <option value={5}>5 Marks (Short Theory)</option>
              <option value={7}>7 Marks (Algorithm/Proof)</option>
              <option value={10}>10 Marks (Detailed Question)</option>
              <option value={13}>13 Marks (Part B Standard)</option>
              <option value={16}>16 Marks (Part C Comprehensive)</option>
            </select>
          </div>

          <button
            onClick={handleGenerateAIExam}
            disabled={isAiGenerating}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all disabled:opacity-50"
          >
            <Sparkles size={14} /> Generate Paper Questions
          </button>
        </div>

        {aiOutput && (
          <div className="p-4 rounded-xl bg-card border border-card-border text-xs space-y-2 mt-4">
            <div className="flex items-center justify-between pb-2 border-b border-card-border font-bold text-indigo-400">
              <span>Generated Paper Output:</span>
              <button onClick={() => setAiOutput('')} className="text-muted hover:text-foreground">
                Dismiss
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-muted leading-relaxed">
              {aiOutput}
            </pre>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-card-border">
        {/* Marks Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-semibold text-muted mr-1">Marks:</span>
          {[0, 2, 5, 7, 10, 13, 16].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMarks(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedMarks === m
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-card border border-card-border text-muted hover:text-foreground'
              }`}
            >
              {m === 0 ? 'All Marks' : `${m} Marks`}
            </button>
          ))}
        </div>

        {/* Unit Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-muted mr-1">Unit:</span>
          {[0, 1, 2, 3, 4, 5].map((u) => (
            <button
              key={u}
              onClick={() => setSelectedUnit(u)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedUnit === u
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-card border border-card-border text-muted hover:text-foreground'
              }`}
            >
              {u === 0 ? 'All' : `Unit ${u}`}
            </button>
          ))}
        </div>
      </div>

      {/* Question Bank Accordion / Cards */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="p-6 rounded-2xl bg-card border border-card-border space-y-4 hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400">
                    {q.marks} Marks
                  </span>
                  <span className="text-xs text-muted">Unit {q.unit}</span>
                  <span className="text-xs text-muted">•</span>
                  <span className="text-xs font-medium text-foreground">{q.topic}</span>
                </div>
                <h3 className="text-base font-bold text-foreground pt-1">{q.question}</h3>
              </div>
            </div>

            {/* Model Answer */}
            <div className="space-y-2 pt-2 border-t border-card-border">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-wide">
                Model Answer:
              </span>
              <pre className="whitespace-pre-wrap font-sans text-xs text-muted leading-relaxed">
                {q.modelAnswer}
              </pre>
            </div>

            {/* Key Evaluator Points */}
            <div className="p-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-muted uppercase">Examiner Key Marking Points:</span>
              <ul className="list-disc pl-4 text-xs text-muted space-y-0.5">
                {q.keyPoints.map((kp, idx) => (
                  <li key={idx}>{kp}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
