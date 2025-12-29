/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Service API pour communiquer avec le backend TradeFood
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('auth_token') 
    : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
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

// Auth endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    request<{ token: string }>('/api/v1/auth/authenticate', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) =>
    request<{ token: string }>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetPassword: (email: string) =>
    request<{ message: string }>(`/api/v1/auth/forget-password?email=${encodeURIComponent(email)}`, {
      method: 'POST',
    }),

  resetPasswordWithToken: (token: string, newPassword: string) =>
    request<{ message: string }>(`/api/v1/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`, {
      method: 'POST',
    }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<{ message: string }>('/api/v1/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCurrentUser: () =>
    request<{ user: any }>('/api/v1/users/profile'),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },
};

// User endpoints
export const userApi = {
  getProfile: () =>
    request<{ user: any }>('/api/v1/users/profile'),

  updateProfile: (data: Partial<any>) =>
    request<{ user: any }>('/api/v1/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getAll: () =>
    request<{ users: any[] }>('/api/v1/users'),

  delete: (id: string) =>
    request<{ message: string }>(`/api/v1/users/${id}`, {
      method: 'DELETE',
    }),
};

// Product endpoints
export const productApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
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
    return request<{
      products: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/api/v1/products${query ? `?${query}` : ''}`);
  },

  getById: (id: string) =>
    request<{ product: any }>(`/api/v1/products/${id}`),

  create: (data: any) =>
    request<{ product: any }>('/api/v1/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    request<{ product: any }>(`/api/v1/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/api/v1/products/${id}`, {
      method: 'DELETE',
    }),

  syncFromSellsy: () =>
    request<{ message: string; count: number }>('/api/v1/products/sync', {
      method: 'POST',
    }),
};

// Cart endpoints
export const cartApi = {
  getCart: () =>
    request<{ items: any[]; total: number }>('/api/v1/cart'),

  addItem: (productId: string, quantity: number) =>
    request<{ message: string }>(`/api/v1/cart/add?productId=${productId}&quantity=${quantity}`, {
      method: 'POST',
    }),

  removeItem: (productId: string) =>
    request<{ message: string }>(`/api/v1/cart/remove?productId=${productId}`, {
      method: 'DELETE',
    }),

  updateQuantity: (productId: string, quantity: number) =>
    request<{ message: string }>(`/api/v1/cart/update?productId=${productId}&quantity=${quantity}`, {
      method: 'PUT',
    }),

  clearCart: () =>
    request<{ message: string }>('/api/v1/cart/clear', {
      method: 'DELETE',
    }),
};

// Order endpoints
export const orderApi = {
  getAll: (params?: { page?: number; limit?: number; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return request<{
      orders: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/api/v1/orders${query ? `?${query}` : ''}`);
  },

  getById: (id: string) =>
    request<{ order: any }>(`/api/v1/orders/${id}`),

  checkout: () =>
    request<{ clientSecret: string; orderId: string }>('/api/v1/orders/checkout', {
      method: 'POST',
      // Pas de payload - utilise le panier actuel de l'utilisateur
    }),

  syncFromSellsy: () =>
    request<{ message: string; count: number }>('/api/v1/orders/sync', {
      method: 'POST',
    }),

  updateStatus: (id: string, status: string) =>
    request<{ order: any }>(`/api/v1/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Address endpoints (à adapter selon votre backend)
export const addressApi = {
  getAll: () =>
    request<{ addresses: any[] }>('/api/v1/addresses'),

  getById: (id: string) =>
    request<{ address: any }>(`/api/v1/addresses/${id}`),

  create: (data: any) =>
    request<{ address: any }>('/api/v1/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    request<{ address: any }>(`/api/v1/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/api/v1/addresses/${id}`, {
      method: 'DELETE',
    }),

  setDefault: (id: string, type: 'billing' | 'shipping') =>
    request<{ address: any }>(`/api/v1/addresses/${id}/default`, {
      method: 'PUT',
      body: JSON.stringify({ type }),
    }),
};

// Shipping endpoints (à adapter selon votre backend)
export const shippingApi = {
  getMethods: () =>
    request<{ methods: any[] }>('/api/v1/shipping/methods'),

  calculate: (data: {
    addressId: string;
    items: { productId: string; quantity: number }[];
  }) =>
    request<{ methods: any[] }>('/api/v1/shipping/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Payment endpoints (Stripe)
export const paymentApi = {
  confirmPayment: (paymentIntentId: string) =>
    request<{ order: any }>('/api/v1/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId }),
    }),

  getPaymentStatus: (paymentIntentId: string) =>
    request<{ status: string }>(`/api/v1/payments/${paymentIntentId}/status`),
};

export { ApiError };
