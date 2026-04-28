import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/public/Navbar';
import { AdminTopBar } from '../components/public/AdminTopBar';

export default function PublicLayout() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-creamy selection:bg-primary selection:text-white relative">
      {/* La Top Bar qui passe isAdmin à true si elle s'affiche */}
      <AdminTopBar onAdminCheck={setIsAdmin} />
      
      {/* On passe l'information à la Navbar pour qu'elle se décale */}
      <Navbar isAdmin={isAdmin} />
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-primary text-creamy py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm opacity-80">
          © {new Date().getFullYear()} AMC - Accompagnement des Étrangers. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}