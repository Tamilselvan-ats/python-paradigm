'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Shuffle, GitBranch, Share2 } from 'lucide-react';

interface Vertex {
  id: number;
  label: string;
  x: number;
  y: number;
}

interface Edge {
  u: number;
  v: number;
  weight: number;
}

const DEFAULT_VERTICES: Vertex[] = [
  { id: 0, label: '0', x: 80, y: 150 },
  { id: 1, label: '1', x: 220, y: 60 },
  { id: 2, label: '2', x: 220, y: 240 },
  { id: 3, label: '3', x: 420, y: 60 },
  { id: 4, label: '4', x: 420, y: 240 },
  { id: 5, label: '5', x: 560, y: 150 },
];

const DEFAULT_EDGES: Edge[] = [
  { u: 0, v: 1, weight: 4 },
  { u: 0, v: 2, weight: 2 },
  { u: 1, v: 2, weight: 1 },
  { u: 1, v: 3, weight: 5 },
  { u: 2, v: 3, weight: 8 },
  { u: 2, v: 4, weight: 10 },
  { u: 3, v: 4, weight: 2 },
  { u: 3, v: 5, weight: 6 },
  { u: 4, v: 5, weight: 3 },
];

export default function GraphVisualizer() {
  const [algo, setAlgo] = useState<'bfs' | 'dfs' | 'dijkstra' | 'prim' | 'kruskal'>('bfs');
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [activeEdges, setActiveEdges] = useState<string[]>([]);
  const [mstEdges, setMstEdges] = useState<string[]>([]);
  const [distances, setDistances] = useState<Record<number, number>>({});
  const [message, setMessage] = useState('Select an algorithm and press Run Animation.');
  const [isRunning, setIsRunning] = useState(false);
  const stopRef = useRef(false);

  const reset = () => {
    stopRef.current = true;
    setIsRunning(false);
    setVisitedNodes([]);
    setActiveNode(null);
    setActiveEdges([]);
    setMstEdges([]);
    setDistances({});
    setMessage('Graph reset.');
  };

  const edgeKey = (u: number, v: number) => (u < v ? `${u}-${v}` : `${v}-${u}`);

  // BFS Animation
  const runBFS = async () => {
    setIsRunning(true);
    stopRef.current = false;
    const visited = new Set<number>();
    const queue: number[] = [0];
    visited.add(0);
    setVisitedNodes([0]);

    while (queue.length > 0 && !stopRef.current) {
      const u = queue.shift()!;
      setActiveNode(u);
      setMessage(`Dequeued node ${u}. Checking adjacent neighbors...`);
      await new Promise((r) => setTimeout(r, 800));

      const neighbors = DEFAULT_EDGES.filter((e) => e.u === u || e.v === u).map((e) =>
        e.u === u ? e.v : e.u
      );

      for (const v of neighbors) {
        if (!visited.has(v) && !stopRef.current) {
          visited.add(v);
          queue.push(v);
          setActiveEdges((prev) => [...prev, edgeKey(u, v)]);
          setVisitedNodes((prev) => [...prev, v]);
          setMessage(`Visited neighbor node ${v} from node ${u}.`);
          await new Promise((r) => setTimeout(r, 700));
        }
      }
    }
    setActiveNode(null);
    setIsRunning(false);
    setMessage('BFS Traversal Complete!');
  };

  // DFS Animation
  const runDFS = async () => {
    setIsRunning(true);
    stopRef.current = false;
    const visited = new Set<number>();
    const visitedList: number[] = [];

    const dfs = async (u: number) => {
      if (stopRef.current) return;
      visited.add(u);
      visitedList.push(u);
      setVisitedNodes([...visitedList]);
      setActiveNode(u);
      setMessage(`DFS visiting node ${u}...`);
      await new Promise((r) => setTimeout(r, 800));

      const neighbors = DEFAULT_EDGES.filter((e) => e.u === u || e.v === u).map((e) =>
        e.u === u ? e.v : e.u
      );

      for (const v of neighbors) {
        if (!visited.has(v) && !stopRef.current) {
          setActiveEdges((prev) => [...prev, edgeKey(u, v)]);
          await dfs(v);
        }
      }
    };

    await dfs(0);
    setActiveNode(null);
    setIsRunning(false);
    setMessage('DFS Traversal Complete!');
  };

  // Dijkstra Shortest Path Animation
  const runDijkstra = async () => {
    setIsRunning(true);
    stopRef.current = false;
    const dist: Record<number, number> = { 0: 0, 1: 999, 2: 999, 3: 999, 4: 999, 5: 999 };
    const settled = new Set<number>();
    setDistances({ ...dist });

    while (settled.size < DEFAULT_VERTICES.length && !stopRef.current) {
      let minNode = -1;
      let minDist = 999;
      for (const v of DEFAULT_VERTICES) {
        if (!settled.has(v.id) && dist[v.id] < minDist) {
          minDist = dist[v.id];
          minNode = v.id;
        }
      }

      if (minNode === -1) break;
      settled.add(minNode);
      setActiveNode(minNode);
      setVisitedNodes(Array.from(settled));
      setMessage(`Settled vertex ${minNode} with shortest distance ${dist[minNode]}. Relaxing edges...`);
      await new Promise((r) => setTimeout(r, 800));

      const incident = DEFAULT_EDGES.filter((e) => e.u === minNode || e.v === minNode);
      for (const edge of incident) {
        const neighbor = edge.u === minNode ? edge.v : edge.u;
        if (!settled.has(neighbor)) {
          setActiveEdges((prev) => [...prev, edgeKey(minNode, neighbor)]);
          if (dist[minNode] + edge.weight < dist[neighbor]) {
            dist[neighbor] = dist[minNode] + edge.weight;
            setDistances({ ...dist });
            setMessage(`Relaxed edge (${minNode}-${neighbor}): New dist[${neighbor}] = ${dist[neighbor]}`);
            await new Promise((r) => setTimeout(r, 800));
          }
        }
      }
    }
    setActiveNode(null);
    setIsRunning(false);
    setMessage('Dijkstra Shortest Paths calculated for all vertices!');
  };

  // Prim's MST Animation
  const runPrim = async () => {
    setIsRunning(true);
    stopRef.current = false;
    const inMST = new Set<number>([0]);
    const mstList: string[] = [];
    setVisitedNodes([0]);

    while (inMST.size < DEFAULT_VERTICES.length && !stopRef.current) {
      let minWeight = 999;
      let bestEdge: Edge | null = null;

      for (const e of DEFAULT_EDGES) {
        const uIn = inMST.has(e.u);
        const vIn = inMST.has(e.v);
        if ((uIn && !vIn) || (!uIn && vIn)) {
          if (e.weight < minWeight) {
            minWeight = e.weight;
            bestEdge = e;
          }
        }
      }

      if (!bestEdge) break;
      const newVertex = inMST.has(bestEdge.u) ? bestEdge.v : bestEdge.u;
      inMST.add(newVertex);
      mstList.push(edgeKey(bestEdge.u, bestEdge.v));
      setMstEdges([...mstList]);
      setVisitedNodes(Array.from(inMST));
      setActiveNode(newVertex);
      setMessage(
        `Added cut-edge (${bestEdge.u}-${bestEdge.v}, weight ${bestEdge.weight}) to MST. Connected node ${newVertex}.`
      );
      await new Promise((r) => setTimeout(r, 900));
    }
    setActiveNode(null);
    setIsRunning(false);
    setMessage('Prim\'s Minimum Spanning Tree built!');
  };

  // Kruskal's MST Animation with Disjoint Set Union
  const runKruskal = async () => {
    setIsRunning(true);
    stopRef.current = false;
    const sortedEdges = [...DEFAULT_EDGES].sort((a, b) => a.weight - b.weight);
    const parent: Record<number, number> = {};
    DEFAULT_VERTICES.forEach((v) => (parent[v.id] = v.id));

    const find = (i: number): number => {
      if (parent[i] === i) return i;
      return (parent[i] = find(parent[i]));
    };

    const mstList: string[] = [];

    for (const edge of sortedEdges) {
      if (stopRef.current || mstList.length === DEFAULT_VERTICES.length - 1) break;

      const rootU = find(edge.u);
      const rootV = find(edge.v);
      setActiveEdges([edgeKey(edge.u, edge.v)]);

      if (rootU !== rootV) {
        parent[rootU] = rootV;
        mstList.push(edgeKey(edge.u, edge.v));
        setMstEdges([...mstList]);
        setMessage(
          `Edge (${edge.u}-${edge.v}, weight ${edge.weight}): Sets disjoint (${rootU} != ${rootV}) -> ADDED to MST.`
        );
      } else {
        setMessage(
          `Edge (${edge.u}-${edge.v}, weight ${edge.weight}): Same root (${rootU} == ${rootV}) -> CYCLE REJECTED!`
        );
      }
      await new Promise((r) => setTimeout(r, 900));
    }
    setActiveEdges([]);
    setIsRunning(false);
    setMessage('Kruskal\'s MST Completed!');
  };

  const handleStart = () => {
    reset();
    setTimeout(() => {
      if (algo === 'bfs') runBFS();
      if (algo === 'dfs') runDFS();
      if (algo === 'dijkstra') runDijkstra();
      if (algo === 'prim') runPrim();
      if (algo === 'kruskal') runKruskal();
    }, 100);
  };

  return (
    <div className="w-full rounded-2xl bg-card border border-card-border p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Graph Algorithm Suite</h2>
          <p className="text-xs text-muted">BFS, DFS, Dijkstra Shortest Path, Prim\'s MST & Kruskal\'s MST</p>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {(['bfs', 'dfs', 'dijkstra', 'prim', 'kruskal'] as const).map((a) => (
            <button
              key={a}
              onClick={() => {
                setAlgo(a);
                reset();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                algo === a ? 'bg-emerald-500 text-white shadow' : 'text-muted'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
        >
          <Play size={16} /> Run {algo.toUpperCase()} Animation
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-600 hover:bg-gray-500 text-white text-sm font-semibold transition-all"
        >
          <RotateCcw size={16} /> Reset
        </button>

        {algo === 'dijkstra' && Object.keys(distances).length > 0 && (
          <div className="ml-auto flex items-center gap-2 text-xs font-mono">
            <span className="text-muted">Distances from 0:</span>
            {DEFAULT_VERTICES.map((v) => (
              <span key={`dist-${v.id}`} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                {v.id}: {distances[v.id] === 999 ? 'INF' : distances[v.id]}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Graph SVG Stage */}
      <div className="bg-gray-950 rounded-2xl p-6 min-h-[340px] flex justify-center items-center overflow-x-auto">
        <svg width={640} height={300} className="overflow-visible">
          {/* Edges */}
          {DEFAULT_EDGES.map((e) => {
            const uVert = DEFAULT_VERTICES.find((v) => v.id === e.u)!;
            const vVert = DEFAULT_VERTICES.find((v) => v.id === e.v)!;
            const k = edgeKey(e.u, e.v);
            const isMST = mstEdges.includes(k);
            const isActive = activeEdges.includes(k);

            return (
              <g key={`edge-${k}`}>
                <line
                  x1={uVert.x}
                  y1={uVert.y}
                  x2={vVert.x}
                  y2={vVert.y}
                  stroke={isMST ? '#10b981' : isActive ? '#f59e0b' : '#334155'}
                  strokeWidth={isMST ? 4 : isActive ? 3 : 2}
                  className="transition-colors duration-300"
                />
                {/* Weight Label */}
                <rect
                  x={(uVert.x + vVert.x) / 2 - 12}
                  y={(uVert.y + vVert.y) / 2 - 10}
                  width={24}
                  height={18}
                  rx={4}
                  fill="#0f172a"
                  stroke="#334155"
                />
                <text
                  x={(uVert.x + vVert.x) / 2}
                  y={(uVert.y + vVert.y) / 2 + 3}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize={10}
                  fontWeight="bold"
                >
                  {e.weight}
                </text>
              </g>
            );
          })}

          {/* Vertices */}
          {DEFAULT_VERTICES.map((v) => {
            const isVisited = visitedNodes.includes(v.id);
            const isActive = activeNode === v.id;

            return (
              <g key={`vert-${v.id}`}>
                <motion.circle
                  cx={v.x}
                  cy={v.y}
                  r={22}
                  animate={{
                    scale: isActive ? 1.25 : 1,
                    fill: isActive ? '#f59e0b' : isVisited ? '#10b981' : '#1e293b',
                  }}
                  stroke={isVisited ? '#059669' : '#475569'}
                  strokeWidth={3}
                />
                <text
                  x={v.x}
                  y={v.y + 5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={14}
                  fontWeight="bold"
                >
                  {v.label}
                </text>
              </g>
            );
          })}
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
