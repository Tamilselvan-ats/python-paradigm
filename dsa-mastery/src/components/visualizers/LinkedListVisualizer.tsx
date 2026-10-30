'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, RotateCcw, ArrowRight } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface LinkedListVisualizerProps {
  type: 'singly' | 'doubly' | 'circular';
}

interface LLNode {
  id: string;
  data: number;
}

type HighlightState = 'default' | 'new' | 'searching' | 'found' | 'deleting';

// ── Component ──────────────────────────────────────────────────────────────────
export default function LinkedListVisualizer({ type }: LinkedListVisualizerProps) {
  const [nodes, setNodes] = useState<LLNode[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [positionValue, setPositionValue] = useState('');
  const [highlights, setHighlights] = useState<Record<string, HighlightState>>({});
  const [message, setMessage] = useState('Add nodes to build the linked list');
  const [isAnimating, setIsAnimating] = useState(false);
  const animRef = useRef(false);

  const uid = () => Math.random().toString(36).slice(2, 8);

  // Generate initial sample list
  useEffect(() => {
    const sample = [10, 20, 30, 40].map(d => ({ id: uid(), data: d }));
    setNodes(sample);
  }, []);

  // Clear animation flag on unmount
  useEffect(() => () => { animRef.current = false; }, []);

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  // ── Operations ─────────────────────────────────────────────────────────────
  const insertHead = useCallback(async () => {
    const val = Number(inputValue);
    if (isNaN(val)) { setMessage('Enter a valid number'); return; }
    setIsAnimating(true);
    animRef.current = true;
    const newNode: LLNode = { id: uid(), data: val };
    setHighlights({ [newNode.id]: 'new' });
    setNodes(prev => [newNode, ...prev]);
    setMessage(`Inserted ${val} at head`);
    await delay(800);
    if (animRef.current) setHighlights({});
    setIsAnimating(false);
    setInputValue('');
  }, [inputValue]);

  const insertTail = useCallback(async () => {
    const val = Number(inputValue);
    if (isNaN(val)) { setMessage('Enter a valid number'); return; }
    setIsAnimating(true);
    animRef.current = true;
    const newNode: LLNode = { id: uid(), data: val };
    setHighlights({ [newNode.id]: 'new' });
    setNodes(prev => [...prev, newNode]);
    setMessage(`Inserted ${val} at tail`);
    await delay(800);
    if (animRef.current) setHighlights({});
    setIsAnimating(false);
    setInputValue('');
  }, [inputValue]);

  const insertAt = useCallback(async () => {
    const val = Number(inputValue);
    const pos = Number(positionValue);
    if (isNaN(val) || isNaN(pos) || pos < 0) { setMessage('Enter valid value and position'); return; }
    setIsAnimating(true);
    animRef.current = true;
    const idx = Math.min(pos, nodes.length);
    const newNode: LLNode = { id: uid(), data: val };
    setHighlights({ [newNode.id]: 'new' });
    setNodes(prev => { const a = [...prev]; a.splice(idx, 0, newNode); return a; });
    setMessage(`Inserted ${val} at position ${idx}`);
    await delay(800);
    if (animRef.current) setHighlights({});
    setIsAnimating(false);
    setInputValue('');
    setPositionValue('');
  }, [inputValue, positionValue, nodes.length]);

  const deleteNode = useCallback(async () => {
    const val = Number(inputValue);
    if (isNaN(val)) { setMessage('Enter a value to delete'); return; }
    setIsAnimating(true);
    animRef.current = true;
    const idx = nodes.findIndex(n => n.data === val);
    if (idx === -1) { setMessage(`Value ${val} not found`); setIsAnimating(false); return; }
    // Search animation
    for (let i = 0; i <= idx; i++) {
      if (!animRef.current) return;
      setHighlights(prev => ({ ...prev, [nodes[i].id]: 'searching' }));
      await delay(400);
    }
    setHighlights({ [nodes[idx].id]: 'deleting' });
    setMessage(`Deleting node with value ${val}`);
    await delay(600);
    setNodes(prev => prev.filter((_, i) => i !== idx));
    setHighlights({});
    setIsAnimating(false);
    setInputValue('');
  }, [inputValue, nodes]);

  const searchNode = useCallback(async () => {
    const val = Number(inputValue);
    if (isNaN(val)) { setMessage('Enter a value to search'); return; }
    setIsAnimating(true);
    animRef.current = true;
    setHighlights({});
    let found = false;
    for (let i = 0; i < nodes.length; i++) {
      if (!animRef.current) return;
      setHighlights(prev => ({ ...prev, [nodes[i].id]: 'searching' }));
      setMessage(`Checking node ${i} (value: ${nodes[i].data})`);
      await delay(500);
      if (nodes[i].data === val) {
        setHighlights({ [nodes[i].id]: 'found' });
        setMessage(`Found ${val} at position ${i}!`);
        found = true;
        break;
      }
    }
    if (!found) setMessage(`Value ${val} not found in the list`);
    await delay(1200);
    if (animRef.current) setHighlights({});
    setIsAnimating(false);
  }, [inputValue, nodes]);

  const reverseList = useCallback(() => {
    setNodes(prev => [...prev].reverse());
    setMessage('List reversed');
  }, []);

  const resetList = () => {
    animRef.current = false;
    setIsAnimating(false);
    setHighlights({});
    const sample = [10, 20, 30, 40].map(d => ({ id: uid(), data: d }));
    setNodes(sample);
    setMessage('List reset');
  };

  // ── Highlight colors ──────────────────────────────────────────────────────
  const nodeColor = (state?: HighlightState) => {
    switch (state) {
      case 'new': return 'border-emerald-400 bg-emerald-500/20 shadow-emerald-500/30 shadow-lg';
      case 'searching': return 'border-amber-400 bg-amber-500/20 shadow-amber-500/30 shadow-lg';
      case 'found': return 'border-emerald-400 bg-emerald-500/30 shadow-emerald-500/40 shadow-lg';
      case 'deleting': return 'border-red-500 bg-red-500/20 shadow-red-500/30 shadow-lg';
      default: return 'border-blue-500 bg-blue-500/10';
    }
  };

  const typeName = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="w-full rounded-2xl bg-gray-900 border border-gray-800 p-6 space-y-5">
      <h2 className="text-xl font-bold text-white">{typeName} Linked List</h2>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Value</label>
          <input
            type="number"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="w-24 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
            placeholder="val"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Position</label>
          <input
            type="number"
            value={positionValue}
            onChange={e => setPositionValue(e.target.value)}
            className="w-24 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
            placeholder="pos"
          />
        </div>

        <motion.button whileTap={{ scale: 0.93 }} onClick={insertHead} disabled={isAnimating} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm disabled:opacity-40 transition-colors">
          <Plus size={14} /> Head
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={insertTail} disabled={isAnimating} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm disabled:opacity-40 transition-colors">
          <Plus size={14} /> Tail
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={insertAt} disabled={isAnimating} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm disabled:opacity-40 transition-colors">
          <Plus size={14} /> At Pos
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={deleteNode} disabled={isAnimating} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm disabled:opacity-40 transition-colors">
          <Trash2 size={14} /> Delete
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={searchNode} disabled={isAnimating} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm disabled:opacity-40 transition-colors">
          <Search size={14} /> Search
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={reverseList} disabled={isAnimating} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm disabled:opacity-40 transition-colors">
          <RotateCcw size={14} /> Reverse
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={resetList} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm transition-colors">
          Reset
        </motion.button>
      </div>

      {/* Message */}
      <motion.p key={message} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-400">
        {message}
      </motion.p>

      {/* Linked list visualization */}
      <div className="bg-gray-950 rounded-xl p-6 min-h-[160px] overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {/* HEAD label */}
          {nodes.length > 0 && (
            <div className="text-xs text-emerald-400 font-mono mr-2 flex flex-col items-center">
              HEAD
              <ArrowRight size={14} className="text-emerald-400 mt-1" />
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {nodes.map((node, i) => (
              <React.Fragment key={node.id}>
                {/* Node */}
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.5, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className={`flex flex-col items-center`}
                >
                  <div className={`rounded-xl border-2 ${nodeColor(highlights[node.id])} px-4 py-3 flex items-center gap-3 transition-colors duration-300`}>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{node.data}</div>
                      <div className="text-[10px] text-gray-500 font-mono">idx {i}</div>
                    </div>
                    {type === 'doubly' && (
                      <div className="text-[10px] text-gray-600 font-mono border-l border-gray-700 pl-2">
                        prev<br />next
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Arrow between nodes */}
                {i < nodes.length - 1 && (
                  <motion.div
                    layout
                    className="flex items-center mx-1"
                  >
                    {type === 'doubly' ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <ArrowRight size={16} className="text-blue-400" />
                        <ArrowRight size={16} className="text-blue-400 rotate-180" />
                      </div>
                    ) : (
                      <ArrowRight size={18} className="text-blue-400" />
                    )}
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </AnimatePresence>

          {/* Circular arrow indicator */}
          {type === 'circular' && nodes.length > 0 && (
            <div className="flex items-center ml-1">
              <ArrowRight size={16} className="text-purple-400" />
              <span className="text-xs text-purple-400 font-mono ml-1">→ HEAD</span>
            </div>
          )}

          {/* NULL terminator */}
          {type !== 'circular' && nodes.length > 0 && (
            <div className="flex items-center ml-1">
              <ArrowRight size={16} className="text-gray-600" />
              <span className="text-xs text-gray-600 font-mono ml-1 px-2 py-1 rounded border border-gray-700">NULL</span>
            </div>
          )}

          {nodes.length === 0 && (
            <div className="text-gray-600 text-sm italic">Empty list — add some nodes!</div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border-2 border-blue-500 bg-blue-500/10" /> Default</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border-2 border-emerald-400 bg-emerald-500/20" /> New/Found</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border-2 border-amber-400 bg-amber-500/20" /> Searching</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border-2 border-red-500 bg-red-500/20" /> Deleting</span>
      </div>
    </div>
  );
}
