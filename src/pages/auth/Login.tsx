import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message === 'Invalid login credentials' 
          ? "Identifiants incorrects." 
          : "Une erreur est survenue lors de la connexion.");
      }

      if (data.user) {
        // Redirection vers le dashboard admin après connexion réussie
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-creamy font-sans">
      
      {/* SIDE GAUCHE : Image Duochromie & Texte (Masqué sur mobile) */}
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center p-12 text-center">
        {/* L'image de fond */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop')" }}
        />
        {/* Les calques (overlays) pour l'effet Duochromie Gris/Vert */}
        <div className="absolute inset-0 bg-gray-900 mix-blend-luminosity z-10 opacity-80"></div>
        <div className="absolute inset-0 bg-primary mix-blend-multiply z-20 opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-dark/40 z-30"></div>

        {/* Contenu superposé */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-40 text-white max-w-lg"
        >
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm inline-block mb-8 border border-white/20">
            <ShieldCheck size={48} className="text-creamy" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Espace d'Administration <span className="text-primary-light text-creamy">AMC</span>
          </h1>
          <p className="text-lg text-creamy/80 leading-relaxed">
            Gérez vos dossiers, répondez à vos clients et mettez à jour vos offres en toute sécurité depuis votre tableau de bord centralisé.
          </p>
        </motion.div>
      </div>

      {/* SIDE DROITE : Formulaire de connexion */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-24 relative overflow-y-auto">
        
        {/* Bouton retour accueil (absolu) */}
        <Link to="/" className="absolute top-8 left-8 sm:left-12 flex items-center gap-2 text-dark/50 hover:text-primary transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Retour au site
        </Link>

        <div className="w-full max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center text-center mb-10"
          >
            <div className="bg-primary/10 p-4 rounded-full mb-6">
              <Logo className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-dark mb-2">Bon retour !</h2>
            <p className="text-dark/60">Veuillez vous connecter à votre compte administrateur.</p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleLogin} 
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-dark/80 mb-2">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" size={20} />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="admin@australeformation.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-dark/80">Mot de passe</label>
                {/* Lien mot de passe oublié (Optionnel pour plus tard) */}
                <a href="#" className="text-xs text-primary font-medium hover:underline">Mot de passe oublié ?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" size={20} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                {errorMsg}
              </motion.div>
            )}

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full h-12 text-lg font-medium shadow-lg shadow-primary/20"
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="animate-spin mr-2" size={20} /> Connexion...</>
              ) : (
                'Se connecter'
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}