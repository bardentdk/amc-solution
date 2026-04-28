import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Loader2, HelpCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Offer } from '../../types';
import { Button } from '../../components/ui/Button';

const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

export default function Offers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      const { data } = await supabase.from('offers').select('*').eq('is_active', true).order('price', { ascending: true });
      if (data) setOffers(data);
      setLoading(false);
    };
    fetchOffers();
  }, []);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-creamy min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* En-tête */}
        <div className="text-center mb-16">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-dark mb-4 font-sans">
            Des formules <span className="text-primary">transparentes</span> et adaptées.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-dark/70 max-w-2xl mx-auto font-sans">
            Choisissez l'accompagnement qui correspond à votre situation. Aucun frais caché, une expertise garantie.
          </motion.p>
        </div>

        {/* Grille des offres */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={48} /></div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center mb-24">
            {offers.map((offer) => (
              <motion.div key={offer.id} variants={fadeInUp} className="bg-white rounded-3xl shadow-bento p-8 flex flex-col h-full relative group hover:-translate-y-2 transition-transform duration-300">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-dark mb-2 font-sans">{offer.title}</h3>
                  <p className="text-dark/60 text-sm h-10 font-sans">{offer.description}</p>
                </div>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-primary">{offer.price}€</span>
                  <span className="text-dark/50 ml-2 text-sm">TTC</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1 border-t border-creamy pt-6">
                  {offer.features && offer.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
                      <span className="text-dark/80 text-sm font-sans">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="mt-auto w-full">
                  <Button variant="primary" className="w-full">Sélectionner</Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* FAQ Express */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-white rounded-3xl shadow-sm p-10 md:p-14 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary"><HelpCircle size={32} /></div>
            <h2 className="text-2xl font-bold text-dark font-sans">Questions fréquentes</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-dark font-sans mb-2">Les frais de préfecture sont-ils inclus ?</h4>
              <p className="text-dark/70 text-sm font-sans">Non, les timbres fiscaux exigés par l'administration française restent à votre charge. Nos tarifs couvrent exclusivement notre prestation d'accompagnement juridique et administratif.</p>
            </div>
            <div>
              <h4 className="font-bold text-dark font-sans mb-2">Que se passe-t-il si mon dossier est refusé ?</h4>
              <p className="text-dark/70 text-sm font-sans">Nous analysons la viabilité de votre dossier avant tout engagement. En cas de refus (OQTF ou autre), nous pouvons vous accompagner sur un recours contentieux (prestation sur devis).</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}