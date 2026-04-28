import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, CheckCircle, PlusCircle, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Offer } from '../../types';
import { Button } from '../../components/ui/Button';

export default function OffersManager() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // État pour le formulaire
  const [currentOffer, setCurrentOffer] = useState<Partial<Offer>>({ 
    title: '', description: '', price: 0, features: [], is_active: true 
  });
  const [newFeature, setNewFeature] = useState('');

  const fetchOffers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('offers').select('*').order('price', { ascending: true });
    if (!error && data) setOffers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSave = async () => {
    // --- DÉBUT DU DIAGNOSTIC ---
    const { data: authData } = await supabase.auth.getSession();
    console.log("1. Session actuelle :", authData.session);
    
    if (authData.session?.user?.id) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.session.user.id)
        .single();
      console.log("2. Profil trouvé en BDD :", profileData);
    } else {
      console.log("2. ERREUR : Aucun ID utilisateur trouvé dans la session.");
    }
    // --- FIN DU DIAGNOSTIC ---
    
    if (!currentOffer.title || currentOffer.price === undefined) {
      return alert('Le titre et le prix sont obligatoires');
    }
    
    setSaving(true);
    const payload = {
      title: currentOffer.title,
      description: currentOffer.description,
      price: currentOffer.price,
      features: currentOffer.features || [],
      is_active: currentOffer.is_active
    };

    if (currentOffer.id) {
      await supabase.from('offers').update(payload).eq('id', currentOffer.id);
    } else {
      await supabase.from('offers').insert([payload]);
    }

    setSaving(false);
    setIsEditing(false);
    setCurrentOffer({ title: '', description: '', price: 0, features: [], is_active: true });
    fetchOffers();
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await supabase.from('offers').update({ is_active: !currentStatus }).eq('id', id);
    fetchOffers();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Es-tu sûr de vouloir supprimer cette offre définitivement ?')) {
      await supabase.from('offers').delete().eq('id', id);
      fetchOffers();
    }
  };

  // Gestion des avantages (features) de l'offre
  const addFeature = () => {
    if (newFeature.trim()) {
      setCurrentOffer({ ...currentOffer, features: [...(currentOffer.features || []), newFeature.trim()] });
      setNewFeature('');
    }
  };

  const removeFeature = (indexToRemove: number) => {
    setCurrentOffer({
      ...currentOffer,
      features: currentOffer.features?.filter((_, index) => index !== indexToRemove)
    });
  };

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="h-full flex flex-col pb-8 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2 font-sans">Gestion des Offres</h1>
          <p className="text-dark/60 font-sans">Créez et modifiez les formules proposées à vos clients.</p>
        </div>
        {!isEditing && (
          <Button variant="primary" onClick={() => { setCurrentOffer({ title: '', description: '', price: 0, features: [], is_active: true }); setIsEditing(true); }}>
            <Plus size={20} className="mr-2" /> Nouvelle Offre
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-3xl shadow-bento p-8 flex flex-col gap-6 max-w-4xl mx-auto w-full">
            <div className="flex justify-between items-center border-b border-creamy pb-4">
              <h2 className="text-2xl font-bold text-primary">{currentOffer.id ? 'Modifier l\'offre' : 'Créer une offre'}</h2>
              <div className="flex gap-4">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Annuler</Button>
                <Button variant="primary" onClick={handleSave} isLoading={saving}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-dark/80 mb-2">Titre de l'offre</label>
                <input 
                  type="text" 
                  value={currentOffer.title} 
                  onChange={(e) => setCurrentOffer({ ...currentOffer, title: e.target.value })}
                  className="w-full bg-creamy/50 border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Ex: Accompagnement Étudiant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark/80 mb-2">Prix (TTC)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={currentOffer.price} 
                    onChange={(e) => setCurrentOffer({ ...currentOffer, price: parseFloat(e.target.value) })}
                    className="w-full bg-creamy/50 border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none pr-10"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/50 font-bold">€</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark/80 mb-2">Description courte</label>
              <textarea 
                value={currentOffer.description} 
                onChange={(e) => setCurrentOffer({ ...currentOffer, description: e.target.value })}
                className="w-full bg-creamy/50 border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none h-24"
                placeholder="Idéal pour les étudiants souhaitant renouveler leur titre..."
              />
            </div>

            {/* Gestion des Avantages (Features) */}
            <div className="border border-creamy rounded-2xl p-6 bg-white/50">
              <label className="block text-sm font-medium text-dark/80 mb-4">Avantages inclus dans l'offre</label>
              
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newFeature} 
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="flex-1 bg-creamy border border-transparent rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Ex: Prise de RDV en préfecture"
                />
                <Button variant="outline" onClick={addFeature} className="px-3" type="button">
                  <PlusCircle size={20} />
                </Button>
              </div>

              <ul className="space-y-2">
                {currentOffer.features?.map((feature, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-creamy/40 px-4 py-2 rounded-lg text-sm text-dark/80">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-primary" />
                      {feature}
                    </div>
                    <button onClick={() => removeFeature(idx)} className="text-red-400 hover:text-red-600 p-1">
                      <X size={16} />
                    </button>
                  </li>
                ))}
                {(!currentOffer.features || currentOffer.features.length === 0) && (
                  <p className="text-sm text-dark/40 italic">Aucun avantage ajouté.</p>
                )}
              </ul>
            </div>

            <div className="flex items-center gap-3 bg-creamy/50 p-4 rounded-xl w-fit mt-2">
              <label className="text-sm font-medium text-dark cursor-pointer">Activer l'offre (visible par les clients)</label>
              <input 
                type="checkbox" 
                checked={currentOffer.is_active || false} 
                onChange={(e) => setCurrentOffer({ ...currentOffer, is_active: e.target.checked })}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className={`bg-white rounded-3xl p-6 flex flex-col gap-4 border-2 transition-all ${offer.is_active ? 'border-transparent shadow-bento' : 'border-dashed border-gray-200 opacity-70'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${offer.is_active ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                    {offer.is_active ? 'Active' : 'Désactivée'}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => toggleActive(offer.id, offer.is_active)} className="text-dark/40 hover:text-primary transition-colors">
                      {offer.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button onClick={() => { setCurrentOffer(offer); setIsEditing(true); }} className="text-dark/40 hover:text-blue-500 transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(offer.id)} className="text-dark/40 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-dark font-sans">{offer.title}</h3>
                  <div className="text-3xl font-bold text-primary mt-2">{offer.price}€</div>
                </div>
                
                <p className="text-sm text-dark/60 mt-2 line-clamp-2">{offer.description}</p>
                
                <div className="mt-auto pt-4 border-t border-creamy">
                  <p className="text-xs text-dark/50 font-medium">
                    {offer.features?.length || 0} avantage(s) inclus
                  </p>
                </div>
              </div>
            ))}
            {offers.length === 0 && <p className="text-dark/50 col-span-full">Aucune offre pour le moment.</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}