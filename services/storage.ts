
import { Task, TaskList, AppState } from '../types';

const STORAGE_KEY = 'taskmaster_db_v1';

export const storage = {
  save: (state: AppState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  
  load: (): AppState => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return {
        lists: [
          { id: 'default', name: 'Mi Primera Lista', color: 'bg-indigo-500', createdAt: Date.now() }
        ],
        tasks: [],
        activeListId: 'default'
      };
    }
    return JSON.parse(data);
  }
};
