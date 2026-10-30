'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Flame,
  Zap,
  Target,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  BookOpen,
  Award,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { TOPICS, COURSE_UNITS } from '@/data/curriculum';
import { PROBLEMS } from '@/data/problems';
import { LAB_EXPERIMENTS } from '@/data/labs';

export default function ProgressPage() {
  const { progress } = useAppStore();

  const totalTopics = TOPICS.length;
  const totalProblems = PROBLEMS.length;
  const totalLabs = LAB_EXPERIMENTS.length;

  const topicPercent = Math.round((progress.completedTopics.length / totalTopics) * 100);
  const problemPercent = Math.round((progress.completedProblems.length / totalProblems) * 100);
  const labPercent = Math.round((progress.completedLabs.length / totalLabs) * 100);

  // Weak Topic Detection: Units where completed topic ratio is lowest
  const unitStats = COURSE_UNITS.map((u) => {
    const unitTopics = TOPICS.filter((t) => t.unitId === u.id);
    const completed = unitTopics.filter((t) => progress.completedTopics.includes(t.id)).length;
    const ratio = completed / unitTopics.length;
    return { ...u, completed, total: unitTopics.length, ratio };
  });

  const weakUnits = [...unitStats].sort((a, b) => a.ratio - b.ratio).filter((u) => u.ratio < 1);

  // Achievements Showcase
  const achievements = [
    {
      id: 'first-step',
      title: 'First Step',
      desc: 'Complete your first DSA topic',
      unlocked: progress.completedTopics.length >= 1,
      icon: '🌱',
    },
    {
      id: 'streak-master',
      title: 'Dedicated Learner',
      desc: 'Maintain a 3+ day streak',
      unlocked: progress.streak >= 3,
      icon: '🔥',
    },
    {
      id: 'problem-solver',
      title: 'Algorithm Apprentice',
      desc: 'Solve 3 practice problems',
      unlocked: progress.completedProblems.length >= 3,
      icon: '💻',
    },
    {
      id: 'lab-scientist',
      title: 'Lab Certified',
      desc: 'Complete 5 university lab experiments',
      unlocked: progress.completedLabs.length >= 5,
      icon: '🧪',
    },
    {
      id: 'level-5',
      title: 'Rising Star',
      desc: 'Reach Level 5 (500+ XP)',
      unlocked: progress.level >= 5,
      icon: '⭐',
    },
    {
      id: 'unit-master',
      title: 'Data Structure Virtuoso',
      desc: 'Complete all topics in at least one unit',
      unlocked: unitStats.some((u) => u.ratio === 1),
      icon: '👑',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-indigo-500" />
          Progress & Readiness Analytics
        </h1>
        <p className="text-muted text-sm mt-1">
          Detailed metrics, weak topic diagnosis, exam readiness forecast, and milestone badges.
        </p>
      </div>

      {/* Primary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Streak', value: `${progress.streak} Days`, icon: Flame, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Total XP Earned', value: `${progress.xp} XP`, icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Level Attained', value: `Level ${progress.level}`, icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Topics Mastered', value: `${progress.completedTopics.length}/${totalTopics}`, icon: Target, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        ].map((card, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-card border border-card-border flex items-center gap-4">
            <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-xs text-muted font-medium">{card.label}</p>
              <p className="text-xl font-bold text-foreground">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bars for Topics, Problems, and Labs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-card-border space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted">Curriculum Mastery</span>
            <span className="text-emerald-500 font-bold">{topicPercent}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${topicPercent}%` }} />
          </div>
          <p className="text-[11px] text-muted">{progress.completedTopics.length} of {totalTopics} topics studied</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-card-border space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted">Coding Problems</span>
            <span className="text-blue-500 font-bold">{problemPercent}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${problemPercent}%` }} />
          </div>
          <p className="text-[11px] text-muted">{progress.completedProblems.length} of {totalProblems} problems solved</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-card-border space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted">Lab Experiments</span>
            <span className="text-orange-500 font-bold">{labPercent}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${labPercent}%` }} />
          </div>
          <p className="text-[11px] text-muted">{progress.completedLabs.length} of {totalLabs} experiments completed</p>
        </div>
      </div>

      {/* Weak Topic Detection Alert */}
      {weakUnits.length > 0 && (
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-foreground">AI Weak Topic Detection & Diagnostic</h3>
          </div>
          <p className="text-xs text-muted">
            Based on your activity, the following units have lower completion and practice scores. Prioritize these for upcoming tests:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {weakUnits.slice(0, 2).map((u) => (
              <div key={u.id} className="p-3 rounded-xl bg-card border border-card-border flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold">{u.title}</h4>
                  <p className="text-[11px] text-muted">{u.completed} / {u.total} topics completed</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500">
                  Priority Focus
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Showcase */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" /> Earned Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between space-y-2 transition-all ${
                ach.unlocked
                  ? 'bg-card border-emerald-500/40 shadow-sm'
                  : 'bg-gray-100/40 dark:bg-gray-900/40 border-card-border opacity-50 grayscale'
              }`}
            >
              <span className="text-3xl">{ach.icon}</span>
              <div>
                <h4 className="text-xs font-bold text-foreground">{ach.title}</h4>
                <p className="text-[10px] text-muted mt-0.5">{ach.desc}</p>
              </div>
              <span
                className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                  ach.unlocked ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                }`}
              >
                {ach.unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
