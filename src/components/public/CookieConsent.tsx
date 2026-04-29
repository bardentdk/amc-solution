import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';
import { Button } from '../ui/Button';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifie si le consentement a déjà été donné
    const consent = localStorage.getItem('amc_cookie_consent');
    if (!consent) {
      // Un léger délai pour ne pas agresser l'utilisateur dès la milliseconde 1
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('amc_cookie_consent', 'accepted');
    setIsVisible(false);
    // Ici, tu pourras déclencher tes scripts Google Analytics / Pixel Facebook plus tard
  };

  const handleReject = () => {
    localStorage.setItem('amc_cookie_consent', 'rejected');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="bg-dark text-creamy max-w-5xl mx-auto rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center gap-6 border border-white/10">
            <div className="bg-primary/20 p-3 rounded-full shrink-0 hidden md:block">
              <ShieldCheck className="text-primary" size={32} />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-white mb-2 font-sans">Respect de votre vie privée</h3>
              <p className="text-creamy/70 text-sm leading-relaxed font-sans">
                Nous utilisons des cookies pour assurer le bon fonctionnement du site, analyser notre trafic et vous offrir une expérience sécurisée. Vous pouvez modifier vos préférences à tout moment.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <button 
                onClick={handleReject}
                className="text-creamy/60 hover:text-white text-sm font-medium transition-colors py-2 px-4 whitespace-nowrap"
              >
                Continuer sans accepter
              </button>
              <Button onClick={handleAccept} variant="primary" className="w-full sm:w-auto whitespace-nowrap">
                Accepter tout
              </Button>
            </div>
            
            {/* Croix de fermeture (équivaut à un refus) */}
            <button onClick={handleReject} className="absolute top-4 right-4 text-creamy/40 hover:text-white hidden md:block">
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}