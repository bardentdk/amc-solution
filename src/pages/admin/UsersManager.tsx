import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Shield, User, Plus, Mail, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

export default function UsersManager() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour la création d'utilisateur
  const [isCreating, setIsCreating] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setProfiles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // En Serverless (sans backend Node.js), on ne peut pas créer un compte auth pour un tiers
    // sans se déconnecter. La bonne méthode est d'utiliser une Supabase Edge Function
    // ou d'envoyer un lien magique (Magic Link) via l'API Admin.
    
    // Ceci est une simulation UI pour te permettre de continuer ton intégration visuelle.
    setTimeout(() => {
      alert(`Simulation : Un email d'invitation avec un lien de création de mot de passe serait envoyé à ${newUserEmail}.\n\nPour activer la vraie création côté admin, nous devrons configurer une Edge Function Supabase (via la clé Service Role) ou activer les Magic Links.`);
      setIsSubmitting(false);
      setIsCreating(false);
      setNewUserEmail('');
      setNewUserName('');
    }, 1500);
  };

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="h-full flex flex-col pb-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2 font-sans">Utilisateurs</h1>
          <p className="text-dark/60 font-sans">Gérez les accès à l'espace client.</p>
        </div>
        {!isCreating && (
          <Button variant="primary" onClick={() => setIsCreating(true)}>
            <Plus size={20} className="mr-2" /> Inviter un client
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isCreating && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }} 
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-3xl shadow-bento p-8 relative">
              <button 
                onClick={() => setIsCreating(false)}
                className="absolute top-6 right-6 text-dark/40 hover:text-dark transition-colors"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-xl font-bold text-dark mb-6">Créer un accès client</h2>
              <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark/80 mb-2">Nom / Prénom du client</label>
                  <input 
                    type="text" 
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full bg-creamy/50 border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark/80 mb-2">Adresse Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" size={20} />
                    <input 
                      type="email" 
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full bg-creamy/50 border border-transparent rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none"
                      placeholder="jean.dupont@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-dark/60 bg-primary/5 p-4 rounded-xl border border-primary/10">
                    ℹ️ Un email automatique sera envoyé à cette adresse. Le client devra cliquer sur le lien pour configurer son mot de passe et activer son espace personnel.
                  </p>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="animate-spin mr-2" size={18} /> Envoi en cours...</> : 'Envoyer l\'invitation'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl shadow-bento overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-creamy/50 text-dark/60 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Utilisateur</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Rôle</th>
              <th className="p-4 font-medium">Date d'inscription</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-creamy">
            {profiles.map(p => (
              <tr key={p.id} className="hover:bg-creamy/20 transition-colors">
                <td className="p-4 font-medium text-dark font-sans flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                    {(p.first_name?.[0] || '') + (p.last_name?.[0] || p.email?.[0] || '?')}
                  </div>
                  {p.first_name || p.last_name ? `${p.first_name || ''} ${p.last_name || ''}` : 'Profil Incomplet'}
                </td>
                <td className="p-4 text-sm text-dark/70 font-sans">{p.email || 'Non renseigné'}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${p.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>
                    {p.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                    {p.role}
                  </span>
                </td>
                <td className="p-4 text-sm text-dark/60">{new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {profiles.length === 0 && <p className="text-center p-8 text-dark/50">Aucun utilisateur trouvé.</p>}
      </div>
    </div>
  );
}