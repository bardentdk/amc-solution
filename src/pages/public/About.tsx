import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Heart, Award, Users, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';

// --- Variantes d'animation Framer Motion ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function About() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-creamy">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 px-4 overflow-hidden">
        {/* Décoration d'arrière-plan */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-bl-[100px] -z-10"></div>
        
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Texte Hero */}
            <motion.div 
              initial="hidden" animate="visible" variants={staggerContainer}
              className="lg:w-1/2"
            >
              <motion.span variants={fadeInUp} className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block">
                Notre Histoire
              </motion.span>
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-dark mb-6 leading-tight font-sans">
                L'humain au cœur de vos <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">démarches administratives</span>.
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg text-dark/70 mb-8 font-sans leading-relaxed">
                Né d'une volonté de simplifier un système souvent complexe et anxiogène, AMC s'est donné pour mission d'accompagner les ressortissants étrangers avec transparence, bienveillance et une expertise juridique de pointe.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Link to="/contact">
                  <Button variant="primaryOrange" className="h-12 px-8 text-lg">
                    Rencontrer notre équipe
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Cadre Photo Hero (Placeholder) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="lg:w-1/2 w-full"
            >
              <div className="relative aspect-[4/3] w-full rounded-[2rem] bg-white shadow-bento overflow-hidden border-8 border-white flex flex-col items-center justify-center group">
                {/* Remplacer ce div par une balise img quand tu auras la photo :
                  <img src="/chemin/vers/ta/photo-equipe.jpg" alt="L'équipe AMC" className="w-full h-full object-cover" />
                */}
                <div className="absolute inset-0 bg-creamy/50 flex flex-col items-center justify-center text-primary/40 group-hover:bg-creamy transition-colors">
                  <ImageIcon size={64} className="mb-4" />
                  <p className="font-medium font-sans">Espace pour la photo d'équipe ou des bureaux</p>
                  <p className="text-sm opacity-70">Format recommandé : Paysage (4:3)</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SECTION MISSION & VISION --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-dark mb-8 font-sans">Notre Mission</motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-dark/80 font-sans leading-relaxed italic border-l-4 border-primary pl-6 text-left">
              "Nous croyons fermement que l'accès au séjour légal ne devrait pas être un parcours du combattant. Notre rôle est d'être le pont entre vous et l'administration française, en traduisant la complexité juridique en actions concrètes et sécurisées."
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* --- NOS VALEURS --- */}
      <section className="py-24 bg-creamy">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark mb-4 font-sans">Ce qui nous anime</h2>
            <p className="text-dark/70 max-w-2xl mx-auto font-sans">Les 4 piliers qui guident chacune de nos actions au quotidien.</p>
          </div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: Heart, title: "Empathie", desc: "Nous écoutons votre histoire sans jugement pour comprendre vos enjeux personnels." },
              { icon: Target, title: "Transparence", desc: "Des honoraires clairs et un discours honnête sur les chances de succès de votre dossier." },
              { icon: Award, title: "Expertise", desc: "Une veille juridique constante pour maîtriser les moindres subtilités préfectorales." },
              { icon: Users, title: "Proximité", desc: "Un interlocuteur dédié qui connaît votre dossier sur le bout des doigts." }
            ].map((valeur, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="bg-white p-8 rounded-3xl shadow-bento hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <valeur.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-dark mb-3 font-sans">{valeur.title}</h3>
                <p className="text-dark/70 font-sans text-sm leading-relaxed">{valeur.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- L'ÉQUIPE (Cadres Photos) --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark mb-4 font-sans">Rencontrez nos experts</h2>
            <p className="text-dark/70 max-w-2xl mx-auto font-sans">Des professionnels passionnés, dédiés à la réussite de votre projet de vie en France.</p>
          </div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {/* Membre 1 */}
            <motion.div variants={fadeInUp} className="flex flex-col group">
              <div className="relative aspect-[3/4] w-full rounded-3xl bg-creamy shadow-sm overflow-hidden mb-6 border-4 border-white transition-all duration-300 group-hover:shadow-bento">
                {/* Remplacer par : <img src="/photo-membre-1.jpg" alt="Nom du membre" className="w-full h-full object-cover" /> 
                */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-primary/30 group-hover:bg-primary/5 transition-colors">
                  <ImageIcon size={48} className="mb-2" />
                  <span className="text-sm font-sans font-medium">Portrait (3:4)</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-dark font-sans text-center">Nom du Dirigeant</h3>
              <p className="text-primary font-medium text-center mb-4 font-sans">Fondateur & Expert Juridique</p>
              <p className="text-dark/70 text-center text-sm font-sans">15 ans d'expérience dans l'accompagnement des étrangers en préfecture.</p>
            </motion.div>

            {/* Membre 2 */}
            <motion.div variants={fadeInUp} className="flex flex-col group mt-0 md:mt-12">
              <div className="relative aspect-[3/4] w-full rounded-3xl bg-creamy shadow-sm overflow-hidden mb-6 border-4 border-white transition-all duration-300 group-hover:shadow-bento">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-primary/30 group-hover:bg-primary/5 transition-colors">
                  <ImageIcon size={48} className="mb-2" />
                  <span className="text-sm font-sans font-medium">Portrait (3:4)</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-dark font-sans text-center">Prénom Nom</h3>
              <p className="text-primary font-medium text-center mb-4 font-sans">Consultant Sénior</p>
              <p className="text-dark/70 text-center text-sm font-sans">Spécialiste des titres de séjour professionnels, étudiants et talents.</p>
            </motion.div>

            {/* Membre 3 */}
            <motion.div variants={fadeInUp} className="flex flex-col group">
              <div className="relative aspect-[3/4] w-full rounded-3xl bg-creamy shadow-sm overflow-hidden mb-6 border-4 border-white transition-all duration-300 group-hover:shadow-bento">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-primary/30 group-hover:bg-primary/5 transition-colors">
                  <ImageIcon size={48} className="mb-2" />
                  <span className="text-sm font-sans font-medium">Portrait (3:4)</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-dark font-sans text-center">Prénom Nom</h3>
              <p className="text-primary font-medium text-center mb-4 font-sans">Chargé(e) de suivi client</p>
              <p className="text-dark/70 text-center text-sm font-sans">Assure le lien constant avec la préfecture et vous tient informé à chaque étape.</p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-20 bg-gradient-to-tr from-orange-500 to-primary-orange text-white relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="container mx-auto max-w-4xl px-4 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6 font-sans"
          >
            Prêt à faire avancer votre dossier ?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-lg text-creamy/80 mb-10 font-sans"
          >
            Ne laissez plus la complexité administrative freiner vos projets. Contactez-nous pour une première évaluation de votre situation.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Link to="/contact">
              <Button variant="outline" className="bg-creamy text-primary-orange border-white hover:bg-creamy hover:text-primary-orange/80 h-14 px-8 text-lg font-bold">
                Nous contacter maintenant <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}