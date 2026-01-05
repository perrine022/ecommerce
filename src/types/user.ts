export type UserRole = "ROLE_CLIENT" | "ROLE_COMMERCIAL" | "ROLE_LIVREUR" | "ROLE_ADMIN" | "ROLE_USER";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyId?: string; // ID de l'entreprise dans Sellsy
  type?: "INDIVIDUAL" | "COMPANY";
  role?: UserRole | UserRole[]; // Rôle(s) de l'utilisateur
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string;
  companyId?: string;
  type?: "INDIVIDUAL" | "COMPANY";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  type?: "INDIVIDUAL" | "COMPANY";
  companyName?: string;
  siret?: string;
  vatNumber?: string;
  rcs?: string;
  legalForm?: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}


