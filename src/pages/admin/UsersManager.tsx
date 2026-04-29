import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { UserPlus, Mail, Trash2, Search, Loader2, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion'; // NOUVEAU : Import nécessaire pour l'animation de la modale

export default function UsersManager() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ email: '', first_name: '', last_name: '' });
  const [inviting, setInviting] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    // On récupère les profils qui ont le rôle 'client'
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'client')
      .order('created_at', { ascending: false });
    
    if (data) setClients(data);
    setLoading(false);
  };

  useEffect(() => { fetchClients(); }, []);

  const filteredClients = clients.filter(c => 
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);

    try {
      const { data, error } = await supabase.functions.invoke('invite-client', {
        body: newClient
      });

      if (error) throw error;

      alert(`Invitation envoyée avec succès à ${newClient.email}`);
      setIsModalOpen(false);
      setNewClient({ email: '', first_name: '', last_name: '' });
      fetchClients(); // Actualise la liste
    } catch (err: any) {
      alert("Erreur lors de l'invitation : " + err.message);
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="h-full flex flex-col pb-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2 font-sans">Gestion des Clients</h1>
          <p className="text-dark/60 font-sans">Créez et gérez les accès de vos clients au portail sécurisé.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={20} className="mr-2" /> Inviter un nouveau client
        </Button>
      </div>

      {/* BARRE DE RECHERCHE */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" size={20} />
        <input 
          type="text" 
          placeholder="Rechercher un client par nom ou email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-creamy rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-primary/20 shadow-sm font-sans"
        />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-creamy overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-creamy/50 text-dark/50 text-[10px] uppercase font-bold tracking-widest border-b border-creamy">
              <th className="p-6">Identité du client</th>
              <th className="p-6">Dossiers</th>
              <th className="p-6">Statut Compte</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-creamy">
            {loading ? (
              <tr><td colSpan={4} className="p-10 text-center"><Loader2 className="animate-spin text-primary mx-auto" /></td></tr>
            ) : filteredClients.map(client => (
              <tr key={client.id} className="hover:bg-creamy/10 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Sécurisation des initiales */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold uppercase">
                      {client.first_name ? client.first_name[0] : '?'}
                      {client.last_name ? client.last_name[0] : ''}
                    </div>
                    <div>
                      {/* Noms par défaut si null */}
                      <p className="font-bold text-dark font-sans">
                        {client.first_name || 'Client'} {client.last_name || 'Sans Nom'}
                      </p>
                      <p className="text-xs text-dark/40">{client.email || 'Pas d\'email renseigné'}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-sm font-medium text-dark/70">
                  <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-500" /> 1 dossier actif</span>
                </td>
                <td className="p-6">
                  <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                    Accès Activé
                  </span>
                </td>
                <td className="p-6 text-right">
                  <button className="p-2 text-dark/20 hover:text-primary transition-colors">
                    <ExternalLink size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredClients.length === 0 && !loading && (
          <div className="p-20 text-center text-dark/30 font-medium">Aucun client trouvé.</div>
        )}
      </div>

      {/* MODAL CORRIGÉE : Placée à l'intérieur du "return" principal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-dark mb-6">Nouveau client</h2>
            <form onSubmit={handleInvite} className="space-y-4">
              <input type="text" placeholder="Prénom" required value={newClient.first_name} onChange={e => setNewClient({...newClient, first_name: e.target.value})} className="w-full bg-creamy/50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20" />
              <input type="text" placeholder="Nom" required value={newClient.last_name} onChange={e => setNewClient({...newClient, last_name: e.target.value})} className="w-full bg-creamy/50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20" />
              <input type="email" placeholder="Email" required value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full bg-creamy/50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20" />
              
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                <Button type="submit" variant="primary" className="flex-1" disabled={inviting}>
                  {inviting ? <Loader2 className="animate-spin" /> : "Envoyer l'invitation"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}