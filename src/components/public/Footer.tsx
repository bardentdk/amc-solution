import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';

// Composants SVG natifs pour éviter les soucis avec Lucide
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="hover:text-[#1877F2] transition-colors"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="hover:text-[#E4405F] transition-colors"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="hover:text-[#0A66C2] transition-colors"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

export default function Footer() {
  return (
    <footer className="bg-dark text-creamy pt-20 pb-10 border-t border-white/10">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          {/* Colonne Marque */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-creamy p-2 rounded-xl text-primary"><Logo className="w-8 h-8" /></div>
              <span className="text-2xl font-bold tracking-widest uppercase text-white font-sans">AMC</span>
            </div>
            <p className="text-creamy/60 text-sm leading-relaxed mb-6 font-sans">
              Expertise et accompagnement sur-mesure pour vos démarches administratives et titres de séjour en France.
            </p>
          </div>

          {/* Navigation Primaire */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6 font-sans">Navigation</h4>
            <ul className="space-y-4 text-sm font-sans">
              <li><Link to="/" className="text-creamy/70 hover:text-white transition-colors">Accueil</Link></li>
              <li><Link to="/qui-sommes-nous" className="text-creamy/70 hover:text-white transition-colors">Le Cabinet</Link></li>
              <li><Link to="/offres" className="text-creamy/70 hover:text-white transition-colors">Nos Formules</Link></li>
              <li><Link to="/blog" className="text-creamy/70 hover:text-white transition-colors">Blog Juridique</Link></li>
              <li><Link to="/interpretariat">Interprétariat</Link></li>
              <li><Link to="/contact" className="text-creamy/70 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Navigation Secondaire (Légal) */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6 font-sans">Informations Légales</h4>
            <ul className="space-y-4 text-sm font-sans">
              <li><Link to="/mentions-legales" className="text-creamy/70 hover:text-white transition-colors">Mentions Légales</Link></li>
              <li><Link to="/cgu" className="text-creamy/70 hover:text-white transition-colors">Conditions Générales (CGU/CGV)</Link></li>
              <li><Link to="/politique-confidentialite" className="text-creamy/70 hover:text-white transition-colors">Politique de Confidentialité</Link></li>
            </ul>
          </div>

          {/* Réseaux Sociaux */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6 font-sans">Suivez-nous</h4>
            <div className="flex items-center gap-4 text-creamy/70">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
            </div>
            <div className="mt-8">
              <p className="text-creamy/50 text-xs mb-2 uppercase tracking-wider">Contact direct</p>
              <a href="mailto:contact@amc.fr" className="text-sm text-creamy/80 hover:text-white transition-colors block">contact@amc-expert.fr</a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 text-center text-sm text-creamy/40 font-sans">
          © {new Date().getFullYear()} AMC Expertise. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}