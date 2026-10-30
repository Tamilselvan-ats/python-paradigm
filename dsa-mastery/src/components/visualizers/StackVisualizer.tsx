'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, Eye, RotateCcw, AlertTriangle } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface StackItem {
  id: string;
  value: number;
}

interface LogEntry {
  id: string;
  operation: string;
  detail: string;
  type: 'push' | 'pop' | 'peek' | 'error';
}

const MAX_SIZE_DEFAULT = 8;

const COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500',
  'bg-pink-500', 'bg-cyan-500', 'bg-orange-500', 'bg-indigo-500',
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function StackVisualizer() {
  const [stack, setStack] = useState<StackItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [maxSize, setMaxSize] = useState(MAX_SIZE_DEFAULT);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [peekHighlight, setPeekHighlight] = useState(false);
  const [warning, setWarning] = useState('');

  const uid = () => Math.random().toString(36).slice(2, 8);

  const addLog = useCallback((operation: string, detail: string, type: LogEntry['type']) => {
    setLog(prev => [{ id: uid(), operation, detail, type }, ...prev].slice(0, 20));
  }, []);

  const showWarning = (msg: string) => {
    setWarning(msg);
    setTimeout(() => setWarning(''), 2000);
  };

  const push = useCallback(() => {
    const val = Number(inputValue);
    if (isNaN(val) || inputValue.trim() === '') { showWarning('Enter a valid number'); return; }
    if (stack.length >= maxSize) {
      showWarning('Stack Overflow! Maximum size reached.');
      addLog('PUSH', `Overflow – ${val} rejected`, 'error');
      return;
    }
    setStack(prev => [...prev, { id: uid(), value: val }]);
    addLog('PUSH', `Pushed ${val}`, 'push');
    setInputValue('');
  }, [inputValue, stack.length, maxSize, addLog]);

  const pop = useCallback(() => {
    if (stack.length === 0) {
      showWarning('Stack Underflow! Stack is empty.');
      addLog('POP', 'Underflow – stack empty', 'error');
      return;
    }
    const top = stack[stack.length - 1];
    setStack(prev => prev.slice(0, -1));
    addLog('POP', `Popped ${top.value}`, 'pop');
  }, [stack, addLog]);

  const peek = useCallback(() => {
    if (stack.length === 0) {
      showWarning('Stack is empty, nothing to peek.');
      return;
    }
    setPeekHighlight(true);
    addLog('PEEK', `Top = ${stack[stack.length - 1].value}`, 'peek');
    setTimeout(() => setPeekHighlight(false), 1200);
  }, [stack, addLog]);

  const reset = () => {
    setStack([]);
    setLog([]);
    setWarning('');
    setPeekHighlight(false);
  };

  const logColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'push': return 'text-emerald-400';
      case 'pop': return 'text-red-400';
      case 'peek': return 'text-amber-400';
      case 'error': return 'text-red-500';
    }
  };

  return (
    <div className="w-full rounded-2xl bg-gray-900 border border-gray-800 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Stack Visualizer</h2>
        <div className="text-xs text-gray-500">Size: {stack.length}/{maxSize}</div>
      </div>

      {/* Warning */}
      <AnimatePresence>
        {warning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2"
          >
            <AlertTriangle size={14} /> {warning}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Value</label>
          <input
            type="number"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && push()}
            className="w-24 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-emerald-500"
            placeholder="val"
          />
        </div>
        <motion.button whileTap={{ scale: 0.93 }} onClick={push} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors">
          <ArrowUp size={14} /> Push
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={pop} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors">
          <ArrowDown size={14} /> Pop
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={peek} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm transition-colors">
          <Eye size={14} /> Peek
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={reset} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm transition-colors">
          <RotateCcw size={14} /> Reset
        </motion.button>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-gray-500">Max Size</span>
          <input type="range" min={3} max={15} value={maxSize} onChange={e => setMaxSize(Number(e.target.value))} className="w-20 accent-blue-500" />
          <span className="text-xs text-gray-400 w-4">{maxSize}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Stack visualization */}
        <div className="flex-1 bg-gray-950 rounded-xl p-6 flex flex-col items-center justify-end min-h-[360px]">
          {/* Top label */}
          {stack.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 mb-2"
            >
              <span className="text-xs text-emerald-400 font-mono">TOP →</span>
            </motion.div>
          )}

          {/* Stack container */}
          <div className="w-48 flex flex-col-reverse gap-1 border-b-4 border-l-4 border-r-4 border-gray-700 rounded-b-lg px-2 pb-2 pt-1 min-h-[40px]">
            <AnimatePresence mode="popLayout">
              {stack.map((item, i) => {
                const isTop = i === stack.length - 1;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: -50, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      boxShadow: isTop && peekHighlight ? '0 0 20px rgba(245,158,11,0.5)' : 'none',
                    }}
                    exit={{ opacity: 0, x: 80, scale: 0.6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className={`${COLORS[i % COLORS.length]} rounded-lg py-2.5 text-center text-white font-bold text-sm relative ${isTop && peekHighlight ? 'ring-2 ring-amber-400' : ''}`}
                  >
                    {item.value}
                    {isTop && (
                      <span className="absolute -right-14 top-1/2 -translate-y-1/2 text-[10px] text-emerald-400 font-mono">
                        ← top
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {stack.length === 0 && (
              <div className="text-center text-gray-600 text-sm py-8 italic">Empty</div>
            )}
          </div>

          {/* Capacity bar */}
          <div className="w-48 mt-4">
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${(stack.length / maxSize) * 100}%` }}
                className={`h-full rounded-full ${stack.length >= maxSize ? 'bg-red-500' : 'bg-emerald-500'}`}
              />
            </div>
          </div>
        </div>

        {/* Operations log */}
        <div className="w-full lg:w-64 bg-gray-800 rounded-xl p-4 max-h-[400px] overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Operations Log</h3>
          <div className="space-y-1.5">
            <AnimatePresence>
              {log.map(entry => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs flex items-start gap-2"
                >
                  <span className={`font-mono font-bold ${logColor(entry.type)} min-w-[40px]`}>{entry.operation}</span>
                  <span className="text-gray-400">{entry.detail}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {log.length === 0 && <p className="text-xs text-gray-600 italic">No operations yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
