import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    const consent = localStorage.getItem('amc_cookie_consent');
    
    if (consent === 'accepted') {
      // 1. Initialiser Google Analytics (à remplacer par ton vrai code GA4)
      console.log('Google Analytics activé : Le visiteur a accepté les cookies.');
      
      // 2. Traquer la page vue à chaque changement de route
      console.log(`Page vue enregistrée : ${location.pathname}`);
      
      // Exemple de vrai code d'injection GA4 (commenté pour plus tard) :
      /*
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-TON_CODE_GOOGLE');
      */
    } else {
      console.log('Tracking bloqué : En attente de consentement ou refusé.');
    }
  }, [location]); // Se redéclenche à chaque changement de page

  return null; // Ce composant est invisible
}