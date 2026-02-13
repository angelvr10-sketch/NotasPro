
import React, { useState, useEffect, useMemo } from 'react';
import { Task, TaskList, AppState } from './types.ts';
import { storage } from './services/storage.ts';
import { getSmartBreakdown } from './services/gemini.ts';
import Sidebar from './components/Sidebar.tsx';
import TaskView from './components/TaskView.tsx';

// Fallback para entornos donde crypto.randomUUID no esté disponible
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => storage.load());
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    storage.save(state);
  }, [state]);

  const activeList = useMemo(() => {
    const found = state.lists.find(l => l.id === state.activeListId);
    return found || (state.lists.length > 0 ? state.lists[0] : null);
  }, [state.lists, state.activeListId]);

  const activeTasks = useMemo(() => {
    if (!activeList) return [];
    return state.tasks.filter(t => t.listId === activeList.id)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [state.tasks, activeList]);

  const handleAddList = (name: string, color: string) => {
    const newList: TaskList = {
      id: generateId(),
      name,
      color,
      createdAt: Date.now()
    };
    setState(prev => ({
      ...prev,
      lists: [...prev.lists, newList],
      activeListId: newList.id
    }));
  };

  const handleDeleteList = (id: string) => {
    setState(prev => {
      const remainingLists = prev.lists.filter(l => l.id !== id);
      const newActiveId = remainingLists.length > 0 ? remainingLists[0].id : null;
      return {
        ...prev,
        lists: remainingLists,
        tasks: prev.tasks.filter(t => t.listId !== id),
        activeListId: newActiveId
      };
    });
  };

  const handleUpdateList = (id: string, name: string) => {
    setState(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.id === id ? { ...l, name } : l)
    }));
  };

  const handleAddTask = (title: string) => {
    if (!activeList) return;
    const newTask: Task = {
      id: generateId(),
      listId: activeList.id,
      title,
      completed: false,
      createdAt: Date.now()
    };
    setState(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));
  };

  const handleToggleTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const handleDeleteTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  };

  const handleSmartBreakdown = async (task: Task) => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    try {
      const subtasks = await getSmartBreakdown(task.title);
      if (subtasks.length > 0) {
        const newTasks: Task[] = subtasks.map(title => ({
          id: generateId(),
          listId: task.listId,
          title,
          completed: false,
          createdAt: Date.now()
        }));
        setState(prev => ({
          ...prev,
          tasks: [...newTasks, ...prev.tasks]
        }));
      }
    } catch (err) {
      console.error("Error in breakdown action:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar 
        lists={state.lists} 
        activeListId={state.activeListId}
        onSelectList={(id) => setState(prev => ({ ...prev, activeListId: id }))}
        onAddList={handleAddList}
        onDeleteList={handleDeleteList}
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {activeList ? (
          <TaskView 
            list={activeList}
            tasks={activeTasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onUpdateList={handleUpdateList}
            onSmartBreakdown={handleSmartBreakdown}
            isAiLoading={isAiLoading}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 p-8 text-center">
            <div>
              <div className="mb-4 text-6xl">📝</div>
              <h2 className="text-xl font-medium">No hay listas seleccionadas</h2>
              <p className="mt-2">Crea una lista en el panel lateral para comenzar.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
