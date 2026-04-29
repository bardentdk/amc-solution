import { useState, useEffect } from 'react';
import { Folder, Edit2, CheckCircle, Loader2, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ClientDossiersManager() {
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Valeurs temporaires pendant l'édition
  const [editStatus, setEditStatus] = useState('');
  const [editProgress, setEditProgress] = useState(0);

  const fetchDossiers = async () => {
    setLoading(true);
    // On récupère les dossiers AVEC les infos du client associé (grâce aux clés étrangères)
    const { data } = await supabase
      .from('client_dossiers')
      .select('*, profiles:client_id(first_name, last_name, email)')
      .order('created_at', { ascending: false });
    
    if (data) setDossiers(data);
    setLoading(false);
  };

  useEffect(() => { fetchDossiers(); }, []);

  const handleEdit = (dossier: any) => {
    setEditingId(dossier.id);
    setEditStatus(dossier.status);
    setEditProgress(dossier.progress_percentage);
  };

  const handleSave = async (id: string) => {
    await supabase
      .from('client_dossiers')
      .update({ status: editStatus, progress_percentage: editProgress })
      .eq('id', id);
      
    setEditingId(null);
    fetchDossiers();
  };

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="h-full flex flex-col pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Suivi des Dossiers</h1>
        <p className="text-dark/60">Mettez à jour la progression pour informer vos clients.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {dossiers.map((dossier) => (
          <div key={dossier.id} className="bg-white rounded-3xl shadow-bento p-6 border border-creamy flex flex-col lg:flex-row gap-6 items-center">
            
            {/* Infos du Dossier */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 text-primary rounded-lg"><Folder size={20} /></div>
                <h3 className="text-xl font-bold text-dark">{dossier.title}</h3>
              </div>
              <p className="text-sm font-medium text-dark/50 mb-4">
                Client : {dossier.profiles?.first_name} {dossier.profiles?.last_name} ({dossier.profiles?.email})
              </p>
              
              {/* Barre visuelle pour l'admin */}
              <div className="w-full bg-creamy rounded-full h-2 mb-1">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${dossier.progress_percentage}%` }}></div>
              </div>
            </div>

            {/* Zone d'édition */}
            <div className="w-full lg:w-auto bg-creamy/30 p-4 rounded-2xl flex items-end gap-4">
              {editingId === dossier.id ? (
                <>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-dark/50 uppercase mb-1">Statut</label>
                    <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-sm">
                      <option value="nouveau">Nouveau</option>
                      <option value="en_preparation">En préparation</option>
                      <option value="depose">Déposé (ANEF)</option>
                      <option value="en_attente">En attente (Préfecture)</option>
                      <option value="valide">Validé</option>
                      <option value="refuse">Refusé</option>
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-bold text-dark/50 uppercase mb-1">Progression</label>
                    <div className="relative">
                      <input type="number" min="0" max="100" value={editProgress} onChange={(e) => setEditProgress(Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-xl pl-3 pr-6 py-2 outline-none focus:ring-2 focus:ring-primary text-sm" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 font-bold">%</span>
                    </div>
                  </div>
                  <button onClick={() => handleSave(dossier.id)} className="h-10 px-4 bg-primary text-white rounded-xl hover:bg-emerald-500 transition-colors flex items-center gap-2">
                    <Save size={16} /> <span className="hidden lg:inline">Enregistrer</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-dark/50 uppercase mb-1">Statut actuel</p>
                    <p className="font-bold text-dark">{dossier.status.replace('_', ' ')}</p>
                  </div>
                  <div className="w-24">
                    <p className="text-xs font-bold text-dark/50 uppercase mb-1">Progression</p>
                    <p className="font-black text-primary text-lg">{dossier.progress_percentage}%</p>
                  </div>
                  <button onClick={() => handleEdit(dossier)} className="h-10 px-4 bg-white border border-gray-200 text-dark rounded-xl hover:text-primary hover:border-primary transition-colors flex items-center gap-2">
                    <Edit2 size={16} /> <span className="hidden lg:inline">Modifier</span>
                  </button>
                </>
              )}
            </div>

          </div>
        ))}
        {dossiers.length === 0 && (
          <div className="text-center p-20 bg-white rounded-3xl shadow-bento text-dark/40 font-medium">Aucun dossier client en cours.</div>
        )}
      </div>
    </div>
  );
}