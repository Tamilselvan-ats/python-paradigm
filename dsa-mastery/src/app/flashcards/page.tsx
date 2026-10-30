'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  RotateCw,
  CheckCircle,
  ThumbsUp,
  Flame,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Filter,
} from 'lucide-react';
import { FLASHCARDS, Flashcard } from '@/data/flashcards';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function FlashcardsPage() {
  const [selectedUnit, setSelectedUnit] = useState<number>(0); // 0 = all
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const { progress, updateFlashcard, addXP } = useAppStore();

  const filteredCards = FLASHCARDS.filter((c) => {
    if (selectedUnit !== 0 && c.unit !== selectedUnit) return false;
    return true;
  });

  const card = filteredCards[currentIndex] || FLASHCARDS[0];

  const handleRate = (ease: number, interval: number) => {
    updateFlashcard(card.id, ease, interval);
    addXP(15);
    toast.success('Review logged! +15 XP');
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      toast.success('Completed all cards in this set! 🎉');
      setCurrentIndex(0);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((i) => (i + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((i) => (i - 1 + filteredCards.length) % filteredCards.length);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-teal-500" />
            Smart Spaced Repetition Flashcards
          </h1>
          <p className="text-muted text-sm mt-1">
            Supercharge long-term concept retention using the SM-2 spaced repetition algorithm.
          </p>
        </div>

        {/* Unit Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[0, 1, 2, 3, 4, 5].map((u) => (
            <button
              key={u}
              onClick={() => {
                setSelectedUnit(u);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedUnit === u
                  ? 'bg-teal-600 text-white shadow'
                  : 'bg-card border border-card-border text-muted hover:text-foreground'
              }`}
            >
              {u === 0 ? 'All Units' : `Unit ${u}`}
            </button>
          ))}
        </div>
      </div>

      {/* Progress tracker */}
      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          Card {currentIndex + 1} of {filteredCards.length}
        </span>
        <span className="font-semibold text-teal-500">Category: {card.category}</span>
      </div>

      {/* 3D Flip Flashcard */}
      <div className="flex justify-center">
        <motion.div
          onClick={() => setIsFlipped((f) => !f)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full max-w-xl h-80 rounded-3xl bg-card border border-card-border p-8 flex flex-col justify-between shadow-xl cursor-pointer relative overflow-hidden transition-all duration-300 hover:border-teal-500/50"
        >
          {/* Top Label */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400">
              Unit {card.unit} • {card.topic}
            </span>
            <span className="text-xs text-muted flex items-center gap-1">
              <RotateCw size={12} /> Click to flip
            </span>
          </div>

          {/* Card Body */}
          <div className="my-auto text-center space-y-3">
            <span className="text-xs font-bold tracking-wider uppercase text-muted">
              {isFlipped ? 'Model Answer' : 'Question Prompt'}
            </span>
            <p className="text-lg md:text-xl font-bold text-foreground leading-relaxed">
              {isFlipped ? card.back : card.front}
            </p>
          </div>

          {/* Bottom Prompt */}
          <div className="text-center text-xs text-muted">
            {isFlipped ? 'Rate how well you recalled this concept below' : 'Tap card to reveal answer'}
          </div>
        </motion.div>
      </div>

      {/* SM-2 Ease Rating Controls (When Flipped) */}
      <div className="flex flex-col items-center gap-4">
        {isFlipped ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleRate(1.5, 1)}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition-all"
            >
              Hard (1 Day)
            </button>
            <button
              onClick={() => handleRate(2.5, 3)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-all"
            >
              Good (3 Days)
            </button>
            <button
              onClick={() => handleRate(3.0, 7)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all"
            >
              Easy (7 Days)
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-card-border hover:bg-card text-xs font-semibold text-muted hover:text-foreground transition-all"
            >
              <ArrowLeft size={14} /> Previous
            </button>
            <button
              onClick={() => setIsFlipped(true)}
              className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow transition-all"
            >
              Reveal Answer
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-card-border hover:bg-card text-xs font-semibold text-muted hover:text-foreground transition-all"
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
