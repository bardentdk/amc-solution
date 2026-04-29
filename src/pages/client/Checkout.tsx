import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Landmark, ShieldCheck, CheckCircle2, FileSignature, Loader2, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

export default function Checkout() {
  const [method, setMethod] = useState<'card' | 'sepa'>('card');
  const [installments, setInstallments] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Dans Checkout.tsx
    const handlePayment = async () => {
        setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return navigate('/login');

        try {
            // On appelle ta Edge Function
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
            body: { 
                priceId: 'price_XXXXXX', // ID du produit récupéré sur ton dashboard Stripe
                userId: session.user.id,
                email: session.user.email,
                installments: installments // 1, 2, 3 ou 4
            }
            });

            if (error) throw error;

            // Redirection vers la page sécurisée de Stripe
            if (data?.url) {
            window.location.href = data.url;
            }
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'initialisation du paiement.");
        } finally {
            setLoading(false);
        }
    };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 bg-white rounded-[3rem] shadow-bento">
        <div className="bg-emerald-100 text-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold text-dark mb-4">Paiement validé !</h2>
        <p className="text-dark/60 mb-8 px-10">
          Votre commande a été traitée avec succès. Vous allez recevoir la copie de votre mandat et votre facture par email.
        </p>
        <Button variant="primary" onClick={() => window.location.href = '/dashboard'}>Retour au tableau de bord</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-dark mb-2">Finaliser mon dossier 💳</h1>
        <p className="text-dark/60">Sécurisez votre accompagnement en choisissant votre mode de règlement.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* COLONNE GAUCHE : CHOIX DU MODE */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-creamy">
            <h3 className="text-xl font-bold text-dark mb-6">1. Mode de paiement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => {setMethod('card'); setInstallments(1);}}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col gap-4 text-left ${method === 'card' ? 'border-primary bg-primary/5' : 'border-creamy hover:border-primary/30'}`}
              >
                <div className={`p-3 rounded-xl w-fit ${method === 'card' ? 'bg-primary text-white' : 'bg-creamy text-dark/40'}`}><CreditCard size={24} /></div>
                <div>
                  <p className="font-bold text-dark">Carte Bancaire</p>
                  <p className="text-xs text-dark/50">Paiement sécurisé immédiat</p>
                </div>
              </button>

              <button 
                onClick={() => setMethod('sepa')}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col gap-4 text-left ${method === 'sepa' ? 'border-primary bg-primary/5' : 'border-creamy hover:border-primary/30'}`}
              >
                <div className={`p-3 rounded-xl w-fit ${method === 'sepa' ? 'bg-primary text-white' : 'bg-creamy text-dark/40'}`}><Landmark size={24} /></div>
                <div>
                  <p className="font-bold text-dark">Prélèvement SEPA</p>
                  <p className="text-xs text-dark/50">Paiement en plusieurs fois</p>
                </div>
              </button>
            </div>
          </div>

          {method === 'sepa' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-creamy space-y-6">
              <h3 className="text-xl font-bold text-dark">2. Échéancier de prélèvement</h3>
              <div className="flex gap-4">
                {[1, 2, 3, 4].map(n => (
                  <button 
                    key={n} 
                    onClick={() => setInstallments(n)}
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all border-2 ${installments === n ? 'bg-dark text-white border-dark' : 'bg-creamy/50 text-dark/40 border-transparent hover:border-dark/10'}`}
                  >
                    {n}x
                  </button>
                ))}
              </div>
              <div className="p-4 bg-primary/5 rounded-2xl flex gap-3 items-start">
                <Info size={20} className="text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-dark/70 leading-relaxed">
                  En choisissant le paiement en {installments} fois, vous serez prélevé de <strong>{(1400 / installments).toFixed(2)}€</strong> chaque mois.
                </p>
              </div>

              {/* FORMULAIRE IBAN */}
              <div className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-dark/40 mb-2">Titulaire du compte</label>
                  <input type="text" placeholder="NOM PRÉNOM" className="w-full bg-creamy/30 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-dark/40 mb-2">IBAN</label>
                  <input type="text" placeholder="FR76 3000 1000 ..." className="w-full bg-creamy/30 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 font-mono" />
                </div>
              </div>

              {/* MANDAT TEXTE LÉGAL */}
              <div className="p-6 bg-creamy/30 rounded-3xl border border-creamy">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <FileSignature size={18} />
                  <span className="text-xs font-bold uppercase tracking-tighter">Mandat de prélèvement SEPA</span>
                </div>
                <p className="text-[10px] text-dark/60 leading-relaxed mb-4">
                  En signant ce mandat, vous autorisez AMC SOLUTIONS à envoyer des instructions à votre banque pour débiter votre compte, et votre banque à débiter votre compte conformément aux instructions de AMC SOLUTIONS.
                </p>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" required className="mt-1 w-4 h-4 accent-primary" />
                  <span className="text-xs font-bold text-dark group-hover:text-primary transition-colors">J'accepte et je signe numériquement ce mandat de prélèvement.</span>
                </label>
              </div>
            </motion.div>
          )}
        </div>

        {/* COLONNE DROITE : RÉSUMÉ & VALIDATION */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-creamy sticky top-28">
            <h3 className="text-xl font-bold text-dark mb-6">Récapitulatif</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-dark/50">Pack Excellence</span>
                <span className="font-bold">1400.00€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark/50">Frais de dossier</span>
                <span className="text-emerald-500 font-bold">OFFERT</span>
              </div>
              <div className="pt-4 border-t border-creamy flex justify-between items-baseline">
                <span className="text-lg font-bold">Total TTC</span>
                <span className="text-3xl font-black text-primary">1400.00€</span>
              </div>
            </div>

            <Button 
              variant="primary" 
              className="w-full h-14 rounded-2xl text-lg shadow-lg shadow-primary/20"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Confirmer le paiement</>}
            </Button>

            <div className="mt-6 flex items-center justify-center gap-2 text-dark/30">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Paiement 100% sécurisé via Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}