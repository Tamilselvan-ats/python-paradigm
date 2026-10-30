'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowDown, RotateCcw, ArrowUp } from 'lucide-react';

export default function HeapVisualizer() {
  const [heapType, setHeapType] = useState<'max' | 'min'>('max');
  const [heap, setHeap] = useState<number[]>([90, 75, 80, 50, 60, 70, 65]);
  const [inputValue, setInputValue] = useState('');
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);
  const [message, setMessage] = useState('Binary Heap: complete binary tree stored compactly in an array.');

  // Heapify-Up
  const handleInsert = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    const nextHeap = [...heap, val];
    setHeap(nextHeap);
    setInputValue('');

    let idx = nextHeap.length - 1;
    setHighlightIdx(idx);
    setMessage(`Inserted ${val} at the end of heap array (index ${idx}). Running Heapify-Up...`);
    await new Promise((r) => setTimeout(r, 600));

    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const condition =
        heapType === 'max'
          ? nextHeap[idx] > nextHeap[parentIdx]
          : nextHeap[idx] < nextHeap[parentIdx];

      if (condition) {
        setMessage(`Swapping child ${nextHeap[idx]} with parent ${nextHeap[parentIdx]}`);
        const temp = nextHeap[idx];
        nextHeap[idx] = nextHeap[parentIdx];
        nextHeap[parentIdx] = temp;
        setHeap([...nextHeap]);
        setHighlightIdx(parentIdx);
        idx = parentIdx;
        await new Promise((r) => setTimeout(r, 700));
      } else {
        break;
      }
    }
    setHighlightIdx(null);
    setMessage(`Heapify-Up complete. ${heapType.toUpperCase()} Heap property satisfied.`);
  };

  // Extract Root (Heapify-Down)
  const handleExtract = async () => {
    if (heap.length === 0) return;
    if (heap.length === 1) {
      const rootVal = heap[0];
      setHeap([]);
      setMessage(`Extracted root ${rootVal}. Heap is now empty.`);
      return;
    }

    const nextHeap = [...heap];
    const rootVal = nextHeap[0];
    const lastVal = nextHeap.pop()!;
    nextHeap[0] = lastVal;
    setHeap([...nextHeap]);

    setMessage(`Extracted root ${rootVal}. Replaced root with last element ${lastVal}. Running Heapify-Down...`);
    await new Promise((r) => setTimeout(r, 600));

    let idx = 0;
    while (true) {
      let targetIdx = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;

      if (heapType === 'max') {
        if (left < nextHeap.length && nextHeap[left] > nextHeap[targetIdx]) targetIdx = left;
        if (right < nextHeap.length && nextHeap[right] > nextHeap[targetIdx]) targetIdx = right;
      } else {
        if (left < nextHeap.length && nextHeap[left] < nextHeap[targetIdx]) targetIdx = left;
        if (right < nextHeap.length && nextHeap[right] < nextHeap[targetIdx]) targetIdx = right;
      }

      if (targetIdx !== idx) {
        setMessage(`Swapping parent ${nextHeap[idx]} with child ${nextHeap[targetIdx]}`);
        const temp = nextHeap[idx];
        nextHeap[idx] = nextHeap[targetIdx];
        nextHeap[targetIdx] = temp;
        setHeap([...nextHeap]);
        setHighlightIdx(targetIdx);
        idx = targetIdx;
        await new Promise((r) => setTimeout(r, 700));
      } else {
        break;
      }
    }
    setHighlightIdx(null);
    setMessage(`Heapify-Down complete. New root is ${nextHeap[0]}.`);
  };

  // Convert Tree Coordinates
  const getCoordinates = (idx: number) => {
    const level = Math.floor(Math.log2(idx + 1));
    const indexInLevel = idx - (Math.pow(2, level) - 1);
    const totalInLevel = Math.pow(2, level);
    const spacing = 650 / (totalInLevel + 1);
    return {
      x: spacing * (indexInLevel + 1),
      y: 45 + level * 65,
    };
  };

  return (
    <div className="w-full rounded-2xl bg-card border border-card-border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Binary Heap Visualizer</h2>
          <p className="text-xs text-muted">Complete Binary Tree Duality: Tree Graph & 1D Array Mapping</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => {
              setHeapType('max');
              setHeap([90, 75, 80, 50, 60, 70, 65]);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              heapType === 'max' ? 'bg-emerald-500 text-white shadow' : 'text-muted'
            }`}
          >
            Max Heap
          </button>
          <button
            onClick={() => {
              setHeapType('min');
              setHeap([10, 25, 15, 50, 40, 30, 35]);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              heapType === 'min' ? 'bg-emerald-500 text-white shadow' : 'text-muted'
            }`}
          >
            Min Heap
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted">Element Value</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Val"
            className="w-24 px-3 py-2 rounded-lg bg-background border border-card-border text-sm"
          />
        </div>
        <button
          onClick={handleInsert}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
        >
          <Plus size={14} /> Insert (Heapify-Up)
        </button>
        <button
          onClick={handleExtract}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
        >
          <ArrowDown size={14} /> Extract Root ({heapType === 'max' ? 'Max' : 'Min'})
        </button>
        <button
          onClick={() => {
            setHeap(heapType === 'max' ? [90, 75, 80, 50, 60, 70, 65] : [10, 25, 15, 50, 40, 30, 35]);
            setMessage('Heap reset to default structure.');
          }}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium transition-colors ml-auto"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Tree Visualization Stage */}
      <div className="bg-gray-950 rounded-xl p-4 overflow-x-auto min-h-[260px] flex justify-center">
        <svg width={650} height={250} className="overflow-visible">
          {heap.map((_, i) => {
            if (i === 0) return null;
            const parentIdx = Math.floor((i - 1) / 2);
            const parentCoord = getCoordinates(parentIdx);
            const currentCoord = getCoordinates(i);
            return (
              <line
                key={`line-${i}`}
                x1={parentCoord.x}
                y1={parentCoord.y}
                x2={currentCoord.x}
                y2={currentCoord.y}
                stroke="#475569"
                strokeWidth={2}
              />
            );
          })}

          {heap.map((val, i) => {
            const coord = getCoordinates(i);
            return (
              <g key={`node-${i}`}>
                <motion.circle
                  cx={coord.x}
                  cy={coord.y}
                  r={20}
                  animate={{
                    scale: highlightIdx === i ? 1.25 : 1,
                    fill: highlightIdx === i ? '#f59e0b' : '#0284c7',
                  }}
                  stroke="#1e293b"
                  strokeWidth={2.5}
                />
                <text
                  x={coord.x}
                  y={coord.y + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={12}
                  fontWeight="bold"
                >
                  {val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Synchronized 1D Array Representation */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-muted">Contiguous Array Mapping:</span>
        <div className="flex flex-wrap gap-2 p-3 bg-gray-950 rounded-xl">
          {heap.map((val, i) => (
            <div key={`arr-${i}`} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-lg border flex items-center justify-center font-bold text-sm text-white transition-all ${
                  highlightIdx === i
                    ? 'bg-amber-500 border-amber-300 ring-2 ring-amber-400'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                {val}
              </div>
              <span className="text-[10px] font-mono text-gray-400 mt-1">[{i}]</span>
            </div>
          ))}
          {heap.length === 0 && <span className="text-xs text-muted p-2">Empty Heap</span>}
        </div>
      </div>

      {/* Status Message */}
      <div className="p-3 bg-gray-100 dark:bg-gray-800/80 rounded-xl text-xs font-mono text-foreground flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        {message}
      </div>
    </div>
  );
}
