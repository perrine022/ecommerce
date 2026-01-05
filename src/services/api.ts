/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Service API pour communiquer avec le backend TradeFood
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? "https://ecommerce-back-kmqe.onrender.com" 
    : "http://localhost:8080");

class ApiError extends Error {
  constructor(message: string, public status: number, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }

  // Vérifier si la réponse a du contenu avant de parser le JSON
  const contentType = response.headers.get("content-type");
  const contentLength = response.headers.get("content-length");
  
  // Si la réponse est vide (204 No Content) ou n'a pas de contenu JSON
  if (
    response.status === 204 ||
    contentLength === "0" ||
    !contentType?.includes("application/json")
  ) {
    // Vérifier si le body est vraiment vide
    const text = await response.text();
    if (!text || text.trim() === "") {
      return {} as T;
    }
    // Essayer de parser le texte comme JSON
    try {
      return JSON.parse(text) as T;
    } catch {
      return {} as T;
    }
  }

  try {
    return await response.json();
  } catch (error) {
    // Si le parsing JSON échoue, retourner un objet vide
    console.warn(`Failed to parse JSON response from ${endpoint}:`, error);
    return {} as T;
  }
}

// Fonction de mapping pour transformer les produits du backend vers le format frontend
function mapBackendProductToFrontend(backendProduct: any): any {
  // Nettoyer la description HTML (remplacer <br /> par des sauts de ligne)
  const cleanDescription = backendProduct.description
    ? backendProduct.description.replace(/<br\s*\/?>/gi, "\n").trim()
    : "";

  return {
    id: backendProduct.id || backendProduct.sellsyId?.toString(),
    title: backendProduct.name || backendProduct.title || "Produit sans nom",
    description: cleanDescription || backendProduct.description || "",
    price: parseFloat(
      backendProduct.referencePrice ||
        backendProduct.referencePriceTaxesInc ||
        backendProduct.price ||
        "0"
    ),
    originalPrice:
      backendProduct.referencePriceTaxesInc && backendProduct.referencePrice
        ? parseFloat(backendProduct.referencePriceTaxesInc) >
          parseFloat(backendProduct.referencePrice)
          ? parseFloat(backendProduct.referencePriceTaxesInc)
          : undefined
        : undefined,
    image:
      backendProduct.imageUrl ||
      backendProduct.image ||
      "https://via.placeholder.com/400",
    images:
      backendProduct.images ||
      (backendProduct.imageUrl ? [backendProduct.imageUrl] : []),
    category:
      backendProduct.categoryId?.toString() || backendProduct.category || "1",
    inStock: !backendProduct.isArchived && !backendProduct.isDeclined,
    stock: backendProduct.stock || undefined,
    rating: backendProduct.rating || undefined,
    reviews: backendProduct.reviews || undefined,
    featured: backendProduct.featured || backendProduct.isFeatured || false,
    origin: backendProduct.origin || undefined,
    weight: backendProduct.weight || undefined,
    dimensions: backendProduct.dimensions || undefined,
    // Conserver les données originales du backend pour référence
    _backend: backendProduct,
  };
}

// Auth endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    request<{ token: string }>("/api/v1/auth/authenticate", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    type?: "INDIVIDUAL" | "COMPANY";
    companyName?: string;
    phone?: string;
    siret?: string;
    vatNumber?: string;
    rcs?: string;
    legalForm?: string;
  }) =>
    request<{ token: string }>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resetPassword: (email: string) =>
    request<{ message: string }>(
      `/api/v1/auth/forget-password?email=${encodeURIComponent(email)}`,
      {
        method: "POST",
      }
    ),

  resetPasswordWithToken: (token: string, newPassword: string) =>
    request<{ message: string }>(
      `/api/v1/auth/reset-password?token=${encodeURIComponent(
        token
      )}&newPassword=${encodeURIComponent(newPassword)}`,
      {
        method: "POST",
      }
    ),

  changePassword: (oldPassword: string, newPassword: string) =>
    request<{ message: string }>(
      `/api/v1/auth/change-password?oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`,
      {
        method: "POST",
      }
    ),

  // Utilise /me pour récupérer l'utilisateur actuel (plus direct)
  getCurrentUser: () => request<any>("/api/v1/users/me"),

  validateSirene: (sirene: string) =>
    request<{ name: string; address: string; siret: string }>(
      `/api/sirene/validate?sirene=${encodeURIComponent(sirene)}`
    ),

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
    }
  },
};

// User endpoints
export const userApi = {
  // GET /api/v1/users/me - Récupère l'utilisateur actuel
  getMe: () => request<any>("/api/v1/users/me"),

  // GET /api/v1/users/profile - Récupère le profil détaillé
  getProfile: () => request<any>("/api/v1/users/profile"),

  // PUT /api/v1/users/profile - Met à jour le profil
  // Accepte: firstName, lastName, phoneNumber, mobileNumber, civility, website
  updateProfile: (data: { 
    firstName?: string; 
    lastName?: string;
    phoneNumber?: string;
    mobileNumber?: string;
    civility?: string;
    website?: string;
  }) =>
    request<any>("/api/v1/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // POST /api/v1/users/sync - (Admin) Sync clients Sellsy
  syncFromSellsy: () =>
    request<{ message: string }>("/api/v1/users/sync", {
      method: "POST",
    }),

  // Endpoints admin (non documentés mais potentiellement utiles)
  getAll: () => request<{ users: any[] }>("/api/v1/users"),

  delete: (id: string) =>
    request<{ message: string }>(`/api/v1/users/${id}`, {
      method: "DELETE",
    }),

  // GET /api/v1/users/{id} - Récupère un utilisateur par son ID
  getById: (id: string) => request<any>(`/api/v1/users/${id}`),

  // GET /api/v1/users/commercial/clients - Récupère tous les clients d'un commercial
  // Retourne directement un tableau de clients
  getCommercialClients: () => request<any[]>("/api/v1/users/commercial/clients"),

  // GET /api/v1/users/{clientId}/orders - Récupère les commandes d'un client spécifique
  getClientOrders: (clientId: string) => request<{ orders: any[] }>(`/api/v1/users/${clientId}/orders`),
};

// Product endpoints
export const productApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    categoryId?: number; // ID Sellsy de la catégorie
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    order?: "asc" | "desc";
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Utiliser categoryId au lieu de category pour le filtrage backend
          if (key === 'categoryId') {
            queryParams.append('categoryId', String(value));
          } else if (key !== 'category') { // Ignorer le paramètre category (slug) pour le backend
            queryParams.append(key, String(value));
          }
        }
      });
    }
    const query = queryParams.toString();
    const response = await request<any>(
      `/api/v1/products${query ? `?${query}` : ""}`
    );

    // Extraire le tableau de produits
    let productsArray: any[] = [];
    if (Array.isArray(response)) {
      productsArray = response;
    } else if (response.products && Array.isArray(response.products)) {
      productsArray = response.products;
    } else if (response.data && Array.isArray(response.data)) {
      productsArray = response.data;
    }

    // Mapper chaque produit du backend vers le format frontend
    const mappedProducts = productsArray.map(mapBackendProductToFrontend);

    return {
      products: mappedProducts,
      total: response.total || productsArray.length,
      page: response.page || 1,
      limit: response.limit || productsArray.length,
      totalPages: response.totalPages || 1,
    };
  },

  getById: async (id: string) => {
    const response = await request<any>(`/api/v1/products/${id}`);
    // Gérer le cas où la réponse est directement un produit ou dans un objet
    const product = response.product || response.data || response;
    return {
      product: mapBackendProductToFrontend(product),
    };
  },

  create: (data: any) =>
    request<{ product: any }>("/api/v1/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    request<{ product: any }>(`/api/v1/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/api/v1/products/${id}`, {
      method: "DELETE",
    }),

  syncFromSellsy: () =>
    request<{ message: string; count: number }>("/api/v1/products/sync", {
      method: "POST",
    }),
};

// Category endpoints
export const categoryApi = {
  getAll: () => request<any[]>("/api/v1/categories"),

  getById: (id: string) => request<any>(`/api/v1/categories/${id}`),
};

// Cart endpoints
export const cartApi = {
  // GET /api/v1/cart - Récupère le panier actuel
  // Retourne: { id, items: [{ product, quantity }], totalHT, totalTVA, totalTTC }
  getCart: () =>
    request<{
      id: string;
      items: Array<{ product: any; quantity: number }>;
      totalHT: number;
      totalTVA: number;
      totalTTC: number;
    }>("/api/v1/cart"),

  // POST /api/v1/cart/add - Ajoute un produit
  addItem: (productId: string, quantity: number) =>
    request<{ message: string }>(
      `/api/v1/cart/add?productId=${productId}&quantity=${quantity}`,
      {
        method: "POST",
      }
    ),

  // DELETE /api/v1/cart/remove - Retire un produit
  removeItem: (productId: string) =>
    request<{ message: string }>(`/api/v1/cart/remove?productId=${productId}`, {
      method: "DELETE",
    }),

  // POST /api/v1/cart/clear - Vide le panier (corrigé: POST au lieu de DELETE)
  clearCart: () =>
    request<{ message: string }>("/api/v1/cart/clear", {
      method: "POST",
    }),

  // Note: updateQuantity n'est pas dans la doc mais peut être utile
  // On le garde pour l'instant mais il faudra vérifier s'il existe côté backend
  updateQuantity: (productId: string, quantity: number) =>
    request<{ message: string }>(
      `/api/v1/cart/update?productId=${productId}&quantity=${quantity}`,
      {
        method: "PUT",
      }
    ),
};

// Order endpoints
export const orderApi = {
  // GET /api/v1/orders - Historique des commandes
  // Retourne directement un tableau [Order, ...]
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    const response = await request<any>(
      `/api/v1/orders${query ? `?${query}` : ""}`
    );

    // Gérer le cas où la réponse est directement un tableau
    if (Array.isArray(response)) {
      return { orders: response };
    }

    // Sinon, retourner avec la structure attendue
    return {
      orders: response.orders || response.data || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 20,
      totalPages: response.totalPages || 1,
    };
  },

  // GET /api/v1/orders/{id} - Détail d'une commande
  getById: async (id: string) => {
    const response = await request<any>(`/api/v1/orders/${id}`);
    // Gérer le cas où la réponse est directement un Order ou dans un objet
    return {
      order: response.order || response.data || response,
    };
  },

  // POST /api/v1/orders - Finalise une commande et l'envoie à Sellsy
  // Crée une commande avec les items, adresses et optionnellement un clientId pour les commerciaux
  createOrder: (data: { 
    invoicingAddressId: number | string; 
    deliveryAddressId: number | string;
    clientId?: string; // ID du client pour les commerciaux (UUID)
    items: Array<{
      productId: string; // UUID du produit
      quantity: number; // Quantité (Integer)
    }>;
  }) =>
    request<{
      id: string;
      status: string;
      totalAmount: number;
      sellsyOrderId?: string;
      number?: string;
      validationCode?: string; // Code de validation à 4 chiffres
      invoicingAddressId: number | string;
      deliveryAddressId: number | string;
      [key: string]: any;
    }>("/api/v1/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // POST /api/v1/orders/checkout - Initie le paiement Stripe (ancien flux, conservé pour compatibilité)
  checkout: () =>
    request<{ clientSecret: string; orderId: string }>(
      "/api/v1/orders/checkout",
      {
        method: "POST",
        // Pas de payload - utilise le panier actuel de l'utilisateur
      }
    ),

  // PUT /api/v1/orders/{orderId}/addresses - Définit les adresses de facturation et de livraison (ancien flux, conservé pour compatibilité)
  setAddresses: (orderId: string, data: { invoicingAddressId: number | string; deliveryAddressId: number | string }) =>
    request<{ message: string }>(`/api/v1/orders/${orderId}/addresses`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // GET /api/v1/orders/user/{userId} - Récupère toutes les commandes d'un utilisateur spécifique
  getUserOrders: async (userId: string) => {
    const response = await request<any>(`/api/v1/orders/user/${userId}`);
    // L'API retourne directement un tableau de commandes
    if (Array.isArray(response)) {
      return response;
    }
    // Sinon, retourner le tableau depuis la structure de réponse
    return response.orders || response.data || [];
  },

  // Endpoints non documentés mais potentiellement utiles
  syncFromSellsy: () =>
    request<{ message: string; count: number }>("/api/v1/orders/sync", {
      method: "POST",
    }),

  updateStatus: (id: string, status: string) =>
    request<{ order: any }>(`/api/v1/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// Address endpoints pour les entreprises (Sellsy)
export const addressApi = {
  // Anciens endpoints (pour compatibilité)
  getAll: () => request<{ addresses: any[] }>("/api/v1/addresses"),

  getById: (id: string) => request<{ address: any }>(`/api/v1/addresses/${id}`),

  create: (data: any) =>
    request<{ address: any }>("/api/v1/addresses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    request<{ address: any }>(`/api/v1/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/api/v1/addresses/${id}`, {
      method: "DELETE",
    }),

  setDefault: (id: string, type: "billing" | "shipping") =>
    request<{ address: any }>(`/api/v1/addresses/${id}/default`, {
      method: "PUT",
      body: JSON.stringify({ type }),
    }),

  // Nouveaux endpoints pour les adresses d'entreprise
  // Créer une adresse d'entreprise
  // Endpoint: POST /api/v1/addresses/company/{companyId}
  // companyId: Long (nombre) - L'identifiant Sellsy de l'entreprise (ex: 6657)
  // Le backend initialise automatiquement les champs texte non fournis à "" pour éviter les erreurs Sellsy
  createCompanyAddress: (companyId: string | number, data: {
    name: string;
    address_line_1: string;
    address_line_2?: string;
    address_line_3?: string;
    address_line_4?: string;
    postal_code: string;
    city: string;
    country_code: string;
    is_invoicing_address: boolean;
    is_delivery_address: boolean;
    geocode?: { lat: number; lng: number };
  }) => {
    // S'assurer que tous les champs texte optionnels sont initialisés à "" s'ils ne sont pas fournis
    const payload = {
      name: data.name,
      address_line_1: data.address_line_1,
      address_line_2: data.address_line_2 || "",
      address_line_3: data.address_line_3 || "",
      address_line_4: data.address_line_4 || "",
      postal_code: data.postal_code,
      city: data.city,
      country_code: data.country_code,
      is_invoicing_address: data.is_invoicing_address,
      is_delivery_address: data.is_delivery_address,
      ...(data.geocode && { geocode: data.geocode }),
    };
    
    // Convertir companyId en string pour l'URL (le backend accepte string ou number dans l'URL)
    const companyIdStr = String(companyId);
    
    return request<any>(`/api/v1/addresses/company/${companyIdStr}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Récupérer les adresses d'une entreprise
  // companyId: Long (nombre) - L'identifiant Sellsy de l'entreprise
  getCompanyAddresses: (companyId: string | number, limit: number = 25, offset: number = 0) =>
    request<{ data: any[]; total?: number }>(
      `/api/v1/addresses/company/${String(companyId)}?limit=${limit}&offset=${offset}`
    ),

  // Mettre à jour une adresse d'entreprise
  // Endpoint: PUT /api/v1/addresses/company/{companyId}/{addressId}
  // companyId: Long (nombre) - L'identifiant Sellsy de l'entreprise
  // addressId: Long (nombre) - L'identifiant Sellsy de l'adresse
  updateCompanyAddress: (companyId: string | number, addressId: string | number, data: {
    name: string;
    address_line_1: string;
    address_line_2?: string;
    address_line_3?: string;
    address_line_4?: string;
    postal_code: string;
    city: string;
    country_code: string;
    is_invoicing_address: boolean;
    is_delivery_address: boolean;
    geocode?: { lat: number; lng: number };
  }) => {
    // S'assurer que tous les champs texte optionnels sont initialisés à "" comme requis par Sellsy
    const payload = {
      name: data.name,
      address_line_1: data.address_line_1,
      address_line_2: data.address_line_2 || "",
      address_line_3: data.address_line_3 || "",
      address_line_4: data.address_line_4 || "",
      postal_code: data.postal_code,
      city: data.city,
      country_code: data.country_code,
      is_invoicing_address: data.is_invoicing_address,
      is_delivery_address: data.is_delivery_address,
      ...(data.geocode && { geocode: data.geocode }),
    };
    
    return request<any>(`/api/v1/addresses/company/${String(companyId)}/${String(addressId)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // Supprimer une adresse d'entreprise
  // Endpoint: DELETE /api/v1/addresses/company/{companyId}/{addressId}
  // companyId: Long (nombre) - L'identifiant Sellsy de l'entreprise
  // addressId: Long (nombre) - L'identifiant Sellsy de l'adresse
  deleteCompanyAddress: (companyId: string | number, addressId: string | number) =>
    request<{ message: string }>(`/api/v1/addresses/company/${String(companyId)}/${String(addressId)}`, {
      method: "DELETE",
    }),

  // ===== NOUVEAUX ENDPOINTS BASÉS SUR USER ID =====
  // Récupérer les adresses de l'utilisateur connecté ou d'un utilisateur spécifique
  // Endpoint: GET /api/v1/users/addresses ou GET /api/v1/users/{userId}/addresses
  getUserAddresses: (userId?: string) =>
    userId 
      ? request<any[]>(`/api/v1/users/${userId}/addresses`)
      : request<any[]>("/api/v1/users/addresses"),

  // Créer une adresse pour l'utilisateur connecté
  // Endpoint: POST /api/v1/users/addresses
  createUserAddress: (data: {
    name: string;
    address_line_1: string;
    address_line_2?: string;
    address_line_3?: string;
    address_line_4?: string;
    postal_code: string;
    city: string;
    country_code: string;
    is_invoicing_address?: boolean;
    is_delivery_address?: boolean;
    geocode?: { lat: number; lng: number };
  }) => {
    const payload = {
      name: data.name,
      address_line_1: data.address_line_1,
      address_line_2: data.address_line_2 || "",
      address_line_3: data.address_line_3 || "",
      address_line_4: data.address_line_4 || "",
      postal_code: data.postal_code,
      city: data.city,
      country_code: data.country_code,
      ...(data.is_invoicing_address !== undefined && { is_invoicing_address: data.is_invoicing_address }),
      ...(data.is_delivery_address !== undefined && { is_delivery_address: data.is_delivery_address }),
      ...(data.geocode && { geocode: data.geocode }),
    };
    
    return request<any>("/api/v1/users/addresses", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Mettre à jour une adresse de l'utilisateur connecté
  // Endpoint: PUT /api/v1/users/addresses/{addressId}
  updateUserAddress: (addressId: string | number, data: {
    name: string;
    address_line_1: string;
    address_line_2?: string;
    address_line_3?: string;
    address_line_4?: string;
    postal_code: string;
    city: string;
    country_code: string;
    is_invoicing_address?: boolean;
    is_delivery_address?: boolean;
    geocode?: { lat: number; lng: number };
  }) => {
    const payload = {
      name: data.name,
      address_line_1: data.address_line_1,
      address_line_2: data.address_line_2 || "",
      address_line_3: data.address_line_3 || "",
      address_line_4: data.address_line_4 || "",
      postal_code: data.postal_code,
      city: data.city,
      country_code: data.country_code,
      ...(data.is_invoicing_address !== undefined && { is_invoicing_address: data.is_invoicing_address }),
      ...(data.is_delivery_address !== undefined && { is_delivery_address: data.is_delivery_address }),
      ...(data.geocode && { geocode: data.geocode }),
    };
    
    return request<any>(`/api/v1/users/addresses/${String(addressId)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // Supprimer une adresse de l'utilisateur connecté
  // Endpoint: DELETE /api/v1/users/addresses/{addressId}
  deleteUserAddress: (addressId: string | number) =>
    request<{ message: string }>(`/api/v1/users/addresses/${String(addressId)}`, {
      method: "DELETE",
    }),
};

// Shipping endpoints (à adapter selon votre backend)
export const shippingApi = {
  getMethods: () => request<{ methods: any[] }>("/api/v1/shipping/methods"),

  calculate: (data: {
    addressId: string;
    items: { productId: string; quantity: number }[];
  }) =>
    request<{ methods: any[] }>("/api/v1/shipping/calculate", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Payment endpoints (Stripe)
export const paymentApi = {
  // POST /api/v1/payment/payment-sheet - Crée un Payment Sheet Stripe
  createPaymentSheet: (data: {
    amount: number; // Montant en centimes
    currency: string; // "eur"
    userId?: string; // Optionnel si déjà authentifié
    description: string; // Description de la commande
  }) =>
    request<{
      paymentIntent: string; // Secret du PaymentIntent
      ephemeralKey: string; // Clé temporaire pour le client
      customer: string; // ID du client Stripe
      publishableKey: string; // Clé publique Stripe
    }>("/api/v1/payment/payment-sheet", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // GET /api/v1/payment/public-key - Récupère la clé publique Stripe
  getPublicKey: () =>
    request<{ publishableKey: string }>("/api/v1/payment/public-key"),

  // GET /api/v1/payment/verify-status/{paymentIntentId} - Vérifie le statut du paiement
  verifyStatus: (paymentIntentId: string) =>
    request<{ status: string; paymentIntent: any }>(`/api/v1/payment/verify-status/${paymentIntentId}`),

  confirmPayment: (paymentIntentId: string) =>
    request<{ order: any }>("/api/v1/payments/confirm", {
      method: "POST",
      body: JSON.stringify({ paymentIntentId }),
    }),

  getPaymentStatus: (paymentIntentId: string) =>
    request<{ status: string }>(`/api/v1/payments/${paymentIntentId}/status`),
};

// Professional DTO type
export interface ProfessionalDTO {
  id?: string;
  type?: "CLIENT" | "ENTERPRISE" | "AGENCY" | "PROFESSIONAL";
  firstName?: string;
  lastName?: string;
  email?: string;
  photo?: {
    url?: string;
  };
  reviewUser?: {
    averageRating?: number;
  };
  address?: {
    city?: string;
  };
  category?: string | any;
  createdAt?: string;
}

// Favorites endpoints
export const favoritesAPI = {
  getFavorites: (userId: string) =>
    request<ProfessionalDTO[]>(`/api/v1/users/${userId}/favorites`),

  addFavorite: (
    userId: string,
    favoriteId: string,
    type: string,
    isClient: boolean
  ) =>
    request<{ success: boolean }>(`/api/v1/users/${userId}/favorites`, {
      method: "POST",
      body: JSON.stringify({
        favoriteId,
        type,
        isClient,
      }),
    }),

  removeFavorite: (
    userId: string,
    favoriteId: string,
    type: string,
    isClient: boolean
  ) =>
    request<{ success: boolean }>(
      `/api/v1/users/${userId}/favorites/${favoriteId}`,
      {
        method: "DELETE",
        body: JSON.stringify({
          type,
          isClient,
        }),
      }
    ),
};

export { ApiError };
