'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  Eye,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Clock,
} from 'lucide-react';
import { COURSE_UNITS, TOPICS, CurriculumTopic } from '@/data/curriculum';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function UnitClientView({ unitId }: { unitId: number }) {
  const unit = COURSE_UNITS.find((u) => u.id === unitId) || COURSE_UNITS[0];
  const unitTopics = TOPICS.filter((t) => t.unitId === unitId);

  const [activeTopic, setActiveTopic] = useState<CurriculumTopic>(unitTopics[0] || TOPICS[0]);
  const [copied, setCopied] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  const { progress, markTopicComplete, addXP } = useAppStore();
  const isCompleted = progress.completedTopics.includes(activeTopic.id);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeTopic.cCode);
    setCopied(true);
    toast.success('C Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkComplete = () => {
    if (!isCompleted) {
      markTopicComplete(activeTopic.id);
      addXP(50);
      toast.success('Topic completed! +50 XP Earned 🔥');
    }
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (selectedAnswers[qIdx] !== undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    setShowExplanation((prev) => ({ ...prev, [qIdx]: true }));

    if (optIdx === activeTopic.mcqs[qIdx].correctIndex) {
      addXP(25);
      toast.success('Correct Answer! +25 XP');
    } else {
      toast.error('Incorrect. Review the explanation below.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/learn"
          className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Units
        </Link>
        <span className="text-muted text-xs">/</span>
        <span className="text-xs font-semibold text-emerald-500">{unit.title}</span>
      </div>

      {/* Main Grid: Sidebar of Topics + Content Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Topic Selector Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <div className="p-4 rounded-2xl bg-card border border-card-border space-y-2">
            <h2 className="text-sm font-bold text-muted uppercase tracking-wider">Unit Topics</h2>
            <div className="space-y-1">
              {unitTopics.map((topic, i) => {
                const isSelected = activeTopic.id === topic.id;
                const isDone = progress.completedTopics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setActiveTopic(topic);
                      setSelectedAnswers({});
                      setShowExplanation({});
                    }}
                    className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-white shadow font-semibold'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-muted hover:text-foreground'
                    }`}
                  >
                    <span className="truncate pr-2">
                      {i + 1}. {topic.title}
                    </span>
                    {isDone && (
                      <CheckCircle2
                        size={14}
                        className={isSelected ? 'text-white' : 'text-emerald-500'}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Topic In-Depth Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div
            key={activeTopic.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-card border border-card-border p-6 md:p-8 space-y-6"
          >
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-card-border">
              <div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  {activeTopic.category}
                </span>
                <h1 className="text-2xl font-bold mt-2">{activeTopic.title}</h1>
                <p className="text-sm text-muted mt-1">{activeTopic.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkComplete}
                  disabled={isCompleted}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                  }`}
                >
                  <CheckCircle2 size={16} />
                  {isCompleted ? 'Completed' : 'Mark Complete (+50 XP)'}
                </button>
              </div>
            </div>

            {/* Complexity & Real-World Analogy Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50 border border-card-border space-y-1">
                <div className="text-xs text-muted flex items-center gap-1.5 font-semibold">
                  <Clock size={14} className="text-indigo-400" /> Complexities:
                </div>
                <div className="text-xs font-mono">
                  <span className="text-emerald-500 font-bold">Time:</span> {activeTopic.timeComplexity || 'O(1)'} |{' '}
                  <span className="text-indigo-400 font-bold">Space:</span> {activeTopic.spaceComplexity || 'O(1)'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <div className="text-xs text-amber-500 flex items-center gap-1.5 font-semibold">
                  <Lightbulb size={14} /> Real-World Analogy:
                </div>
                <p className="text-xs text-muted">{activeTopic.realWorldAnalogy}</p>
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
                <Sparkles size={16} className="text-emerald-500" /> Key Exam Concepts
              </h3>
              <ul className="space-y-1.5 text-xs text-muted">
                {activeTopic.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Theory Explanation */}
            <div className="prose dark:prose-invert max-w-none text-sm text-muted space-y-3 border-t border-card-border pt-4">
              <div
                dangerouslySetInnerHTML={{
                  __html: activeTopic.theory.replace(/###/g, '<h4 class="font-bold text-foreground mt-3 mb-1">').replace(/####/g, '<h5 class="font-semibold text-foreground mt-2 mb-1">')
                }}
              />
            </div>

            {/* Interactive Visualizer Link */}
            {activeTopic.visualizer && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                    <Eye size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Interactive Visualizer Available</h4>
                    <p className="text-xs text-muted">See this data structure in action in the Visual Lab.</p>
                  </div>
                </div>
                <Link
                  href="/visualizer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                >
                  Launch Visualizer
                </Link>
              </div>
            )}

            {/* Complete C Implementation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Code2 size={16} className="text-indigo-400" /> Complete C Implementation
                </h3>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground px-2.5 py-1 rounded-lg border border-card-border transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy C Code'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-gray-950 text-gray-200 text-xs font-mono overflow-x-auto border border-gray-800">
                <code>{activeTopic.cCode}</code>
              </pre>
            </div>

            {/* Topic MCQ Quizzes */}
            {activeTopic.mcqs && activeTopic.mcqs.length > 0 && (
              <div className="space-y-4 border-t border-card-border pt-6">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <HelpCircle size={16} className="text-amber-500" /> Topic Knowledge Check (+25 XP)
                </h3>

                {activeTopic.mcqs.map((mcq, qIdx) => {
                  const selected = selectedAnswers[qIdx];
                  const isAnswered = selected !== undefined;

                  return (
                    <div
                      key={qIdx}
                      className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-card-border space-y-3"
                    >
                      <p className="text-xs font-semibold text-foreground">
                        Q: {mcq.question}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {mcq.options.map((opt, optIdx) => {
                          let optStyle = 'bg-card border-card-border hover:border-emerald-500 text-muted';
                          if (isAnswered) {
                            if (optIdx === mcq.correctIndex) {
                              optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold';
                            } else if (optIdx === selected) {
                              optStyle = 'bg-red-500/20 border-red-500 text-red-400 font-bold';
                            } else {
                              optStyle = 'bg-card opacity-50';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={isAnswered}
                              onClick={() => handleSelectOption(qIdx, optIdx)}
                              className={`p-3 rounded-lg border text-xs text-left transition-all ${optStyle}`}
                            >
                              {String.fromCharCode(65 + optIdx)}. {opt}
                            </button>
                          );
                        })}
                      </div>

                      {showExplanation[qIdx] && (
                        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-muted">
                          <span className="font-bold text-indigo-400">Explanation: </span>
                          {mcq.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
