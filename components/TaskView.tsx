
import React, { useState } from 'react';
import { Task, TaskList } from '../types';
import TaskCard from './TaskCard';

interface TaskViewProps {
  list: TaskList;
  tasks: Task[];
  onAddTask: (title: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateList: (id: string, name: string) => void;
  onSmartBreakdown: (task: Task) => void;
  isAiLoading: boolean;
}

const TaskView: React.FC<TaskViewProps> = ({
  list,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateList,
  onSmartBreakdown,
  isAiLoading
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState(list.name);

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle.trim());
    setNewTaskTitle('');
  };

  const handleTitleSubmit = () => {
    onUpdateList(list.id, editTitleValue);
    setIsEditingTitle(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white md:bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              {isEditingTitle ? (
                <input
                  autoFocus
                  className="text-3xl font-bold text-slate-800 bg-transparent border-b-2 border-indigo-500 focus:outline-none w-full py-1"
                  value={editTitleValue}
                  onChange={(e) => setEditTitleValue(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                />
              ) : (
                <h2 
                  className="text-3xl font-bold text-slate-800 cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    setEditTitleValue(list.name);
                    setIsEditingTitle(true);
                  }}
                >
                  {list.name}
                </h2>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-medium text-slate-500">
                  {completedCount} de {tasks.length} tareas completadas
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="text-2xl font-bold text-indigo-600">{progress}%</div>
              <div className="w-32 h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${list.color}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <input 
              type="text"
              placeholder="Añadir una nueva tarea..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-lg"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </form>
        </div>
      </header>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-lg font-medium text-slate-600">No hay tareas pendientes</h3>
              <p className="text-slate-400 mt-1">Tu lista está limpia, ¡disfruta el día!</p>
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard 
                key={task.id}
                task={task}
                onToggle={() => onToggleTask(task.id)}
                onDelete={() => onDeleteTask(task.id)}
                onSmartBreakdown={() => onSmartBreakdown(task)}
                isAiLoading={isAiLoading}
              />
            ))
          )}
        </div>
      </div>
      
      {isAiLoading && (
        <div className="fixed bottom-8 right-8 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-medium">IA analizando tarea...</span>
        </div>
      )}
    </div>
  );
};

export default TaskView;
