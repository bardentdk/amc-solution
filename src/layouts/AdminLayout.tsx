import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AdminSidebar } from '../components/admin/AdminSidebar';

export default function AdminLayout() {
  // null = en cours de vérification, true = autorisé, false = refusé
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // 1. On vérifie s'il y a un token de connexion actif
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setIsAuthorized(false);
        return;
      }

      // 2. Si connecté, on vérifie que le rôle est bien "admin"
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!error && profile?.role === 'admin') {
        setIsAuthorized(true);
      } else {
        // Connecté mais pas admin (un client par exemple) -> on bloque
        setIsAuthorized(false);
      }
    };

    checkAuth();

    // 3. On écoute les changements d'état (ex: l'admin clique sur "Déconnexion")
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setIsAuthorized(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Pendant que Supabase vérifie, on affiche un loader pour éviter un "flash" de la page de login
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-creamy">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  // Si refusé, redirection stricte vers la page de login
  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  // Si tout est bon, on affiche l'interface d'administration
  return (
    <div className="flex bg-creamy min-h-screen font-sans selection:bg-primary selection:text-white">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 h-screen overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}