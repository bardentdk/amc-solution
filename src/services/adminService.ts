import { supabase } from '../lib/supabase';
// import { ContactMessage, Offer, BlogPost } from '../types';
import type { ContactMessage, Offer, BlogPost } from '../types';


export const adminService = {
  // Récupération des statistiques globales
  async getStats() {
    const { data, error } = await supabase.rpc('get_admin_stats');
    if (error) throw error;
    return data[0];
  },

  // Gestion de la To-Do List
  async getTodos() {
    const { data, error } = await supabase
      .from('admin_todos')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async toggleTodo(id: string, is_completed: boolean) {
    const { error } = await supabase
      .from('admin_todos')
      .update({ is_completed })
      .eq('id', id);
    if (error) throw error;
  },

  async addTodo(task: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('admin_todos')
      .insert([{ task, user_id: user?.id }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};