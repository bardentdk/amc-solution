import { useState, useEffect } from 'react';
import { Loader2, Mail, Download, Trash2, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

export default function NewsletterManager() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setSubscribers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer cet abonné de la liste ?")) {
      await supabase.from('newsletter_subscribers').delete().eq('id', id);
      fetchSubscribers();
    }
  };

  // Fonction magique pour l'export CSV
  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      return alert("Aucun abonné à exporter pour le moment.");
    }

    // 1. Création des en-têtes du CSV
    const headers = ["Email", "Date d'inscription"];
    
    // 2. Formatage des données
    const csvRows = subscribers.map(sub => {
      const date = new Date(sub.created_at).toLocaleDateString('fr-FR');
      // On entoure de guillemets pour éviter les bugs si l'email contenait une virgule (peu probable mais bonne pratique)
      return `"${sub.email}","${date}"`;
    });

    // 3. Assemblage du fichier avec retour à la ligne
    const csvContent = [headers.join(","), ...csvRows].join("\n");

    // 4. Création du fichier physique (Blob) et déclenchement du téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `amc_newsletter_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="h-full flex flex-col pb-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2 font-sans">Abonnés Newsletter</h1>
          <p className="text-dark/60 font-sans">Gérez votre base de contacts pour vos campagnes d'emailing.</p>
        </div>
        <Button variant="primary" onClick={handleExportCSV} className="flex items-center gap-2">
          <Download size={20} /> Exporter en CSV
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-bento overflow-hidden">
        <div className="p-6 border-b border-creamy flex items-center gap-4 bg-creamy/20">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Mail size={24} />
          </div>
          <div>
            <p className="font-bold text-dark text-lg">{subscribers.length} Abonnés</p>
            <p className="text-sm text-dark/60">Base de données globale</p>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-creamy/50 text-dark/60 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium pl-6">Adresse Email</th>
              <th className="p-4 font-medium">Date d'inscription</th>
              <th className="p-4 font-medium text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-creamy">
            {subscribers.map(sub => (
              <tr key={sub.id} className="hover:bg-creamy/20 transition-colors group">
                <td className="p-4 pl-6 font-medium text-dark font-sans">{sub.email}</td>
                <td className="p-4 text-sm text-dark/60 font-sans flex items-center gap-2">
                  <Calendar size={14} className="text-primary/50" />
                  {new Date(sub.created_at).toLocaleDateString('fr-FR', { 
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' 
                  })}
                </td>
                <td className="p-4 pr-6 text-right">
                  <button 
                    onClick={() => handleDelete(sub.id)} 
                    className="p-2 text-dark/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Supprimer l'abonné"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {subscribers.length === 0 && (
          <div className="text-center p-12">
            <p className="text-dark/50 font-medium">Aucun abonné pour le moment.</p>
            <p className="text-sm text-dark/40 mt-1">Les inscriptions apparaîtront ici automatiquement.</p>
          </div>
        )}
      </div>
    </div>
  );
}