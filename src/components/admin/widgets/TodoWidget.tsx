import { useState } from 'react';
import { CheckCircle2, Circle, Plus, Loader2 } from 'lucide-react';

interface TodoWidgetProps {
  todos: any[];
  onToggle: (id: string, status: boolean) => void;
  onAdd: (task: string) => void;
  className?: string;
}

export const TodoWidget = ({ todos, onToggle, onAdd, className = '' }: TodoWidgetProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onAdd(inputValue);
    setInputValue('');
  };

  return (
    <div className={`bg-white rounded-3xl shadow-bento p-6 flex flex-col ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-dark font-sans">À faire</h3>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nouvelle tâche..."
          className="flex-1 bg-creamy/50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
        />
        <button type="submit" className="bg-primary text-white p-2 rounded-xl hover:opacity-90">
          <Plus size={20} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {todos.map(todo => (
          <div 
            key={todo.id} 
            className="flex items-start gap-3 cursor-pointer group animate-in fade-in slide-in-from-left-2"
            onClick={() => onToggle(todo.id, todo.is_completed)}
          >
            <div className="mt-0.5">
              {todo.is_completed ? (
                <CheckCircle2 size={18} className="text-primary" />
              ) : (
                <Circle size={18} className="text-dark/30 group-hover:text-primary transition-colors" />
              )}
            </div>
            <span className={`text-sm transition-all ${todo.is_completed ? 'text-dark/40 line-through' : 'text-dark/80'}`}>
              {todo.task}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};