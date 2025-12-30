# TradeFood - Site E-commerce de Produits Rares et Authentiques

**Auteur :** Perrine Honoré  
**Date :** 29 décembre 2025

Site e-commerce moderne pour **TradeFood**, une boutique en ligne spécialisée dans les produits rares et authentiques du monde entier : fruits, épices, thés, chocolats, huiles et cafés rares.

## 🌟 À propos

**TradeFood** est une plateforme e-commerce dédiée à la vente de produits rares et authentiques de qualité. Nous proposons une sélection soignée de produits rares provenant des quatre coins du monde, garantissant fraîcheur, authenticité et traçabilité.

### Catégories de produits

- 🍍 **Fruits** - Mangues, fruits du dragon, et autres fruits rares
- 🌶️ **Épices & Condiments** - Curry, safran, et épices du monde entier
- 🍵 **Thés & Infusions** - Thés rares et infusions authentiques
- 🍫 **Chocolats & Confiseries** - Chocolats fins et gourmandises rares
- 🫒 **Huiles & Vinaigres** - Huiles d'exception et vinaigres rares
- ☕ **Cafés & Boissons** - Cafés rares et boissons authentiques

## 🚀 Technologies utilisées

- **[Next.js 15](https://nextjs.org/)** - Framework React pour le développement
- **[React 19](https://react.dev/)** - Bibliothèque JavaScript pour l'interface utilisateur
- **[TypeScript](https://www.typescriptlang.org/)** - Typage statique pour JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utilitaire
- **[Lucide React](https://lucide.dev/)** - Icônes modernes et élégantes
- **[Stripe](https://stripe.com/)** - Paiement en ligne sécurisé
- **[Unsplash](https://unsplash.com/)** - Images de produits libres de droits

## 📦 Installation

### Prérequis

- Node.js 18+ 
- npm, yarn, pnpm ou bun
- Backend API disponible sur `http://localhost:8080`

### Installation des dépendances

```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

### Configuration

Créer un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_stripe
```

## 🛠️ Développement

Lancer le serveur de développement :

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

La page se met à jour automatiquement lorsque vous modifiez les fichiers.

## 🏗️ Structure du projet

```
ecommerce/
├── public/                 # Fichiers statiques (images, logos, etc.)
│   └── logotrade.png       # Logo TradeFood
├── src/
│   ├── app/
│   │   ├── globals.css     # Styles globaux et variables CSS
│   │   ├── layout.tsx       # Layout principal avec métadonnées
│   │   ├── page.tsx        # Page d'accueil principale
│   │   ├── connexion/       # Page de connexion
│   │   ├── inscription/    # Page d'inscription
│   │   ├── reset-password/ # Réinitialisation mot de passe
│   │   ├── produit/[id]/   # Pages de fiches produits
│   │   ├── categorie/[slug]/ # Pages de catégories
│   │   ├── compte/         # Espace client
│   │   │   └── commande/[id]/ # Détail d'une commande
│   │   ├── panier/         # Page panier
│   │   └── checkout/       # Checkout et paiement
│   │       ├── page.tsx    # Checkout multi-étapes
│   │       ├── payment/     # Paiement Stripe
│   │       └── success/     # Confirmation de commande
│   ├── components/         # Composants React réutilisables
│   │   ├── Header.tsx      # En-tête avec navigation
│   │   ├── HeroSection.tsx # Section hero avec produit vedette
│   │   ├── ProductsSection.tsx # Section produits avec filtres
│   │   ├── Footer.tsx      # Footer réutilisable
│   │   ├── ProtectedRoute.tsx # Protection de routes
│   │   └── Providers.tsx   # Provider pour les contextes
│   ├── contexts/           # Contextes React
│   │   ├── AuthContext.tsx # Gestion de l'authentification
│   │   └── CartContext.tsx # Gestion du panier (sync backend)
│   ├── services/           # Services API
│   │   └── api.ts          # Service API complet avec tous les endpoints
│   ├── lib/                # Utilitaires et données
│   │   └── products.ts     # Données des produits (fallback)
│   └── types/              # Types TypeScript
│       ├── product.ts      # Types pour les produits
│       ├── user.ts         # Types utilisateur
│       ├── order.ts         # Types commandes
│       ├── address.ts       # Types adresses
│       └── shipping.ts      # Types livraison
├── package.json
├── README.md
├── API_DOCUMENTATION.md     # Documentation complète des API
└── IMPLEMENTATION.md        # Documentation d'implémentation
```

## 🎨 Design & Couleurs

Le site utilise une palette de couleurs professionnelle :

- **Bleu principal** : `#172867` (bleu foncé)
- **Vert accent** : `#A0A12F` (vert olive)
- **Fond** : Blanc
- **Texte** : `#172867` avec différentes opacités

## ✨ Fonctionnalités Complètes

### 🔐 Authentification
- ✅ Inscription avec création automatique client Sellsy
- ✅ Connexion avec token JWT
- ✅ Réinitialisation de mot de passe
- ✅ Gestion de session persistante
- ✅ Protection des routes nécessitant authentification

### 🛍️ Catalogue Produits
- ✅ Listing produits avec pagination
- ✅ Recherche textuelle
- ✅ Filtres avancés (prix, catégorie, tri)
- ✅ Fiche produit détaillée
- ✅ Synchronisation produits depuis Sellsy

### 🛒 Panier & Checkout
- ✅ Panier synchronisé avec le backend
- ✅ Gestion des quantités
- ✅ Calcul automatique des totaux
- ✅ Checkout en 3 étapes :
  1. Sélection des adresses (facturation + livraison)
  2. Choix de la méthode de livraison
  3. Récapitulatif et paiement

### 💳 Paiement
- ✅ Intégration Stripe complète
- ✅ Payment Intents sécurisés
- ✅ Gestion des webhooks
- ✅ Confirmation de commande

### 👤 Espace Client
- ✅ Profil utilisateur (lecture/édition)
- ✅ Historique des commandes
- ✅ Détail de chaque commande
- ✅ Gestion des adresses (CRUD complet)
- ✅ Favoris
- ✅ Paramètres

### 📦 Commandes
- ✅ Création automatique dans Sellsy (devis → commande → facture)
- ✅ Synchronisation depuis Sellsy
- ✅ Suivi des statuts
- ✅ Numéros de suivi

## 🔌 Intégration Backend

### Configuration API

L'application communique avec le backend via l'API REST sur `http://localhost:8080` (configurable via `NEXT_PUBLIC_API_URL`).

### Endpoints utilisés

Tous les endpoints sont documentés dans `API_DOCUMENTATION.md`. Voici les principaux :

- **Authentification** : `/api/v1/auth/*`
- **Produits** : `/api/v1/products/*`
- **Panier** : `/api/v1/cart/*`
- **Commandes** : `/api/v1/orders/*`
- **Utilisateurs** : `/api/v1/users/*`

### Authentification

Le token JWT est automatiquement inclus dans les headers de toutes les requêtes authentifiées :
```
Authorization: Bearer <token>
```

## 📝 Scripts disponibles

```bash
npm run dev      # Démarre le serveur de développement
npm run build    # Compile l'application pour la production
npm run start    # Démarre le serveur de production
npm run lint     # Lance le linter ESLint
```

## 🚀 Déploiement

### Vercel (recommandé)

Le moyen le plus simple de déployer votre application Next.js est d'utiliser [Vercel](https://vercel.com/new) :

1. Connectez votre repository GitHub
2. Vercel détectera automatiquement Next.js
3. Configurez les variables d'environnement :
   - `NEXT_PUBLIC_API_URL` : URL de votre API backend
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` : Clé publique Stripe
4. Cliquez sur "Deploy"

### Autres plateformes

Consultez la [documentation de déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying) pour plus de détails.

## 📸 Images

Les images des produits proviennent de [Unsplash](https://unsplash.com/), une plateforme d'images libres de droits. Les images sont chargées dynamiquement depuis Unsplash.

## 📚 Documentation

- **API_DOCUMENTATION.md** : Documentation complète de tous les endpoints API
- **IMPLEMENTATION.md** : Détails d'implémentation et checklist backend

## 🤝 Contribution

**Auteur :** Perrine Honoré  
**Date de création :** 29 décembre 2025

Ce projet est privé et personnel. Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue.

## 📄 Licence

Tous droits réservés © 2025 TradeFood - Perrine Honoré

---

**Découvrez les saveurs du monde avec TradeFood.** 🌍✨
