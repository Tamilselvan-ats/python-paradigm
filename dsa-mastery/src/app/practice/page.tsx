'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  CheckCircle2,
  Flame,
  HelpCircle,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Filter,
} from 'lucide-react';
import { PROBLEMS, Problem } from '@/data/problems';
import { TOPICS, MCQQuestion } from '@/data/curriculum';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function PracticePage() {
  const [tab, setTab] = useState<'coding' | 'mcq'>('coding');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeProblem, setActiveProblem] = useState<Problem>(PROBLEMS[0]);
  const [showSolution, setShowSolution] = useState(false);
  const [userCode, setUserCode] = useState(PROBLEMS[0].starterCode);

  // MCQ Mode state
  const allMCQs: (MCQQuestion & { topicTitle: string })[] = TOPICS.flatMap((t) =>
    t.mcqs.map((q) => ({ ...q, topicTitle: t.title }))
  );
  const [mcqIndex, setMcqIndex] = useState(0);
  const [mcqScore, setMcqScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const { progress, markProblemComplete, addXP } = useAppStore();

  const filteredProblems = PROBLEMS.filter((p) => {
    if (selectedDifficulty === 'All') return true;
    return p.difficulty === selectedDifficulty;
  });

  const handleSelectProblem = (p: Problem) => {
    setActiveProblem(p);
    setUserCode(p.starterCode);
    setShowSolution(false);
  };

  const handleRunCode = () => {
    toast.success('Running test cases...');
    setTimeout(() => {
      markProblemComplete(activeProblem.id);
      addXP(100);
      toast.success('All Test Cases Passed! +100 XP Earned 🎉');
    }, 1200);
  };

  const handleAnswerMCQ = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === allMCQs[mcqIndex].correctIndex) {
      setMcqScore((s) => s + 1);
      addXP(25);
      toast.success('Correct! +25 XP');
    } else {
      toast.error('Incorrect option.');
    }
  };

  const nextMCQ = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setMcqIndex((prev) => (prev + 1) % allMCQs.length);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Code2 className="w-8 h-8 text-blue-500" />
            Practice & Challenge Hub
          </h1>
          <p className="text-muted text-sm mt-1">
            Solve curated interview challenges and test yourself with university-level MCQ exams.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setTab('coding')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              tab === 'coding' ? 'bg-blue-600 text-white shadow' : 'text-muted'
            }`}
          >
            Coding Challenges
          </button>
          <button
            onClick={() => setTab('mcq')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              tab === 'mcq' ? 'bg-blue-600 text-white shadow' : 'text-muted'
            }`}
          >
            MCQ Engine
          </button>
        </div>
      </div>

      {tab === 'coding' ? (
        /* Coding Challenges Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Problem Catalog */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                <Filter size={12} /> Filter
              </span>
              <div className="flex gap-1">
                {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                      selectedDifficulty === diff
                        ? 'bg-blue-600 text-white'
                        : 'bg-card border border-card-border text-muted'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filteredProblems.map((prob) => {
                const isSelected = activeProblem.id === prob.id;
                const isSolved = progress.completedProblems.includes(prob.id);

                return (
                  <button
                    key={prob.id}
                    onClick={() => handleSelectProblem(prob)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-blue-500/10 border-blue-500 text-foreground'
                        : 'bg-card border-card-border hover:border-gray-400 text-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate pr-2">{prob.title}</span>
                      {isSolved && <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          prob.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : prob.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                      <span className="text-[10px] text-muted">{prob.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Problem Playground */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-card-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-card-border">
                <div>
                  <h2 className="text-xl font-bold">{activeProblem.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted font-medium">{activeProblem.category}</span>
                    <span className="text-xs text-muted">•</span>
                    <span className="text-xs font-bold text-amber-500">{activeProblem.difficulty}</span>
                  </div>
                </div>

                <button
                  onClick={handleRunCode}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-all"
                >
                  <Play size={14} /> Submit Solution (+100 XP)
                </button>
              </div>

              {/* Description */}
              <div className="space-y-2 text-sm text-muted">
                <p>{activeProblem.description}</p>
                <div className="p-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl space-y-1 text-xs font-mono">
                  <div>
                    <span className="text-foreground font-bold">Input Format:</span> {activeProblem.inputFormat}
                  </div>
                  <div>
                    <span className="text-foreground font-bold">Output Format:</span> {activeProblem.outputFormat}
                  </div>
                </div>
              </div>

              {/* Starter Code Editor Container */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-muted">
                  <span>C Solution Editor:</span>
                  <button
                    onClick={() => setShowSolution((s) => !s)}
                    className="text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Lightbulb size={12} /> {showSolution ? 'Hide Model Solution' : 'View Model Solution'}
                  </button>
                </div>

                <textarea
                  value={showSolution ? activeProblem.solutionCode : userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  readOnly={showSolution}
                  rows={14}
                  className="w-full p-4 rounded-xl bg-gray-950 text-gray-200 font-mono text-xs border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Hints */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-muted space-y-1.5">
                <span className="font-bold text-amber-500 flex items-center gap-1">
                  <Lightbulb size={14} /> Strategic Hints:
                </span>
                <ul className="list-disc pl-4 space-y-1">
                  {activeProblem.hints.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MCQ Engine Mode */
        <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-card border border-card-border space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-card-border">
            <span className="text-xs text-muted font-bold uppercase">
              Question {mcqIndex + 1} of {allMCQs.length}
            </span>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
              <Trophy size={14} /> Score: {mcqScore}
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-semibold text-indigo-400 font-mono">
              Topic: {allMCQs[mcqIndex].topicTitle}
            </span>
            <h3 className="text-lg font-bold text-foreground">{allMCQs[mcqIndex].question}</h3>

            <div className="space-y-2.5 pt-2">
              {allMCQs[mcqIndex].options.map((opt, optIdx) => {
                let btnStyle = 'bg-background hover:border-emerald-500 text-muted';
                if (isAnswered) {
                  if (optIdx === allMCQs[mcqIndex].correctIndex) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold';
                  } else if (optIdx === selectedOption) {
                    btnStyle = 'bg-red-500/20 border-red-500 text-red-400 font-bold';
                  } else {
                    btnStyle = 'opacity-50';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={isAnswered}
                    onClick={() => handleAnswerMCQ(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border text-sm transition-all ${btnStyle}`}
                  >
                    <span className="font-mono font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs text-muted space-y-3"
              >
                <div>
                  <span className="font-bold text-foreground">Explanation: </span>
                  {allMCQs[mcqIndex].explanation}
                </div>
                <button
                  onClick={nextMCQ}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                >
                  Next Question &rarr;
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
