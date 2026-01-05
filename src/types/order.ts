export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  product?: {
    id: string;
    name: string;
    reference?: string;
  };
}

export interface Order {
  id: string;
  orderNumber?: string;
  number?: string; // Format "CMD-2026-001"
  userId: string;
  status: OrderStatus | string; // Support aussi "PAID" du backend
  items: OrderItem[];
  subtotal?: number;
  shippingCost?: number;
  tax?: number;
  total?: number;
  totalAmount?: number; // Format backend
  billingAddress?: Address;
  shippingAddress?: Address;
  invoicingAddressId?: number;
  deliveryAddressId?: number;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  sellsyQuoteId?: string;
  sellsyOrderId?: string;
  sellsyInvoiceId?: string;
  trackingNumber?: string;
  notes?: string;
  orderDate: string; // Date de création (remplace createdAt)
  updatedAt: string; // Date de dernière modification
  createdAt?: string; // Conservé pour compatibilité
  validationCode?: string; // Code de validation à 4 chiffres
  isValidated?: boolean; // Indique si la commande est validée
  // Note: Le champ "user" n'est plus retourné par l'API pour éviter les erreurs 500
  // Les informations utilisateur sont disponibles via /api/v1/users/me si nécessaire
}

export interface CreateOrderData {
  items: {
    productId: string;
    quantity: number;
  }[];
  billingAddressId: string;
  shippingAddressId: string;
  shippingMethod: string;
  paymentMethod: string;
}

import { Address } from './address';

