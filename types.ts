
export interface Task {
  id: string;
  listId: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export interface TaskList {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface AppState {
  lists: TaskList[];
  tasks: Task[];
  activeListId: string | null;
}

export enum ThemeColor {
  Blue = 'bg-blue-500',
  Purple = 'bg-purple-500',
  Emerald = 'bg-emerald-500',
  Rose = 'bg-rose-500',
  Amber = 'bg-amber-500',
  Indigo = 'bg-indigo-500'
}
