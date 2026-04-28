import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, Download, Trash2, CheckCircle, Loader2, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ContactMessage } from '../../types';

export default function ContactMessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('contact_messages').update({ status }).eq('id', id);
    fetchMessages();
  };

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="h-full flex flex-col pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Demandes de Contact</h1>
        <p className="text-dark/60">Gérez les prospects et les pièces jointes reçues.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={msg.id}
            className={`bg-white rounded-3xl shadow-bento p-6 flex flex-col md:flex-row gap-6 border-l-8 ${
              msg.status === 'new' ? 'border-primary' : 'border-gray-200 opacity-80'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-dark">{msg.first_name} {msg.last_name}</h3>
                {msg.status === 'new' && <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Nouveau</span>}
              </div>
              
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-dark/60 font-medium">
                <span className="flex items-center gap-1"><Mail size={14} /> {msg.email}</span>
                <span className="flex items-center gap-1"><Phone size={14} /> {msg.phone}</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(msg.created_at).toLocaleDateString('fr-FR')}</span>
              </div>

              <div className="bg-creamy/50 p-4 rounded-2xl text-dark/80 text-sm leading-relaxed mb-4">
                <MessageSquare size={16} className="mb-2 text-primary/40" />
                {msg.message}
              </div>

              {msg.attachment_url && (
                <a 
                  href={msg.attachment_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/20 transition-colors"
                >
                  <Download size={14} /> Voir la pièce jointe
                </a>
              )}
            </div>

            <div className="flex md:flex-col justify-end gap-2 shrink-0">
              {msg.status === 'new' && (
                <button 
                  onClick={() => updateStatus(msg.id, 'read')}
                  className="p-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all"
                  title="Marquer comme lu"
                >
                  <CheckCircle size={20} />
                </button>
              )}
              <button 
                onClick={async () => { if(confirm('Supprimer ce message ?')) { await supabase.from('contact_messages').delete().eq('id', msg.id); fetchMessages(); } }}
                className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </motion.div>
        ))}
        {messages.length === 0 && <div className="text-center py-20 bg-white rounded-3xl shadow-bento text-dark/40 font-medium">Aucun message reçu pour le moment.</div>}
      </div>
    </div>
  );
}