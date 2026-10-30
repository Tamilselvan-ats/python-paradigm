'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Layers,
  Binary,
  GitBranch,
  Table,
  Cpu,
  ArrowRightLeft,
  ListOrdered,
  Search as SearchIcon,
  HelpCircle,
} from 'lucide-react';

import ArrayVisualizer from '@/components/visualizers/ArrayVisualizer';
import LinkedListVisualizer from '@/components/visualizers/LinkedListVisualizer';
import StackVisualizer from '@/components/visualizers/StackVisualizer';
import QueueVisualizer from '@/components/visualizers/QueueVisualizer';
import TreeVisualizer from '@/components/visualizers/TreeVisualizer';
import AVLVisualizer from '@/components/visualizers/AVLVisualizer';
import HeapVisualizer from '@/components/visualizers/HeapVisualizer';
import HashTableVisualizer from '@/components/visualizers/HashTableVisualizer';
import GraphVisualizer from '@/components/visualizers/GraphVisualizer';
import SortingVisualizer from '@/components/visualizers/SortingVisualizer';
import SearchVisualizer from '@/components/visualizers/SearchVisualizer';

type VisualizerKey =
  | 'array'
  | 'linked-list'
  | 'stack'
  | 'queue'
  | 'bst'
  | 'avl'
  | 'heap'
  | 'hash-table'
  | 'graph'
  | 'sorting'
  | 'searching';

const TABS: { id: VisualizerKey; label: string; icon: any; unit: string }[] = [
  { id: 'array', label: 'Array & Matrix', icon: Layers, unit: 'Unit 1' },
  { id: 'linked-list', label: 'Linked List', icon: ArrowRightLeft, unit: 'Unit 2' },
  { id: 'stack', label: 'Stack', icon: Layers, unit: 'Unit 3' },
  { id: 'queue', label: 'Queue', icon: ListOrdered, unit: 'Unit 3' },
  { id: 'bst', label: 'BST', icon: Binary, unit: 'Unit 4' },
  { id: 'avl', label: 'AVL Tree', icon: Binary, unit: 'Unit 4' },
  { id: 'heap', label: 'Binary Heap', icon: Cpu, unit: 'Unit 4' },
  { id: 'hash-table', label: 'Hash Table', icon: Table, unit: 'Unit 4' },
  { id: 'graph', label: 'Graph Lab', icon: GitBranch, unit: 'Unit 5' },
  { id: 'sorting', label: 'Sorting', icon: Eye, unit: 'General' },
  { id: 'searching', label: 'Searching', icon: SearchIcon, unit: 'General' },
];

export default function VisualizerPage() {
  const [activeTab, setActiveTab] = useState<VisualizerKey>('array');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Eye className="w-8 h-8 text-emerald-500" />
            Interactive Visual Lab
          </h1>
          <p className="text-muted text-sm mt-1">
            Observe algorithm mechanics, pointer reassignments, and memory state changes step-by-step.
          </p>
        </div>
      </div>

      {/* Visualizer Category Nav */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-card-border">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-card hover:bg-gray-100 dark:hover:bg-gray-800 text-muted hover:text-foreground border border-card-border'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-800 text-muted'
                }`}
              >
                {tab.unit}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Visualizer Container */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {activeTab === 'array' && <ArrayVisualizer />}
        {activeTab === 'linked-list' && <LinkedListVisualizer type="singly" />}
        {activeTab === 'stack' && <StackVisualizer />}
        {activeTab === 'queue' && <QueueVisualizer type="linear" />}
        {activeTab === 'bst' && <TreeVisualizer />}
        {activeTab === 'avl' && <AVLVisualizer />}
        {activeTab === 'heap' && <HeapVisualizer />}
        {activeTab === 'hash-table' && <HashTableVisualizer />}
        {activeTab === 'graph' && <GraphVisualizer />}
        {activeTab === 'sorting' && <SortingVisualizer algorithm="bubble" />}
        {activeTab === 'searching' && <SearchVisualizer algorithm="binary" />}
      </motion.div>
    </div>
  );
}
