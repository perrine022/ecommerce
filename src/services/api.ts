/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Service API pour communiquer avec le backend TradeFood
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ecommerce-back-kmqe.onrender.com";

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

  return response.json();
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

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<{ message: string }>("/api/v1/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Utilise /me pour récupérer l'utilisateur actuel (plus direct)
  getCurrentUser: () => request<any>("/api/v1/users/me"),

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
  updateProfile: (data: { firstName?: string; lastName?: string }) =>
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
};

// Product endpoints
export const productApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    order?: "asc" | "desc";
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

  // POST /api/v1/orders/checkout - Initie le paiement Stripe
  checkout: () =>
    request<{ clientSecret: string; orderId: string }>(
      "/api/v1/orders/checkout",
      {
        method: "POST",
        // Pas de payload - utilise le panier actuel de l'utilisateur
      }
    ),

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

// Address endpoints (à adapter selon votre backend)
export const addressApi = {
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
