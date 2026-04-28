import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, FolderOpen } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

export default function FoldersManager() {
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFolders = async () => {
    setLoading(true);
    const { data } = await supabase.from('client_folders').select('*').order('created_at', { ascending: false });
    if (data) setFolders(data);
    setLoading(false);
  };

  useEffect(() => { fetchFolders(); }, []);

  const addDummyFolder = async () => {
    const type = prompt("Type de dossier (ex: Titre Étudiant) ?");
    const name = prompt("Nom du client ?");
    if(type && name) {
      await supabase.from('client_folders').insert([{ client_name: name, folder_type: type }]);
      fetchFolders();
    }
  };

  const deleteFolder = async (id: string) => {
    if(confirm("Supprimer ce dossier ?")) {
      await supabase.from('client_folders').delete().eq('id', id);
      fetchFolders();
    }
  };

  const updateStatus = async (id: string, currentStatus: string) => {
    const statuses = ['En attente', 'En cours', 'Déposé', 'Validé'];
    const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    await supabase.from('client_folders').update({ status: statuses[nextIndex] }).eq('id', id);
    fetchFolders();
  };

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="h-full flex flex-col pb-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2 font-sans">Dossiers Clients</h1>
          <p className="text-dark/60 font-sans">Votre CRM de suivi des démarches.</p>
        </div>
        <Button variant="primary" onClick={addDummyFolder}><Plus size={20} className="mr-2" /> Nouveau Dossier</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {folders.map(folder => (
          <div key={folder.id} className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between border-l-4 border-primary">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-xl text-primary"><FolderOpen size={24} /></div>
              <div>
                <h3 className="font-bold text-dark font-sans">{folder.client_name}</h3>
                <p className="text-sm text-dark/60">{folder.folder_type}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => updateStatus(folder.id, folder.status)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  folder.status === 'Validé' ? 'bg-green-100 text-green-700' :
                  folder.status === 'En cours' ? 'bg-blue-100 text-blue-700' :
                  folder.status === 'Déposé' ? 'bg-purple-100 text-purple-700' :
                  'bg-orange-100 text-orange-700'
                }`}
              >
                {folder.status} (cliquer pour changer)
              </button>
              
              <div className="flex gap-2">
                <button onClick={() => deleteFolder(folder.id)} className="text-dark/40 hover:text-red-500"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
        {folders.length === 0 && <p className="text-dark/40 text-center py-10 bg-white rounded-2xl">Aucun dossier en cours.</p>}
      </div>
    </div>
  );
}