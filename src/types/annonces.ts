// Types pour le système d'annonces

export type AnnonceType = 'ets' | 'influenceur' | 'agence';
export type PrestationType = 'photo' | 'video' | 'event' | 'meeting' | 'content' | 'autre';
export type AnnonceStatus = 'open' | 'closed' | 'in_progress' | 'completed';

export interface Annonce {
  id: string;
  type: AnnonceType; // Type de créateur de l'annonce
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorType: 'entreprise' | 'influenceur' | 'agence';
  
  // Titre et description
  title: string;
  description: string;
  
  // Pour les annonces d'établissements (recherche d'influenceurs)
  searchType?: 'influenceurs'; // Type de recherche
  prestationType?: PrestationType; // Type de prestation recherchée
  dateDebut?: string; // Date de début souhaitée
  dateFin?: string; // Date de fin souhaitée
  nombreInfluenceurs?: number; // Nombre d'influenceurs recherchés
  budget?: number; // Budget disponible
  localisation?: string; // Ville/lieu
  
  // Pour les annonces d'influenceurs (recherche d'établissements)
  rechercheType?: 'hotel' | 'restaurant' | 'evenement' | 'spa' | 'autre'; // Type d'établissement recherché
  dateDebutRecherche?: string; // Date de début souhaitée
  dateFinRecherche?: string; // Date de fin souhaitée
  villeRecherche?: string; // Ville recherchée
  
  // Pour les annonces d'agences
  agenceDescription?: string;
  
  // Métadonnées
  status: AnnonceStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string; // Date d'expiration de l'annonce
  
  // Candidatures
  candidatures: Candidature[];
  candidaturesCount: number;
  hasApplied?: boolean; // Indique si l'utilisateur actuel a postulé à cette annonce
  
  // Catégories et tags
  categories: string[];
  tags: string[];
}

export interface Candidature {
  id: string;
  annonceId: string;
  candidatId: string;
  candidatName: string;
  candidatAvatar: string;
  candidatType: 'influenceur' | 'entreprise' | 'agence';
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
}

