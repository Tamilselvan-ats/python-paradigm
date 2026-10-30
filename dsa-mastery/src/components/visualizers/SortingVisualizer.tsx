'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, ChevronRight } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface SortingVisualizerProps {
  algorithm: 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';
}

interface SortStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  description: string;
}

// ── Pseudocode map ─────────────────────────────────────────────────────────────
const PSEUDOCODE: Record<string, string[]> = {
  bubble: [
    'for i = 0 to n-1:',
    '  for j = 0 to n-i-2:',
    '    if arr[j] > arr[j+1]:',
    '      swap(arr[j], arr[j+1])',
  ],
  selection: [
    'for i = 0 to n-1:',
    '  min_idx = i',
    '  for j = i+1 to n:',
    '    if arr[j] < arr[min_idx]:',
    '      min_idx = j',
    '  swap(arr[i], arr[min_idx])',
  ],
  insertion: [
    'for i = 1 to n:',
    '  key = arr[i]',
    '  j = i - 1',
    '  while j >= 0 and arr[j] > key:',
    '    arr[j+1] = arr[j]',
    '    j = j - 1',
    '  arr[j+1] = key',
  ],
  merge: [
    'mergeSort(arr, l, r):',
    '  if l < r:',
    '    mid = (l + r) / 2',
    '    mergeSort(arr, l, mid)',
    '    mergeSort(arr, mid+1, r)',
    '    merge(arr, l, mid, r)',
  ],
  quick: [
    'quickSort(arr, low, high):',
    '  if low < high:',
    '    pi = partition(arr, low, high)',
    '    quickSort(arr, low, pi-1)',
    '    quickSort(arr, pi+1, high)',
    'partition: pivot = arr[high]',
    '  i = low - 1',
    '  for j = low to high-1:',
    '    if arr[j] <= pivot: swap',
  ],
};

const TIME_COMPLEXITY: Record<string, { best: string; avg: string; worst: string }> = {
  bubble:    { best: 'O(n)',      avg: 'O(n²)',     worst: 'O(n²)' },
  selection: { best: 'O(n²)',     avg: 'O(n²)',     worst: 'O(n²)' },
  insertion: { best: 'O(n)',      avg: 'O(n²)',     worst: 'O(n²)' },
  merge:     { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' },
  quick:     { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)' },
};

// ── Step generators ────────────────────────────────────────────────────────────
function generateBubbleSortSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];

  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted], description: 'Starting Bubble Sort' });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ array: [...a], comparing: [j, j + 1], swapping: [], sorted: [...sorted], description: `Comparing index ${j} (${a[j]}) and ${j + 1} (${a[j + 1]})` });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ array: [...a], comparing: [], swapping: [j, j + 1], sorted: [...sorted], description: `Swapped ${a[j + 1]} and ${a[j]}` });
      }
    }
    sorted.push(n - 1 - i);
  }
  sorted.push(0);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted], description: 'Sorting complete!' });
  return steps;
}

function generateSelectionSortSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];

  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [], description: 'Starting Selection Sort' });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      steps.push({ array: [...a], comparing: [minIdx, j], swapping: [], sorted: [...sorted], description: `Comparing min (${a[minIdx]}) with ${a[j]}` });
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({ array: [...a], comparing: [], swapping: [i, minIdx], sorted: [...sorted], description: `Swapped index ${i} and ${minIdx}` });
    }
    sorted.push(i);
  }
  sorted.push(n - 1);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted], description: 'Sorting complete!' });
  return steps;
}

function generateInsertionSortSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [0];

  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [0], description: 'Starting Insertion Sort – first element is sorted' });

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    steps.push({ array: [...a], comparing: [i], swapping: [], sorted: [...sorted], description: `Inserting ${key} into sorted portion` });
    while (j >= 0 && a[j] > key) {
      steps.push({ array: [...a], comparing: [j, j + 1], swapping: [], sorted: [...sorted], description: `${a[j]} > ${key}, shifting right` });
      a[j + 1] = a[j];
      steps.push({ array: [...a], comparing: [], swapping: [j, j + 1], sorted: [...sorted], description: `Shifted ${a[j]} to index ${j + 1}` });
      j--;
    }
    a[j + 1] = key;
    sorted.push(i);
    steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted], description: `Placed ${key} at index ${j + 1}` });
  }

  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, i) => i), description: 'Sorting complete!' });
  return steps;
}

function generateMergeSortSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const sorted: number[] = [];

  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [], description: 'Starting Merge Sort' });

  function mergeSort(start: number, end: number) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    mergeSort(start, mid);
    mergeSort(mid + 1, end);
    merge(start, mid, end);
  }

  function merge(start: number, mid: number, end: number) {
    const left = a.slice(start, mid + 1);
    const right = a.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    steps.push({ array: [...a], comparing: Array.from({ length: end - start + 1 }, (_, x) => x + start), swapping: [], sorted: [...sorted], description: `Merging [${start}..${mid}] and [${mid + 1}..${end}]` });

    while (i < left.length && j < right.length) {
      steps.push({ array: [...a], comparing: [start + i, mid + 1 + j], swapping: [], sorted: [...sorted], description: `Comparing ${left[i]} and ${right[j]}` });
      if (left[i] <= right[j]) {
        a[k] = left[i]; i++;
      } else {
        a[k] = right[j]; j++;
      }
      steps.push({ array: [...a], comparing: [], swapping: [k], sorted: [...sorted], description: `Placed ${a[k]} at index ${k}` });
      k++;
    }
    while (i < left.length) { a[k] = left[i]; i++; k++; }
    while (j < right.length) { a[k] = right[j]; j++; k++; }
    steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted], description: `Merged subarray [${start}..${end}]` });
  }

  mergeSort(0, a.length - 1);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: a.length }, (_, i) => i), description: 'Sorting complete!' });
  return steps;
}

function generateQuickSortSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const sorted: number[] = [];

  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [], description: 'Starting Quick Sort' });

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    } else if (low === high) {
      sorted.push(low);
    }
  }

  function partition(low: number, high: number): number {
    const pivot = a[high];
    steps.push({ array: [...a], comparing: [high], swapping: [], sorted: [...sorted], description: `Pivot = ${pivot} (index ${high})` });
    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({ array: [...a], comparing: [j, high], swapping: [], sorted: [...sorted], description: `Comparing ${a[j]} with pivot ${pivot}` });
      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        if (i !== j) {
          steps.push({ array: [...a], comparing: [], swapping: [i, j], sorted: [...sorted], description: `Swapped ${a[j]} and ${a[i]}` });
        }
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    steps.push({ array: [...a], comparing: [], swapping: [i + 1, high], sorted: [...sorted], description: `Pivot placed at index ${i + 1}` });
    sorted.push(i + 1);
    return i + 1;
  }

  quickSort(0, a.length - 1);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({ length: a.length }, (_, i) => i), description: 'Sorting complete!' });
  return steps;
}

const STEP_GENERATORS: Record<string, (arr: number[]) => SortStep[]> = {
  bubble: generateBubbleSortSteps,
  selection: generateSelectionSortSteps,
  insertion: generateInsertionSortSteps,
  merge: generateMergeSortSteps,
  quick: generateQuickSortSteps,
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function randomArray(size: number, max = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 5);
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function SortingVisualizer({ algorithm }: SortingVisualizerProps) {
  const [arraySize, setArraySize] = useState(25);
  const [speed, setSpeed] = useState(50);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Counters
  const comparisons = steps.slice(0, currentStep + 1).filter(s => s.comparing.length > 0).length;
  const swaps = steps.slice(0, currentStep + 1).filter(s => s.swapping.length > 0).length;

  const currentState: SortStep = steps[currentStep] ?? { array: [], comparing: [], swapping: [], sorted: [], description: 'Generate an array to begin' };

  // Generate a new array and compute steps
  const generate = useCallback(() => {
    stop();
    const arr = randomArray(arraySize);
    const gen = STEP_GENERATORS[algorithm];
    const newSteps = gen(arr);
    setSteps(newSteps);
    setCurrentStep(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm, arraySize]);

  // Generate on mount & algorithm change
  useEffect(() => { generate(); }, [generate]);

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
    const delay = Math.max(10, 510 - speed * 5);
    timerRef.current = setTimeout(() => { stepForward(); }, delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, currentStep, speed, steps.length, stop, stepForward]);

  const play = () => {
    if (currentStep >= steps.length - 1) setCurrentStep(0);
    setIsPlaying(true);
  };

  const reset = () => { stop(); setCurrentStep(0); };

  // Bar color
  const barColor = (index: number): string => {
    if (currentState.sorted.includes(index)) return 'bg-emerald-500';
    if (currentState.swapping.includes(index)) return 'bg-red-500';
    if (currentState.comparing.includes(index)) return 'bg-amber-400';
    return 'bg-blue-500';
  };

  const maxVal = Math.max(...(currentState.array.length ? currentState.array : [1]));
  const tc = TIME_COMPLEXITY[algorithm];
  const algoName = algorithm.charAt(0).toUpperCase() + algorithm.slice(1);

  return (
    <div className="w-full rounded-2xl bg-gray-900 border border-gray-800 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-white">{algoName} Sort</h2>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="px-2 py-1 rounded bg-gray-800">Best: {tc.best}</span>
          <span className="px-2 py-1 rounded bg-gray-800">Avg: {tc.avg}</span>
          <span className="px-2 py-1 rounded bg-gray-800">Worst: {tc.worst}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Bars area */}
        <div className="flex-1 min-h-[300px] bg-gray-950 rounded-xl p-4 flex items-end gap-[2px]">
          <AnimatePresence mode="popLayout">
            {currentState.array.map((val, i) => (
              <motion.div
                key={`${i}-${val}`}
                layout
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${(val / maxVal) * 100}%`, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`${barColor(i)} rounded-t-sm flex-1 min-w-[4px] relative group`}
              >
                {arraySize <= 30 && (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {val}
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pseudocode panel */}
        <div className="w-full lg:w-56 bg-gray-800 rounded-xl p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Pseudocode</h3>
          {PSEUDOCODE[algorithm].map((line, i) => (
            <pre key={i} className="text-xs text-emerald-400 font-mono whitespace-pre-wrap">{line}</pre>
          ))}
          <hr className="border-gray-700 my-3" />
          <div className="text-xs text-gray-400 space-y-1">
            <p>Comparisons: <span className="text-amber-400 font-bold">{comparisons}</span></p>
            <p>Swaps: <span className="text-red-400 font-bold">{swaps}</span></p>
            <p>Step: <span className="text-blue-400 font-bold">{currentStep}/{steps.length - 1}</span></p>
          </div>
        </div>
      </div>

      {/* Step description */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-gray-300 bg-gray-800 rounded-lg px-4 py-2 flex items-center gap-2"
      >
        <ChevronRight size={14} className="text-emerald-400 flex-shrink-0" />
        {currentState.description}
      </motion.div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <motion.button whileTap={{ scale: 0.93 }} onClick={generate} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors">
          <Shuffle size={14} /> New Array
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={reset} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors">
          <RotateCcw size={14} /> Reset
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={isPlaying ? stop : play} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors">
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          {isPlaying ? 'Pause' : 'Play'}
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={stepForward} disabled={currentStep >= steps.length - 1} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors disabled:opacity-40">
          <SkipForward size={14} /> Step
        </motion.button>

        {/* Speed slider */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-gray-500">Speed</span>
          <input type="range" min={1} max={100} value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-24 accent-emerald-500" />
        </div>

        {/* Size slider */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Size</span>
          <input type="range" min={5} max={80} value={arraySize} onChange={e => { setArraySize(Number(e.target.value)); }} className="w-24 accent-blue-500" />
          <span className="text-xs text-gray-400 w-6 text-right">{arraySize}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-500" /> Default</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-amber-400" /> Comparing</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-500" /> Swapping</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500" /> Sorted</span>
      </div>
    </div>
  );
}
