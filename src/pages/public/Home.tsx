import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, CheckCircle, ShieldCheck, XCircle, Star, Quote, Loader2, 
  Mail, Send, GraduationCap, Briefcase, HeartHandshake, Sparkles, 
  Search, FileText, Fingerprint, ChevronDown, CheckCircle2,
  Zap
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import type { Offer, BlogPost, Testimonial } from '../../types';

// --- Variantes d'animation ---
const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

// --- Composant FAQ (Accordéon) ---
const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-2 border-creamy/50 rounded-2xl mb-4 bg-white overflow-hidden transition-all hover:border-primary/30">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
      >
        <h4 className="font-bold text-dark font-sans pr-4">{question}</h4>
        <ChevronDown className={`text-primary shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={20} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="px-6 pb-6 text-dark/70 font-sans text-sm leading-relaxed border-t border-creamy pt-4">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Home() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Newsletter
  const [newsEmail, setNewsEmail] = useState('');
  const [newsStatus, setNewsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      const [offersRes, postsRes, testRes] = await Promise.all([
        supabase.from('offers').select('*').eq('is_active', true).order('price', { ascending: true }),
        supabase.from('blog_posts').select('*, blog_categories(name)').eq('published', true).order('created_at', { ascending: false }).limit(3),
        supabase.from('testimonials').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(3)
      ]);

      if (offersRes.data) setOffers(offersRes.data);
      if (postsRes.data) setLatestPosts(postsRes.data);
      if (testRes.data) setTestimonials(testRes.data);
      setLoading(false);
    };
    fetchHomeData();
  }, []);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail) return;
    setNewsStatus('loading');
    const { error } = await supabase.from('newsletter_subscribers').insert([{ email: newsEmail }]);
    if (error) setNewsStatus('error');
    else {
      setNewsStatus('success');
      setNewsEmail('');
      setTimeout(() => setNewsStatus('idle'), 3000);
    }
  };

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center bg-creamy"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;

  return (
    <div className="flex flex-col w-full overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-24 px-4 bg-creamy">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center z-100">
            <motion.span variants={fadeInUp} className="text-primary font-semibold tracking-wider uppercase text-sm mb-4">Cabinet d'Expertise AMC</motion.span>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-dark mb-6 leading-tight max-w-4xl font-sans">
              Votre partenaire de confiance pour l'obtention de votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">Titre de Séjour</span>.
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-dark/70 mb-10 max-w-2xl font-sans">
              Gagnez du temps, évitez les erreurs fatales et sécurisez votre avenir en France avec notre équipe d'experts juridiques.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact"><Button variant="primary" className="h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-primary/20">Démarrer mon dossier</Button></Link>
              <Link to="/offres"><Button variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-white">Voir nos formules</Button></Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. STATISTIQUES (Social Proof) */}
      <section className="bg-dark text-creamy py-12 relative z-10 border-b-4 border-primary">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            <div><p className="text-4xl font-bold text-white mb-2">98%</p><p className="text-sm text-creamy/70 font-sans uppercase tracking-wide">Taux de réussite</p></div>
            <div><p className="text-4xl font-bold text-white mb-2">500+</p><p className="text-sm text-creamy/70 font-sans uppercase tracking-wide">Dossiers traités</p></div>
            <div><p className="text-4xl font-bold text-white mb-2">10 ans</p><p className="text-sm text-creamy/70 font-sans uppercase tracking-wide">D'expertise juridique</p></div>
            <div><p className="text-4xl font-bold text-white mb-2">24/7</p><p className="text-sm text-creamy/70 font-sans uppercase tracking-wide">Suivi client dédié</p></div>
          </div>
        </div>
      </section>

      {/* 3. POUR QUI ? (Target Audience) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4 font-sans">À chaque situation, sa solution.</h2>
            <p className="text-dark/70 max-w-2xl mx-auto font-sans">Nous maîtrisons les subtilités de chaque type de titre de séjour pour vous garantir le meilleur accompagnement.</p>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: GraduationCap, title: "Étudiants", desc: "Première demande, renouvellement ou changement de statut vers salarié." },
              { icon: Briefcase, title: "Salariés & Talents", desc: "Passeport talent, autorisation de travail et admission exceptionnelle." },
              { icon: HeartHandshake, title: "Vie Privée & Familiale", desc: "Regroupement familial, conjoint de français ou parent d'enfant français." },
              { icon: Sparkles, title: "Régularisation", desc: "Accompagnement spécifique pour les dossiers complexes (Circulaire Valls)." }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-creamy/30 p-8 rounded-[2rem] hover:bg-white hover:shadow-bento transition-all duration-300 border border-transparent hover:border-primary/10 group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-6 group-hover:scale-110 transition-transform"><item.icon size={28} /></div>
                <h3 className="text-xl font-bold text-dark mb-3 font-sans">{item.title}</h3>
                <p className="text-dark/70 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. LE FAIRE SEUL VS AVEC AMC */}
      <section className="py-24 bg-creamy relative overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4 font-sans">Le prix de la tranquillité</h2>
            <p className="text-dark/70 max-w-2xl mx-auto font-sans">Une seule erreur dans votre dossier peut entraîner une OQTF (Obligation de Quitter le Territoire). Ne prenez pas ce risque.</p>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="flex flex-col md:flex-row gap-8 lg:gap-12 justify-center items-stretch">
            {/* Le faire seul */}
            <motion.div variants={fadeInUp} className="flex-1 bg-red-50/50 border border-red-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-red-500 group-hover:scale-110 transition-transform"><XCircle size={100} /></div>
              <h3 className="text-2xl font-bold text-dark mb-8 font-sans flex items-center gap-3"><XCircle className="text-red-500" /> Le faire soi-même</h3>
              <ul className="space-y-6 relative z-10">
                {["Dossiers souvent incomplets ou mal interprétés.", "Risque élevé de rater des délais de recours cruciaux.", "Impossible de joindre la préfecture pour un suivi.", "Stress permanent face à l'incertitude et la paperasse."].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-dark/80"><span className="text-red-500 font-bold mt-1">✗</span> {item}</li>
                ))}
              </ul>
            </motion.div>
            {/* Avec AMC */}
            <motion.div variants={fadeInUp} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-creamy group-hover:scale-110 transition-transform"><ShieldCheck size={100} /></div>
              <h3 className="text-2xl font-bold text-creamy mb-8 font-sans flex items-center gap-3"><CheckCircle className="text-emerald-300" /> Avec l'expertise AMC</h3>
              <ul className="space-y-6 relative z-10">
                {["Dossier monté sur-mesure et juridiquement blindé.", "Veille des délais et relances automatisées de notre côté.", "Canaux de communication pros avec les préfectures.", "Sérénité totale : on s'occupe de tout, de A à Z."].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-creamy/90"><CheckCircle className="text-emerald-300 shrink-0 mt-0.5" size={20} /> {item}</li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5. NOTRE PROCESSUS (How it works) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4 font-sans">Comment ça marche ?</h2>
            <p className="text-dark/70 max-w-2xl mx-auto font-sans">Un processus clair, transparent et efficace en 4 étapes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Ligne de connexion (Desktop uniquement) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-creamy -translate-y-1/2 z-0"></div>
            
            {[
              { icon: Search, step: "01", title: "Diagnostic & Devis", desc: "Analyse complète de votre situation juridique lors d'un premier échange." },
              { icon: FileText, step: "02", title: "Montage du dossier", desc: "Collecte, vérification et optimisation de chaque document exigé." },
              { icon: CheckCircle, step: "03", title: "Dépôt & Suivi", desc: "Nous soumettons votre dossier et gérons les échanges avec la préfecture." },
              { icon: Fingerprint, step: "04", title: "Obtention", desc: "Vous récupérez votre titre de séjour sereinement." }
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white border-4 border-creamy rounded-full flex items-center justify-center text-primary shadow-sm mb-6 relative">
                  <item.icon size={32} />
                  <div className="absolute -top-2 -right-2 bg-dark text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{item.step}</div>
                </div>
                <h3 className="text-xl font-bold text-dark mb-2 font-sans">{item.title}</h3>
                <p className="text-sm text-dark/70 px-4">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. OFFRES */}
      {/* --- SECTION OFFRES PREMIUM (HOME) --- */}
      <section className="py-24 bg-creamy border-t border-white/50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block"
            >
              Nos Formules
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-bold text-dark mb-4 font-sans tracking-tight">
              L'accompagnement qui vous <span className="text-primary">correspond</span>.
            </h2>
            <p className="text-dark/60 max-w-2xl mx-auto font-sans">
              Des tarifs clairs, sans surprise, pour une prise en charge totale de votre dossier.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
          ) : (
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={staggerContainer} 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
            >
              {offers.slice(0, 3).map((offer, index) => {
                // On applique le style "Premium" à la carte du milieu (index 1)
                const isFeatured = index === 1;

                return (
                  <motion.div 
                    key={offer.id} 
                    variants={fadeInUp} 
                    className={`relative flex flex-col h-full rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 ${
                      isFeatured 
                        ? 'bg-dark text-white shadow-2xl shadow-dark/30 scale-100 md:scale-105 z-10 border border-white/10' 
                        : 'bg-white text-dark shadow-bento hover:-translate-y-2'
                    }`}
                  >
                    {isFeatured && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-teal-400 text-dark font-bold px-6 py-2 rounded-full text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg">
                        <Zap size={14} className="fill-dark" /> Le plus populaire
                      </div>
                    )}

                    <div className="mb-8">
                      <h3 className={`text-2xl font-bold mb-3 font-sans ${isFeatured ? 'text-white' : 'text-dark'}`}>
                        {offer.title}
                      </h3>
                      <p className={`text-sm leading-relaxed font-sans ${isFeatured ? 'text-creamy/60' : 'text-dark/50'}`}>
                        {offer.description}
                      </p>
                    </div>

                    <div className="mb-8 pb-8 border-b border-opacity-10 border-gray-400">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black tracking-tighter">{offer.price}€</span>
                        <span className={`text-xs font-bold uppercase tracking-widest ${isFeatured ? 'text-creamy/40' : 'text-dark/30'}`}>
                          HT
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-10 flex-1">
                      {offer.features?.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 size={18} className={`shrink-0 mt-0.5 ${isFeatured ? 'text-emerald-400' : 'text-primary'}`} />
                          <span className={`text-sm font-sans ${isFeatured ? 'text-creamy/80' : 'text-dark/70'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link to="/contact" className="mt-auto w-full">
                      <Button 
                        variant={isFeatured ? 'primary' : 'outline'} 
                        className={`w-full h-14 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${
                          isFeatured 
                            ? 'bg-primary hover:bg-emerald-500 text-white border-none shadow-xl shadow-primary/20' 
                            : 'hover:bg-creamy border-creamy'
                        }`}
                      >
                        Choisir ce pack
                      </Button>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
          
          <div className="mt-16 text-center">
            <Link to="/offres" className="inline-flex items-center gap-2 text-dark/40 hover:text-primary font-bold text-sm uppercase tracking-widest transition-all group">
              Comparer toutes nos solutions <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. TÉMOIGNAGES (Reviews) */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-dark mb-4 font-sans">Ils ont obtenu leur titre avec nous</h2>
            </div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testi, index) => (
                <motion.div key={index} variants={fadeInUp} className="bg-creamy/40 border border-creamy rounded-[2rem] p-8 relative flex flex-col">
                  <Quote size={40} className="text-primary/20 absolute top-6 right-6" />
                  <div className="flex text-yellow-400 mb-6">
                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < testi.rating ? "currentColor" : "none"} className={i >= testi.rating ? "text-gray-300" : ""} />)}
                  </div>
                  <p className="text-dark/80 italic leading-relaxed mb-8 flex-1 font-sans">"{testi.content}"</p>
                  <div>
                    <p className="font-bold text-dark font-sans">{testi.client_name}</p>
                    {testi.context && <p className="text-sm text-primary font-medium">{testi.context}</p>}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* 8. FAQ (Foire Aux Questions) */}
      <section className="py-24 bg-creamy border-t border-white/50">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark mb-4 font-sans">Questions fréquentes</h2>
            <p className="text-dark/70 font-sans">Tout ce que vous devez savoir avant de nous confier votre dossier.</p>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <FAQItem question="Les timbres fiscaux sont-ils inclus dans vos tarifs ?" answer="Non, les taxes et timbres fiscaux exigés par l'État français restent à la charge du client. Nos honoraires couvrent exclusivement notre prestation d'accompagnement juridique et administratif." />
            <FAQItem question="Combien de temps prend l'instruction d'un dossier ?" answer="Les délais varient énormément selon la préfecture dont vous dépendez (de quelques semaines à plusieurs mois). Cependant, un dossier complet et bien monté par notre cabinet permet d'éviter les rejets pour pièces manquantes, ce qui accélère considérablement le processus global." />
            <FAQItem question="Que se passe-t-il si mon titre est refusé ?" answer="Nous n'acceptons d'accompagner un client que si nous estimons que le dossier est viable lors du diagnostic. Si malgré cela l'administration oppose un refus, nous pourrons vous orienter vers nos avocats partenaires pour un recours contentieux au tribunal administratif." />
            <FAQItem question="Est-ce que vous vous déplacez avec moi en préfecture ?" answer="Selon la formule choisie et la préfecture concernée, un accompagnement physique est tout à fait possible. La majorité des démarches se faisant désormais sur l'ANEF (en ligne), notre rôle est surtout d'intervenir sur la plateforme et auprès des services instructeurs." />
          </motion.div>
        </div>
      </section>

      {/* 9. BLOG TEASER */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-dark mb-4 font-sans">Actualités & Conseils</h2>
              <p className="text-dark/70 max-w-2xl font-sans">Restez informé des évolutions de la loi sur l'immigration en France.</p>
            </div>
            <Link to="/blog"><Button variant="ghost" className="flex items-center gap-2">Voir tout le blog <ArrowRight size={18} /></Button></Link>
          </div>

          {latestPosts.length === 0 ? (
            <div className="text-center text-dark/50 italic py-10">Aucun article publié pour le moment.</div>
          ) : (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <motion.div key={post.id} variants={fadeInUp} className="group cursor-pointer bg-creamy/30 border border-creamy rounded-3xl overflow-hidden flex flex-col h-full hover:shadow-bento transition-all">
                  <div className="relative h-56 w-full overflow-hidden bg-white">
                    {post.cover_image ? (
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/20"><ShieldCheck size={64} /></div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between text-xs text-dark/50 mb-3 font-sans">
                      <span>{new Date(post.created_at).toLocaleDateString('fr-FR')}</span>
                      {post.blog_categories && <span className="font-semibold text-primary/70">{post.blog_categories.name}</span>}
                    </div>
                    <h3 className="text-xl font-bold text-dark group-hover:text-primary transition-colors font-sans mb-4 line-clamp-2">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <Link to={`/blog/${post.slug}`} className="mt-auto text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Lire l'article <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* 10. NEWSLETTER (LEAD MAGNET) */}
      <section className="py-24 bg-gradient-to-r from-emerald-500 to-teal-400 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-dark to-dark"></div>
        <div className="container mx-auto max-w-4xl px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-primary/20 rounded-full text-primary mb-6">
            <Mail size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-sans">Abonnez-vous à notre Veille Juridique</h2>
          <p className="text-lg text-creamy/70 mb-10 font-sans max-w-2xl mx-auto">
            Recevez nos alertes sur les nouvelles circulaires, les changements de lois et nos conseils pratiques directement dans votre boîte mail.
          </p>
          
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input 
              type="email" 
              value={newsEmail}
              onChange={(e) => setNewsEmail(e.target.value)}
              placeholder="Votre adresse email..." 
              required
              className="flex-1 bg-white/10 border border-white/20 text-white rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40 font-sans"
            />
            <Button type="submit" variant="primary" disabled={newsStatus === 'loading'} className="h-[58px] px-8 rounded-2xl whitespace-nowrap">
              {newsStatus === 'loading' ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} className="mr-2" /> S'inscrire</>}
            </Button>
          </form>
          
          {newsStatus === 'success' && <p className="text-emerald-400 mt-4 text-sm font-medium">✨ Inscription confirmée ! Merci de votre confiance.</p>}
          {newsStatus === 'error' && <p className="text-red-400 mt-4 text-sm font-medium">Une erreur est survenue, ou cet email est déjà inscrit.</p>}
        </div>
      </section>

    </div>
  );
}