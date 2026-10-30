'use client';

import { useAppStore } from '@/lib/store';
import { Search, Moon, Sun, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const { darkMode, toggleDarkMode, searchQuery, setSearchQuery, sidebarOpen } = useAppStore();
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-card-border flex items-center justify-between px-6"
    >
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search topics, algorithms, data structures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-card-border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {/* Right Actions */}
      <div className="flex items-center gap-3 ml-4">
        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-card transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600" />
          )}
        </motion.button>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-card transition-colors relative">
          <Bell className="w-5 h-5 text-muted" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>

        {/* Profile */}
        <button className="p-1.5 rounded-lg hover:bg-card transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-indigo-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </button>
      </div>
    </header>
  );
}
