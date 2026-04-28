import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Testimonial } from '../../types';
import { Button } from '../../components/ui/Button';

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial>>({ 
    client_name: '', context: '', content: '', rating: 5, is_published: true 
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (data) setTestimonials(data);
    setLoading(false);
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const handleSave = async () => {
    if (!currentTestimonial.client_name || !currentTestimonial.content) return alert('Nom et contenu obligatoires');
    
    if (currentTestimonial.id) {
      await supabase.from('testimonials').update(currentTestimonial).eq('id', currentTestimonial.id);
    } else {
      await supabase.from('testimonials').insert([currentTestimonial]);
    }
    setIsEditing(false);
    fetchTestimonials();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cet avis ?')) {
      await supabase.from('testimonials').delete().eq('id', id);
      fetchTestimonials();
    }
  };

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="h-full flex flex-col pb-8 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2 font-sans">Avis Clients</h1>
          <p className="text-dark/60 font-sans">Gérez les témoignages affichés sur la page d'accueil.</p>
        </div>
        {!isEditing && (
          <Button variant="primary" onClick={() => { setCurrentTestimonial({ client_name: '', context: '', content: '', rating: 5, is_published: true }); setIsEditing(true); }}>
            <Plus size={20} className="mr-2" /> Nouvel Avis
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-3xl shadow-bento p-8 flex flex-col gap-6 max-w-2xl">
            <div className="flex justify-between items-center border-b border-creamy pb-4">
              <h2 className="text-xl font-bold text-primary">{currentTestimonial.id ? 'Modifier' : 'Créer un avis'}</h2>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Annuler</Button>
                <Button variant="primary" onClick={handleSave}>Enregistrer</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-dark/80">Nom du client</label>
                <input type="text" value={currentTestimonial.client_name} onChange={e => setCurrentTestimonial({...currentTestimonial, client_name: e.target.value})} className="w-full bg-creamy/50 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm mb-2 text-dark/80">Contexte (Ex: Titre Salarié)</label>
                <input type="text" value={currentTestimonial.context} onChange={e => setCurrentTestimonial({...currentTestimonial, context: e.target.value})} className="w-full bg-creamy/50 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-dark/80">Témoignage</label>
              <textarea value={currentTestimonial.content} onChange={e => setCurrentTestimonial({...currentTestimonial, content: e.target.value})} rows={4} className="w-full bg-creamy/50 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary resize-none" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm mb-2 text-dark/80">Note (sur 5)</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setCurrentTestimonial({...currentTestimonial, rating: star})} className={`${(currentTestimonial.rating || 0) >= star ? 'text-yellow-400' : 'text-gray-300'}`}>
                      <Star fill="currentColor" size={24} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={currentTestimonial.is_published} onChange={e => setCurrentTestimonial({...currentTestimonial, is_published: e.target.checked})} className="w-5 h-5 accent-primary" />
                <span className="text-sm font-medium">Publier sur le site</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(testi => (
              <div key={testi.id} className="bg-white rounded-3xl p-6 shadow-bento flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < testi.rating ? "currentColor" : "none"} className={i >= testi.rating ? "text-gray-200" : ""} />)}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={async () => { await supabase.from('testimonials').update({is_published: !testi.is_published}).eq('id', testi.id); fetchTestimonials(); }} className="text-dark/40 hover:text-primary">
                      {testi.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button onClick={() => { setCurrentTestimonial(testi); setIsEditing(true); }} className="text-dark/40 hover:text-blue-500"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(testi.id)} className="text-dark/40 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
                <p className="text-dark/80 italic text-sm line-clamp-4 flex-1">"{testi.content}"</p>
                <div className="pt-4 border-t border-creamy">
                  <p className="font-bold text-dark text-sm">{testi.client_name}</p>
                  <p className="text-xs text-primary">{testi.context}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}