'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightToLine, ArrowLeftFromLine, RotateCcw, AlertTriangle } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface QueueVisualizerProps {
  type: 'linear' | 'circular' | 'deque' | 'priority';
}

interface QueueItem {
  id: string;
  value: number;
  priority?: number;
}

const MAX_SIZE = 10;

const COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500',
  'bg-pink-500', 'bg-cyan-500', 'bg-orange-500', 'bg-indigo-500', 'bg-teal-500', 'bg-rose-500',
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function QueueVisualizer({ type }: QueueVisualizerProps) {
  const [queue, setQueue] = useState<QueueItem[]>([
    { id: 'a', value: 10 },
    { id: 'b', value: 20 },
    { id: 'c', value: 30 },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [priorityValue, setPriorityValue] = useState('');
  const [warning, setWarning] = useState('');
  const [message, setMessage] = useState('');

  const uid = () => Math.random().toString(36).slice(2, 8);

  const showWarning = (msg: string) => { setWarning(msg); setTimeout(() => setWarning(''), 2000); };

  // ── Enqueue ────────────────────────────────────────────────────────────────
  const enqueueRear = useCallback(() => {
    const val = Number(inputValue);
    if (isNaN(val) || inputValue.trim() === '') { showWarning('Enter a valid number'); return; }
    if (queue.length >= MAX_SIZE) { showWarning('Queue is full!'); return; }

    if (type === 'priority') {
      const pri = Number(priorityValue) || 0;
      const item: QueueItem = { id: uid(), value: val, priority: pri };
      setQueue(prev => {
        const a = [...prev, item];
        a.sort((x, y) => (x.priority ?? 0) - (y.priority ?? 0));
        return a;
      });
      setMessage(`Enqueued ${val} with priority ${pri}`);
    } else {
      setQueue(prev => [...prev, { id: uid(), value: val }]);
      setMessage(`Enqueued ${val} at rear`);
    }
    setInputValue('');
    setPriorityValue('');
  }, [inputValue, priorityValue, queue.length, type]);

  const enqueueFront = useCallback(() => {
    if (type !== 'deque') return;
    const val = Number(inputValue);
    if (isNaN(val) || inputValue.trim() === '') { showWarning('Enter a valid number'); return; }
    if (queue.length >= MAX_SIZE) { showWarning('Queue is full!'); return; }
    setQueue(prev => [{ id: uid(), value: val }, ...prev]);
    setMessage(`Enqueued ${val} at front`);
    setInputValue('');
  }, [inputValue, queue.length, type]);

  // ── Dequeue ────────────────────────────────────────────────────────────────
  const dequeueFront = useCallback(() => {
    if (queue.length === 0) { showWarning('Queue is empty!'); return; }
    const item = queue[0];
    setQueue(prev => prev.slice(1));
    setMessage(`Dequeued ${item.value} from front`);
  }, [queue]);

  const dequeueRear = useCallback(() => {
    if (type !== 'deque') return;
    if (queue.length === 0) { showWarning('Queue is empty!'); return; }
    const item = queue[queue.length - 1];
    setQueue(prev => prev.slice(0, -1));
    setMessage(`Dequeued ${item.value} from rear`);
  }, [queue, type]);

  const reset = () => {
    setQueue([]);
    setMessage('Queue cleared');
    setWarning('');
  };

  const typeName = type.charAt(0).toUpperCase() + type.slice(1);

  // ── Circular layout helper ─────────────────────────────────────────────────
  const circularPositions = (count: number, radius: number) => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (2 * Math.PI * i) / Math.max(count, 1) - Math.PI / 2;
      return { x: radius + radius * Math.cos(angle), y: radius + radius * Math.sin(angle) };
    });
  };

  return (
    <div className="w-full rounded-2xl bg-gray-900 border border-gray-800 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{typeName} Queue</h2>
        <div className="text-xs text-gray-500">Size: {queue.length}/{MAX_SIZE}</div>
      </div>

      {/* Warning */}
      <AnimatePresence>
        {warning && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
            <AlertTriangle size={14} /> {warning}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Value</label>
          <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && enqueueRear()} className="w-24 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="val" />
        </div>

        {type === 'priority' && (
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Priority</label>
            <input type="number" value={priorityValue} onChange={e => setPriorityValue(e.target.value)} className="w-20 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500" placeholder="pri" />
          </div>
        )}

        {type === 'deque' && (
          <motion.button whileTap={{ scale: 0.93 }} onClick={enqueueFront} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm transition-colors">
            <ArrowRightToLine size={14} className="rotate-180" /> Enq Front
          </motion.button>
        )}

        <motion.button whileTap={{ scale: 0.93 }} onClick={enqueueRear} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm transition-colors">
          <ArrowRightToLine size={14} /> {type === 'priority' ? 'Enqueue' : 'Enq Rear'}
        </motion.button>

        <motion.button whileTap={{ scale: 0.93 }} onClick={dequeueFront} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm transition-colors">
          <ArrowLeftFromLine size={14} /> Deq Front
        </motion.button>

        {type === 'deque' && (
          <motion.button whileTap={{ scale: 0.93 }} onClick={dequeueRear} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm transition-colors">
            <ArrowLeftFromLine size={14} className="rotate-180" /> Deq Rear
          </motion.button>
        )}

        <motion.button whileTap={{ scale: 0.93 }} onClick={reset} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm transition-colors">
          <RotateCcw size={14} /> Reset
        </motion.button>
      </div>

      {/* Message */}
      {message && (
        <motion.p key={message} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-400">{message}</motion.p>
      )}

      {/* Queue visualization */}
      <div className="bg-gray-950 rounded-xl p-6 min-h-[200px] overflow-x-auto">
        {type === 'circular' ? (
          /* Circular layout */
          <div className="flex justify-center">
            <div className="relative" style={{ width: 280, height: 280 }}>
              {/* Circle outline */}
              <svg className="absolute inset-0" width={280} height={280}>
                <circle cx={140} cy={140} r={100} fill="none" stroke="#374151" strokeWidth={2} strokeDasharray="6 4" />
              </svg>
              {circularPositions(queue.length || 1, 100).map((pos, i) => {
                if (i >= queue.length) return null;
                const item = queue[i];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1, x: pos.x + 40 - 25, y: pos.y + 40 - 25 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className={`absolute w-[50px] h-[50px] rounded-full ${COLORS[i % COLORS.length]} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                  >
                    {item.value}
                    {i === 0 && <span className="absolute -top-5 text-[10px] text-emerald-400 font-mono">F</span>}
                    {i === queue.length - 1 && <span className="absolute -bottom-5 text-[10px] text-red-400 font-mono">R</span>}
                  </motion.div>
                );
              })}
              {queue.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm italic">Empty</div>
              )}
            </div>
          </div>
        ) : (
          /* Linear / Deque / Priority layout */
          <div className="flex items-center gap-1 min-w-max">
            {/* Front label */}
            {queue.length > 0 && (
              <div className="text-xs text-emerald-400 font-mono mr-2 flex flex-col items-center">
                FRONT
                <span className="text-lg">→</span>
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {queue.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 50, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className={`${COLORS[i % COLORS.length]} rounded-xl px-5 py-3 text-white font-bold text-sm shadow-lg relative`}
                >
                  {item.value}
                  {type === 'priority' && item.priority !== undefined && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] bg-gray-900 px-1.5 py-0.5 rounded text-amber-400 font-mono">
                      p:{item.priority}
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Rear label */}
            {queue.length > 0 && (
              <div className="text-xs text-red-400 font-mono ml-2 flex flex-col items-center">
                REAR
                <span className="text-lg">←</span>
              </div>
            )}

            {queue.length === 0 && (
              <div className="text-gray-600 text-sm italic">Empty queue</div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1"><span className="text-emerald-400 font-bold">F</span> Front</span>
        <span className="flex items-center gap-1"><span className="text-red-400 font-bold">R</span> Rear</span>
        {type === 'priority' && <span className="flex items-center gap-1"><span className="text-amber-400 font-bold">p:</span> Priority (lower = higher)</span>}
      </div>
    </div>
  );
}
