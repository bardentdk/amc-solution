import { useEffect, useState } from 'react';
import { Users, Mail, FileText, TrendingUp, Loader2, Send, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [stats, setStats] = useState({ clients: 0, contacts: 0, interpretariat: 0, newsletter: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      // On lance toutes les requêtes de comptage en parallèle pour plus de rapidité
      const [clientsRes, contactsRes, interpRes, newsRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('interpretariat_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        clients: clientsRes.count || 0,
        contacts: contactsRes.count || 0,
        interpretariat: interpRes.count || 0,
        newsletter: newsRes.count || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Clients Actifs", value: stats.clients, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Nouveaux Contacts", value: stats.contacts, icon: Mail, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "Demandes Interprète", value: stats.interpretariat, icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "Abonnés Newsletter", value: stats.newsletter, icon: Send, color: "text-purple-500", bg: "bg-purple-50" }
  ];

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-dark mb-2">Vue d'ensemble</h1>
        <p className="text-dark/60">Bienvenue sur votre centre de contrôle AMC Solutions.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-bento flex items-center gap-4"
          >
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-dark/50 uppercase tracking-wider">{stat.title}</p>
              <p className="text-3xl font-black text-dark">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-bento border border-creamy">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl"><TrendingUp size={24} /></div>
          <h2 className="text-xl font-bold text-dark">Activité récente</h2>
        </div>
        <p className="text-dark/60">L'historique des actions s'affichera ici prochainement.</p>
      </div>
    </div>
  );
}