import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Phone, Mail, Paperclip, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

// Schéma de validation Zod
const contactSchema = z.object({
  first_name: z.string().min(2, "Le prénom est requis"),
  last_name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  message: z.string().min(10, "Votre message doit contenir au moins 10 caractères"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      let attachment_url = null;

      // 1. Upload du fichier s'il y en a un
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `contacts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('attachments')
          .upload(filePath, file);

        if (uploadError) throw new Error("Erreur lors de l'envoi de la pièce jointe.");
        
        // On récupère l'URL publique
        const { data: publicUrlData } = supabase.storage.from('attachments').getPublicUrl(filePath);
        attachment_url = publicUrlData.publicUrl;
      }

      // 2. Insertion dans la base de données
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([{
          ...data,
          attachment_url
        }]);

      if (dbError) throw new Error("Erreur lors de l'envoi de votre message.");

      // 3. (Optionnel pour plus tard) Appel à une Edge Function Supabase pour envoyer le mail via Resend
      // await supabase.functions.invoke('send-email', { body: data });

      setIsSuccess(true);
      reset();
      setFile(null);
    } catch (error: any) {
      setErrorMsg(error.message || "Une erreur inattendue est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-creamy">
      <div className="container mx-auto max-w-6xl">
        
        {/* En-tête */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-dark mb-4 font-sans"
          >
            Contactez-<span className="text-primary">Nous</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-dark/70 max-w-2xl mx-auto font-sans"
          >
            Une question ? Un dossier à confier ? Notre équipe d'experts est là pour vous répondre et vous accompagner dans vos démarches.
          </motion.p>
        </div>

        {/* Layout Double Side */}
        <div className="bg-white rounded-3xl shadow-bento overflow-hidden flex flex-col lg:flex-row">
          
          {/* Side Gauche : Informations */}
          <div className="bg-primary lg:w-1/3 p-10 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Décoration d'arrière-plan */}
            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 rounded-full bg-white/10 blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-8 font-sans">Nos Coordonnées</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <Phone className="mt-1 text-creamy" />
                  <div>
                    <p className="text-sm text-creamy/70 font-sans mb-1">Téléphone</p>
                    <p className="font-semibold text-lg font-sans">0693 711 811</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="mt-1 text-creamy" />
                  <div>
                    <p className="text-sm text-creamy/70 font-sans mb-1">Email professionnel</p>
                    <p className="font-semibold text-lg font-sans">pmamode@amconseils.org</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 text-creamy" />
                  <div>
                    <p className="text-sm text-creamy/70 font-sans mb-1">Adresse postale</p>
                    <p className="font-semibold text-lg font-sans">68 rue Tessan,<br/>97490 Sainte-Clotilde, Réunion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Droite : Formulaire */}
          <div className="lg:w-2/3 p-10 md:p-14">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4"
              >
                <CheckCircle2 size={64} className="text-primary" />
                <h3 className="text-2xl font-bold text-dark font-sans">Message envoyé !</h3>
                <p className="text-dark/70 font-sans">Nous avons bien reçu votre demande et vos éventuelles pièces jointes. Nous vous recontacterons dans les plus brefs délais.</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsSuccess(false)}>
                  Envoyer un autre message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark/80 mb-2 font-sans">Prénom</label>
                    <input 
                      {...register("first_name")}
                      className={`w-full bg-creamy/50 border ${errors.first_name ? 'border-red-500' : 'border-transparent'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none font-sans transition-all`}
                      placeholder="Jean"
                    />
                    {errors.first_name && <span className="text-red-500 text-xs mt-1">{errors.first_name.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark/80 mb-2 font-sans">Nom</label>
                    <input 
                      {...register("last_name")}
                      className={`w-full bg-creamy/50 border ${errors.last_name ? 'border-red-500' : 'border-transparent'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none font-sans transition-all`}
                      placeholder="Dupont"
                    />
                    {errors.last_name && <span className="text-red-500 text-xs mt-1">{errors.last_name.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark/80 mb-2 font-sans">Adresse Email</label>
                    <input 
                      {...register("email")}
                      type="email"
                      className={`w-full bg-creamy/50 border ${errors.email ? 'border-red-500' : 'border-transparent'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none font-sans transition-all`}
                      placeholder="jean.dupont@email.com"
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark/80 mb-2 font-sans">Numéro de téléphone</label>
                    <input 
                      {...register("phone")}
                      className={`w-full bg-creamy/50 border ${errors.phone ? 'border-red-500' : 'border-transparent'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none font-sans transition-all`}
                      placeholder="06 12 34 56 78"
                    />
                    {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark/80 mb-2 font-sans">Votre message</label>
                  <textarea 
                    {...register("message")}
                    rows={4}
                    className={`w-full bg-creamy/50 border ${errors.message ? 'border-red-500' : 'border-transparent'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none font-sans resize-none transition-all`}
                    placeholder="Expliquez-nous votre situation..."
                  />
                  {errors.message && <span className="text-red-500 text-xs mt-1">{errors.message.message}</span>}
                </div>

                {/* Upload de pièce jointe */}
                <div>
                  <label className="block text-sm font-medium text-dark/80 mb-2 font-sans">Pièce jointe (Optionnel)</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="file-upload"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label 
                      htmlFor="file-upload"
                      className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-primary/30 rounded-xl px-4 py-6 text-sm text-dark/60 cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all font-sans"
                    >
                      <Paperclip size={20} className={file ? "text-primary" : ""} />
                      {file ? <span className="font-medium text-primary">{file.name}</span> : <span>Cliquez pour joindre un document (PDF, Image)</span>}
                    </label>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-sans">
                    {errorMsg}
                  </div>
                )}

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full flex justify-center items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Envoyer ma demande
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}