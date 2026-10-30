'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, RotateCcw, Zap } from 'lucide-react';

interface AVLNode {
  key: number;
  height: number;
  left: AVLNode | null;
  right: AVLNode | null;
  id: string;
}

export default function AVLVisualizer() {
  const [root, setRoot] = useState<AVLNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [lastRotation, setLastRotation] = useState<string>('None');
  const [message, setMessage] = useState('Add values to trigger automatic AVL balancing rotations.');

  const getHeight = (n: AVLNode | null): number => (n ? n.height : 0);
  const getBF = (n: AVLNode | null): number => (n ? getHeight(n.left) - getHeight(n.right) : 0);

  const rightRotate = (y: AVLNode): AVLNode => {
    const x = y.left!;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    return x;
  };

  const leftRotate = (x: AVLNode): AVLNode => {
    const y = x.right!;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    return y;
  };

  const insertAVL = (node: AVLNode | null, key: number): AVLNode => {
    if (!node) {
      return { key, height: 1, left: null, right: null, id: `avl-${key}-${Math.random()}` };
    }

    if (key < node.key) node.left = insertAVL(node.left, key);
    else if (key > node.key) node.right = insertAVL(node.right, key);
    else return node;

    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
    const bf = getBF(node);

    // LL Case -> Right Rotate
    if (bf > 1 && key < node.left!.key) {
      setLastRotation('LL Rotation (Right Rotate)');
      setMessage(`Imbalance detected at node ${node.key} (BF=+2). Performing Right Rotation (LL).`);
      return rightRotate(node);
    }
    // RR Case -> Left Rotate
    if (bf < -1 && key > node.right!.key) {
      setLastRotation('RR Rotation (Left Rotate)');
      setMessage(`Imbalance detected at node ${node.key} (BF=-2). Performing Left Rotation (RR).`);
      return leftRotate(node);
    }
    // LR Case -> Left Rotate Left Child, then Right Rotate
    if (bf > 1 && key > node.left!.key) {
      setLastRotation('LR Rotation (Left-Right)');
      setMessage(`Imbalance detected at node ${node.key}. Performing Left-Right Double Rotation.`);
      node.left = leftRotate(node.left!);
      return rightRotate(node);
    }
    // RL Case -> Right Rotate Right Child, then Left Rotate
    if (bf < -1 && key < node.right!.key) {
      setLastRotation('RL Rotation (Right-Left)');
      setMessage(`Imbalance detected at node ${node.key}. Performing Right-Left Double Rotation.`);
      node.right = rightRotate(node.right!);
      return leftRotate(node);
    }

    return node;
  };

  const handleInsert = (val?: number) => {
    const k = val !== undefined ? val : parseInt(inputValue);
    if (isNaN(k)) return;
    setRoot((prev) => insertAVL(prev ? JSON.parse(JSON.stringify(prev)) : null, k));
    setInputValue('');
  };

  // Triggers for classic rotation demonstrations
  const triggerDemo = (type: 'LL' | 'RR' | 'LR' | 'RL') => {
    setRoot(null);
    let sequence: number[] = [];
    if (type === 'LL') sequence = [30, 20, 10]; // 10 causes LL on 30
    if (type === 'RR') sequence = [10, 20, 30]; // 30 causes RR on 10
    if (type === 'LR') sequence = [30, 10, 20]; // 20 causes LR
    if (type === 'RL') sequence = [10, 30, 20]; // 20 causes RL

    let current: AVLNode | null = null;
    sequence.forEach((val) => {
      current = insertAVL(current, val);
    });
    setRoot(current);
  };

  const renderAVL = (
    node: AVLNode | null,
    x: number,
    y: number,
    offset: number
  ): React.ReactNode => {
    if (!node) return null;
    const bf = getBF(node);
    const leftX = x - offset;
    const rightX = x + offset;
    const childY = y + 70;

    return (
      <g key={node.id}>
        {node.left && (
          <line x1={x} y1={y} x2={leftX} y2={childY} stroke="#475569" strokeWidth={2} />
        )}
        {node.right && (
          <line x1={x} y1={y} x2={rightX} y2={childY} stroke="#475569" strokeWidth={2} />
        )}

        {/* Node Circle */}
        <motion.circle
          cx={x}
          cy={y}
          r={24}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          fill="#059669"
          stroke="#1e293b"
          strokeWidth={3}
        />
        <text x={x} y={y + 5} textAnchor="middle" fill="#ffffff" fontSize={13} fontWeight="bold">
          {node.key}
        </text>

        {/* Balance Factor Badge */}
        <rect
          x={x + 12}
          y={y - 25}
          width={30}
          height={16}
          rx={4}
          fill={Math.abs(bf) > 1 ? '#ef4444' : '#6366f1'}
        />
        <text x={x + 27} y={y - 13} textAnchor="middle" fill="#ffffff" fontSize={9} fontWeight="bold">
          {bf >= 0 ? `+${bf}` : bf}
        </text>

        {renderAVL(node.left, leftX, childY, offset / 2)}
        {renderAVL(node.right, rightX, childY, offset / 2)}
      </g>
    );
  };

  return (
    <div className="w-full rounded-2xl bg-card border border-card-border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">AVL Self-Balancing Tree Visualizer</h2>
          <p className="text-xs text-muted">Balance Factor Invariant: |BF| &le; 1 with LL, RR, LR, RL Rotations</p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs font-mono font-bold text-indigo-400">
          Last Rotation: {lastRotation}
        </div>
      </div>

      {/* Preset Rotation Demo Triggers */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl text-xs">
        <span className="font-semibold text-muted flex items-center gap-1">
          <Zap size={13} className="text-amber-500" /> Presets:
        </span>
        <button
          onClick={() => triggerDemo('LL')}
          className="px-2.5 py-1 rounded bg-card border hover:border-emerald-500 font-mono font-bold transition-all"
        >
          LL Case (30,20,10)
        </button>
        <button
          onClick={() => triggerDemo('RR')}
          className="px-2.5 py-1 rounded bg-card border hover:border-emerald-500 font-mono font-bold transition-all"
        >
          RR Case (10,20,30)
        </button>
        <button
          onClick={() => triggerDemo('LR')}
          className="px-2.5 py-1 rounded bg-card border hover:border-emerald-500 font-mono font-bold transition-all"
        >
          LR Case (30,10,20)
        </button>
        <button
          onClick={() => triggerDemo('RL')}
          className="px-2.5 py-1 rounded bg-card border hover:border-emerald-500 font-mono font-bold transition-all"
        >
          RL Case (10,30,20)
        </button>
      </div>

      {/* Manual Insertion */}
      <div className="flex items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted">Insert Key</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Key"
            className="w-24 px-3 py-2 rounded-lg bg-background border border-card-border text-sm"
          />
        </div>
        <button
          onClick={() => handleInsert()}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
        >
          <Plus size={14} /> Insert & Auto-Balance
        </button>
        <button
          onClick={() => {
            setRoot(null);
            setLastRotation('None');
            setMessage('AVL tree cleared.');
          }}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium transition-colors ml-auto"
        >
          <RotateCcw size={14} /> Clear
        </button>
      </div>

      {/* SVG Tree Stage */}
      <div className="bg-gray-950 rounded-xl p-4 overflow-x-auto min-h-[300px] flex justify-center">
        <svg width={700} height={300} className="overflow-visible">
          {renderAVL(root, 350, 40, 160)}
        </svg>
      </div>

      {/* Status Message */}
      <div className="p-3 bg-gray-100 dark:bg-gray-800/80 rounded-xl text-xs font-mono text-foreground flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        {message}
      </div>
    </div>
  );
}
