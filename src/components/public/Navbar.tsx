import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';

const links = [
  { name: 'Accueil', path: '/' },
  { name: 'Qui sommes-nous ?', path: '/qui-sommes-nous' },
  { name: 'Notre offre', path: '/nos-offres' },
  { name: 'Blog', path: '/blog' },
];

export default function Navbar({ isAdmin }: { isAdmin?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Détecter le scroll pour styliser la navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${isAdmin ? 'top-10' : 'top-0'} ${
        scrolled ? 'bg-creamy/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <Logo className="w-10 h-10 transition-transform group-hover:scale-105" />
          {/* <img src="/logo.png" alt="" width={100}/> */}
          {/* <span className="font-bold text-xl tracking-tight text-primary">AMC</span> */}
        </NavLink>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `text-sm font-medium transition-colors hover:text-primary relative ${
                  isActive ? 'text-primary' : 'text-dark/70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
          <NavLink to="/contact" tabIndex={-1}>
            <Button variant="primary">Contactez-nous</Button>
          </NavLink>
        </nav>

        {/* Bouton Menu Mobile */}
        <button 
          className="md:hidden p-2 text-primary focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-creamy shadow-lg border-t border-primary/10 md:hidden"
          >
            <nav className="flex flex-col p-4 gap-4">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => 
                    `p-2 text-base font-medium rounded-md ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-dark/80 hover:bg-primary/5 hover:text-primary'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-4 border-t border-primary/10">
                <NavLink to="/contact" className="block w-full">
                  <Button variant="primary" className="w-full">Contactez-nous</Button>
                </NavLink>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}