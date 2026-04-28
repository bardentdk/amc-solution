import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, ExternalLink, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AdminTopBar = ({ onAdminCheck }: { onAdminCheck: (isAdmin: boolean) => void }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (profile?.role === 'admin') {
          setIsAdmin(true);
          onAdminCheck(true); // Informe le Layout que la barre est visible
        }
      }
    };
    checkAdminStatus();
  }, [onAdminCheck]);

  if (!isAdmin) return null;

  return (
    <div className="bg-dark text-creamy text-xs md:text-sm py-2 px-4 fixed top-0 w-full z-[60] flex justify-between items-center shadow-md">
      <div className="flex items-center gap-3 font-medium">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        <span>Mode Administrateur Actif</span>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <Link to="/admin/dashboard" className="flex items-center gap-1.5 hover:text-primary transition-colors">
          <Settings size={14} /> <span className="hidden md:inline">Aller au Dashboard</span>
        </Link>
        <button 
          onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}
          className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut size={14} /> <span className="hidden md:inline">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};