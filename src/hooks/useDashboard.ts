import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

export function useDashboard() {
  const [stats, setStats] = useState({ total_contacts: 0, total_offers: 0, total_blog_posts: 0 });
  const [todos, setTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [s, t] = await Promise.all([
        adminService.getStats(),
        adminService.getTodos()
      ]);
      setStats(s);
      setTodos(t);
    } catch (error) {
      console.error("Erreur chargement dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleTodo = async (id: string, completed: boolean) => {
    await adminService.toggleTodo(id, !completed);
    setTodos(todos.map(t => t.id === id ? { ...t, is_completed: !completed } : t));
  };

  const handleAddTodo = async (task: string) => {
    const newTodo = await adminService.addTodo(task);
    setTodos([newTodo, ...todos]);
  };

  return { stats, todos, loading, handleToggleTodo, handleAddTodo, refresh: loadData };
}