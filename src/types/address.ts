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
  id: string;
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
  geocode?: {
    lat: number;
    lng: number;
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



