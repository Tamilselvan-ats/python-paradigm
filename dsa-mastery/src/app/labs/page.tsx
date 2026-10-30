'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  CheckCircle2,
  Code2,
  Copy,
  Check,
  HelpCircle,
  Clock,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { LAB_EXPERIMENTS, LabExperiment } from '@/data/labs';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function LabsPage() {
  const [activeLab, setActiveLab] = useState<LabExperiment>(LAB_EXPERIMENTS[0]);
  const [copied, setCopied] = useState(false);
  const [showVivaAnswer, setShowVivaAnswer] = useState<Record<number, boolean>>({});

  const { progress, markLabComplete, addXP } = useAppStore();
  const isCompleted = progress.completedLabs.includes(activeLab.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeLab.cCode);
    setCopied(true);
    toast.success('Lab C source code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = () => {
    if (!isCompleted) {
      markLabComplete(activeLab.id);
      addXP(100);
      toast.success('Lab Experiment Completed! +100 XP Earned 🧪');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Layers className="w-8 h-8 text-orange-500" />
            15 SRM University DSA Lab Experiments
          </h1>
          <p className="text-muted text-sm mt-1">
            Complete syllabus lab manual: Aim, Theory, Algorithm, C Source, Output, and Viva Voce preparation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lab Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">
            Experiments (1 - 15)
          </span>
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {LAB_EXPERIMENTS.map((lab) => {
              const isSelected = activeLab.id === lab.id;
              const isDone = progress.completedLabs.includes(lab.id);

              return (
                <button
                  key={lab.id}
                  onClick={() => setActiveLab(lab)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-orange-500/10 border-orange-500 text-foreground'
                      : 'bg-card border-card-border hover:border-gray-400 text-muted hover:text-foreground'
                  }`}
                >
                  <span className="truncate pr-2">
                    Exp {lab.expNumber}: {lab.title}
                  </span>
                  {isDone && <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Experiment Detail Manual */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div
            key={activeLab.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-8 rounded-2xl bg-card border border-card-border space-y-6"
          >
            {/* Title & Complete Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-card-border">
              <div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-500 font-bold">
                  Unit {activeLab.unit} • Experiment #{activeLab.expNumber}
                </span>
                <h2 className="text-2xl font-bold mt-2">{activeLab.title}</h2>
              </div>

              <button
                onClick={handleComplete}
                disabled={isCompleted}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                    : 'bg-orange-600 hover:bg-orange-500 text-white shadow'
                }`}
              >
                <CheckCircle2 size={16} />
                {isCompleted ? 'Lab Verified' : 'Mark Lab Complete (+100 XP)'}
              </button>
            </div>

            {/* Aim */}
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50 space-y-1">
              <span className="text-xs font-bold text-foreground uppercase tracking-wide">Aim:</span>
              <p className="text-xs text-muted">{activeLab.aim}</p>
            </div>

            {/* Theory */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-foreground uppercase tracking-wide">Theoretical Background:</span>
              <p className="text-xs text-muted leading-relaxed">{activeLab.theory}</p>
            </div>

            {/* Algorithm */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wide">Algorithm Steps:</span>
              <ol className="list-decimal pl-5 space-y-1 text-xs text-muted">
                {activeLab.algorithm.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            {/* C Source Code */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Code2 size={14} className="text-orange-500" /> Lab Program C Code:
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-muted hover:text-foreground px-2.5 py-1 rounded-lg border border-card-border"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-gray-950 text-gray-200 text-xs font-mono overflow-x-auto border border-gray-800">
                <code>{activeLab.cCode}</code>
              </pre>
            </div>

            {/* Sample Output */}
            <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-1.5 text-xs font-mono">
              <span className="text-gray-500 flex items-center gap-1">
                <Terminal size={12} /> Expected Lab Execution Output:
              </span>
              <pre className="text-emerald-400 whitespace-pre-wrap">{activeLab.sampleOutput}</pre>
            </div>

            {/* Viva Voce Questions */}
            <div className="space-y-3 pt-4 border-t border-card-border">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <HelpCircle size={16} className="text-amber-500" /> Viva Voce Oral Examination Questions
              </h3>

              <div className="space-y-3">
                {activeLab.vivaQuestions.map((vq, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800/40 border border-card-border space-y-2">
                    <p className="text-xs font-bold text-foreground">
                      Q{idx + 1}: {vq.question}
                    </p>
                    <button
                      onClick={() =>
                        setShowVivaAnswer((prev) => ({ ...prev, [idx]: !prev[idx] }))
                      }
                      className="text-xs text-indigo-400 hover:underline font-semibold block"
                    >
                      {showVivaAnswer[idx] ? 'Hide Answer' : 'Reveal Model Viva Answer'}
                    </button>
                    {showVivaAnswer[idx] && (
                      <p className="text-xs text-muted pt-1 border-t border-card-border/50">
                        {vq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
