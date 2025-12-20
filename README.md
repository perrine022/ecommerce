# TradeFood - Site E-commerce de Produits Exotiques

Site e-commerce moderne pour **TradeFood**, une boutique en ligne spécialisée dans les produits exotiques du monde entier : fruits exotiques, épices, thés, chocolats, huiles et cafés rares.

## 🌟 À propos

**TradeFood** est une plateforme e-commerce dédiée à la vente de produits exotiques authentiques et de qualité. Nous proposons une sélection soignée de produits rares provenant des quatre coins du monde, garantissant fraîcheur, authenticité et traçabilité.

### Catégories de produits

- 🍍 **Fruits Exotiques** - Mangues, fruits du dragon, et autres fruits rares
- 🌶️ **Épices & Condiments** - Curry, safran, et épices du monde entier
- 🍵 **Thés & Infusions** - Thés rares et infusions exotiques
- 🍫 **Chocolats & Confiseries** - Chocolats fins et gourmandises exotiques
- 🫒 **Huiles & Vinaigres** - Huiles d'exception et vinaigres rares
- ☕ **Cafés & Boissons** - Cafés rares et boissons exotiques

## 🚀 Technologies utilisées

- **[Next.js 15](https://nextjs.org/)** - Framework React pour le développement
- **[React 19](https://react.dev/)** - Bibliothèque JavaScript pour l'interface utilisateur
- **[TypeScript](https://www.typescriptlang.org/)** - Typage statique pour JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utilitaire
- **[Lucide React](https://lucide.dev/)** - Icônes modernes et élégantes
- **[Unsplash](https://unsplash.com/)** - Images de produits libres de droits

## 📦 Installation

### Prérequis

- Node.js 18+ 
- npm, yarn, pnpm ou bun

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
├── src/
│   ├── app/
│   │   ├── globals.css     # Styles globaux et variables CSS
│   │   ├── layout.tsx       # Layout principal avec métadonnées
│   │   ├── page.tsx        # Page d'accueil principale
│   │   ├── produit/[id]/   # Pages de fiches produits
│   │   ├── categorie/[slug]/ # Pages de catégories
│   │   ├── compte/         # Espace client
│   │   └── panier/         # Page panier
│   ├── components/         # Composants React réutilisables
│   │   ├── Header.tsx      # En-tête avec navigation
│   │   ├── HeroSection.tsx # Section hero avec produit vedette
│   │   ├── ProductsSection.tsx # Section produits avec filtres
│   │   └── Footer.tsx      # Footer réutilisable
│   ├── contexts/           # Contextes React
│   │   ├── CartContext.tsx # Gestion du panier
│   │   └── Providers.tsx   # Provider pour les contextes
│   ├── lib/                # Utilitaires et données
│   │   └── products.ts     # Données des produits
│   └── types/              # Types TypeScript
│       └── product.ts      # Types pour les produits
├── package.json
└── README.md
```

## 🎨 Design & Couleurs

Le site utilise une palette de couleurs professionnelle :

- **Bleu principal** : `#172867` (bleu foncé)
- **Vert accent** : `#A0A12F` (vert olive)
- **Fond** : Blanc
- **Texte** : `#172867` avec différentes opacités

## ✨ Fonctionnalités

### Navigation
- 🏠 **Page d'accueil** avec hero section mettant en avant un produit vedette
- 🛍️ **Catalogue produits** avec filtrage par catégories
- 📦 **Fiches produits** détaillées avec galerie d'images
- 🛒 **Panier d'achat** avec gestion des quantités
- 👤 **Espace client** avec profil, commandes, favoris, adresses
- 🔍 **Navigation par catégories** dans le header avec menu déroulant
- 📱 **Design responsive** pour mobile, tablette et desktop
- ✨ **Animations** et transitions fluides

### Pages disponibles
- `/` - Page d'accueil
- `/produit/[id]` - Fiche produit individuelle
- `/categorie/[slug]` - Page de catégorie avec produits filtrés
- `/panier` - Panier d'achat
- `/compte` - Espace client
- `/societe` - Page société
- `/contact` - Page contact
- `/promotions` - Page promotions
- `/nouveautes` - Page nouveautés

## 🛍️ Fonctionnalités E-commerce

- Gestion du panier avec contexte React
- Calcul automatique des totaux
- Livraison gratuite à partir de 50€
- Système de notation et avis produits
- Produits en vedette
- Promotions et réductions
- Filtrage par catégories
- Pages de catégories dynamiques
- Header et Footer sur toutes les pages

## 🚀 Déploiement

### Vercel (recommandé)

Le moyen le plus simple de déployer votre application Next.js est d'utiliser [Vercel](https://vercel.com/new) :

1. Connectez votre repository GitHub
2. Vercel détectera automatiquement Next.js
3. Cliquez sur "Deploy"

### Autres plateformes

Consultez la [documentation de déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying) pour plus de détails.

## 📝 Scripts disponibles

```bash
npm run dev      # Démarre le serveur de développement
npm run build    # Compile l'application pour la production
npm run start    # Démarre le serveur de production
npm run lint     # Lance le linter ESLint
```

## 📸 Images

Les images des produits proviennent de [Unsplash](https://unsplash.com/), une plateforme d'images libres de droits. Les images sont chargées dynamiquement depuis Unsplash. La configuration Next.js permet l'utilisation d'images externes depuis Unsplash.

## 🎯 Fonctionnalités principales

- **Hero Section** : Mise en avant d'un produit vedette avec image promotionnelle
- **Catalogue** : Affichage de tous les produits avec filtrage par catégories
- **Fiche produit** : Page détaillée avec galerie d'images, informations complètes et ajout au panier
- **Panier** : Gestion complète du panier avec modification des quantités
- **Espace client** : Profil, commandes, favoris, adresses et paramètres
- **Navigation** : Menu avec catégories, société, contact, promotions et nouveautés

## 🤝 Contribution

Ce projet est privé et personnel. Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue.

## 📄 Licence

Tous droits réservés © 2025 TradeFood

---

**Découvrez les saveurs du monde avec TradeFood.** 🌍✨
