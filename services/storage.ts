
import { Task, TaskList, AppState } from '../types.ts';

const STORAGE_KEY = 'taskmaster_db_v1';

const DEFAULT_STATE: AppState = {
  lists: [
    { id: 'default', name: 'Mi Primera Lista', color: 'bg-indigo-500', createdAt: Date.now() }
  ],
  tasks: [],
  activeListId: 'default'
};

export const storage = {
  save: (state: AppState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },
  
  load: (): AppState => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_STATE;
      
      const parsed = JSON.parse(data);
      // Validación básica de estructura
      if (!parsed.lists || !Array.isArray(parsed.lists)) return DEFAULT_STATE;
      
      return parsed;
    } catch (error) {
      console.error("Error loading from localStorage, resetting to default:", error);
      return DEFAULT_STATE;
    }
  }
};
