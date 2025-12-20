export interface SocialMedia {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

export interface Influencer {
  id: string;
  name: string;
  specialty: string;
  city: string;
  followers: number;
  rating: number;
  reviewCount: number;
  profileImage: string;
  socialMedia: SocialMedia;
  age?: number;
}

export interface SearchFilters {
  query: string;
  city: string;
  followers: string;
  specialty: string;
  age: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SearchResponse {
  influencers: Influencer[];
  pagination: PaginationData;
}
