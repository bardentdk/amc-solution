import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Dans ton fichier Register.tsx, modifie la fonction handleRegister :
    const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
        // On passe les infos ici, le Trigger SQL s'occupe du reste
        data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
        }
        }
    });

    if (signUpError) {
        setError(signUpError.message);
    } else if (data.user) {
        navigate('/dashboard');
    }
    setLoading(false);
    };

  return (
    <div className="min-h-screen bg-creamy flex items-center justify-center p-4 pt-32">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-bento p-8 md:p-10 border border-primary/5">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-dark mb-2">Créer un compte</h1>
          <p className="text-dark/60 text-sm">Rejoignez AMC pour suivre vos démarches en ligne.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30 group-focus-within:text-primary transition-colors" size={18} />
              <input type="text" placeholder="Prénom" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-creamy/30 border-none rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
            </div>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30 group-focus-within:text-primary transition-colors" size={18} />
              <input type="text" placeholder="Nom" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-creamy/30 border-none rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
            </div>
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30 group-focus-within:text-primary transition-colors" size={18} />
            <input type="email" placeholder="Adresse email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-creamy/30 border-none rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30 group-focus-within:text-primary transition-colors" size={18} />
            <input type="password" placeholder="Mot de passe" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-creamy/30 border-none rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
          </div>

          {error && <p className="text-red-500 text-xs text-center font-medium bg-red-50 p-3 rounded-xl">{error}</p>}

          <Button type="submit" variant="primary" className="w-full h-14 rounded-2xl text-lg shadow-lg shadow-primary/20" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <>S'inscrire <ArrowRight className="ml-2" size={20} /></>}
          </Button>

          <p className="text-center text-dark/50 text-sm">
            Déjà un compte ? <Link to="/login" className="text-primary font-bold hover:underline">Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  );
}