'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import {
  BookOpen,
  Code2,
  FlaskConical,
  Brain,
  Trophy,
  Flame,
  Target,
  TrendingUp,
  Zap,
  GraduationCap,
  Eye,
  Layers,
  CreditCard,
  ArrowRight,
  Star,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const unitCards = [
  {
    id: 1,
    title: 'Introduction',
    description: 'C Programming, Data Structures basics, Complexity Analysis',
    icon: '📚',
    color: 'from-blue-500 to-cyan-500',
    topics: 14,
  },
  {
    id: 2,
    title: 'List Structures',
    description: 'Arrays, Linked Lists, Sparse Matrix, Polynomials',
    icon: '🔗',
    color: 'from-emerald-500 to-teal-500',
    topics: 8,
  },
  {
    id: 3,
    title: 'Stacks & Queues',
    description: 'Stack operations, Queue types, Applications',
    icon: '📦',
    color: 'from-purple-500 to-indigo-500',
    topics: 15,
  },
  {
    id: 4,
    title: 'Trees & Hashing',
    description: 'BST, AVL, B-Trees, Heaps, Hash Tables',
    icon: '🌳',
    color: 'from-amber-500 to-orange-500',
    topics: 11,
  },
  {
    id: 5,
    title: 'Graphs',
    description: 'BFS, DFS, MST, Shortest Path algorithms',
    icon: '🕸️',
    color: 'from-rose-500 to-pink-500',
    topics: 8,
  },
];

const quickActions = [
  { href: '/learn', label: 'Start Learning', icon: BookOpen, color: 'bg-emerald-500' },
  { href: '/practice', label: 'Practice Problems', icon: Code2, color: 'bg-blue-500' },
  { href: '/playground', label: 'Code Playground', icon: FlaskConical, color: 'bg-purple-500' },
  { href: '/visualizer', label: 'Visual Lab', icon: Eye, color: 'bg-amber-500' },
  { href: '/ai-tutor', label: 'AI Tutor', icon: Brain, color: 'bg-rose-500' },
  { href: '/exam', label: 'Exam Prep', icon: GraduationCap, color: 'bg-indigo-500' },
  { href: '/flashcards', label: 'Flashcards', icon: CreditCard, color: 'bg-teal-500' },
  { href: '/labs', label: 'Lab Mode', icon: Layers, color: 'bg-orange-500' },
];

export default function DashboardPage() {
  const { progress } = useAppStore();
  const totalTopics = 56;
  const completedPercent = Math.round(
    (progress.completedTopics.length / totalTopics) * 100
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Hero Section */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-700 p-8 md:p-12 text-white"
      >
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-3"
          >
            Welcome to DSA Mastery ⚡
          </motion.h1>
          <p className="text-lg text-emerald-100 max-w-2xl mb-6">
            Your complete journey to mastering Data Structures & Algorithms.
            Learn interactively, practice with 1000+ problems, and ace your exams
            with AI-powered guidance.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-700 font-semibold hover:bg-emerald-50 transition-colors"
            >
              Start Learning <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ai-tutor"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors"
            >
              <Brain className="w-4 h-4" /> Ask AI Tutor
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute top-1/2 right-12 text-6xl opacity-20 animate-float">🚀</div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Day Streak',
            value: progress.streak,
            icon: Flame,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
          },
          {
            label: 'XP Earned',
            value: progress.xp,
            icon: Zap,
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10',
          },
          {
            label: 'Problems Solved',
            value: progress.completedProblems.length,
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
          },
          {
            label: 'Topics Complete',
            value: progress.completedTopics.length,
            icon: Target,
            color: 'text-rose-500',
            bg: 'bg-rose-500/10',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-card border border-card-border p-4 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        variants={item}
        className="rounded-xl bg-card border border-card-border p-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Overall Progress
          </h2>
          <span className="text-sm text-muted">
            {progress.completedTopics.length}/{totalTopics} topics
          </span>
        </div>
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completedPercent}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
          />
        </div>
        <p className="mt-2 text-sm text-muted">{completedPercent}% complete</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl bg-card border border-card-border p-4 flex items-center gap-3 hover:border-emerald-500/30 transition-colors cursor-pointer"
              >
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm">{action.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Unit Cards */}
      <motion.div variants={item}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-500" />
          Course Units
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unitCards.map((unit, index) => (
            <Link key={unit.id} href={`/learn/unit/${unit.id}`}>
              <motion.div
                variants={item}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl bg-card border border-card-border overflow-hidden cursor-pointer group"
              >
                <div
                  className={`h-2 bg-gradient-to-r ${unit.color}`}
                />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{unit.icon}</span>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-emerald-500 transition-colors">
                        Unit {unit.id}: {unit.title}
                      </h3>
                      <p className="text-xs text-muted">{unit.topics} topics</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted">{unit.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <Clock className="w-3 h-3" />
                      ~{unit.topics * 15} min
                    </div>
                    <div className="flex items-center gap-1 text-xs text-emerald-500 font-medium group-hover:translate-x-1 transition-transform">
                      Start <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Features Highlight */}
      <motion.div variants={item}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'AI-Powered Learning',
              description: 'Chat with Gemini AI for instant explanations, code reviews, and personalized study plans.',
              icon: '🤖',
              gradient: 'from-purple-500/10 to-indigo-500/10',
            },
            {
              title: 'Interactive Visualizations',
              description: 'Watch algorithms come alive with step-by-step animations for sorting, trees, graphs, and more.',
              icon: '🎬',
              gradient: 'from-amber-500/10 to-orange-500/10',
            },
            {
              title: '1000+ Practice Problems',
              description: 'MCQs, coding challenges, debug exercises, and output predictions across all difficulty levels.',
              icon: '💪',
              gradient: 'from-emerald-500/10 to-teal-500/10',
            },
            {
              title: 'Lab Experiments',
              description: '15 complete lab programs with aim, theory, algorithm, code, and viva questions.',
              icon: '🧪',
              gradient: 'from-blue-500/10 to-cyan-500/10',
            },
            {
              title: 'Exam Master Mode',
              description: 'Practice with 2, 5, 7, 10, 13, and 16 mark questions in university exam format.',
              icon: '📝',
              gradient: 'from-rose-500/10 to-pink-500/10',
            },
            {
              title: 'Smart Flashcards',
              description: '500+ flashcards with spaced repetition for long-term retention of DSA concepts.',
              icon: '🃏',
              gradient: 'from-violet-500/10 to-fuchsia-500/10',
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -4 }}
              className={`rounded-xl bg-gradient-to-br ${feature.gradient} border border-card-border p-5`}
            >
              <span className="text-3xl mb-3 block">{feature.icon}</span>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
