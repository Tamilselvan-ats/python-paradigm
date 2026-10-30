'use client';

import React, { useState } from 'react';
import {
  Settings,
  Key,
  Moon,
  Sun,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Server,
  Database,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { darkMode, toggleDarkMode, geminiApiKey, setGeminiApiKey } = useAppStore();
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);
  const [isTesting, setIsTesting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleSaveKey = () => {
    setGeminiApiKey(apiKeyInput.trim());
    toast.success('Gemini API key saved to local storage!');
  };

  const handleTestKey = async () => {
    setIsTesting(true);
    setStatusMsg('Testing Gemini Flash connectivity...');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Respond with the word "CONNECTED" in all caps if you can read this.',
          feature: 'tutor',
          apiKey: apiKeyInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg('Successfully connected to Google Gemini Flash API!');
        toast.success('API Key is valid and connected!');
      } else {
        setStatusMsg(`Error: ${data.error}`);
        toast.error('API Key validation failed.');
      }
    } catch (err: any) {
      setStatusMsg(`Connection failed: ${err.message}`);
      toast.error('Connection failed.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all course progress, XP, and streaks? This cannot be undone.')) {
      localStorage.removeItem('dsa-mastery-storage');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings className="w-8 h-8 text-muted" />
          System Settings & Integrations
        </h1>
        <p className="text-muted text-sm mt-1">
          Manage your Gemini AI credentials, theme preferences, and system diagnostic states.
        </p>
      </div>

      {/* Gemini AI Settings Section */}
      <div className="p-6 rounded-2xl bg-card border border-card-border space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg font-bold">Google Gemini AI Configuration</h2>
        </div>
        <p className="text-xs text-muted">
          Your API key is used server-side for AI tutoring, code analysis, and question generation. You can override the default server key with your own personal key.
        </p>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground">Gemini API Key</label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-card-border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
            <button
              onClick={handleSaveKey}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
            >
              Save Key
            </button>
            <button
              onClick={handleTestKey}
              disabled={isTesting}
              className="px-4 py-2.5 rounded-xl border border-card-border hover:bg-background text-xs font-bold transition-all disabled:opacity-50"
            >
              Test Connection
            </button>
          </div>
          {statusMsg && <p className="text-xs font-mono text-emerald-500 pt-1">{statusMsg}</p>}
        </div>
      </div>

      {/* Theme & Display Section */}
      <div className="p-6 rounded-2xl bg-card border border-card-border space-y-4">
        <h2 className="text-lg font-bold">Appearance & Theme</h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Color Mode</h3>
            <p className="text-xs text-muted">Toggle between dark mode (default) and light mode</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-bold border border-card-border hover:border-emerald-500 transition-all"
          >
            {darkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-600" />}
            <span>{darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
          </button>
        </div>
      </div>

      {/* System Infrastructure Status */}
      <div className="p-6 rounded-2xl bg-card border border-card-border space-y-4">
        <h2 className="text-lg font-bold">Infrastructure Diagnostics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800/40 border border-card-border flex items-center gap-3">
            <Cpu className="w-6 h-6 text-emerald-500" />
            <div>
              <p className="text-xs font-bold text-foreground">Next.js App Engine</p>
              <p className="text-[10px] text-emerald-500 font-semibold">Active (Webpack Mode)</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800/40 border border-card-border flex items-center gap-3">
            <Server className="w-6 h-6 text-indigo-500" />
            <div>
              <p className="text-xs font-bold text-foreground">Express Server</p>
              <p className="text-[10px] text-indigo-400 font-semibold">Optional (/server port 3001)</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800/40 border border-card-border flex items-center gap-3">
            <Database className="w-6 h-6 text-teal-500" />
            <div>
              <p className="text-xs font-bold text-foreground">Local State & Storage</p>
              <p className="text-[10px] text-teal-500 font-semibold">Persistent (Zustand)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-bold text-red-500">Reset Local Progress</h2>
        </div>
        <p className="text-xs text-muted">
          Clear all cached XP, completed topics, solved problems, flashcard intervals, and streak data.
        </p>
        <button
          onClick={handleResetProgress}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow transition-all"
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
}
