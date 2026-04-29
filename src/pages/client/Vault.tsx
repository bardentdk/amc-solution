import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, FileText, CheckCircle2, XCircle, Loader2, Trash2, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function Vault() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('client_documents').select('*').eq('client_id', user.id);
      if (data) setDocuments(data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Upload vers Storage (Bucket client_vault)
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { error: storageError } = await supabase.storage.from('client_vault').upload(filePath, file);

    if (storageError) {
      alert("Erreur upload storage");
    } else {
      // 2. Enregistrement en base de données
      await supabase.from('client_documents').insert([{
        client_id: user.id,
        file_name: file.name,
        file_path: filePath
      }]);
      fetchDocs();
    }
    setUploading(false);
  };

  const handleDelete = async (id: string, path: string) => {
    if (confirm("Supprimer ce document ?")) {
      await supabase.storage.from('client_vault').remove([path]);
      await supabase.from('client_documents').delete().eq('id', id);
      fetchDocs();
    }
  };

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Mon Coffre-fort 🛡️</h1>
          <p className="text-dark/60">Déposez vos documents en toute sécurité pour votre dossier.</p>
        </div>
        <div className="relative">
          <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" disabled={uploading} />
          <Button variant="primary" disabled={uploading} className="w-full">
            {uploading ? <Loader2 className="animate-spin" /> : <><Upload size={18} className="mr-2" /> Ajouter un document</>}
          </Button>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-creamy overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-creamy/50 border-b border-creamy text-[10px] uppercase font-bold tracking-widest text-dark/50">
            <tr>
              <th className="p-6">Document</th>
              <th className="p-6">Statut</th>
              <th className="p-6">Date</th>
              <th className="p-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-creamy">
            {documents.map(doc => (
              <tr key={doc.id} className="hover:bg-creamy/20 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl"><FileText size={20} /></div>
                    <span className="font-bold text-dark text-sm">{doc.file_name}</span>
                  </div>
                </td>
                <td className="p-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    doc.status === 'valide' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {doc.status === 'valide' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {doc.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-6 text-sm text-dark/40">
                  {new Date(doc.created_at).toLocaleDateString()}
                </td>
                <td className="p-6 text-right">
                  <button onClick={() => handleDelete(doc.id, doc.file_path)} className="text-dark/20 hover:text-red-500 transition-colors p-2">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {documents.length === 0 && (
          <div className="text-center p-20 text-dark/40">
            <Shield size={48} className="mx-auto mb-4 opacity-20" />
            <p>Votre coffre-fort est vide.</p>
          </div>
        )}
      </div>
    </div>
  );
}