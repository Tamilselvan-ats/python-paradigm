'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, RotateCcw, ArrowRight } from 'lucide-react';

const TABLE_SIZE = 7;

interface ChainNode {
  key: number;
  id: string;
}

export default function HashTableVisualizer() {
  const [method, setMethod] = useState<'chaining' | 'linear' | 'quadratic'>('chaining');
  const [chainTable, setChainTable] = useState<ChainNode[][]>(() =>
    Array.from({ length: TABLE_SIZE }, () => [])
  );
  const [openTable, setOpenTable] = useState<(number | null)[]>(() =>
    Array(TABLE_SIZE).fill(null)
  );
  const [inputKey, setInputKey] = useState('');
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);
  const [message, setMessage] = useState('Hash Function: h(k) = k % 7');

  const getLoadFactor = () => {
    if (method === 'chaining') {
      const total = chainTable.reduce((acc, row) => acc + row.length, 0);
      return (total / TABLE_SIZE).toFixed(2);
    } else {
      const total = openTable.filter((v) => v !== null).length;
      return (total / TABLE_SIZE).toFixed(2);
    }
  };

  const handleInsert = async () => {
    const k = parseInt(inputKey);
    if (isNaN(k)) return;
    setInputKey('');
    const baseIdx = k % TABLE_SIZE;
    setHighlightIdx(baseIdx);

    if (method === 'chaining') {
      setMessage(`h(${k}) = ${k} % ${TABLE_SIZE} = ${baseIdx}. Prepending to chain at bucket ${baseIdx}.`);
      await new Promise((r) => setTimeout(r, 600));

      const nextTable = chainTable.map((row) => [...row]);
      nextTable[baseIdx].unshift({ key: k, id: `chain-${k}-${Math.random()}` });
      setChainTable(nextTable);
      setHighlightIdx(null);
    } else {
      // Open Addressing: Linear or Quadratic Probing
      let i = 0;
      let targetIdx = baseIdx;
      const nextOpen = [...openTable];

      while (i < TABLE_SIZE) {
        const offset = method === 'linear' ? i : i * i;
        targetIdx = (baseIdx + offset) % TABLE_SIZE;
        setHighlightIdx(targetIdx);
        setMessage(
          `Probe #${i}: Index = (${baseIdx} + ${offset}) % ${TABLE_SIZE} = ${targetIdx} (${
            nextOpen[targetIdx] !== null ? 'COLLISION!' : 'EMPTY SLOT FOUND'
          })`
        );
        await new Promise((r) => setTimeout(r, 700));

        if (nextOpen[targetIdx] === null) {
          nextOpen[targetIdx] = k;
          setOpenTable(nextOpen);
          setMessage(`Inserted ${k} at bucket ${targetIdx} using ${method} probing.`);
          break;
        }
        i++;
      }

      if (i >= TABLE_SIZE) {
        setMessage(`Hash Table Full or Probing cycle failed for key ${k}!`);
      }
      setHighlightIdx(null);
    }
  };

  const handleClear = () => {
    setChainTable(Array.from({ length: TABLE_SIZE }, () => []));
    setOpenTable(Array(TABLE_SIZE).fill(null));
    setMessage('Hash Table cleared.');
  };

  return (
    <div className="w-full rounded-2xl bg-card border border-card-border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Hash Table & Collision Visualizer</h2>
          <p className="text-xs text-muted">Modulo Hashing: h(k) = k % 7 with Separate Chaining & Probing</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setMethod('chaining')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              method === 'chaining' ? 'bg-emerald-500 text-white shadow' : 'text-muted'
            }`}
          >
            Chaining
          </button>
          <button
            onClick={() => setMethod('linear')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              method === 'linear' ? 'bg-emerald-500 text-white shadow' : 'text-muted'
            }`}
          >
            Linear Probing
          </button>
          <button
            onClick={() => setMethod('quadratic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              method === 'quadratic' ? 'bg-emerald-500 text-white shadow' : 'text-muted'
            }`}
          >
            Quadratic Probing
          </button>
        </div>
      </div>

      {/* Controls & Load Factor Metrics */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted">Key Value</label>
          <input
            type="number"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Key"
            className="w-24 px-3 py-2 rounded-lg bg-background border border-card-border text-sm"
          />
        </div>
        <button
          onClick={handleInsert}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
        >
          <Plus size={14} /> Insert Key
        </button>
        <button
          onClick={handleClear}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium transition-colors"
        >
          <RotateCcw size={14} /> Reset
        </button>

        <div className="ml-auto px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono">
          Load Factor (&alpha;): <span className="font-bold text-indigo-400">{getLoadFactor()}</span>
        </div>
      </div>

      {/* Hash Table Visual Stage */}
      <div className="bg-gray-950 rounded-2xl p-6 min-h-[300px]">
        {method === 'chaining' ? (
          /* Separate Chaining Layout */
          <div className="space-y-3">
            {chainTable.map((chain, bucketIdx) => (
              <div key={`bucket-${bucketIdx}`} className="flex items-center gap-3">
                <div
                  className={`w-14 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-sm text-white border transition-all ${
                    highlightIdx === bucketIdx
                      ? 'bg-amber-500 border-amber-300 ring-2 ring-amber-400'
                      : 'bg-gray-800 border-gray-700'
                  }`}
                >
                  [{bucketIdx}]
                </div>
                <ArrowRight size={16} className="text-muted" />

                {/* Chain linked nodes */}
                <div className="flex items-center gap-2 overflow-x-auto">
                  <AnimatePresence>
                    {chain.map((node) => (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, x: -20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        className="flex items-center gap-1 bg-emerald-600 border border-emerald-400 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow"
                      >
                        {node.key}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {chain.length === 0 && <span className="text-xs text-gray-600 italic">Empty Chain</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Open Addressing (Linear / Quadratic) Layout */
          <div className="grid grid-cols-7 gap-3">
            {openTable.map((val, idx) => (
              <div key={`open-${idx}`} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-full h-16 rounded-xl border flex items-center justify-center font-bold text-lg text-white transition-all ${
                    highlightIdx === idx
                      ? 'bg-amber-500 border-amber-300 ring-4 ring-amber-400/50 scale-105'
                      : val !== null
                      ? 'bg-emerald-600 border-emerald-500 shadow'
                      : 'bg-gray-900 border-gray-800'
                  }`}
                >
                  {val !== null ? val : <span className="text-gray-600 text-xs">-</span>}
                </div>
                <span className="text-xs font-mono text-gray-400">Slot {idx}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Message */}
      <div className="p-3 bg-gray-100 dark:bg-gray-800/80 rounded-xl text-xs font-mono text-foreground flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        {message}
      </div>
    </div>
  );
}
