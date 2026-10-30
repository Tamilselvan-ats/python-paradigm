'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search as SearchIcon,
  BookOpen,
  Code2,
  Layers,
} from 'lucide-react';
import { TOPICS } from '@/data/curriculum';
import { PROBLEMS } from '@/data/problems';
import { LAB_EXPERIMENTS } from '@/data/labs';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const qLower = query.toLowerCase().trim();

  const matchedTopics = qLower
    ? TOPICS.filter(
        (t) =>
          t.title.toLowerCase().includes(qLower) ||
          t.category.toLowerCase().includes(qLower) ||
          t.description.toLowerCase().includes(qLower)
      )
    : [];

  const matchedProblems = qLower
    ? PROBLEMS.filter(
        (p) =>
          p.title.toLowerCase().includes(qLower) ||
          p.category.toLowerCase().includes(qLower) ||
          p.description.toLowerCase().includes(qLower)
      )
    : [];

  const matchedLabs = qLower
    ? LAB_EXPERIMENTS.filter(
        (l) =>
          l.title.toLowerCase().includes(qLower) ||
          l.aim.toLowerCase().includes(qLower)
      )
    : [];

  const totalResults = matchedTopics.length + matchedProblems.length + matchedLabs.length;

  return (
    <div className="space-y-8">
      {/* Search Input Bar */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <SearchIcon className="w-8 h-8 text-emerald-500" />
          Global Search
        </h1>

        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics (e.g. AVL, Stack, Dijkstra, Prim, Pointer)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-card-border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        {query && (
          <p className="text-xs text-muted">
            Found <span className="font-bold text-foreground">{totalResults}</span> matching result(s) for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>

      {/* Results Categories */}
      {query && (
        <div className="space-y-6">
          {/* Topics Results */}
          {matchedTopics.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold flex items-center gap-2 text-foreground">
                <BookOpen size={16} className="text-emerald-500" /> Curriculum Topics ({matchedTopics.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchedTopics.map((t) => (
                  <Link key={t.id} href={`/learn/unit/${t.unitId}`}>
                    <div className="p-4 rounded-xl bg-card border border-card-border hover:border-emerald-500/50 transition-all space-y-1 group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold group-hover:text-emerald-500 transition-colors">
                          {t.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-semibold">
                          Unit {t.unitId}
                        </span>
                      </div>
                      <p className="text-xs text-muted line-clamp-2">{t.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Problems Results */}
          {matchedProblems.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold flex items-center gap-2 text-foreground">
                <Code2 size={16} className="text-blue-500" /> Practice Challenges ({matchedProblems.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchedProblems.map((p) => (
                  <Link key={p.id} href="/practice">
                    <div className="p-4 rounded-xl bg-card border border-card-border hover:border-blue-500/50 transition-all space-y-1 group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold group-hover:text-blue-500 transition-colors">
                          {p.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-semibold">
                          {p.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-muted line-clamp-2">{p.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Labs Results */}
          {matchedLabs.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold flex items-center gap-2 text-foreground">
                <Layers size={16} className="text-orange-500" /> Lab Experiments ({matchedLabs.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchedLabs.map((l) => (
                  <Link key={l.id} href="/labs">
                    <div className="p-4 rounded-xl bg-card border border-card-border hover:border-orange-500/50 transition-all space-y-1 group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold group-hover:text-orange-500 transition-colors">
                          Exp #{l.expNumber}: {l.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 font-semibold">
                          Unit {l.unit}
                        </span>
                      </div>
                      <p className="text-xs text-muted line-clamp-2">{l.aim}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="p-12 text-center text-muted text-sm bg-card border border-card-border rounded-2xl">
              No results found matching &ldquo;{query}&rdquo;. Try searching for general terms like &ldquo;Tree&rdquo;, &ldquo;Stack&rdquo;, or &ldquo;Sort&rdquo;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Suspense fallback={<div className="p-8 text-center text-xs text-muted">Loading search interface...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
