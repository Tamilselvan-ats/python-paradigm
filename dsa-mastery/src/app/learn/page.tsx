'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { COURSE_UNITS, TOPICS } from '@/data/curriculum';
import { useAppStore } from '@/lib/store';

export default function LearnPage() {
  const { progress } = useAppStore();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-emerald-500" />
          DSA Curriculum (SRM Syllabus)
        </h1>
        <p className="text-muted text-sm mt-1">
          Master all 5 core units of Data Structures & Algorithms from foundational memory concepts to advanced graph theory.
        </p>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COURSE_UNITS.map((unit) => {
          const unitTopics = TOPICS.filter((t) => t.unitId === unit.id);
          const completedCount = unitTopics.filter((t) =>
            progress.completedTopics.includes(t.id)
          ).length;
          const percent = Math.round((completedCount / (unitTopics.length || 1)) * 100);

          return (
            <Link key={unit.id} href={`/learn/unit/${unit.id}`}>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="rounded-2xl bg-card border border-card-border overflow-hidden flex flex-col h-full hover:border-emerald-500/40 transition-all shadow-sm group"
              >
                <div className={`h-2.5 bg-gradient-to-r ${unit.color}`} />
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{unit.icon}</span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {unit.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg group-hover:text-emerald-500 transition-colors">
                        {unit.title}
                      </h3>
                      <p className="text-xs text-muted font-medium mt-0.5">{unit.subtitle}</p>
                    </div>

                    <p className="text-sm text-muted line-clamp-2">{unit.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-card-border">
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>{completedCount} / {unitTopics.length} topics completed</span>
                      <span className="font-bold">{percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="flex items-center gap-1 text-muted">
                        <Clock size={12} /> ~{unitTopics.length * 20} mins
                      </span>
                      <span className="flex items-center gap-1 text-emerald-500 font-bold group-hover:translate-x-1 transition-transform">
                        Explore Unit <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
