import { Outlet, Navigate } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
// Note : Plus tard, nous ajouterons une vérification d'authentification ici
// pour rediriger vers /login si l'utilisateur n'est pas un admin.

export default function AdminLayout() {
  // Pour l'instant, on simule que l'utilisateur est connecté et admin
  const isAuthenticatedAdmin = true; 

  if (!isAuthenticatedAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-creamy overflow-hidden">
      {/* Notre Sidebar latérale fidèle à la maquette */}
      <AdminSidebar />
      
      {/* Conteneur principal (Dashboard, CRUD, etc.) */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* En-tête de l'admin (Optionnel : barre de recherche, profil...) */}
        <header className="h-20 flex items-center justify-between px-8 bg-transparent">
          <h2 className="text-2xl font-bold text-primary font-sans">Espace Administration</h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              AM
            </div>
          </div>
        </header>

        {/* Zone de contenu défilable (Le Bento Dashboard viendra ici) */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}