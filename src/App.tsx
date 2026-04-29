import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages Publiques
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Blog from './pages/public/Blog';
import BlogPostView from './pages/public/BlogPostView';
import { MentionsLegales, CGU, PolitiqueConfidentialite } from './pages/public/legal/LegalPages';
import Interpretariat from './pages/public/Interpretariat';
import Login from './pages/auth/Login';

// Pages Administrateur
import Dashboard from './pages/admin/Dashboard';
import BlogManager from './pages/admin/BlogManager';
import OffersManager from './pages/admin/OffersManager';
import ContactMessagesManager from './pages/admin/ContactMessagesManager'; // On le crée juste après
import InterpretariatManager from './pages/admin/InterpretariatManager';
import Offers from './pages/public/Offers';
import UsersManager from './pages/admin/UsersManager';
import FoldersManager from './pages/admin/FoldersManager';
import TestimonialsManager from './pages/admin/TestimonialsManager';
import NewsletterManager from './pages/admin/NewsletterManager';
import ClientDashboard from './pages/client/ClientDashboard';
import Vault from './pages/client/Vault';
import Register from './pages/public/Register';
import ClientLayout from './layouts/ClientLayout';
import ClientDossiersManager from './pages/admin/ClientDossiersManager';

// Page d'Offres Publique (Version simplifiée réutilisant le composant Home ou dédiée)
const PublicOffers = () => <div className="pt-20"><Home /></div>; 

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Route d'authentification */}
          <Route path="/login" element={<Login />} />
          {/* --- VUES PUBLIQUES --- */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="qui-sommes-nous" element={<About />} />
            <Route path="offres" element={<PublicOffers />} />
            <Route path="nos-offres" element={<Offers />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPostView />} />
            <Route path="interpretariat" element={<Interpretariat />} />
            <Route path="contact" element={<Contact />} />
            {/* NOUVELLES ROUTES LÉGALES */}
            <Route path="mentions-legales" element={<MentionsLegales />} />
            <Route path="cgu" element={<CGU />} />
            <Route path="politique-confidentialite" element={<PolitiqueConfidentialite />} />
          </Route>
          {/* --- ESPACE CLIENT --- */}
          <Route path="/dashboard" element={<ClientLayout />}>
            <Route index element={<ClientDashboard/>} />
            <Route path="vault" element={<Vault />} />
          </Route>

          {/* --- AUTH PUBLIQUE --- */}
          <Route path="/register" element={<Register />} />

          {/* --- ESPACE ADMINISTRATION --- */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* Redirection automatique vers le dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="offres" element={<OffersManager />} />
            <Route path="contacts" element={<ContactMessagesManager />} />
            <Route path="interpretariat" element={<InterpretariatManager />} />
            <Route path="dossiers" element={<ClientDossiersManager />} />
            <Route path="avis" element={<TestimonialsManager />} />
            <Route path="users" element={<UsersManager />} />
            <Route path="newsletter" element={<NewsletterManager />} /> {/* NOUVELLE LIGNE ICI */}
            <Route path="folders" element={<FoldersManager />} />
            {/* Placeholders pour évolutions futures */}
            {/* <Route path="users" element={<div className="p-8 bg-white rounded-3xl shadow-bento">Gestion Utilisateurs (Prochainement)</div>} />
            <Route path="folders" element={<div className="p-8 bg-white rounded-3xl shadow-bento">Dossiers Clients (Prochainement)</div>} /> */}
          </Route>

          {/* Redirection par défaut (404) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;