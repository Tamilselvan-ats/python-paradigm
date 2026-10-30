'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, RotateCcw, Play } from 'lucide-react';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  id: string;
}

export default function TreeVisualizer() {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [message, setMessage] = useState('Add nodes to build the Binary Search Tree.');
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize with balanced sample BST
  useEffect(() => {
    const sample = [50, 30, 70, 20, 40, 60, 80];
    let tree: TreeNode | null = null;
    sample.forEach((v) => {
      tree = insertNode(tree, v);
    });
    setRoot(tree);
  }, []);

  function insertNode(node: TreeNode | null, val: number): TreeNode {
    if (!node) {
      return { val, left: null, right: null, id: `node-${val}-${Math.random()}` };
    }
    if (val < node.val) node.left = insertNode(node.left, val);
    else if (val > node.val) node.right = insertNode(node.right, val);
    return { ...node };
  }

  function deleteBST(node: TreeNode | null, val: number): TreeNode | null {
    if (!node) return null;
    if (val < node.val) node.left = deleteBST(node.left, val);
    else if (val > node.val) node.right = deleteBST(node.right, val);
    else {
      if (!node.left && !node.right) return null;
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Two children: find inorder successor
      let succ = node.right;
      while (succ.left) succ = succ.left;
      node.val = succ.val;
      node.right = deleteBST(node.right, succ.val);
    }
    return { ...node };
  }

  const handleInsert = () => {
    const v = parseInt(inputValue);
    if (isNaN(v)) return;
    setRoot((prev) => insertNode(prev, v));
    setMessage(`Inserted ${v} into BST following BST invariant.`);
    setInputValue('');
  };

  const handleDelete = () => {
    const v = parseInt(inputValue);
    if (isNaN(v)) return;
    setRoot((prev) => deleteBST(prev, v));
    setMessage(`Deleted ${v} from BST.`);
    setInputValue('');
  };

  const handleSearch = async () => {
    const v = parseInt(inputValue);
    if (isNaN(v) || !root) return;
    setIsAnimating(true);
    let curr: TreeNode | null = root;
    let found = false;

    while (curr) {
      setHighlightId(curr.id);
      setMessage(`Comparing target ${v} with node ${curr.val}...`);
      await new Promise((r) => setTimeout(r, 600));

      if (v === curr.val) {
        setMessage(`Element ${v} found in BST!`);
        found = true;
        break;
      } else if (v < curr.val) {
        setMessage(`${v} < ${curr.val}: Traversing Left Subtree.`);
        curr = curr.left;
      } else {
        setMessage(`${v} > ${curr.val}: Traversing Right Subtree.`);
        curr = curr.right;
      }
    }

    if (!found) setMessage(`Element ${v} is not in the BST.`);
    setTimeout(() => {
      setHighlightId(null);
      setIsAnimating(false);
    }, 1500);
  };

  const runTraversal = async (type: 'inorder' | 'preorder' | 'postorder') => {
    if (!root) return;
    setIsAnimating(true);
    setTraversalResult([]);
    const nodes: TreeNode[] = [];

    const traverse = (n: TreeNode | null) => {
      if (!n) return;
      if (type === 'preorder') nodes.push(n);
      traverse(n.left);
      if (type === 'inorder') nodes.push(n);
      traverse(n.right);
      if (type === 'postorder') nodes.push(n);
    };

    traverse(root);
    const order: number[] = [];

    for (const node of nodes) {
      setHighlightId(node.id);
      order.push(node.val);
      setTraversalResult([...order]);
      await new Promise((r) => setTimeout(r, 500));
    }

    setHighlightId(null);
    setIsAnimating(false);
    setMessage(`${type.toUpperCase()} Traversal complete: [${order.join(', ')}]`);
  };

  // Helper to render tree layout via SVG coordinates
  const renderTree = (
    node: TreeNode | null,
    x: number,
    y: number,
    offset: number
  ): React.ReactNode => {
    if (!node) return null;

    const leftX = x - offset;
    const rightX = x + offset;
    const childY = y + 70;

    return (
      <g key={node.id}>
        {/* Branch Lines */}
        {node.left && (
          <line
            x1={x}
            y1={y}
            x2={leftX}
            y2={childY}
            stroke="#475569"
            strokeWidth={2}
          />
        )}
        {node.right && (
          <line
            x1={x}
            y1={y}
            x2={rightX}
            y2={childY}
            stroke="#475569"
            strokeWidth={2}
          />
        )}

        {/* Node Circle */}
        <motion.circle
          cx={x}
          cy={y}
          r={22}
          initial={{ scale: 0 }}
          animate={{
            scale: highlightId === node.id ? 1.25 : 1,
            fill: highlightId === node.id ? '#f59e0b' : '#10b981',
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          stroke="#1e293b"
          strokeWidth={3}
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          fill="#ffffff"
          fontSize={13}
          fontWeight="bold"
        >
          {node.val}
        </text>

        {/* Render Subtrees */}
        {renderTree(node.left, leftX, childY, offset / 2)}
        {renderTree(node.right, rightX, childY, offset / 2)}
      </g>
    );
  };

  return (
    <div className="w-full rounded-2xl bg-card border border-card-border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Binary Search Tree (BST) Visualizer</h2>
          <p className="text-xs text-muted">Hierarchical Ordering: Left &lt; Root &lt; Right with Animated Traversals</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted">Node Value</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Val"
            disabled={isAnimating}
            className="w-24 px-3 py-2 rounded-lg bg-background border border-card-border text-sm"
          />
        </div>

        <button
          onClick={handleInsert}
          disabled={isAnimating}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
        >
          <Plus size={14} /> Insert
        </button>
        <button
          onClick={handleDelete}
          disabled={isAnimating}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
        >
          <Trash2 size={14} /> Delete
        </button>
        <button
          onClick={handleSearch}
          disabled={isAnimating}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
        >
          <Search size={14} /> Search
        </button>

        <div className="h-6 w-px bg-card-border mx-1" />

        <button
          onClick={() => runTraversal('inorder')}
          disabled={isAnimating}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
        >
          <Play size={14} /> Inorder (Sorted)
        </button>
        <button
          onClick={() => runTraversal('preorder')}
          disabled={isAnimating}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
        >
          <Play size={14} /> Preorder
        </button>
        <button
          onClick={() => runTraversal('postorder')}
          disabled={isAnimating}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium transition-colors"
        >
          <Play size={14} /> Postorder
        </button>

        <button
          onClick={() => {
            setRoot(null);
            setMessage('Tree cleared.');
          }}
          disabled={isAnimating}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium transition-colors ml-auto"
        >
          <RotateCcw size={14} /> Clear
        </button>
      </div>

      {/* Traversal Stream Display */}
      {traversalResult.length > 0 && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs flex items-center gap-2">
          <span className="font-bold text-blue-400">Stream Output:</span>
          <div className="flex gap-1.5 flex-wrap">
            {traversalResult.map((v, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono font-bold">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SVG Canvas Stage */}
      <div className="bg-gray-950 rounded-xl p-4 overflow-x-auto min-h-[340px] flex justify-center">
        <svg width={700} height={320} className="overflow-visible">
          {renderTree(root, 350, 40, 160)}
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
