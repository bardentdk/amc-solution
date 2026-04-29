import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { FileText, Clock, CheckCircle2, ShieldCheck, Upload, Loader2, AlertCircle } from 'lucide-react';
import type { ClientDossier } from '../../types';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export default function ClientDashboard() {
  const [dossiers, setDossiers] = useState<ClientDossier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDossiers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('client_dossiers').select('*').eq('client_id', user.id);
        if (data) setDossiers(data);
      }
      setLoading(false);
    };
    fetchDossiers();
  }, []);

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-dark mb-2">Bonjour ! 👋</h1>
        <p className="text-dark/60">Suivez l'avancement de vos démarches administratives.</p>
      </header>

      {dossiers.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-sm border border-creamy">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <FileText size={40} />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-4">Aucun dossier en cours</h2>
          <p className="text-dark/60 max-w-md mx-auto mb-8">
            Vous n'avez pas encore de dossier actif. Prenez contact avec un expert pour démarrer votre procédure.
          </p>
          <Link to="/contact"><Button variant="primary">Contacter un expert</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {dossiers.map(dossier => (
            <div key={dossier.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-creamy">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
                <div>
                  <h3 className="text-2xl font-bold text-dark mb-2">{dossier.title}</h3>
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <span className="flex items-center gap-1.5 text-primary">
                      <Clock size={16} /> Créé le {new Date(dossier.created_at).toLocaleDateString()}
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs uppercase font-bold">
                      {dossier.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <Link to="/vault"><Button variant="outline"><Upload size={18} className="mr-2" /> Déposer des pièces</Button></Link>
              </div>

              {/* BARRE DE PROGRESSION ÉLÉGANTE */}
              <div className="relative">
                <div className="flex justify-between mb-4">
                  <span className="text-sm font-bold text-dark">Progression du dossier</span>
                  <span className="text-sm font-bold text-primary">{dossier.progress_percentage}%</span>
                </div>
                <div className="h-4 w-full bg-creamy rounded-full overflow-hidden border border-creamy shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${dossier.progress_percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                  />
                </div>
                
                {/* ÉTAPES VISUELLES */}
                <div className="grid grid-cols-4 mt-8 gap-2">
                  {[
                    { label: 'Analyse', min: 10 },
                    { label: 'Préparation', min: 40 },
                    { label: 'Dépôt ANEF', min: 70 },
                    { label: 'Validation', min: 100 }
                  ].map((step, i) => (
                    <div key={i} className="text-center">
                      <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center transition-colors ${dossier.progress_percentage >= step.min ? 'bg-primary text-white' : 'bg-creamy text-dark/30'}`}>
                        {dossier.progress_percentage >= step.min ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{i+1}</span>}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${dossier.progress_percentage >= step.min ? 'text-primary' : 'text-dark/30'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION RÉASSURANCE DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark text-white p-6 rounded-3xl flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-2xl text-primary"><ShieldCheck size={24} /></div>
          <div><p className="font-bold text-sm">Données chiffrées</p><p className="text-xs text-creamy/60">Vos documents sont en sécurité</p></div>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl flex items-center gap-4">
          <div className="bg-primary/20 p-3 rounded-2xl text-primary"><AlertCircle size={24} /></div>
          <div><p className="font-bold text-sm text-dark">Besoin d'aide ?</p><p className="text-xs text-dark/50">Contactez votre conseiller dédié</p></div>
        </div>
      </div>
    </div>
  );
}