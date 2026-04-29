import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, XCircle, ShieldCheck, Clock, FileCheck, 
  Scale, AlertTriangle, Loader2, ArrowRight, Zap 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Offer } from '../../types';
import { Button } from '../../components/ui/Button';

// Variantes Framer Motion
const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
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
    <div className="flex flex-col w-full overflow-hidden bg-creamy min-h-screen pt-32 pb-20">
      
      {/* --- 1. HEADER --- */}
      <section className="px-4 mb-20 text-center">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
            <Scale size={16} /> Tarification transparente
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold text-dark mb-6 tracking-tight">
            Investissez dans votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">sérénité juridique</span>.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-dark/60 max-w-2xl mx-auto">
            Choisissez l'accompagnement adapté à votre situation. Sans frais cachés, avec un engagement total de notre équipe jusqu'à la décision de la préfecture.
          </motion.p>
        </div>
      </section>

      {/* --- 2. PRICING CARDS PREMIUM --- */}
      <section className="px-4 mb-32">
        <div className="container mx-auto max-w-7xl">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={48} /></div>
          ) : (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {offers.map((offer, index) => {
                // On met en avant l'offre du milieu (ou la deuxième)
                const isPremium = index === 1; 
                
                return (
                  <motion.div 
                    key={offer.id} 
                    variants={fadeInUp} 
                    className={`relative flex flex-col h-full rounded-[2.5rem] transition-all duration-300 ${
                      isPremium 
                        ? 'bg-dark text-white shadow-2xl shadow-dark/20 scale-100 md:scale-105 z-10 border border-white/10' 
                        : 'bg-white text-dark shadow-bento hover:-translate-y-2'
                    } p-8 md:p-10`}
                  >
                    {isPremium && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-teal-400 text-dark font-bold px-6 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg">
                        <Zap size={16} className="fill-dark" /> Recommandé
                      </div>
                    )}

                    <div className="mb-8">
                      <h3 className={`text-2xl font-bold mb-3 ${isPremium ? 'text-white' : 'text-dark'}`}>{offer.title}</h3>
                      <p className={`text-sm leading-relaxed ${isPremium ? 'text-creamy/70' : 'text-dark/60'}`}>{offer.description}</p>
                    </div>

                    <div className="mb-8 pb-8 border-b border-opacity-20 border-gray-400">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-extrabold tracking-tight">{offer.price}€</span>
                        <span className={`text-sm font-medium ${isPremium ? 'text-creamy/50' : 'text-dark/40'}`}>HT</span>
                      </div>
                    </div>

                    <ul className="space-y-5 mb-10 flex-1">
                      {offer.features && offer.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-4">
                          <CheckCircle2 size={22} className={`shrink-0 ${isPremium ? 'text-emerald-400' : 'text-primary'}`} />
                          <span className={`text-sm md:text-base ${isPremium ? 'text-creamy/90' : 'text-dark/80'}`}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to="/contact" className="mt-auto w-full">
                      <Button 
                        variant={isPremium ? 'primary' : 'outline'} 
                        className={`w-full h-14 text-lg ${isPremium ? 'bg-primary hover:bg-emerald-500 text-white border-none shadow-lg shadow-primary/30' : 'hover:bg-creamy'}`}
                      >
                        Sélectionner cette offre
                      </Button>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* --- 3. TABLEAU COMPARATIF : AMC VS SEUL --- */}
      <section className="px-4 mb-32 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">La différence est dans le résultat.</h2>
            <p className="text-dark/60 max-w-2xl mx-auto">Découvrez pourquoi 98% de nos dossiers aboutissent par rapport aux demandes effectuées de manière isolée.</p>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-creamy overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr>
                    <th className="w-1/3 p-6 md:p-8 bg-creamy/30 font-bold text-dark/50 uppercase text-xs tracking-wider border-b border-creamy">Enjeux & Étapes</th>
                    <th className="w-1/3 p-6 md:p-8 bg-red-50/30 font-bold text-dark text-center border-b border-creamy border-x border-x-creamy">Faire ses démarches seul</th>
                    <th className="w-1/3 p-6 md:p-8 bg-primary/5 font-bold text-primary text-center border-b border-creamy">Avec un cabinet (AMC)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-creamy">
                  {[
                    { feature: "Connaissance des lois en vigueur", seul: "Limitée, risque d'utiliser de vieux formulaires", amc: "Expertise pointue et veille juridique quotidienne" },
                    { feature: "Constitution du dossier", seul: "Risque élevé de pièces manquantes ou non conformes", amc: "Dossier blindé, vérifié par des professionnels" },
                    { feature: "Communication Préfecture", seul: "Quasi impossible (lignes occupées, pas de réponses)", amc: "Canaux dédiés aux professionnels et avocats" },
                    { feature: "Gestion des délais", seul: "Risque de rupture de droits (perte de travail)", amc: "Anticipation des dates et relances automatiques" },
                    { feature: "En cas de problème ou blocage", seul: "Panique et stress, risque d'OQTF", amc: "Intervention juridique immédiate (recours)" }
                  ].map((row, idx) => (
                    <tr key={idx} className="transition-colors hover:bg-creamy/10">
                      <td className="p-6 md:p-8 text-sm font-semibold text-dark/80 bg-creamy/10">{row.feature}</td>
                      <td className="p-6 md:p-8 text-sm text-dark/70 text-center border-x border-x-creamy relative">
                        <XCircle size={20} className="text-red-400 absolute top-1/2 -translate-y-1/2 left-4 opacity-20 hidden md:block" />
                        {row.seul}
                      </td>
                      <td className="p-6 md:p-8 text-sm font-medium text-dark bg-primary/5 text-center relative">
                        <CheckCircle2 size={20} className="text-primary absolute top-1/2 -translate-y-1/2 left-4 hidden md:block" />
                        {row.amc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. RÉASSURANCE : NOS GARANTIES --- */}
      <section className="px-4 mb-32">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={fadeInUp} className="bg-creamy/50 rounded-[2rem] p-8 text-center hover:bg-white hover:shadow-bento transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark mb-4">Sécurité absolue</h3>
              <p className="text-dark/60 text-sm leading-relaxed">Vos documents personnels sont stockés sur des serveurs sécurisés et ne sont partagés qu'avec l'administration française.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-creamy/50 rounded-[2rem] p-8 text-center hover:bg-white hover:shadow-bento transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark mb-4">Zéro fausse promesse</h3>
              <p className="text-dark/60 text-sm leading-relaxed">Nous n'acceptons votre dossier que si nous avons la conviction juridique qu'il a de réelles chances d'aboutir.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-creamy/50 rounded-[2rem] p-8 text-center hover:bg-white hover:shadow-bento transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <FileCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark mb-4">Suivi de A à Z</h3>
              <p className="text-dark/60 text-sm leading-relaxed">Du diagnostic initial jusqu'à la remise de votre carte de séjour en préfecture, vous n'êtes jamais seul.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- 5. RÉASSURANCE : TIMELINE / PROCESSUS POST-PAIEMENT --- */}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-4xl bg-dark text-white rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-dark/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[120px] opacity-20"></div>
          
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-3xl font-bold mb-4">Que se passe-t-il après avoir choisi une offre ?</h2>
            <p className="text-creamy/70">Un processus fluide et sans stress, conçu pour votre tranquillité d'esprit.</p>
          </div>

          <div className="space-y-8 relative z-10">
            {[
              { time: "Jour 1", title: "Appel de cadrage", desc: "Un expert AMC vous contacte pour confirmer votre situation et valider la liste exacte des pièces à fournir." },
              { time: "Semaine 1", title: "Constitution & Audit", desc: "Vous nous transmettez vos documents. Nous les vérifions méticuleusement pour créer un dossier juridiquement inattaquable." },
              { time: "Semaine 2", title: "Dépôt officiel", desc: "Nous soumettons le dossier à la préfecture (en ligne ou via prise de RDV) et vous obtenez votre attestation de dépôt/récépissé." },
              { time: "Jusqu'à la fin", title: "Veille & Relances", desc: "Nous surveillons l'avancée, répondons aux éventuelles demandes de compléments de la préfecture, jusqu'à l'accord final." }
            ].map((step, idx) => (
              <div key={idx} className="flex gap-6 items-start group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary font-bold border border-white/20 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                    {idx + 1}
                  </div>
                  {idx !== 3 && <div className="w-0.5 h-16 bg-white/10 mt-2"></div>}
                </div>
                <div className="pt-2">
                  <div className="text-primary text-sm font-bold tracking-wider uppercase mb-1">{step.time}</div>
                  <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-creamy/60 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center relative z-10">
            <Link to="/contact">
              <Button variant="primary" className="h-14 px-8 text-lg bg-white text-dark hover:bg-creamy border-none">
                Je prends contact gratuitement <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}