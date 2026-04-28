import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, MousePointerClick, MessageSquare, Loader2, Save } from 'lucide-react';
import { StatCard } from '../../components/admin/widgets/StatCard';
import { TodoWidget } from '../../components/admin/widgets/TodoWidget';
import { useDashboard } from '../../hooks/useDashboard';

// Variantes d'animation pour Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const { stats, todos, loading, handleToggleTodo, handleAddTodo } = useDashboard();
  const [note, setNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Simulation de sauvegarde du bloc-notes
  const handleSaveNote = () => {
    setIsSavingNote(true);
    setTimeout(() => setIsSavingNote(false), 800);
  };

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-primary animate-spin" size={48} />
        <p className="text-primary font-medium animate-pulse">Chargement de votre espace...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pb-8">
      {/* En-tête du Dashboard */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2 font-sans">Tableau de bord</h1>
        <p className="text-dark/60 font-sans">Données en temps réel de votre cabinet d'accompagnement.</p>
      </div>

      {/* Grille Bento */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]"
      >
        {/* Ligne 1 : Statistiques rapides */}
        <motion.div variants={itemVariants} className="col-span-1">
          <StatCard 
            title="Contacts Reçus" 
            value={stats.total_contacts} 
            icon={MessageSquare} 
            className="h-full" 
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="col-span-1">
          <StatCard 
            title="Offres Actives" 
            value={stats.total_offers} 
            icon={Users} 
            className="h-full" 
          />
        </motion.div>

        {/* Le widget To-Do prend 2 colonnes de large et 2 rangées de haut */}
        <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2 row-span-2">
          <TodoWidget 
            todos={todos} 
            onToggle={handleToggleTodo} 
            onAdd={handleAddTodo}
            className="h-full min-h-[400px]" 
          />
        </motion.div>

        {/* Ligne 2 : Autres métriques */}
        <motion.div variants={itemVariants} className="col-span-1">
          <StatCard 
            title="Articles de Blog" 
            value={stats.total_blog_posts} 
            icon={FileText} 
            className="h-full" 
          />
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-1">
          <StatCard 
            title="Visites (30j)" 
            value="À config" 
            icon={MousePointerClick} 
            className="h-full" 
          />
        </motion.div>

        {/* Espace Bloc Notes (Prend toute la largeur restante en bas) */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-4 bg-white rounded-3xl shadow-bento p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-dark font-sans">Bloc-notes rapide</h3>
            <button 
              onClick={handleSaveNote}
              disabled={isSavingNote}
              className="flex items-center gap-2 text-sm text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              {isSavingNote ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSavingNote ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full flex-1 min-h-[120px] bg-creamy/50 border-none rounded-xl p-4 text-sm text-dark focus:ring-2 focus:ring-primary outline-none resize-none font-sans"
            placeholder="Écrivez vos notes rapides ici... (Ex: Rappeler la préfecture à 14h)"
          />
        </motion.div>

      </motion.div>
    </div>
  );
}