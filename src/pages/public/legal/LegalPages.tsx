import { useEffect } from 'react';

// Composant Template
export const LegalLayout = ({ title, lastUpdate, children }: { title: string, lastUpdate: string, children: React.ReactNode }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []); // Remonte en haut de page à l'ouverture

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-creamy selection:bg-primary selection:text-white">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-dark mb-4 font-sans leading-tight">{title}</h1>
          <p className="text-dark/50 font-sans font-medium">Dernière mise à jour : {lastUpdate}</p>
        </header>
        <div className="bg-white rounded-3xl shadow-bento p-8 md:p-12 prose prose-emerald prose-lg max-w-none font-sans text-dark/80">
          {children}
        </div>
      </div>
    </div>
  );
};

// 1. Mentions Légales
export const MentionsLegales = () => (
  <LegalLayout title="Mentions Légales" lastUpdate="28 Avril 2026">
    <h2>1. Éditeur du site</h2>
    <p>Le site internet AMC (ci-après "le Site") est édité par :<br/>
    <strong>Cabinet AMC Expertise</strong><br/>
    Forme juridique : [SAS / SARL / Auto-entreprise]<br/>
    Capital social : [Montant] €<br/>
    Siège social : [Adresse complète]<br/>
    SIRET : [Numéro de SIRET]<br/>
    RCS : [Ville d'immatriculation]<br/>
    Directeur de la publication : [Nom du dirigeant]</p>
    
    <h2>2. Hébergement</h2>
    <p>Le Site est hébergé par :<br/>
    Laravel Forge / Supabase<br/>
    [Adresse de l'hébergeur]</p>

    <h2>3. Propriété intellectuelle</h2>
    <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.</p>
  </LegalLayout>
);

// 2. CGU / CGV
export const CGU = () => (
  <LegalLayout title="Conditions Générales d'Utilisation" lastUpdate="28 Avril 2026">
    <h2>1. Objet</h2>
    <p>Les présentes Conditions Générales ont pour objet de définir les modalités de mise à disposition des services du site AMC et les conditions d'utilisation du service par l'Utilisateur.</p>
    
    <h2>2. Prestations de conseil</h2>
    <p>Le cabinet AMC propose des prestations d'accompagnement administratif. AMC est tenu à une obligation de moyens et non de résultats, les décisions finales appartenant souverainement aux préfectures et à l'administration française.</p>

    <h2>3. Tarifs et Paiement</h2>
    <p>Les prix de nos formules sont indiqués en euros toutes taxes comprises (TTC). Les frais annexes (timbres fiscaux, traductions assermentées) restent à la charge exclusive du client.</p>
  </LegalLayout>
);

// 3. Politique de Confidentialité
export const PolitiqueConfidentialite = () => (
  <LegalLayout title="Politique de Confidentialité et Cookies" lastUpdate="28 Avril 2026">
    <h2>1. Collecte des données personnelles</h2>
    <p>Dans le cadre de son activité d'accompagnement, AMC est amené à collecter et traiter des données à caractère personnel (état civil, situation professionnelle, familiale). Ces données sont strictement confidentielles.</p>

    <h2>2. Finalité du traitement</h2>
    <p>Vos données sont traitées uniquement dans le but de :</p>
    <ul>
      <li>Constituer et déposer votre dossier en préfecture.</li>
      <li>Communiquer avec vous concernant l'avancement de vos démarches.</li>
      <li>Vous envoyer notre newsletter (uniquement avec votre consentement explicite).</li>
    </ul>

    <h2>3. Vos droits (RGPD)</h2>
    <p>Conformément à la loi Informatique et Libertés et au RGPD, vous disposez d'un droit d'accès, de rectification, de portabilité et d'effacement de vos données. Pour exercer ce droit, contactez-nous à : <strong>contact@amc-expert.fr</strong></p>

    <h2>4. Gestion des Cookies</h2>
    <p>Notre site utilise des cookies techniques nécessaires au bon fonctionnement (conservation de votre session) ainsi que des cookies de mesure d'audience anonymes.</p>
  </LegalLayout>
);