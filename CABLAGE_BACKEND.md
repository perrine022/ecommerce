# État du Câblage Backend - TradeFood

**Auteur :** Perrine Honoré  
**Date :** 29 décembre 2025

## ✅ Endpoints Câblés

### 🔐 Authentification (`/api/v1/auth`)

#### ✅ POST `/api/v1/auth/register` - Inscription
- **Fichier :** `src/app/inscription/page.tsx`
- **Service :** `src/services/api.ts` → `authApi.register()`
- **Contexte :** `src/contexts/AuthContext.tsx` → `register()`
- **Payload :** `{ firstName, lastName, email, password }`
- **Status :** ✅ Câblé et fonctionnel

#### ✅ POST `/api/v1/auth/authenticate` - Connexion
- **Fichier :** `src/app/connexion/page.tsx`
- **Service :** `src/services/api.ts` → `authApi.login()`
- **Contexte :** `src/contexts/AuthContext.tsx` → `login()`
- **Payload :** `{ email, password }`
- **Status :** ✅ Câblé et fonctionnel

#### ✅ POST `/api/v1/auth/forget-password` - Mot de passe oublié
- **Fichier :** `src/app/reset-password/page.tsx`
- **Service :** `src/services/api.ts` → `authApi.resetPassword()`
- **Query Parameter :** `email`
- **Status :** ✅ Câblé et fonctionnel

#### ✅ POST `/api/v1/auth/reset-password` - Réinitialisation
- **Service :** `src/services/api.ts` → `authApi.resetPasswordWithToken()`
- **Query Parameters :** `token`, `newPassword`
- **Status :** ✅ Câblé (à tester avec le token reçu par email)

---

### 📦 Produits (`/api/v1/products`)

#### ✅ GET `/api/v1/products` - Liste des produits
- **Fichiers :**
  - `src/components/ProductsSection.tsx` (page d'accueil)
  - `src/app/categorie/[slug]/page.tsx` (page catégorie)
- **Service :** `src/services/api.ts` → `productApi.getAll()`
- **Query Parameters :** `page`, `limit`, `search`, `category`, `minPrice`, `maxPrice`, `sortBy`, `order`
- **Status :** ✅ Câblé avec fallback sur données statiques

#### ✅ GET `/api/v1/products/{id}` - Détail produit
- **Fichier :** `src/app/produit/[id]/page.tsx`
- **Service :** `src/services/api.ts` → `productApi.getById()`
- **Status :** ✅ Câblé avec fallback sur données statiques

#### ✅ POST `/api/v1/products/sync` - Sync Sellsy
- **Service :** `src/services/api.ts` → `productApi.syncFromSellsy()`
- **Status :** ✅ Câblé (à utiliser par un admin)

---

### 🛒 Panier (`/api/v1/cart`)

#### ✅ GET `/api/v1/cart` - Récupérer le panier
- **Contexte :** `src/contexts/CartContext.tsx` → `loadCart()`
- **Service :** `src/services/api.ts` → `cartApi.getCart()`
- **Status :** ✅ Câblé et synchronisé automatiquement

#### ✅ POST `/api/v1/cart/add` - Ajouter au panier
- **Contexte :** `src/contexts/CartContext.tsx` → `addItem()`
- **Service :** `src/services/api.ts` → `cartApi.addItem()`
- **Query Parameters :** `productId`, `quantity`
- **Status :** ✅ Câblé et synchronisé avec le backend

#### ⚠️ PUT `/api/v1/cart/update` - Mettre à jour quantité
- **Contexte :** `src/contexts/CartContext.tsx` → `updateQuantity()`
- **Service :** `src/services/api.ts` → `cartApi.updateQuantity()`
- **Status :** ✅ Câblé (mais endpoint non documenté - à vérifier)

#### ⚠️ DELETE `/api/v1/cart/remove` - Supprimer du panier
- **Contexte :** `src/contexts/CartContext.tsx` → `removeItem()`
- **Service :** `src/services/api.ts` → `cartApi.removeItem()`
- **Status :** ✅ Câblé (mais endpoint non documenté - à vérifier)

#### ⚠️ DELETE `/api/v1/cart/clear` - Vider le panier
- **Contexte :** `src/contexts/CartContext.tsx` → `clearCart()`
- **Service :** `src/services/api.ts` → `cartApi.clearCart()`
- **Status :** ✅ Câblé (mais endpoint non documenté - à vérifier)

---

### 🧾 Commandes (`/api/v1/orders`)

#### ✅ GET `/api/v1/orders` - Historique des commandes
- **Fichier :** `src/app/compte/page.tsx` → `OrdersTab`
- **Service :** `src/services/api.ts` → `orderApi.getAll()`
- **Status :** ✅ Câblé et fonctionnel

#### ✅ GET `/api/v1/orders/{id}` - Détail d'une commande
- **Fichier :** `src/app/compte/commande/[id]/page.tsx`
- **Service :** `src/services/api.ts` → `orderApi.getById()`
- **Status :** ✅ Câblé et fonctionnel

#### ✅ POST `/api/v1/orders/checkout` - Passer commande
- **Fichier :** `src/app/checkout/page.tsx` → `handlePlaceOrder()`
- **Service :** `src/services/api.ts` → `orderApi.checkout()`
- **Payload :** Aucun (utilise le panier actuel)
- **Response :** `{ clientSecret, orderId }`
- **Status :** ✅ Câblé (corrigé pour ne pas envoyer de payload)

---

### 👤 Utilisateurs (`/api/v1/users`)

#### ✅ GET `/api/v1/users/profile` - Profil utilisateur
- **Fichiers :**
  - `src/contexts/AuthContext.tsx` → `getCurrentUser()`
  - `src/app/compte/page.tsx` → `ProfileTab`
- **Service :** `src/services/api.ts` → `userApi.getProfile()`
- **Status :** ✅ Câblé et fonctionnel

#### ✅ PUT `/api/v1/users/profile` - Mettre à jour le profil
- **Fichier :** `src/app/compte/page.tsx` → `ProfileTab`
- **Service :** `src/services/api.ts` → `userApi.updateProfile()`
- **Payload :** `{ firstName, lastName }` (et autres champs modifiables)
- **Status :** ✅ Câblé et fonctionnel

---

## ⚠️ Points d'Attention

### 1. Checkout et Adresses
Le checkout utilise maintenant le panier actuel (pas de payload), mais l'interface demande encore des adresses. Deux possibilités :
- **Option A :** Le backend récupère les adresses depuis le profil utilisateur
- **Option B :** Il faut simplifier l'interface checkout pour ne pas demander d'adresses

**Action requise :** Vérifier avec le backend comment les adresses sont gérées lors du checkout.

### 2. Endpoints Panier Non Documentés
Les endpoints suivants sont câblés mais non documentés dans votre liste :
- `PUT /api/v1/cart/update`
- `DELETE /api/v1/cart/remove`
- `DELETE /api/v1/cart/clear`

**Action requise :** Vérifier si ces endpoints existent ou s'il faut les implémenter.

### 3. Adresses
Les endpoints d'adresses sont câblés dans `src/services/api.ts` mais ne sont pas dans votre liste d'endpoints. Ils sont utilisés dans :
- `src/app/compte/page.tsx` → `AddressesTab`
- `src/app/checkout/page.tsx` (sélection d'adresses)

**Action requise :** Vérifier si les endpoints d'adresses existent ou s'il faut les implémenter.

### 4. Livraison
Les endpoints de livraison sont câblés mais non documentés :
- `GET /api/v1/shipping/methods`
- `POST /api/v1/shipping/calculate`

**Action requise :** Vérifier si ces endpoints existent.

---

## 📋 Checklist Finale

### ✅ Fonctionnalités Complètement Câblées
- [x] Inscription
- [x] Connexion
- [x] Mot de passe oublié
- [x] Réinitialisation mot de passe
- [x] Récupération des produits (liste + détail)
- [x] Panier (récupération + ajout)
- [x] Checkout (création commande)
- [x] Historique des commandes
- [x] Détail d'une commande
- [x] Profil utilisateur (lecture + mise à jour)

### ⚠️ Fonctionnalités Câblées mais à Vérifier
- [ ] Mise à jour quantité panier
- [ ] Suppression produit panier
- [ ] Vider le panier
- [ ] Gestion des adresses
- [ ] Calcul des frais de livraison

### ❌ Fonctionnalités Non Câblées (endpoints non documentés)
- [ ] Webhooks Stripe (`POST /api/v1/webhooks/stripe`)
- [ ] Sync contacts Sellsy (`POST /api/v1/users/sync`)
- [ ] Gestion admin produits (POST, PUT, DELETE)

---

## 🎯 Prochaines Étapes

1. **Tester le checkout** : Vérifier que le checkout fonctionne sans payload
2. **Vérifier les endpoints panier** : Confirmer l'existence des endpoints update/remove/clear
3. **Gérer les adresses** : Clarifier comment les adresses sont gérées lors du checkout
4. **Tester l'intégration complète** : Tester le flux complet depuis l'inscription jusqu'au paiement

---

## 📝 Notes Techniques

- **Token JWT** : Automatiquement inclus dans tous les headers via `request()` dans `api.ts`
- **Gestion d'erreurs** : Tous les appels API ont un fallback sur les données statiques pour les produits
- **Synchronisation panier** : Le panier se synchronise automatiquement avec le backend à chaque action
- **Authentification** : Le token est stocké dans `localStorage` sous la clé `auth_token`

