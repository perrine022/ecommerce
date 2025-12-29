# Documentation API - TradeFood

**Auteur :** Perrine Honoré  
**Date :** 29 décembre 2025

Ce document liste toutes les API à appeler pour le backend (localhost:8080).

## Configuration

L'URL de base de l'API est configurée dans `src/services/api.ts` :
- Par défaut : `http://localhost:8080`
- Variable d'environnement : `NEXT_PUBLIC_API_URL`

## Authentification

Tous les endpoints protégés nécessitent un token JWT dans le header :
```
Authorization: Bearer <token>
```

Le token est stocké dans `localStorage` sous la clé `auth_token`.

---

## 🔑 Authentification (`/api/v1/auth`)

### POST `/api/v1/auth/register`
Inscription d'un nouvel utilisateur. Crée automatiquement le client dans Sellsy.

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "votre_mot_de_passe"
}
```

**Response:**
```json
{
  "token": "jwt_token_string"
}
```

### POST `/api/v1/auth/authenticate`
Connexion d'un utilisateur.

**Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "votre_mot_de_passe"
}
```

**Response:**
```json
{
  "token": "jwt_token_string"
}
```

### POST `/api/v1/auth/forget-password`
Demande de réinitialisation de mot de passe.

**Query Parameter:**
- `email` (string) - Ex: `?email=test@test.com`

**Response:**
```json
{
  "message": "Email envoyé"
}
```

### POST `/api/v1/auth/reset-password`
Réinitialisation du mot de passe avec token.

**Query Parameters:**
- `token` (string) - Token de réinitialisation
- `newPassword` (string) - Nouveau mot de passe

**Response:**
```json
{
  "message": "Mot de passe réinitialisé"
}
```

---

## 📦 Produits (`/api/v1/products`)

### GET `/api/v1/products`
Récupère tous les produits avec pagination et filtres optionnels.

**Query Parameters (optionnels):**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `search` (string) - Recherche textuelle
- `category` (string) - Filtre par catégorie
- `minPrice` (number) - Prix minimum
- `maxPrice` (number) - Prix maximum
- `sortBy` (string) - `name`, `price`, `rating`, `createdAt`
- `order` (string) - `asc` ou `desc`

**Response:**
```json
{
  "products": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "price": 0,
      "originalPrice": 0,
      "image": "string",
      "images": ["string"],
      "category": "string",
      "inStock": true,
      "stock": 0,
      "rating": 0,
      "reviews": 0,
      "featured": false,
      "origin": "string",
      "weight": "string",
      "sellsyProductId": "string"
    }
  ],
  "total": 0,
  "page": 1,
  "limit": 20,
  "totalPages": 0
}
```

### GET `/api/v1/products/{id}`
Récupère un produit par ID.

**Response:**
```json
{
  "product": { ... }
}
```

### POST `/api/v1/products`
Crée un produit (Admin uniquement).

**Headers:** `Authorization: Bearer <token>`

**Body:** Objet Product complet

**Response:**
```json
{
  "product": { ... }
}
```

### PUT `/api/v1/products/{id}`
Met à jour un produit (Admin uniquement).

**Headers:** `Authorization: Bearer <token>`

**Body:** Objet Product complet

**Response:**
```json
{
  "product": { ... }
}
```

### DELETE `/api/v1/products/{id}`
Supprime un produit (Admin uniquement).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Produit supprimé"
}
```

### POST `/api/v1/products/sync`
Synchronisation manuelle des produits depuis Sellsy (Admin uniquement).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Synchronisation réussie",
  "count": 50
}
```

---

## 🛒 Panier (`/api/v1/cart`)

### GET `/api/v1/cart`
Récupère le panier de l'utilisateur connecté.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "items": [
    {
      "product": { ... },
      "quantity": 0
    }
  ],
  "total": 0
}
```

### POST `/api/v1/cart/add`
Ajoute un produit au panier.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `productId` (Long) - ID du produit
- `quantity` (Integer) - Quantité

**Response:**
```json
{
  "message": "Produit ajouté au panier"
}
```

### PUT `/api/v1/cart/update`
Met à jour la quantité d'un produit dans le panier.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `productId` (Long) - ID du produit
- `quantity` (Integer) - Nouvelle quantité

**Response:**
```json
{
  "message": "Quantité mise à jour"
}
```

### DELETE `/api/v1/cart/remove`
Supprime un produit du panier.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `productId` (Long) - ID du produit

**Response:**
```json
{
  "message": "Produit supprimé du panier"
}
```

### DELETE `/api/v1/cart/clear`
Vide complètement le panier.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Panier vidé"
}
```

---

## 🧾 Commandes (`/api/v1/orders`)

### GET `/api/v1/orders`
Récupère l'historique des commandes.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters (optionnels):**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string) - Filtre par statut

**Note :** Retourne les commandes de l'utilisateur ou toutes les commandes si Admin.

**Response:**
```json
{
  "orders": [
    {
      "id": "string",
      "orderNumber": "string",
      "userId": "string",
      "status": "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded",
      "items": [
        {
          "id": "string",
          "orderId": "string",
          "productId": "string",
          "productName": "string",
          "productImage": "string",
          "quantity": 0,
          "unitPrice": 0,
          "totalPrice": 0
        }
      ],
      "subtotal": 0,
      "shippingCost": 0,
      "tax": 0,
      "total": 0,
      "billingAddress": { ... },
      "shippingAddress": { ... },
      "paymentMethod": "string",
      "paymentStatus": "pending" | "paid" | "failed" | "refunded",
      "stripePaymentIntentId": "string",
      "sellsyQuoteId": "string",
      "sellsyOrderId": "string",
      "sellsyInvoiceId": "string",
      "trackingNumber": "string",
      "notes": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "total": 0,
  "page": 1,
  "limit": 20,
  "totalPages": 0
}
```

### GET `/api/v1/orders/{id}`
Récupère le détail d'une commande.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "order": { ... }
}
```

### POST `/api/v1/orders/checkout`
Initie le paiement et crée la commande. Crée automatiquement un devis/commande/facture dans Sellsy.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "items": [
    {
      "productId": "string",
      "quantity": 0
    }
  ],
  "billingAddressId": "string",
  "shippingAddressId": "string",
  "shippingMethod": "string"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "orderId": "uuid-string"
}
```

---

## 👤 Utilisateurs (`/api/v1/users`)

### GET `/api/v1/users/profile`
Récupère le profil de l'utilisateur connecté.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "phone": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### PUT `/api/v1/users/profile`
Met à jour le profil de l'utilisateur connecté.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "0612345678"
}
```

**Response:**
```json
{
  "user": { ... }
}
```

### GET `/api/v1/users`
Liste tous les utilisateurs (Admin uniquement).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "users": [ ... ]
}
```

### DELETE `/api/v1/users/{id}`
Supprime un utilisateur (Admin uniquement).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Utilisateur supprimé"
}
```

---

## ⚡ Webhooks (Stripe)

### POST `/api/v1/webhooks/stripe`
Réception des événements Stripe.

**Header requis:**
```
Stripe-Signature: <signature>
```

**Body:** Événement Stripe (JSON)

**Événements gérés:**
- `payment_intent.succeeded` → Mettre à jour `paymentStatus` à `paid`
- `payment_intent.payment_failed` → Mettre à jour `paymentStatus` à `failed`
- `charge.refunded` → Mettre à jour `paymentStatus` à `refunded` et `status` à `refunded`

---

## 📍 Adresses

**Note :** Les endpoints d'adresses doivent être implémentés selon vos besoins. Les endpoints suivants sont utilisés dans le code :

- `GET /api/v1/addresses` - Liste des adresses
- `POST /api/v1/addresses` - Créer une adresse
- `PUT /api/v1/addresses/{id}` - Mettre à jour une adresse
- `DELETE /api/v1/addresses/{id}` - Supprimer une adresse
- `PUT /api/v1/addresses/{id}/default` - Définir comme adresse par défaut

---

## 🚚 Livraison

**Note :** Les endpoints de livraison doivent être implémentés selon vos besoins. Les endpoints suivants sont utilisés dans le code :

- `GET /api/v1/shipping/methods` - Liste des méthodes de livraison
- `POST /api/v1/shipping/calculate` - Calculer les frais de livraison

---

## 💳 Paiement

**Note :** Les endpoints de paiement suivants sont utilisés :

- `POST /api/v1/payments/confirm` - Confirmer un paiement après succès Stripe
- `GET /api/v1/payments/{paymentIntentId}/status` - Récupérer le statut d'un paiement

---

## 📝 Notes importantes

1. **Sellsy Integration** : 
   - À l'inscription (`POST /api/v1/auth/register`), créer/mettre à jour le client dans Sellsy
   - Au checkout (`POST /api/v1/orders/checkout`), créer devis → commande → facture dans Sellsy
   - Synchronisation des produits via `POST /api/v1/products/sync`

2. **Stripe** :
   - Le `clientSecret` retourné par `/api/v1/orders/checkout` est utilisé directement avec Stripe Elements
   - Gérer les webhooks pour les mises à jour de statut
   - Stocker `paymentIntentId` dans la commande

3. **Pagination** :
   - Tous les endpoints de liste supportent `page` et `limit`
   - Retourner `total`, `page`, `limit`, `totalPages`

4. **Erreurs** :
   - Retourner un status HTTP approprié (400, 401, 403, 404, 500)
   - Body d'erreur : `{ "message": "Description de l'erreur", "code": "ERROR_CODE" }`

5. **Authentification** :
   - Tous les endpoints (sauf auth) nécessitent le header `Authorization: Bearer <token>`
   - Le token est obtenu via `/api/v1/auth/register` ou `/api/v1/auth/authenticate`
