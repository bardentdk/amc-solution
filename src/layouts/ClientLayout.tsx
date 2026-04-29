import { useEffect, useState } from 'react';
import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  LogOut, 
  Loader2, 
  ChevronRight,
  UserCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Logo } from '../components/ui/Logo';

export default function ClientLayout() {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [clientName, setClientName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setIsAuthorized(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, role')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setClientName(profile.first_name);
        // On autorise les clients ET les admins (pour les tests)
        setIsAuthorized(profile.role === 'client' || profile.role === 'admin');
      } else {
        setIsAuthorized(false);
      }
    };

    checkAuth();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-creamy">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-creamy font-sans">
      
      {/* SIDEBAR CLIENT */}
      <aside className="w-full md:w-72 bg-white border-r border-creamy flex flex-col p-6 md:p-8 z-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <Logo className="w-8 h-8" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-dark uppercase">Espace Client</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavLink 
            to="/dashboard" 
            end
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-dark/50 hover:bg-creamy hover:text-dark'}`}
          >
            <LayoutDashboard size={20} /> Tableau de bord
          </NavLink>
          <NavLink 
            to="/dashboard/vault" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-dark/50 hover:bg-creamy hover:text-dark'}`}
          >
            <ShieldCheck size={20} /> Mon Coffre-fort
          </NavLink>
        </nav>

        {/* FOOTER SIDEBAR (PROFIL) */}
        <div className="mt-auto pt-6 border-t border-creamy">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UserCircle size={24} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-dark text-sm truncate">{clientName || 'Client'}</p>
              <p className="text-[10px] text-dark/40 uppercase font-bold tracking-widest">Compte vérifié</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center justify-between w-full px-4 py-3 bg-red-50 text-red-500 rounded-2xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all group"
          >
            Déconnexion <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-y-auto max-h-screen custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
}