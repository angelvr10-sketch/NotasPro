
import React, { useState } from 'react';
import { TaskList, ThemeColor } from '../types';

interface SidebarProps {
  lists: TaskList[];
  activeListId: string | null;
  onSelectList: (id: string) => void;
  onAddList: (name: string, color: string) => void;
  onDeleteList: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  lists, 
  activeListId, 
  onSelectList, 
  onAddList,
  onDeleteList
}) => {
  const [newListName, setNewListName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const colors = [
    ThemeColor.Indigo,
    ThemeColor.Purple,
    ThemeColor.Emerald,
    ThemeColor.Amber,
    ThemeColor.Rose,
    ThemeColor.Blue
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    onAddList(newListName.trim(), randomColor);
    setNewListName('');
    setShowAddForm(false);
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm z-10">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="font-bold text-xl tracking-tight text-slate-800">TaskMaster</h1>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mis Listas</h2>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-500"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="mb-4">
            <input 
              autoFocus
              type="text"
              placeholder="Nombre de la lista..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
          </form>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1">
        {lists.map(list => (
          <div 
            key={list.id}
            className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
              activeListId === list.id 
                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
            onClick={() => onSelectList(list.id)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${list.color}`} />
              <span className="truncate max-w-[140px]">{list.name}</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDeleteList(list.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded text-slate-400 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <img src="https://picsum.photos/40" alt="Avatar" className="w-8 h-8 rounded-lg" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">Usuario Pro</p>
            <p className="text-xs text-slate-500 truncate">Plan Personal</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
