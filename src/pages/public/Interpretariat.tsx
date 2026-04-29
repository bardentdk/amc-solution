import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Languages, Globe, Lock, Clock, Award, FileText, 
  CheckCircle2, Send, Loader2, Scale, Stethoscope, 
  Landmark, Briefcase, ChevronDown, Users, User, Mail, Phone, MessageSquare
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

// Variantes d'animation
const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
// const ToggleLogo = useRef(true);
// const Logo = "https://assets.zyrosite.com/dOqyRXMokNu852kG/amc-interpra-c-tariat-1-mP4nRPXJQnfyKQQg.svg";
// Composant FAQ interne
const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-2 border-creamy/50 rounded-2xl mb-4 bg-white overflow-hidden transition-all hover:border-primary/30">
      <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full p-6 text-left focus:outline-none">
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

export default function Interpretariat() {
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone: '', languages: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('interpretariat_messages').insert([formData]);
    if (error) setStatus('error');
    else {
      setStatus('success');
      setFormData({ first_name: '', last_name: '', email: '', phone: '', languages: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-creamy selection:bg-primary selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-24 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-bl-[100px] -z-10"></div>
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 border border-primary/20">
              <Languages size={18} /> Service dédié AMC
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-dark mb-6 leading-tight max-w-4xl font-sans tracking-tight">
              Faites sauter la barrière de la langue avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">précision</span>.
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-dark/70 mb-10 max-w-2xl font-sans leading-relaxed">
              Interprétariat simultané, consécutif, et traductions assermentées. Un accompagnement linguistique d'excellence pour vos démarches administratives, médicales et juridiques.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button variant="primary" className="h-14 px-8 text-lg shadow-lg shadow-primary/20" onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
                Obtenir un devis gratuit
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. STATISTIQUES */}
      <section className="bg-primary-orange text-creamy py-12 relative z-10">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            <div><p className="text-4xl font-bold text-white mb-2">50+</p><p className="text-sm text-creamy/70 font-sans uppercase tracking-wide">Langues & Dialectes</p></div>
            <div><p className="text-4xl font-bold text-white mb-2">24h</p><p className="text-sm text-creamy/70 font-sans uppercase tracking-wide">Délai de réponse</p></div>
            <div><p className="text-4xl font-bold text-white mb-2">100%</p><p className="text-sm text-creamy/70 font-sans uppercase tracking-wide">Confidentialité</p></div>
            <div><p className="text-4xl font-bold text-white mb-2">Top 3</p><p className="text-sm text-creamy/70 font-sans uppercase tracking-wide">Agences certifiées</p></div>
          </div>
        </div>
      </section>

      {/* 3. NOS SERVICES */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4 font-sans">Nos solutions linguistiques</h2>
            <p className="text-dark/60 max-w-2xl mx-auto font-sans">Des prestations sur mesure adaptées à l'exigence de vos enjeux.</p>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Interprétariat de liaison", desc: "Accompagnement physique ou téléphonique (rendez-vous préfecture, tribunaux, réunions d'affaires)." },
              { icon: Award, title: "Traduction Assermentée", desc: "Traduction certifiée conforme par des experts près la Cour d'Appel (actes d'état civil, diplômes)." },
              { icon: Globe, title: "Traduction Technique", desc: "Traduction de sites web, plaquettes commerciales et documents professionnels complexes." }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-creamy/30 p-8 md:p-10 rounded-[2.5rem] border border-transparent hover:border-primary/10 hover:shadow-bento hover:bg-white transition-all duration-300 group">
                <div className="w-16 h-16 bg-white border border-creamy text-primary rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-dark mb-4 font-sans">{item.title}</h3>
                <p className="text-dark/60 text-sm leading-relaxed font-sans">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. DOMAINES D'EXPERTISE */}
      <section className="py-24 bg-creamy relative">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4 font-sans">À chaque secteur, son vocabulaire</h2>
            <p className="text-dark/60 max-w-2xl mx-auto font-sans">Nos traducteurs ne font pas que traduire, ils maîtrisent le jargon de votre domaine.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Landmark, title: "Administratif", desc: "Préfectures, OFPRA, mairies, CAF." },
              { icon: Scale, title: "Juridique", desc: "Tribunaux, avocats, notaires, contrats." },
              { icon: Stethoscope, title: "Médical", desc: "Hôpitaux, consultations, bilans de santé." },
              { icon: Briefcase, title: "Business", desc: "B2B, réunions d'affaires, présentations." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-bento transition-all flex flex-col items-center text-center group border border-transparent hover:border-primary/10">
                <div className="p-4 bg-creamy rounded-full mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors"><item.icon size={28} /></div>
                <h4 className="font-bold text-dark mb-2">{item.title}</h4>
                <p className="text-sm text-dark/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROCESSUS */}
      <section className="py-24 bg-white border-y border-creamy">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4 font-sans">Comment se déroule une prestation ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-creamy -translate-y-1/2 z-0"></div>
            {[
              { step: "01", title: "Analyse & Devis", desc: "Vous décrivez votre besoin via le formulaire. Nous vous envoyons un devis sous 24h avec le profil adapté." },
              { step: "02", title: "Préparation", desc: "Signature d'un accord de confidentialité. L'interprète s'imprègne de votre dossier et de votre terminologie." },
              { step: "03", title: "Intervention", desc: "Prestation réalisée avec ponctualité, neutralité et fidélité absolue au message source." }
            ].map((item, i) => (
               <div key={i} className="relative z-10 flex flex-col items-center text-center bg-white p-6 rounded-3xl">
                <div className="w-16 h-16 bg-creamy border-4 border-white rounded-full flex items-center justify-center text-primary font-black text-xl shadow-sm mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-dark mb-3 font-sans">{item.title}</h3>
                <p className="text-sm text-dark/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ENGAGEMENTS QUALITÉ */}
      <section className="py-24 bg-primary-orange text-creamy">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-sans">Nos engagements stricts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                <Lock className="text-creamy mb-6" size={36} />
                <h3 className="text-xl font-bold text-white mb-4">Secret Professionnel</h3>
                <p className="text-creamy/70 text-sm leading-relaxed">Chaque intervenant est soumis à un accord de non-divulgation (NDA). Aucune information ne quitte notre cabinet.</p>
             </div>
             <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                <CheckCircle2 className="text-creamy mb-6" size={36} />
                <h3 className="text-xl font-bold text-white mb-4">Neutralité Absolue</h3>
                <p className="text-creamy/70 text-sm leading-relaxed">L'interprète ne prend pas parti, n'ajoute et ne retranche rien. Seul votre message compte.</p>
             </div>
             <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                <Clock className="text-creamy mb-6" size={36} />
                <h3 className="text-xl font-bold text-white mb-4">Urgence & Flexibilité</h3>
                <p className="text-creamy/70 text-sm leading-relaxed">Une convocation de dernière minute ? Nous avons des équipes mobilisables rapidement pour vous accompagner.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-24 bg-creamy">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark mb-4 font-sans">Questions Fréquentes</h2>
          </div>
          <FAQItem question="L'interprète peut-il m'accompagner en préfecture ?" answer="Absolument. Nos interprètes sont habitués aux rendez-vous administratifs (Préfecture, OFPRA, etc.) et assurent une traduction de liaison parfaite pour fluidifier vos démarches." />
          <FAQItem question="Qu'est-ce qu'une traduction assermentée ?" answer="C'est une traduction réalisée par un expert traducteur ayant prêté serment devant une Cour d'Appel. Elle est obligatoire pour que vos documents étrangers (actes de naissance, diplômes) soient reconnus officiellement en France." />
          <FAQItem question="Comment est calculé le tarif d'une traduction ?" answer="Pour la traduction écrite, le tarif est calculé au mot ou à la page selon la complexité et l'urgence. Pour l'interprétariat physique, nous facturons à la demi-journée ou à la journée, frais de déplacement inclus." />
        </div>
      </section>

      {/* 8. FORMULAIRE ULTRA PREMIUM (Split Layout) */}
      <section id="contact-form" className="py-24 relative bg-dark overflow-hidden">
        {/* Glow Effects de fond */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[100px] rounded-full mix-blend-screen"></div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            
            {/* Colonne Gauche : Pitch & Réassurance */}
            <div className="lg:w-5/12 text-white w-full">
              <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl text-primary mb-8 backdrop-blur-md">
                <MessageSquare size={24} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-sans tracking-tight leading-tight">
                Parlons de votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">projet linguistique</span>.
              </h2>
              <p className="text-creamy/70 text-lg mb-10 font-sans leading-relaxed">
                Remplissez ce formulaire pour obtenir un devis transparent. Notre équipe analyse votre demande et vous répond avec la solution la plus adaptée.
              </p>

              <div className="space-y-6 hidden md:block">
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  <div className="bg-primary/20 p-3 rounded-full text-primary"><Clock size={24} /></div>
                  <div>
                    <p className="text-sm text-creamy/50 font-medium">Réactivité garantie</p>
                    <p className="text-white font-bold">Devis détaillé sous 24 heures</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  <div className="bg-primary/20 p-3 rounded-full text-primary"><Lock size={24} /></div>
                  <div>
                    <p className="text-sm text-creamy/50 font-medium">Sécurité des données</p>
                    <p className="text-white font-bold">Chiffrement de bout en bout</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Formulaire Glassmorphism Clair */}
            <div className="lg:w-7/12 w-full">
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/50">
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Input avec Icône intégrée */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="text-dark/40 group-focus-within:text-primary transition-colors" size={20} />
                      </div>
                      <input type="text" required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full bg-creamy/30 border border-creamy text-dark placeholder:text-dark/40 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans text-sm" placeholder="Prénom" />
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="text-dark/40 group-focus-within:text-primary transition-colors" size={20} />
                      </div>
                      <input type="text" required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full bg-creamy/30 border border-creamy text-dark placeholder:text-dark/40 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans text-sm" placeholder="Nom de famille" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="text-dark/40 group-focus-within:text-primary transition-colors" size={20} />
                      </div>
                      <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-creamy/30 border border-creamy text-dark placeholder:text-dark/40 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans text-sm" placeholder="Adresse email" />
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="text-dark/40 group-focus-within:text-primary transition-colors" size={20} />
                      </div>
                      <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-creamy/30 border border-creamy text-dark placeholder:text-dark/40 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans text-sm" placeholder="Téléphone (Optionnel)" />
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Globe className="text-dark/40 group-focus-within:text-primary transition-colors" size={20} />
                    </div>
                    <input type="text" required value={formData.languages} onChange={e => setFormData({...formData, languages: e.target.value})} className="w-full bg-creamy/30 border border-creamy text-dark placeholder:text-dark/40 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans text-sm" placeholder="Langues concernées (ex: Français vers Arabe)" />
                  </div>

                  <div className="relative group">
                    <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                      <FileText className="text-dark/40 group-focus-within:text-primary transition-colors" size={20} />
                    </div>
                    <textarea required rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-creamy/30 border border-creamy text-dark placeholder:text-dark/40 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans text-sm resize-none" placeholder="Détaillez votre besoin (Nature du document, contexte du RDV, volume approximatif...)" />
                  </div>

                  <AnimatePresence>
                    {status === 'error' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 bg-red-50 p-4 rounded-xl text-sm font-bold text-center">Erreur lors de l'envoi. Veuillez réessayer.</motion.div>}
                    {status === 'success' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-center font-bold flex items-center justify-center gap-2"><CheckCircle2 size={20} /> Demande envoyée avec succès !</motion.div>}
                  </AnimatePresence>

                  <div className="pt-2">
                    <Button type="submit" variant="primary" disabled={status === 'loading'} className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-1 transition-transform">
                      {status === 'loading' ? <><Loader2 className="animate-spin mr-2" size={24} /> Envoi en cours...</> : <><Send size={20} className="mr-2" /> Demander un devis</>}
                    </Button>
                    <p className="text-center text-xs text-dark/40 mt-4 font-sans">
                      En soumettant ce formulaire, vous acceptez notre politique de confidentialité.
                    </p>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}