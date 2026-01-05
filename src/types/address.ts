// Ancien format (pour compatibilité)
export interface Address {
  id: string;
  userId: string;
  type: 'billing' | 'shipping';
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Nouveau format pour les adresses d'entreprise (Sellsy)
export interface CompanyAddress {
  id: string | number; // Peut être un nombre (ID Sellsy) ou une string (UUID)
  name: string;
  address_line_1: string;
  address_line_2?: string;
  address_line_3?: string;
  address_line_4?: string;
  postal_code: string;
  city: string;
  country_code: string;
  country?: string; // Optionnel, peut être présent dans la réponse
  is_invoicing_address: boolean;
  is_delivery_address: boolean;
  is_default_address?: boolean; // Indique si c'est l'adresse par défaut
  geocode?: {
    lat: number | null;
    lng: number | null;
  };
}

export interface CreateCompanyAddressData {
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
  is_default_address?: boolean; // Indique si c'est l'adresse par défaut
  geocode?: {
    lat: number;
    lng: number;
  };
}

export interface CreateAddressData {
  type: 'billing' | 'shipping';
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  id: string;
}



