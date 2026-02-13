
import React from 'react';
import { Task } from '../types.ts';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onSmartBreakdown: () => void;
  isAiLoading: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onToggle, 
  onDelete, 
  onSmartBreakdown,
  isAiLoading
}) => {
  return (
    <div className={`group flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl transition-all hover:shadow-md hover:border-indigo-100 ${task.completed ? 'bg-slate-50/50' : ''}`}>
      <button 
        onClick={onToggle}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          task.completed 
            ? 'bg-emerald-500 border-emerald-500 text-white' 
            : 'border-slate-300 hover:border-indigo-500'
        }`}
      >
        {task.completed && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-lg transition-all truncate ${
          task.completed 
            ? 'text-slate-400 line-through decoration-emerald-500/50 decoration-2' 
            : 'text-slate-700 font-medium'
        }`}>
          {task.title}
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSmartBreakdown();
          }}
          disabled={isAiLoading}
          title="Sugerir desglose con IA"
          className="p-2 text-indigo-400 hover:bg-indigo-50 rounded-xl transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
