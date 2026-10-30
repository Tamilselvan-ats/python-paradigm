'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, Search } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface SearchVisualizerProps {
  algorithm: 'linear' | 'binary';
}

interface SearchStep {
  array: number[];
  current: number;
  low?: number;
  mid?: number;
  high?: number;
  found: boolean | null;     // null = in progress, true = found, false = not found
  eliminated: number[];       // indices that have been eliminated
  description: string;
}

// ── Step generators ────────────────────────────────────────────────────────────
function generateLinearSearchSteps(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  steps.push({ array: arr, current: -1, found: null, eliminated: [], description: `Searching for ${target} using Linear Search` });

  for (let i = 0; i < arr.length; i++) {
    steps.push({ array: arr, current: i, found: null, eliminated: Array.from({ length: i }, (_, k) => k), description: `Checking index ${i}: value ${arr[i]} ${arr[i] === target ? '== ' : '!= '}${target}` });
    if (arr[i] === target) {
      steps.push({ array: arr, current: i, found: true, eliminated: [], description: `Found ${target} at index ${i}!` });
      return steps;
    }
  }
  steps.push({ array: arr, current: -1, found: false, eliminated: Array.from({ length: arr.length }, (_, i) => i), description: `${target} not found in the array` });
  return steps;
}

function generateBinarySearchSteps(arr: number[], target: number): SearchStep[] {
  const sorted = [...arr].sort((a, b) => a - b);
  const steps: SearchStep[] = [];
  const eliminated: number[] = [];

  steps.push({ array: sorted, current: -1, low: 0, mid: undefined, high: sorted.length - 1, found: null, eliminated: [], description: `Searching for ${target} using Binary Search (sorted array)` });

  let low = 0;
  let high = sorted.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    steps.push({ array: sorted, current: mid, low, mid, high, found: null, eliminated: [...eliminated], description: `low=${low}, high=${high}, mid=${mid} → arr[${mid}]=${sorted[mid]}` });

    if (sorted[mid] === target) {
      steps.push({ array: sorted, current: mid, low, mid, high, found: true, eliminated: [], description: `Found ${target} at index ${mid}!` });
      return steps;
    } else if (sorted[mid] < target) {
      for (let i = low; i <= mid; i++) eliminated.push(i);
      steps.push({ array: sorted, current: mid, low: mid + 1, mid, high, found: null, eliminated: [...eliminated], description: `${sorted[mid]} < ${target} → search right half` });
      low = mid + 1;
    } else {
      for (let i = mid; i <= high; i++) eliminated.push(i);
      steps.push({ array: sorted, current: mid, low, mid, high: mid - 1, found: null, eliminated: [...eliminated], description: `${sorted[mid]} > ${target} → search left half` });
      high = mid - 1;
    }
  }

  steps.push({ array: sorted, current: -1, found: false, eliminated: Array.from({ length: sorted.length }, (_, i) => i), description: `${target} not found in the array` });
  return steps;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function randomSortedArray(size: number): number[] {
  const arr: number[] = [];
  let v = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < size; i++) {
    arr.push(v);
    v += Math.floor(Math.random() * 8) + 1;
  }
  return arr;
}

function randomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function SearchVisualizer({ algorithm }: SearchVisualizerProps) {
  const [arraySize] = useState(15);
  const [speed, setSpeed] = useState(50);
  const [target, setTarget] = useState('');
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [array, setArray] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentState: SearchStep = steps[currentStep] ?? { array: array, current: -1, found: null, eliminated: [], description: 'Set a target and press Search' };

  // Generate initial array
  useEffect(() => {
    const arr = algorithm === 'binary' ? randomSortedArray(arraySize) : randomArray(arraySize);
    setArray(arr);
    setSteps([]);
    setCurrentStep(0);
  }, [algorithm, arraySize]);

  const generateNew = () => {
    stop();
    const arr = algorithm === 'binary' ? randomSortedArray(arraySize) : randomArray(arraySize);
    setArray(arr);
    setSteps([]);
    setCurrentStep(0);
    setTarget('');
  };

  const startSearch = useCallback(() => {
    const t = Number(target);
    if (isNaN(t) || target.trim() === '') return;
    stop();
    const gen = algorithm === 'linear' ? generateLinearSearchSteps : generateBinarySearchSteps;
    const s = gen(array, t);
    setSteps(s);
    setCurrentStep(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, array, algorithm]);

  // Playback
  const stop = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  const stepForward = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= steps.length - 1) { stop(); return; }
    const delay = Math.max(100, 1010 - speed * 10);
    timerRef.current = setTimeout(() => stepForward(), delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, currentStep, speed, steps.length, stop, stepForward]);

  const play = () => {
    if (steps.length === 0) { startSearch(); }
    if (currentStep >= steps.length - 1) setCurrentStep(0);
    setIsPlaying(true);
  };

  const reset = () => { stop(); setCurrentStep(0); };

  const comparisons = steps.slice(0, currentStep + 1).filter(s => s.current >= 0).length;

  // Cell color
  const cellColor = (index: number) => {
    const s = currentState;
    if (s.found === true && s.current === index) return 'bg-emerald-500 ring-2 ring-emerald-300 scale-110';
    if (s.current === index) return 'bg-amber-500 ring-2 ring-amber-300';
    if (s.eliminated.includes(index)) return 'bg-gray-700 opacity-40';
    if (algorithm === 'binary') {
      if (s.low !== undefined && index === s.low) return 'bg-blue-500';
      if (s.high !== undefined && index === s.high) return 'bg-purple-500';
    }
    return 'bg-blue-500/70';
  };

  const algoName = algorithm === 'linear' ? 'Linear Search' : 'Binary Search';

  return (
    <div className="w-full rounded-2xl bg-gray-900 border border-gray-800 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{algoName}</h2>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="px-2 py-1 rounded bg-gray-800">Time: {algorithm === 'linear' ? 'O(n)' : 'O(log n)'}</span>
          <span className="px-2 py-1 rounded bg-gray-800">Comparisons: {comparisons}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Target</label>
          <input
            type="number"
            value={target}
            onChange={e => setTarget(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && startSearch()}
            className="w-24 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500"
            placeholder="val"
          />
        </div>
        <motion.button whileTap={{ scale: 0.93 }} onClick={startSearch} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm transition-colors">
          <Search size={14} /> Search
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={isPlaying ? stop : play} disabled={steps.length === 0} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium disabled:opacity-40 transition-colors">
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          {isPlaying ? 'Pause' : 'Play'}
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={stepForward} disabled={steps.length === 0 || currentStep >= steps.length - 1} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm disabled:opacity-40 transition-colors">
          <SkipForward size={14} /> Step
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={reset} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors">
          <RotateCcw size={14} /> Reset
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={generateNew} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors">
          <Shuffle size={14} /> New Array
        </motion.button>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-gray-500">Speed</span>
          <input type="range" min={1} max={100} value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-24 accent-emerald-500" />
        </div>
      </div>

      {/* Array visualization */}
      <div className="bg-gray-950 rounded-xl p-6 min-h-[120px]">
        <div className="flex flex-wrap gap-2 justify-center">
          {currentState.array.map((val, i) => (
            <motion.div
              key={i}
              layout
              animate={{ scale: currentState.current === i ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`relative flex flex-col items-center`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${cellColor(i)}`}>
                {val}
              </div>
              <span className="text-[10px] text-gray-600 mt-1 font-mono">{i}</span>

              {/* Binary search pointers */}
              {algorithm === 'binary' && currentState.low !== undefined && currentState.high !== undefined && (
                <>
                  {currentState.low === i && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-5 text-[10px] text-blue-400 font-mono font-bold">low</motion.span>
                  )}
                  {currentState.mid === i && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-5 text-[10px] text-amber-400 font-mono font-bold">mid</motion.span>
                  )}
                  {currentState.high === i && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-5 text-[10px] text-purple-400 font-mono font-bold">high</motion.span>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Step description */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-sm rounded-lg px-4 py-2 ${currentState.found === true ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : currentState.found === false ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-gray-800 text-gray-300'}`}
      >
        {currentState.description}
      </motion.div>

      {/* Result */}
      <AnimatePresence>
        {currentState.found !== null && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`text-center text-lg font-bold ${currentState.found ? 'text-emerald-400' : 'text-red-400'}`}>
            {currentState.found ? '✓ Element Found!' : '✗ Element Not Found'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500" /> Current</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500" /> Found</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-700 opacity-40" /> Eliminated</span>
        {algorithm === 'binary' && <>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500" /> Low</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-500" /> High</span>
        </>}
      </div>
    </div>
  );
}
