'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, RotateCcw, Play, RefreshCw, Grid } from 'lucide-react';

export default function ArrayVisualizer() {
  const [mode, setMode] = useState<'1d' | '2d'>('1d');
  const [array, setArray] = useState<number[]>([15, 28, 42, 67, 89, 94]);
  const [inputValue, setInputValue] = useState('');
  const [indexValue, setIndexValue] = useState('');
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);
  const [message, setMessage] = useState('Select an operation to manipulate the array.');
  const [isProcessing, setIsProcessing] = useState(false);

  // 2D Matrix state
  const [matrixA] = useState([
    [1, 2],
    [3, 4],
  ]);
  const [matrixB] = useState([
    [5, 6],
    [7, 8],
  ]);
  const [matrixC, setMatrixC] = useState<number[][]>([
    [0, 0],
    [0, 0],
  ]);
  const [activeCell, setActiveCell] = useState<{ r: number; c: number; k?: number } | null>(null);

  // 1D Operations
  const handleInsert = () => {
    const val = parseInt(inputValue);
    const idx = parseInt(indexValue);
    if (isNaN(val)) {
      setMessage('Please enter a valid number.');
      return;
    }
    const targetIdx = isNaN(idx) ? array.length : Math.max(0, Math.min(idx, array.length));
    const nextArr = [...array];
    nextArr.splice(targetIdx, 0, val);
    setArray(nextArr);
    setHighlightIdx(targetIdx);
    setMessage(`Inserted ${val} at index ${targetIdx}. Elements shifted right.`);
    setInputValue('');
    setIndexValue('');
    setTimeout(() => setHighlightIdx(null), 1500);
  };

  const handleDelete = () => {
    const idx = parseInt(indexValue);
    if (isNaN(idx) || idx < 0 || idx >= array.length) {
      setMessage(`Enter a valid index between 0 and ${array.length - 1}.`);
      return;
    }
    const val = array[idx];
    setHighlightIdx(idx);
    setMessage(`Deleting element ${val} at index ${idx}...`);
    setTimeout(() => {
      const nextArr = array.filter((_, i) => i !== idx);
      setArray(nextArr);
      setHighlightIdx(null);
      setMessage(`Deleted ${val} at index ${idx}. Remaining elements shifted left.`);
    }, 600);
  };

  const handleSearch = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) {
      setMessage('Enter a value to search for.');
      return;
    }
    setIsProcessing(true);
    let found = false;
    for (let i = 0; i < array.length; i++) {
      setHighlightIdx(i);
      setMessage(`Checking index ${i}: ${array[i]} === ${val}?`);
      await new Promise((r) => setTimeout(r, 600));
      if (array[i] === val) {
        setMessage(`Element ${val} found at index ${i}!`);
        found = true;
        break;
      }
    }
    if (!found) setMessage(`Element ${val} not found in array.`);
    setIsProcessing(false);
  };

  const handleReverse = () => {
    setArray([...array].reverse());
    setMessage('Array reversed in-place.');
  };

  const resetArray = () => {
    setArray([15, 28, 42, 67, 89, 94]);
    setHighlightIdx(null);
    setMessage('Array reset to default values.');
  };

  // 2D Matrix Multiplication Animation
  const runMatrixMultiply = async () => {
    setIsProcessing(true);
    const result = [
      [0, 0],
      [0, 0],
    ];
    setMatrixC([
      [0, 0],
      [0, 0],
    ]);

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        let sum = 0;
        for (let k = 0; k < 2; k++) {
          setActiveCell({ r: i, c: j, k });
          const prod = matrixA[i][k] * matrixB[k][j];
          sum += prod;
          setMessage(
            `Computing C[${i}][${j}] += A[${i}][${k}] (${matrixA[i][k]}) * B[${k}][${j}] (${matrixB[k][j]}) = ${prod} (Current Sum: ${sum})`
          );
          result[i][j] = sum;
          setMatrixC([...result.map((row) => [...row])]);
          await new Promise((r) => setTimeout(r, 900));
        }
      }
    }
    setActiveCell(null);
    setMessage('Matrix multiplication completed: C = A x B.');
    setIsProcessing(false);
  };

  return (
    <div className="w-full rounded-2xl bg-card border border-card-border p-6 space-y-6">
      {/* Mode Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Array & Matrix Visualizer</h2>
          <p className="text-xs text-muted">Contiguous Memory & 2D Matrix Dot Product Operations</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setMode('1d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === '1d' ? 'bg-emerald-500 text-white shadow' : 'text-muted hover:text-foreground'
            }`}
          >
            1D Array
          </button>
          <button
            onClick={() => setMode('2d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === '2d' ? 'bg-emerald-500 text-white shadow' : 'text-muted hover:text-foreground'
            }`}
          >
            2D Matrix Mult
          </button>
        </div>
      </div>

      {mode === '1d' ? (
        <>
          {/* Controls */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted">Value</label>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Val"
                disabled={isProcessing}
                className="w-24 px-3 py-2 rounded-lg bg-background border border-card-border text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted">Index (Optional)</label>
              <input
                type="number"
                value={indexValue}
                onChange={(e) => setIndexValue(e.target.value)}
                placeholder="Idx"
                disabled={isProcessing}
                className="w-24 px-3 py-2 rounded-lg bg-background border border-card-border text-sm"
              />
            </div>

            <button
              onClick={handleInsert}
              disabled={isProcessing}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
            >
              <Plus size={14} /> Insert
            </button>
            <button
              onClick={handleDelete}
              disabled={isProcessing}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
            >
              <Trash2 size={14} /> Delete At Idx
            </button>
            <button
              onClick={handleSearch}
              disabled={isProcessing}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
            >
              <Search size={14} /> Linear Search
            </button>
            <button
              onClick={handleReverse}
              disabled={isProcessing}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
            >
              <RefreshCw size={14} /> Reverse
            </button>
            <button
              onClick={resetArray}
              disabled={isProcessing}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium transition-colors"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          {/* Array Stage */}
          <div className="bg-gray-950 rounded-xl p-8 min-h-[160px] flex flex-col items-center justify-center">
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <AnimatePresence>
                {array.map((val, idx) => (
                  <motion.div
                    key={`${idx}-${val}`}
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: highlightIdx === idx ? 1.15 : 1,
                      opacity: 1,
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md transition-all duration-300 ${
                        highlightIdx === idx
                          ? 'bg-amber-500 ring-4 ring-amber-400/50 shadow-amber-500/50'
                          : 'bg-emerald-600'
                      }`}
                    >
                      {val}
                    </div>
                    <span className="text-[11px] font-mono text-gray-400 mt-1">idx {idx}</span>
                    <span className="text-[9px] font-mono text-gray-500">0x{(1000 + idx * 4).toString(16)}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </>
      ) : (
        /* 2D Matrix Multiplication Mode */
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={runMatrixMultiply}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
            >
              <Play size={16} /> Run Step-by-Step Multiplication
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-950 p-6 rounded-2xl items-center text-center">
            {/* Matrix A */}
            <div className="space-y-2">
              <span className="text-sm font-semibold text-emerald-400">Matrix A (2x2)</span>
              <div className="grid grid-cols-2 gap-2 max-w-[140px] mx-auto">
                {matrixA.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`a-${r}-${c}`}
                      className={`w-14 h-14 rounded-xl border flex items-center justify-center font-bold text-white transition-all ${
                        activeCell?.r === r && activeCell?.k === c
                          ? 'bg-amber-500 border-amber-300 ring-2 ring-amber-400 scale-105'
                          : 'bg-gray-800 border-gray-700'
                      }`}
                    >
                      {val}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Multiply symbol & Matrix B */}
            <div className="space-y-2">
              <span className="text-sm font-semibold text-indigo-400">Matrix B (2x2)</span>
              <div className="grid grid-cols-2 gap-2 max-w-[140px] mx-auto">
                {matrixB.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`b-${r}-${c}`}
                      className={`w-14 h-14 rounded-xl border flex items-center justify-center font-bold text-white transition-all ${
                        activeCell?.k === r && activeCell?.c === c
                          ? 'bg-indigo-500 border-indigo-300 ring-2 ring-indigo-400 scale-105'
                          : 'bg-gray-800 border-gray-700'
                      }`}
                    >
                      {val}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Matrix C Result */}
            <div className="space-y-2">
              <span className="text-sm font-semibold text-amber-400">Result Matrix C (A x B)</span>
              <div className="grid grid-cols-2 gap-2 max-w-[140px] mx-auto">
                {matrixC.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`c-${r}-${c}`}
                      className={`w-14 h-14 rounded-xl border flex items-center justify-center font-bold text-white transition-all ${
                        activeCell?.r === r && activeCell?.c === c
                          ? 'bg-emerald-500 border-emerald-300 ring-4 ring-emerald-400/50 scale-110'
                          : 'bg-gray-800 border-gray-700'
                      }`}
                    >
                      {val}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Message */}
      <div className="p-3 bg-gray-100 dark:bg-gray-800/80 rounded-xl text-xs font-mono text-foreground flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        {message}
      </div>
    </div>
  );
}
