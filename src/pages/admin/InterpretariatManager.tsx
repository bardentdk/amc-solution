import { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Trash2, CheckCircle, Loader2, MessageSquare, Languages } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { InterpretariatMessage } from '../../types';

export default function InterpretariatManager() {
  const [messages, setMessages] = useState<InterpretariatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase.from('interpretariat_messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('interpretariat_messages').update({ status }).eq('id', id);
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette demande ?')) {
      await supabase.from('interpretariat_messages').delete().eq('id', id);
      fetchMessages();
    }
  };

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="h-full flex flex-col pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2 flex items-center gap-3">
          Demandes d'Interprétariat <span className="text-xs bg-[#049dbf] text-white px-2 py-1 rounded-md uppercase tracking-wider font-bold">Nouveau Service</span>
        </h1>
        <p className="text-dark/60">Gérez les demandes de traduction et d'accompagnement linguistique.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`bg-white rounded-3xl shadow-bento p-6 flex flex-col md:flex-row gap-6 border-l-8 ${msg.status === 'new' ? 'border-[#049dbf]' : 'border-gray-200 opacity-80'}`}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-dark">{msg.first_name} {msg.last_name}</h3>
                {msg.status === 'new' && <span className="bg-[#049dbf] text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Nouveau</span>}
              </div>
              
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-dark/60 font-medium">
                <span className="flex items-center gap-1 text-[#f2b705] font-bold"><Languages size={14} /> {msg.languages}</span>
                <span className="flex items-center gap-1"><Mail size={14} /> {msg.email}</span>
                {msg.phone && <span className="flex items-center gap-1"><Phone size={14} /> {msg.phone}</span>}
                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(msg.created_at).toLocaleDateString('fr-FR')}</span>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl text-dark/80 text-sm leading-relaxed">
                <MessageSquare size={16} className="mb-2 text-gray-400" />
                {msg.message}
              </div>
            </div>

            <div className="flex md:flex-col justify-end gap-2 shrink-0">
              {msg.status === 'new' && (
                <button onClick={() => updateStatus(msg.id, 'read')} className="p-3 bg-blue-50 text-[#049dbf] rounded-2xl hover:bg-[#049dbf] hover:text-white transition-all" title="Marquer comme traité">
                  <CheckCircle size={20} />
                </button>
              )}
              <button onClick={() => handleDelete(msg.id)} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        {messages.length === 0 && <div className="text-center py-20 bg-white rounded-3xl shadow-bento text-dark/40 font-medium">Aucune demande d'interprétariat.</div>}
      </div>
    </div>
  );
}