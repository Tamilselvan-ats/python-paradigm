// Zustand store for global application state
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ────────────────────────────────────────────────
export interface UserProgress {
  completedTopics: string[];
  completedProblems: string[];
  completedLabs: number[];
  flashcardProgress: Record<number, { ease: number; interval: number; nextReview: string }>;
  quizScores: Record<string, number>;
  streak: number;
  lastActiveDate: string;
  totalTimeSpent: number; // minutes
  xp: number;
  level: number;
}

export interface AppState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Gemini API
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;

  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Progress
  progress: UserProgress;
  markTopicComplete: (topicId: string) => void;
  markProblemComplete: (problemId: string) => void;
  markLabComplete: (labId: number) => void;
  updateQuizScore: (quizId: string, score: number) => void;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  updateFlashcard: (id: number, ease: number, interval: number) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DEFAULT_PROGRESS: UserProgress = {
  completedTopics: [],
  completedProblems: [],
  completedLabs: [],
  flashcardProgress: {},
  quizScores: {},
  streak: 0,
  lastActiveDate: '',
  totalTimeSpent: 0,
  xp: 0,
  level: 1,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      darkMode: true,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      // Gemini API
      geminiApiKey: '',
      setGeminiApiKey: (key: string) => set({ geminiApiKey: key }),

      // Sidebar
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

      // Progress
      progress: DEFAULT_PROGRESS,

      markTopicComplete: (topicId: string) =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedTopics: state.progress.completedTopics.includes(topicId)
              ? state.progress.completedTopics
              : [...state.progress.completedTopics, topicId],
          },
        })),

      markProblemComplete: (problemId: string) =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedProblems: state.progress.completedProblems.includes(problemId)
              ? state.progress.completedProblems
              : [...state.progress.completedProblems, problemId],
          },
        })),

      markLabComplete: (labId: number) =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedLabs: state.progress.completedLabs.includes(labId)
              ? state.progress.completedLabs
              : [...state.progress.completedLabs, labId],
          },
        })),

      updateQuizScore: (quizId: string, score: number) =>
        set((state) => ({
          progress: {
            ...state.progress,
            quizScores: { ...state.progress.quizScores, [quizId]: score },
          },
        })),

      addXP: (amount: number) =>
        set((state) => {
          const newXP = state.progress.xp + amount;
          const newLevel = Math.floor(newXP / 100) + 1;
          return {
            progress: { ...state.progress, xp: newXP, level: newLevel },
          };
        }),

      updateStreak: () =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          let newStreak = state.progress.streak;

          if (state.progress.lastActiveDate === yesterday) {
            newStreak += 1;
          } else if (state.progress.lastActiveDate !== today) {
            newStreak = 1;
          }

          return {
            progress: {
              ...state.progress,
              streak: newStreak,
              lastActiveDate: today,
            },
          };
        }),

      updateFlashcard: (id: number, ease: number, interval: number) =>
        set((state) => ({
          progress: {
            ...state.progress,
            flashcardProgress: {
              ...state.progress.flashcardProgress,
              [id]: {
                ease,
                interval,
                nextReview: new Date(Date.now() + interval * 86400000).toISOString(),
              },
            },
          },
        })),

      // Search
      searchQuery: '',
      setSearchQuery: (query: string) => set({ searchQuery: query }),
    }),
    {
      name: 'dsa-mastery-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        geminiApiKey: state.geminiApiKey,
        progress: state.progress,
      }),
    }
  )
);
