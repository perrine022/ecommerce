import axios from "axios";
import { Influencer, SearchFilters, SearchResponse } from "@/types/influencer";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://platform-ihjb.onrender.com/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token aux requêtes si disponible
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

console.log("🔧 [API CONFIG] Configuration de l'API:", {
  baseURL: api.defaults.baseURL,
  timeout: api.defaults.timeout,
  env:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://platform-ihjb.onrender.com (default)",
});

// Mock data for development
const mockInfluencers: Influencer[] = [
  {
    id: "1",
    name: "Emma Leroy",
    specialty: "Food & Restaurant",
    city: "Bordeaux",
    followers: 78000,
    rating: 5,
    reviewCount: 24,
    profileImage:
      "https://api.builder.io/api/v1/image/assets/TEMP/d7f59ccb92ae835b7a3d41f20c52b96a03593370?width=128",
    socialMedia: {
      instagram: "@emmaleroy",
      tiktok: "@emmaleroy",
      youtube: "@emmaleroy",
    },
  },
  {
    id: "2",
    name: "Lucas Moreau",
    specialty: "Travel & Lifestyle",
    city: "Marseille",
    followers: 145000,
    rating: 5,
    reviewCount: 18,
    profileImage:
      "https://api.builder.io/api/v1/image/assets/TEMP/acf6a129b7ab195ebfda5d704d21c9002252ff62?width=128",
    socialMedia: {
      instagram: "@lucasmoreau",
      tiktok: "@lucasmoreau",
      youtube: "@lucasmoreau",
    },
  },
  {
    id: "3",
    name: "Camille Petit",
    specialty: "Fashion & Beauty",
    city: "Lille",
    followers: 92000,
    rating: 4,
    reviewCount: 13,
    profileImage:
      "https://api.builder.io/api/v1/image/assets/TEMP/6d55aeaf8124922ca1e34d1e4bc7d3a2e9a47387?width=128",
    socialMedia: {
      instagram: "@camillepetit",
      tiktok: "@camillepetit",
      youtube: "@camillepetit",
    },
  },
  {
    id: "4",
    name: "Marie Dubois",
    specialty: "Food & Lifestyle",
    city: "Paris",
    followers: 85000,
    rating: 5,
    reviewCount: 47,
    profileImage:
      "https://api.builder.io/api/v1/image/assets/TEMP/2dee89b6647a921637c99b9d33d3334deac9f07f?width=160",
    socialMedia: {
      instagram: "@mariedubois",
      tiktok: "@mariedubois",
      youtube: "@mariedubois",
    },
  },
  {
    id: "5",
    name: "Thomas Martin",
    specialty: "Travel & Adventure",
    city: "Lyon",
    followers: 120000,
    rating: 5,
    reviewCount: 32,
    profileImage:
      "https://api.builder.io/api/v1/image/assets/TEMP/8ca44b64e1d363bc0d9d0b99cab04aeca04aafd7?width=160",
    socialMedia: {
      instagram: "@thomasmartin",
      tiktok: "@thomasmartin",
      youtube: "@thomasmartin",
    },
  },
  {
    id: "6",
    name: "Sophie Bernard",
    specialty: "Fashion & Beauty",
    city: "Nice",
    followers: 95000,
    rating: 5,
    reviewCount: 63,
    profileImage:
      "https://api.builder.io/api/v1/image/assets/TEMP/c365e4714cdf7c4fe0ad541399e838367a705d83?width=160",
    socialMedia: {
      instagram: "@sophiebernard",
      tiktok: "@sophiebernard",
      youtube: "@sophiebernard",
    },
  },
  {
    id: "7",
    name: "Alex Rousseau",
    specialty: "Tech & Gaming",
    city: "Toulouse",
    followers: 150000,
    rating: 5,
    reviewCount: 28,
    profileImage:
      "https://api.builder.io/api/v1/image/assets/TEMP/bf514e5cb19e8116cb3aa658022020049849a6b7?width=160",
    socialMedia: {
      instagram: "@alexrousseau",
      tiktok: "@alexrousseau",
      youtube: "@alexrousseau",
    },
  },
];

// Mock search function
const mockSearch = (
  filters: SearchFilters,
  page: number,
  limit: number
): SearchResponse => {
  let filtered = [...mockInfluencers];

  // Filter by search query
  if (filters.query) {
    filtered = filtered.filter(
      (inf) =>
        inf.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        inf.specialty.toLowerCase().includes(filters.query.toLowerCase())
    );
  }

  // Filter by city
  if (filters.city && filters.city !== "all") {
    filtered = filtered.filter(
      (inf) => inf.city.toLowerCase() === filters.city.toLowerCase()
    );
  }

  // Filter by specialty
  if (filters.specialty && filters.specialty !== "all") {
    filtered = filtered.filter((inf) =>
      inf.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
    );
  }

  // Filter by followers
  if (filters.followers && filters.followers !== "all") {
    const ranges: { [key: string]: [number, number] } = {
      "0-50k": [0, 50000],
      "50k-100k": [50000, 100000],
      "100k-500k": [100000, 500000],
      "500k+": [500000, Infinity],
    };
    const range = ranges[filters.followers];
    if (range) {
      filtered = filtered.filter(
        (inf) => inf.followers >= range[0] && inf.followers < range[1]
      );
    }
  }

  // Calculate pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedData = filtered.slice(start, end);

  return {
    influencers: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const influencerAPI = {
  search: async (
    filters: SearchFilters,
    page = 1,
    limit = 3
  ): Promise<SearchResponse> => {
    try {
      // In production, this would be:
      // const response = await api.post('/influencers/search', { filters, page, limit });
      // return response.data;

      // For now, use mock data
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      return mockSearch(filters, page, limit);
    } catch (error) {
      console.error("Error searching influencers:", error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Influencer | null> => {
    try {
      // In production:
      // const response = await api.get(`/influencers/${id}`);
      // return response.data;

      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockInfluencers.find((inf) => inf.id === id) || null;
    } catch (error) {
      console.error("Error fetching influencer:", error);
      throw error;
    }
  },

  getFeatured: async (): Promise<Influencer[]> => {
    try {
      // In production:
      // const response = await api.get('/influencers/featured');
      // return response.data;

      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockInfluencers.slice(0, 4);
    } catch (error) {
      console.error("Error fetching featured influencers:", error);
      throw error;
    }
  },
};

// Signup API types
export type SignupType = "CLIENT" | "PROFESSIONAL" | "AGENCY" | "ENTERPRISE";

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface ClientSignupPayload {
  type: "CLIENT";
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  matchingPassword: string;
  phoneNumber?: string;
  birthCity?: string;
  birthdate?: string;
  address?: Address;
}

export interface ProfessionalSpeciality {
  specialityId: number;
  price: number;
}

export interface Pricing {
  label: string;
  price: number;
}

export interface ProfessionalCard {
  title?: string;
  description?: string;
  price?: number;
}

export interface BankInformation {
  iban: string;
  bic: string;
}

export interface ProfessionalSignupPayload {
  type: "PROFESSIONAL";
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  matchingPassword: string;
  phoneNumber?: string;
  birthCity?: string;
  birthdate?: string;
  professionalCard?: ProfessionalCard;
  bankInformations?: BankInformation[];
}

export interface AgencySignupPayload {
  type: "AGENCY";
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  matchingPassword: string;
  agencyName: string;
  website?: string;
  vatNumber?: string;
}

export interface EnterpriseSignupPayload {
  type: "ENTERPRISE";
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  matchingPassword: string;
  companyName: string;
  siretNumber?: string;
  vatNumber?: string;
  contactPerson?: string;
}

export type SignupPayload =
  | ClientSignupPayload
  | ProfessionalSignupPayload
  | AgencySignupPayload
  | EnterpriseSignupPayload;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  type?: string;
  token?: string;
  [key: string]: unknown; // Pour les autres champs du UserDTO
}

// Authentication API
export const authAPI = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
      const fullURL = `${api.defaults.baseURL}/auth/signin`;

      // Logs détaillés du payload
      console.log("🔵 [AUTH API] ========================================");
      console.log("🔵 [AUTH API] Envoi de la requête de connexion");
      console.log("🔵 [AUTH API] ========================================");
      console.log("🔵 [AUTH API] Endpoint:", "/auth/signin");
      console.log("🔵 [AUTH API] Base URL:", api.defaults.baseURL);
      console.log("🔵 [AUTH API] URL complète:", fullURL);
      console.log("🔵 [AUTH API] Méthode:", "POST");
      console.log("🔵 [AUTH API] Headers:", {
        "Content-Type": "application/json",
      });
      console.log("🔵 [AUTH API] Payload envoyé:", {
        email: payload.email,
        password: "***", // Masquer le mot de passe dans les logs
      });
      console.log(
        "🔵 [AUTH API] Payload complet (JSON):",
        JSON.stringify(
          {
            email: payload.email,
            password: "***",
          },
          null,
          2
        )
      );

      // Log du payload réel qui sera envoyé (pour débogage)
      const actualPayload = {
        email: payload.email,
        password: payload.password,
      };
      console.log(
        "🔵 [AUTH API] Payload réel qui sera envoyé au backend:",
        JSON.stringify(actualPayload, null, 2)
      );
      console.log("🔵 [AUTH API] ========================================");

      const response = await api.post("/auth/signin", payload);

      console.log("✅ [AUTH API] ========================================");
      console.log("✅ [AUTH API] Réponse reçue du backend");
      console.log("✅ [AUTH API] ========================================");
      console.log("✅ [AUTH API] Status HTTP:", response.status);
      console.log("✅ [AUTH API] Status Text:", response.statusText);
      console.log("✅ [AUTH API] Headers de réponse:", response.headers);
      console.log(
        "✅ [AUTH API] Données reçues:",
        JSON.stringify(response.data, null, 2)
      );
      console.log("✅ [AUTH API] Token présent:", !!response.data?.token);
      if (response.data?.token) {
        console.log(
          "✅ [AUTH API] Token (premiers caractères):",
          response.data.token.substring(0, 20) + "..."
        );
      }
      console.log("✅ [AUTH API] ========================================");

      // Stocker le token dans l'instance axios pour les requêtes futures
      if (response.data.token) {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        stack?: string;
        response?: {
          status?: number;
          statusText?: string;
          headers?: unknown;
          data?: { message?: string; error?: string };
        };
        request?: unknown;
        code?: string;
        config?: {
          url?: string;
          method?: string;
          baseURL?: string;
        };
      };

      // Log détaillé de l'erreur
      console.error("❌ [AUTH API] Erreur lors de la connexion");
      console.error("❌ [AUTH API] Type d'erreur:", typeof error);
      console.error("❌ [AUTH API] Erreur complète:", error);
      console.error("❌ [AUTH API] Message:", errorObj?.message);
      console.error("❌ [AUTH API] Stack:", errorObj?.stack);

      if (errorObj.response) {
        console.error("❌ [AUTH API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          headers: errorObj.response.headers,
          data: errorObj.response.data,
        });
      } else if (errorObj.request) {
        console.error("❌ [AUTH API] Requête HTTP sans réponse:", {
          request: errorObj.request,
          code: errorObj.code,
          message: errorObj.message,
        });
      }

      console.error("❌ [AUTH API] Configuration de la requête:", {
        url: errorObj.config?.url,
        method: errorObj.config?.method,
        baseURL: errorObj.config?.baseURL,
        fullURL: errorObj.config
          ? `${errorObj.config.baseURL}${errorObj.config.url}`
          : "N/A",
      });

      if (errorObj.response) {
        const status = errorObj.response.status;
        let errorMessage = "Erreur lors de la connexion";

        if (status === 401 || status === 403) {
          errorMessage = "Email ou mot de passe incorrect";
        } else if (status === 400 || status === 404) {
          errorMessage = errorObj.response.data?.message || "Données invalides";
        } else {
          errorMessage =
            errorObj.response.data?.message ||
            errorObj.response.data?.error ||
            "Erreur lors de la connexion";
        }

        throw new Error(errorMessage);
      }
      throw new Error("Erreur de connexion au serveur");
    }
  },

  logout: () => {
    console.log("🔴 [AUTH API] ========================================");
    console.log("🔴 [AUTH API] Déconnexion de l'utilisateur");
    console.log("🔴 [AUTH API] ========================================");

    try {
      // Supprimer le token du localStorage
      localStorage.removeItem("authToken");
      console.log("🔴 [AUTH API] Token supprimé du localStorage");

      // Supprimer les autres données utilisateur
      localStorage.removeItem("finalIsLoggedIn");
      localStorage.removeItem("finalUserType");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userId");
      console.log(
        "🔴 [AUTH API] Données utilisateur supprimées du localStorage"
      );

      // Supprimer le header Authorization d'axios
      delete api.defaults.headers.common["Authorization"];
      console.log("🔴 [AUTH API] Header Authorization supprimé d'axios");

      // Vérifier que tout a bien été supprimé
      const remainingAuthToken = localStorage.getItem("authToken");
      const remainingIsLoggedIn = localStorage.getItem("finalIsLoggedIn");
      console.log("🔴 [AUTH API] Vérification après suppression:", {
        authToken: remainingAuthToken,
        finalIsLoggedIn: remainingIsLoggedIn,
      });

      // Déclencher plusieurs événements pour s'assurer que tout se met à jour
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("logout"));

      // Forcer une mise à jour en modifiant une valeur dans localStorage puis en la supprimant
      localStorage.setItem("logoutTrigger", Date.now().toString());
      localStorage.removeItem("logoutTrigger");
      window.dispatchEvent(new Event("storage"));

      console.log("🔴 [AUTH API] Événements storage et logout déclenchés");
      console.log("🔴 [AUTH API] Déconnexion terminée");
      console.log("🔴 [AUTH API] ========================================");
    } catch (error) {
      console.error("❌ [AUTH API] Erreur lors de la déconnexion:", error);
    }
  },

  signup: async (payload: SignupPayload) => {
    try {
      const fullURL = `${api.defaults.baseURL}/users/signup/unified`;
      console.log("🔵 [AUTH API] Envoi de la requête d'inscription:", {
        type: payload.type,
        email:
          payload.type === "CLIENT" || payload.type === "PROFESSIONAL"
            ? (payload as ClientSignupPayload | ProfessionalSignupPayload).email
            : (payload as AgencySignupPayload | EnterpriseSignupPayload).email,
        endpoint: "/users/signup/unified",
        fullURL: fullURL,
        baseURL: api.defaults.baseURL,
        payload: { ...payload, password: "***", matchingPassword: "***" }, // Masquer les mots de passe dans les logs
      });

      console.log(
        "🔵 [AUTH API] Payload complet (sans mots de passe):",
        JSON.stringify(
          { ...payload, password: "***", matchingPassword: "***" },
          null,
          2
        )
      );

      const response = await api.post("/users/signup/unified", payload);

      console.log("✅ [AUTH API] Inscription réussie:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        stack?: string;
        response?: {
          status?: number;
          statusText?: string;
          headers?: unknown;
          data?: { message?: string; error?: string };
        };
        request?: unknown;
        code?: string;
        config?: {
          url?: string;
          method?: string;
          baseURL?: string;
        };
      };

      // Log détaillé de l'erreur
      console.error("❌ [AUTH API] Erreur lors de l'inscription");
      console.error("❌ [AUTH API] Type d'erreur:", typeof error);
      console.error("❌ [AUTH API] Erreur complète:", error);
      console.error("❌ [AUTH API] Message:", errorObj?.message);
      console.error("❌ [AUTH API] Stack:", errorObj?.stack);

      if (errorObj.response) {
        console.error("❌ [AUTH API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          headers: errorObj.response.headers,
          data: errorObj.response.data,
        });
      } else if (errorObj.request) {
        console.error("❌ [AUTH API] Requête HTTP sans réponse:", {
          request: errorObj.request,
          code: errorObj.code,
          message: errorObj.message,
        });
      }

      console.error("❌ [AUTH API] Configuration de la requête:", {
        url: errorObj.config?.url,
        method: errorObj.config?.method,
        baseURL: errorObj.config?.baseURL,
        fullURL: errorObj.config
          ? `${errorObj.config.baseURL}${errorObj.config.url}`
          : "N/A",
      });

      if (errorObj.response) {
        throw new Error(
          errorObj.response.data?.message ||
            errorObj.response.data?.error ||
            "Erreur lors de l'inscription"
        );
      }
      throw new Error("Erreur de connexion au serveur");
    }
  },
};

// Announcements API - Correspond au DTO Java AnnouncementDTO
export type PreferredGender = "FEMALE" | "MALE" | "NEUTRAL";
export type AgeRange =
  | "UNDER_12"
  | "FROM_12_TO_18"
  | "FROM_19_TO_25"
  | "FROM_26_TO_35"
  | "FROM_36_TO_45"
  | "FROM_46_TO_55"
  | "FROM_56_TO_65"
  | "FROM_66_TO_75"
  | "FROM_76_TO_85"
  | "FROM_86_TO_95"
  | "OVER_95";

export interface AnnouncementResponse {
  id?: string; // Optionnel pour la création, présent dans la réponse
  title: string;
  description: string;
  location: string;
  userType: string; // CLIENT, PROFESSIONAL, AGENCY, ENTERPRISE
  startDate: string; // ISO 8601 format (Instant en Java)
  endDate: string; // ISO 8601 format (Instant en Java)
  latitude?: number;
  longitude?: number;
  prestationType?: string;
  influencersNumber?: number;
  budget?: number; // BigDecimal en Java, number en TypeScript
  categoryId?: string;
  subCategoryId?: string;
  postedById: string;
  createdAt?: string; // ISO 8601 format (Instant en Java) - présent dans la réponse
  updatedAt?: string; // ISO 8601 format (Instant en Java) - présent dans la réponse
  status?: string; // OPEN, CLOSED, IN_PROGRESS, COMPLETED (AnnouncementStatus enum)
  preferredAgeRanges?: AgeRange[];
  preferredGender?: PreferredGender;
}

export interface AnnouncementsListResponse {
  announcements: AnnouncementResponse[];
  total?: number;
  limit?: number;
}

export const announcementsAPI = {
  getById: async (id: string): Promise<AnnouncementResponse | null> => {
    try {
      const endpoint = `/announcements/${encodeURIComponent(id)}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [ANNOUNCEMENTS API] Récupération d'une annonce par ID:", {
        id,
        endpoint,
        fullURL,
      });

      const response = await api.get(endpoint);

      console.log("✅ [ANNOUNCEMENTS API] Annonce récupérée:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [ANNOUNCEMENTS API] Erreur lors de la récupération de l'annonce"
      );
      console.error("❌ [ANNOUNCEMENTS API] Type d'erreur:", typeof error);
      console.error("❌ [ANNOUNCEMENTS API] Erreur complète:", error);
      console.error("❌ [ANNOUNCEMENTS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [ANNOUNCEMENTS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });

        // Si l'annonce n'est pas trouvée (404), retourner null
        if (errorObj.response.status === 404) {
          console.log(
            "⚠️ [ANNOUNCEMENTS API] Annonce non trouvée, retour de null"
          );
          return null;
        }
      }

      // En cas d'erreur, retourner null
      return null;
    }
  },

  getByUserId: async (userId: string): Promise<AnnouncementResponse[]> => {
    try {
      const endpoint = `/announcements/by-user?postedById=${encodeURIComponent(
        userId
      )}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log(
        "🔵 [ANNOUNCEMENTS API] Récupération des annonces de l'utilisateur:",
        {
          userId,
          endpoint,
          fullURL,
        }
      );

      const response = await api.get(endpoint);

      console.log(
        "✅ [ANNOUNCEMENTS API] Annonces de l'utilisateur récupérées:",
        {
          status: response.status,
          count: Array.isArray(response.data) ? response.data.length : 0,
          data: response.data,
        }
      );

      // La réponse est directement un tableau d'annonces
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // En cas de réponse non-tableau, retourner un tableau vide
      return [];
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: {
          status?: number;
          statusText?: string;
          data?: { message?: string };
        };
      };
      console.error(
        "❌ [ANNOUNCEMENTS API] Erreur lors de la récupération des annonces de l'utilisateur"
      );
      console.error("❌ [ANNOUNCEMENTS API] Type d'erreur:", typeof error);
      console.error("❌ [ANNOUNCEMENTS API] Erreur complète:", error);
      console.error("❌ [ANNOUNCEMENTS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [ANNOUNCEMENTS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      // En cas d'erreur, retourner un tableau vide plutôt que de throw
      // Cela permet d'afficher le message marketing si pas d'annonces
      return [];
    }
  },

  create: async (
    announcement: AnnouncementResponse
  ): Promise<AnnouncementResponse> => {
    try {
      const endpoint = `/announcements`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [ANNOUNCEMENTS API] Création d'une annonce:", {
        endpoint,
        fullURL,
        announcement,
      });

      const response = await api.post(endpoint, announcement);

      console.log("✅ [ANNOUNCEMENTS API] Annonce créée:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: unknown) {
      console.error(
        "❌ [ANNOUNCEMENTS API] Erreur lors de la création de l'annonce"
      );
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [ANNOUNCEMENTS API] Type d'erreur:", typeof error);
      console.error("❌ [ANNOUNCEMENTS API] Erreur complète:", error);
      console.error("❌ [ANNOUNCEMENTS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [ANNOUNCEMENTS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  update: async (
    id: string,
    announcement: Partial<AnnouncementResponse>
  ): Promise<AnnouncementResponse> => {
    try {
      const endpoint = `/announcements/${encodeURIComponent(id)}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [ANNOUNCEMENTS API] Modification d'une annonce:", {
        id,
        endpoint,
        fullURL,
        announcement,
      });

      const response = await api.put(endpoint, announcement);

      console.log("✅ [ANNOUNCEMENTS API] Annonce modifiée:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: unknown) {
      console.error(
        "❌ [ANNOUNCEMENTS API] Erreur lors de la modification de l'annonce"
      );
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [ANNOUNCEMENTS API] Type d'erreur:", typeof error);
      console.error("❌ [ANNOUNCEMENTS API] Erreur complète:", error);
      console.error("❌ [ANNOUNCEMENTS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [ANNOUNCEMENTS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const endpoint = `/announcements/${encodeURIComponent(id)}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [ANNOUNCEMENTS API] Suppression d'une annonce:", {
        id,
        endpoint,
        fullURL,
      });

      const response = await api.delete(endpoint);

      console.log("✅ [ANNOUNCEMENTS API] Annonce supprimée:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      });

      // Vérifier que la réponse est correcte (le backend retourne "Deleted")
      if (
        response.status === 200 &&
        (response.data === "Deleted" || response.data === "Deleted\n")
      ) {
        console.log(
          "✅ [ANNOUNCEMENTS API] Suppression confirmée par le backend"
        );
      }
    } catch (error: unknown) {
      console.error(
        "❌ [ANNOUNCEMENTS API] Erreur lors de la suppression de l'annonce"
      );
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [ANNOUNCEMENTS API] Type d'erreur:", typeof error);
      console.error("❌ [ANNOUNCEMENTS API] Erreur complète:", error);
      console.error("❌ [ANNOUNCEMENTS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [ANNOUNCEMENTS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  getLatest: async (limit: number = 10): Promise<AnnouncementResponse[]> => {
    try {
      const endpoint = `/announcements?limit=${limit}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log(
        "🔵 [ANNOUNCEMENTS API] Récupération des dernières annonces:",
        {
          limit,
          endpoint,
          fullURL,
          baseURL: api.defaults.baseURL,
        }
      );

      const response = await api.get(endpoint);

      console.log("✅ [ANNOUNCEMENTS API] Annonces récupérées:", {
        status: response.status,
        count: Array.isArray(response.data)
          ? response.data.length
          : response.data?.announcements?.length || 0,
        data: response.data,
      });

      // Si la réponse est directement un tableau
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // Si la réponse est un objet avec une propriété announcements
      if (response.data?.announcements) {
        return response.data.announcements;
      }

      // Sinon retourner un tableau vide
      return [];
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [ANNOUNCEMENTS API] Erreur lors de la récupération des annonces"
      );
      console.error("❌ [ANNOUNCEMENTS API] Type d'erreur:", typeof error);
      console.error("❌ [ANNOUNCEMENTS API] Erreur complète:", error);
      console.error("❌ [ANNOUNCEMENTS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [ANNOUNCEMENTS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      // En cas d'erreur, retourner un tableau vide plutôt que de throw
      // Cela permet d'afficher le message marketing si pas d'annonces
      return [];
    }
  },

  getLatestExcludingUser: async (
    excludePostedById: string,
    limit: number = 5
  ): Promise<AnnouncementResponse[]> => {
    try {
      const endpoint = `/announcements/latest?excludePostedById=${encodeURIComponent(
        excludePostedById
      )}&limit=${limit}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log(
        "🔵 [ANNOUNCEMENTS API] Récupération des dernières annonces (excluant l'utilisateur):",
        {
          excludePostedById,
          limit,
          endpoint,
          fullURL,
          baseURL: api.defaults.baseURL,
        }
      );

      const response = await api.get(endpoint);

      console.log(
        "✅ [ANNOUNCEMENTS API] Annonces récupérées (excluant l'utilisateur):",
        {
          status: response.status,
          count: Array.isArray(response.data)
            ? response.data.length
            : response.data?.announcements?.length || 0,
          data: response.data,
        }
      );

      // Si la réponse est directement un tableau
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // Si la réponse est un objet avec une propriété announcements
      if (response.data?.announcements) {
        return response.data.announcements;
      }

      // Sinon retourner un tableau vide
      return [];
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [ANNOUNCEMENTS API] Erreur lors de la récupération des annonces (excluant l'utilisateur)"
      );
      console.error("❌ [ANNOUNCEMENTS API] Type d'erreur:", typeof error);
      console.error("❌ [ANNOUNCEMENTS API] Erreur complète:", error);
      console.error("❌ [ANNOUNCEMENTS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [ANNOUNCEMENTS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      // En cas d'erreur, retourner un tableau vide plutôt que de throw
      return [];
    }
  },

  apply: async (
    announcementId: string,
    applicationData: {
      message: string;
      price?: number;
      photos?: File[];
      videos?: File[];
    }
  ): Promise<unknown> => {
    try {
      const endpoint = `/announcements/${encodeURIComponent(
        announcementId
      )}/applications`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [ANNOUNCEMENTS API] Soumission d'une candidature:", {
        announcementId,
        endpoint,
        fullURL,
        applicationData,
      });

      // Créer FormData pour envoyer les fichiers
      const formData = new FormData();
      formData.append("message", applicationData.message);

      if (applicationData.price !== undefined) {
        formData.append("price", applicationData.price.toString());
      }

      // Ajouter les photos
      if (applicationData.photos && applicationData.photos.length > 0) {
        applicationData.photos.forEach((photo) => {
          formData.append(`photos`, photo);
        });
      }

      // Ajouter les vidéos
      if (applicationData.videos && applicationData.videos.length > 0) {
        applicationData.videos.forEach((video) => {
          formData.append(`videos`, video);
        });
      }

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ [ANNOUNCEMENTS API] Candidature soumise:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: unknown) {
      console.error(
        "❌ [ANNOUNCEMENTS API] Erreur lors de la soumission de la candidature"
      );
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [ANNOUNCEMENTS API] Type d'erreur:", typeof error);
      console.error("❌ [ANNOUNCEMENTS API] Erreur complète:", error);
      console.error("❌ [ANNOUNCEMENTS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [ANNOUNCEMENTS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  getCurrent: async (): Promise<AnnouncementResponse[]> => {
    try {
      const endpoint = `/announcements/current`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log(
        "🔵 [ANNOUNCEMENTS API] Récupération des annonces courantes (non fermées):",
        {
          endpoint,
          fullURL,
          baseURL: api.defaults.baseURL,
        }
      );

      const response = await api.get(endpoint);

      console.log("✅ [ANNOUNCEMENTS API] Annonces courantes récupérées:", {
        status: response.status,
        count: Array.isArray(response.data) ? response.data.length : 0,
        data: response.data,
      });

      // Si la réponse est directement un tableau
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // Sinon retourner un tableau vide
      return [];
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [ANNOUNCEMENTS API] Erreur lors de la récupération des annonces courantes"
      );
      console.error("❌ [ANNOUNCEMENTS API] Type d'erreur:", typeof error);
      console.error("❌ [ANNOUNCEMENTS API] Erreur complète:", error);
      console.error("❌ [ANNOUNCEMENTS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [ANNOUNCEMENTS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      return [];
    }
  },
};

// Dashboard API - Correspond aux DTOs Java
// Enums correspondant aux enums Java
export type GenderEnum = "MALE" | "FEMALE" | "OTHER" | "NEUTRAL";
export type ProviderEnum = "LOCAL" | "GOOGLE" | "FACEBOOK" | "GITHUB";
export type UserEnum = "CLIENT" | "PROFESSIONAL" | "AGENCY" | "ENTERPRISE";
export type SubscriptionEnum = "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE";
export type AccountStatusEnum = "PENDING" | "ACTIVE" | "SUSPENDED" | "INACTIVE";
export type OrganizationType = "AGENCY" | "ENTERPRISE" | "OTHER";

// DTOs de base
export interface PhotoDTO {
  id?: string;
  url?: string;
  [key: string]: unknown;
}

export interface AddressDTO {
  id?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  [key: string]: unknown;
}

export interface ReviewUserDTO {
  id?: string;
  averageRating?: number;
  totalReviews?: number;
  [key: string]: unknown;
}

export interface RoleDTO {
  id?: string;
  name?: string;
  [key: string]: unknown;
}

export interface UserPreferenceDTO {
  [key: string]: unknown;
}

export interface DocumentDTO {
  id?: string;
  [key: string]: unknown;
}

export interface SubCategoryDTO {
  id: string;
  name: string;
  description?: string;
}

export interface CategoryDTO {
  id: string;
  name: string;
  description?: string;
  subCategories: SubCategoryDTO[];
}

export interface UserProfileCategoryDTO {
  id?: string; // OPTIONAL - si fourni, on met à jour l'enregistrement existant
  userId?: string;
  categoryId: string; // REQUIRED pour lier la catégorie
  subCategoryIds?: string[]; // Liste d'ids de sous-catégories (optionnel)
}

// Chat/Conversations DTOs
export interface MessageDTO {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  senderName?: string;
  content: string;
  createdAt: string; // ISO 8601 format
  clientMessageId?: string;
  status: "SENDING" | "SENT" | "READ" | "FAILED";
}

export interface ConversationDTO {
  id: string;
  subject?: string;
  participantIds: string[];
  messages?: MessageDTO[];
  createdAt: string; // ISO 8601 format
  senderId?: string;
  recipientId?: string;
  content?: string;
  timestamp?: string;
  documentIds?: string[];
  readByRecipient?: boolean;
  chatRoomId?: string;
  tokenRecipient?: string[];
  // Enriched display fields
  clientName?: string;
  clientPicture?: string;
  proName?: string;
  proPicture?: string;
  senderName?: string;
}

export interface OrganizationDTO {
  id?: string;
  type?: OrganizationType;
  name?: string;
  siretNumber?: string;
  vatNumber?: string;
  website?: string;
  members?: UserDTO[];
  [key: string]: unknown;
}

export interface StatsClientDTO {
  [key: string]: unknown;
}

export interface SettingsDTO {
  [key: string]: unknown;
}

// UserDTO complet basé sur le modèle Java User
export interface UserDTO {
  // Champs de base
  id?: string;
  uid?: string;
  socialType?: string;
  firstName?: string;
  lastName?: string;
  lastNameMarried?: string;
  email?: string;
  username?: string;
  password?: string; // Ne devrait pas être retourné par l'API, mais présent dans le modèle
  profile?: string;
  datePassword?: string;
  phoneNumber?: string;
  birthdate?: string; // ISO 8601 format (Instant en Java)
  birthCity?: string;
  creationDate?: string; // ISO 8601 format (Instant en Java)
  updateDate?: string; // ISO 8601 format (Instant en Java)
  gender?: GenderEnum;
  type?: UserEnum;
  providerEnum?: ProviderEnum;
  active?: boolean;
  createdAt?: string; // ISO 8601 format (Instant en Java)

  // Relations DBRef (lazy loaded)
  address?: AddressDTO;
  reviewUser?: ReviewUserDTO;
  photo?: PhotoDTO;
  userPreference?: UserPreferenceDTO;
  roles?: RoleDTO[];
  chatRooms?: unknown[]; // List<ChatRoom>
  messages?: unknown[]; // List<Message>

  // Champs de statut
  enabled?: boolean;
  emailVerified?: boolean;
  isVerified?: boolean;
  verificationCode?: string;
  verificationExpiry?: string; // ISO 8601 format
  passwordResetToken?: string;
  tokenExpiry?: string; // ISO 8601 format
  tokens?: string[];
  profileFilled?: boolean;

  // Organisation
  organization?: OrganizationDTO;
  organizationRole?: string;
  influenceurRole?: string;

  // Documents
  documentsAsPro?: DocumentDTO[];
  documentsAsClient?: DocumentDTO[];

  // Catégories de profil
  userProfileCategories?: UserProfileCategoryDTO[];

  // Récupération
  recoveryEmail?: string;
  recoveryPhoneNumber?: string;

  // Featured
  isFeatured?: boolean;

  // Favoris
  favoritesPro?: UserDTO[];

  [key: string]: unknown; // Pour les autres champs
}

// ProfessionalDTO basé sur le modèle Java Professional extends User
export interface ProfessionalDTO extends UserDTO {
  subscriptionEnum?: SubscriptionEnum;
  bankInformations?: BankInformationDTO[];
  professionalCard?: ProfessionalCardDTO;
  settings?: SettingsDTO;
  invitationSent?: boolean;
  invitationSentDate?: number; // Long en Java
  accountStatus?: AccountStatusEnum;
  professionalCardId?: string;
}

// ClientDTO basé sur le modèle Java Client extends User
export interface ClientDTO extends UserDTO {
  invitationSent?: boolean;
  invitationSentDate?: number; // Long en Java
  accountStatus?: AccountStatusEnum;
  statsClient?: StatsClientDTO;
}

// AgencyDTO basé sur le modèle Java Agency extends User
export interface AgencyDTO extends UserDTO {
  agencyName?: string;
  contactPerson?: string;
  website?: string;
  vatNumber?: string;
}

// EnterpriseDTO basé sur le modèle Java Enterprise extends User
export interface EnterpriseDTO extends UserDTO {
  companyName?: string;
  siretNumber?: string;
  vatNumber?: string;
  contactPerson?: string;
  website?: string;
}

export interface UserSettingsDTO {
  recoveryEmail?: string;
  recoveryPhoneNumber?: string;
}

export interface ResetPasswordDTO {
  email: string;
  password: string; // Nouveau mot de passe
  matchingPassword: string; // Confirmation du nouveau mot de passe
  token?: string; // Token pour réinitialisation (optionnel pour modification depuis settings)
  currentPassword?: string; // Mot de passe actuel pour le changement de mot de passe depuis settings
}

// Application (Candidature) DTO - Correspond au ApplicationDTO Java
export interface ApplicationDTO {
  id?: string;
  announcementId?: string;
  applicantId?: string;
  message?: string;
  mediaUrls?: string[];
  photos?: string[];
  videos?: string[];
  price?: number;
  status?: "PENDING" | "ACCEPTED" | "REJECTED"; // ApplicationStatus enum
  createdAt?: string;
  updatedAt?: string;
}

export interface RecommendationDTO {
  user: UserDTO;
  score: number;
  reasonSummary: string;
}

export interface DashboardSummaryDTO {
  hasNewMessages: boolean;
  pendingQuotesCount: number;
  recommendations: RecommendationDTO[];
}

export const dashboardAPI = {
  getSummary: async (
    userId: string,
    recLimit: number = 6
  ): Promise<DashboardSummaryDTO> => {
    try {
      const endpoint = `/dashboard/summary?userId=${encodeURIComponent(
        userId
      )}&recLimit=${recLimit}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [DASHBOARD API] Récupération du résumé du dashboard:", {
        userId,
        recLimit,
        endpoint,
        fullURL,
      });

      const response = await api.get(endpoint);

      console.log("✅ [DASHBOARD API] Résumé récupéré:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: unknown) {
      console.error(
        "❌ [DASHBOARD API] Erreur lors de la récupération du résumé"
      );
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [DASHBOARD API] Type d'erreur:", typeof error);
      console.error("❌ [DASHBOARD API] Erreur complète:", error);
      console.error("❌ [DASHBOARD API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [DASHBOARD API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      // Retourner des valeurs par défaut en cas d'erreur
      return {
        hasNewMessages: false,
        pendingQuotesCount: 0,
        recommendations: [],
      };
    }
  },
};

// Favorites API - Correspond au DTO Java ProfessionalDTO
export interface ProfessionalCardDTO {
  title?: string;
  description?: string;
  price?: number;
  [key: string]: unknown;
}

export interface BankInformationDTO {
  id?: string;
  iban?: string;
  bic?: string;
  [key: string]: unknown;
}

// ProfessionalDTO est déjà défini plus haut avec toutes les propriétés
// Cette interface est maintenant redondante, mais on garde BankInformationDTO et ProfessionalCardDTO ici

// Fonction helper pour mapper le type frontend vers le type backend
const mapFavoriteTypeToBackend = (
  type: "establishment" | "influencer" | "agent"
): string => {
  const mapping: { [key: string]: string } = {
    influencer: "PROFESSIONAL", // ou 'INFLUENCER' selon le backend
    establishment: "CLIENT", // ou 'ENTERPRISE' selon le contexte
    agent: "AGENCY",
  };
  return mapping[type] || "PROFESSIONAL";
};

export const favoritesAPI = {
  // Récupération des favoris - utilise /users/{userId}/favorites
  getFavorites: async (userId: string): Promise<ProfessionalDTO[]> => {
    try {
      const endpoint = `/users/${encodeURIComponent(userId)}/favorites`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [FAVORITES API] Récupération des favoris:", {
        userId,
        endpoint,
        fullURL,
      });

      const response = await api.get(endpoint);

      console.log("✅ [FAVORITES API] Favoris récupérés:", {
        status: response.status,
        count: Array.isArray(response.data) ? response.data.length : 0,
        data: response.data,
      });

      // Si la réponse est directement un tableau
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // Sinon retourner un tableau vide
      return [];
    } catch (error: unknown) {
      console.error(
        "❌ [FAVORITES API] Erreur lors de la récupération des favoris"
      );
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [FAVORITES API] Type d'erreur:", typeof error);
      console.error("❌ [FAVORITES API] Erreur complète:", error);
      console.error("❌ [FAVORITES API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [FAVORITES API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      // En cas d'erreur, retourner un tableau vide
      return [];
    }
  },

  // Ajout d'un favori - utilise /users/{userId}/favorites/{targetId}?type={type}
  addFavorite: async (
    userId: string,
    favoriteId: string,
    favoriteType?: "establishment" | "influencer" | "agent",
    isClient: boolean = false
  ): Promise<void> => {
    try {
      // URL: /users/{userId}/favorites/{targetId} où userId est l'utilisateur connecté et targetId est l'utilisateur à ajouter
      let endpoint = `/users/${encodeURIComponent(
        userId
      )}/favorites/${encodeURIComponent(favoriteId)}`;

      if (favoriteType) {
        const backendType = mapFavoriteTypeToBackend(favoriteType);
        endpoint += `?type=${encodeURIComponent(backendType)}`;
      }

      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [FAVORITES API] Ajout d'un favori:", {
        userId,
        favoriteId,
        favoriteType,
        backendType: favoriteType
          ? mapFavoriteTypeToBackend(favoriteType)
          : undefined,
        isClient,
        endpoint,
        fullURL,
      });

      // Utiliser POST pour ajouter un favori
      const response = await api.post(endpoint);

      console.log("✅ [FAVORITES API] Favori ajouté:", {
        status: response.status,
        data: response.data,
      });
    } catch (error: unknown) {
      console.error("❌ [FAVORITES API] Erreur lors de l'ajout du favori");
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [FAVORITES API] Type d'erreur:", typeof error);
      console.error("❌ [FAVORITES API] Erreur complète:", error);
      console.error("❌ [FAVORITES API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [FAVORITES API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  // Suppression d'un favori - utilise /users/{userId}/favorites/{targetId}
  removeFavorite: async (
    userId: string,
    favoriteId: string,
    favoriteType?: "establishment" | "influencer" | "agent",
    isClient: boolean = false
  ): Promise<void> => {
    try {
      // URL: /users/{userId}/favorites/{targetId} où userId est l'utilisateur propriétaire et targetId est l'utilisateur à retirer
      let endpoint = `/users/${encodeURIComponent(
        userId
      )}/favorites/${encodeURIComponent(favoriteId)}`;

      if (favoriteType) {
        const backendType = mapFavoriteTypeToBackend(favoriteType);
        endpoint += `?type=${encodeURIComponent(backendType)}`;
      }

      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [FAVORITES API] Suppression d'un favori:", {
        userId,
        favoriteId,
        favoriteType,
        backendType: favoriteType
          ? mapFavoriteTypeToBackend(favoriteType)
          : undefined,
        isClient,
        endpoint,
        fullURL,
      });

      // Utiliser DELETE pour supprimer un favori
      const response = await api.delete(endpoint);

      console.log("✅ [FAVORITES API] Favori supprimé:", {
        status: response.status,
        data: response.data,
      });
    } catch (error: unknown) {
      console.error(
        "❌ [FAVORITES API] Erreur lors de la suppression du favori"
      );
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [FAVORITES API] Type d'erreur:", typeof error);
      console.error("❌ [FAVORITES API] Erreur complète:", error);
      console.error("❌ [FAVORITES API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [FAVORITES API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },
};

// Prestations API - Correspond au modèle Prestation Java
export interface PrestationDTO {
  id?: string;
  quoteId?: string;
  quoteNumber?: string;
  title?: string;
  description?: string;
  price?: number; // BigDecimal en Java, number en TypeScript
  deliveryTime?: string; // Temps de livraison
  createdBy?: string | { id?: string; [key: string]: unknown }; // ID de l'utilisateur créateur (influenceur) ou objet User DBRef
  recipient?: string | { id?: string; [key: string]: unknown }; // ID du destinataire (client/entreprise) ou objet User DBRef
  recipientId?: string; // Alias pour compatibilité (extrait de recipient.id si objet)
  status?: string; // ACTIVE, COMPLETED, CANCELLED (PrestationStatus enum)
  createdAt?: string; // ISO 8601 format (Instant en Java)
  startedAt?: string; // ISO 8601 format (Instant en Java)
  completedAt?: string; // ISO 8601 format (Instant en Java)
  // Champs de compatibilité pour l'ancien format
  startDate?: string; // Alias pour startedAt
  endDate?: string; // Alias pour completedAt
  updatedAt?: string; // Alias pour createdAt
  [key: string]: unknown; // Pour les autres champs du Prestation
}

export const prestationsAPI = {
  listAll: async (): Promise<PrestationDTO[]> => {
    try {
      const baseURLWithoutV1 =
        api.defaults.baseURL?.replace("/api/v1", "/api") ||
        "https://platform-ihjb.onrender.com/api";
      const endpoint = `/prestations`;
      const fullURL = `${baseURLWithoutV1}${endpoint}`;

      console.log(
        "🔵 [PRESTATIONS API] Récupération de toutes les prestations:",
        {
          endpoint,
          fullURL,
        }
      );

      const response = await axios.get(fullURL, {
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("authToken")
            ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            : {}),
        },
      });

      console.log("✅ [PRESTATIONS API] Prestations récupérées:", {
        status: response.status,
        count: Array.isArray(response.data) ? response.data.length : 0,
        data: response.data,
      });

      return Array.isArray(response.data) ? response.data : [];
    } catch (error: unknown) {
      console.error(
        "❌ [PRESTATIONS API] Erreur lors de la récupération des prestations"
      );
      return [];
    }
  },

  listOngoing: async (): Promise<PrestationDTO[]> => {
    try {
      const baseURLWithoutV1 =
        api.defaults.baseURL?.replace("/api/v1", "/api") ||
        "https://platform-ihjb.onrender.com/api";
      const endpoint = `/prestations/ongoing`;
      const fullURL = `${baseURLWithoutV1}${endpoint}`;

      console.log(
        "🔵 [PRESTATIONS API] Récupération des prestations en cours:",
        {
          endpoint,
          fullURL,
        }
      );

      const response = await axios.get(fullURL, {
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("authToken")
            ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            : {}),
        },
      });

      console.log("✅ [PRESTATIONS API] Prestations en cours récupérées:", {
        status: response.status,
        count: Array.isArray(response.data) ? response.data.length : 0,
        data: response.data,
      });

      return Array.isArray(response.data) ? response.data : [];
    } catch (error: unknown) {
      console.error(
        "❌ [PRESTATIONS API] Erreur lors de la récupération des prestations en cours"
      );
      return [];
    }
  },

  listByCreator: async (userId: string): Promise<PrestationDTO[]> => {
    try {
      const baseURLWithoutV1 =
        api.defaults.baseURL?.replace("/api/v1", "/api") ||
        "https://platform-ihjb.onrender.com/api";
      const endpoint = `/prestations/by-creator?userId=${encodeURIComponent(
        userId
      )}`;
      const fullURL = `${baseURLWithoutV1}${endpoint}`;

      console.log(
        "🔵 [PRESTATIONS API] Récupération des prestations par créateur:",
        {
          userId,
          endpoint,
          fullURL,
        }
      );

      const response = await axios.get(fullURL, {
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("authToken")
            ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            : {}),
        },
      });

      console.log("✅ [PRESTATIONS API] Prestations du créateur récupérées:", {
        status: response.status,
        count: Array.isArray(response.data) ? response.data.length : 0,
        data: response.data,
      });

      return Array.isArray(response.data) ? response.data : [];
    } catch (error: unknown) {
      console.error(
        "❌ [PRESTATIONS API] Erreur lors de la récupération des prestations du créateur"
      );
      return [];
    }
  },

  listOngoingByCreator: async (userId: string): Promise<PrestationDTO[]> => {
    try {
      const baseURLWithoutV1 =
        api.defaults.baseURL?.replace("/api/v1", "/api") ||
        "https://platform-ihjb.onrender.com/api";
      const endpoint = `/prestations/ongoing/by-creator?userId=${encodeURIComponent(
        userId
      )}`;
      const fullURL = `${baseURLWithoutV1}${endpoint}`;

      console.log(
        "🔵 [PRESTATIONS API] Récupération des prestations en cours par créateur:",
        {
          userId,
          endpoint,
          fullURL,
        }
      );

      const response = await axios.get(fullURL, {
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("authToken")
            ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            : {}),
        },
      });

      console.log(
        "✅ [PRESTATIONS API] Prestations en cours du créateur récupérées:",
        {
          status: response.status,
          count: Array.isArray(response.data) ? response.data.length : 0,
          data: response.data,
        }
      );

      return Array.isArray(response.data) ? response.data : [];
    } catch (error: unknown) {
      console.error(
        "❌ [PRESTATIONS API] Erreur lors de la récupération des prestations en cours du créateur"
      );
      return [];
    }
  },

  listByRecipient: async (recipientId: string): Promise<PrestationDTO[]> => {
    try {
      const baseURLWithoutV1 =
        api.defaults.baseURL?.replace("/api/v1", "/api") ||
        "https://platform-ihjb.onrender.com/api";
      const endpoint = `/prestations/by-recipient?recipientId=${encodeURIComponent(
        recipientId
      )}`;
      const fullURL = `${baseURLWithoutV1}${endpoint}`;

      console.log(
        "🔵 [PRESTATIONS API] Récupération des prestations par destinataire:",
        {
          recipientId,
          endpoint,
          fullURL,
        }
      );

      const response = await axios.get(fullURL, {
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("authToken")
            ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            : {}),
        },
      });

      console.log(
        "✅ [PRESTATIONS API] Prestations du destinataire récupérées:",
        {
          status: response.status,
          count: Array.isArray(response.data) ? response.data.length : 0,
          data: response.data,
        }
      );

      return Array.isArray(response.data) ? response.data : [];
    } catch (error: unknown) {
      console.error(
        "❌ [PRESTATIONS API] Erreur lors de la récupération des prestations du destinataire"
      );
      return [];
    }
  },

  listOngoingByRecipient: async (
    recipientId: string
  ): Promise<PrestationDTO[]> => {
    try {
      const baseURLWithoutV1 =
        api.defaults.baseURL?.replace("/api/v1", "/api") ||
        "https://platform-ihjb.onrender.com/api";
      const endpoint = `/prestations/ongoing/by-recipient?recipientId=${encodeURIComponent(
        recipientId
      )}`;
      const fullURL = `${baseURLWithoutV1}${endpoint}`;

      console.log(
        "🔵 [PRESTATIONS API] Récupération des prestations en cours par destinataire:",
        {
          recipientId,
          endpoint,
          fullURL,
        }
      );

      const response = await axios.get(fullURL, {
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("authToken")
            ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            : {}),
        },
      });

      console.log(
        "✅ [PRESTATIONS API] Prestations en cours du destinataire récupérées:",
        {
          status: response.status,
          count: Array.isArray(response.data) ? response.data.length : 0,
          data: response.data,
        }
      );

      return Array.isArray(response.data) ? response.data : [];
    } catch (error: unknown) {
      console.error(
        "❌ [PRESTATIONS API] Erreur lors de la récupération des prestations en cours du destinataire"
      );
      return [];
    }
  },

  getById: async (id: string): Promise<PrestationDTO | null> => {
    try {
      const baseURLWithoutV1 =
        api.defaults.baseURL?.replace("/api/v1", "/api") ||
        "https://platform-ihjb.onrender.com/api";
      const endpoint = `/prestations/${encodeURIComponent(id)}`;
      const fullURL = `${baseURLWithoutV1}${endpoint}`;

      console.log(
        "🔵 [PRESTATIONS API] Récupération d'une prestation par ID:",
        {
          id,
          endpoint,
          fullURL,
        }
      );

      const response = await axios.get(fullURL, {
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("authToken")
            ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            : {}),
        },
      });

      console.log("✅ [PRESTATIONS API] Prestation récupérée:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: unknown) {
      console.error(
        "❌ [PRESTATIONS API] Erreur lors de la récupération de la prestation"
      );
      console.error("❌ [PRESTATIONS API] Type d'erreur:", typeof error);
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [PRESTATIONS API] Erreur complète:", error);
      console.error("❌ [PRESTATIONS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [PRESTATIONS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });

        // Si la prestation n'est pas trouvée (404), retourner null
        if (errorObj.response.status === 404) {
          console.log(
            "⚠️ [PRESTATIONS API] Prestation non trouvée, retour de null"
          );
          return null;
        }
      }

      // En cas d'erreur, retourner null
      return null;
    }
  },
};

// Stats API - Correspond aux DTOs Java
export interface TypeStatDTO {
  type: string;
  count: number;
  percent: number;
}

export interface CityStatDTO {
  city: string;
  count: number;
}

export interface PunchlineDTO {
  userId: string;
  totalPrestations: number;
  totalRevenue: number; // BigDecimal en Java, number en TypeScript
  uniqueClients: number;
  typeDistribution: TypeStatDTO[];
  cityDistribution: CityStatDTO[];
}

export const statsAPI = {
  getPunchline: async (userId: string): Promise<PunchlineDTO | null> => {
    try {
      // Le controller Java est à /api/stats (sans /v1), donc on utilise l'URL complète
      // En remplaçant /api/v1 par /api dans le baseURL
      const baseURLWithoutV1 =
        api.defaults.baseURL?.replace("/api/v1", "/api") ||
        "https://platform-ihjb.onrender.com/api";
      const endpoint = `/stats/users/${encodeURIComponent(userId)}/punchline`;
      const fullURL = `${baseURLWithoutV1}${endpoint}`;

      console.log("🔵 [STATS API] Récupération des statistiques:", {
        userId,
        endpoint,
        baseURL: api.defaults.baseURL,
        baseURLWithoutV1,
        fullURL,
      });

      // Utiliser axios directement avec l'URL complète pour éviter le baseURL
      const response = await axios.get(fullURL, {
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("authToken")
            ? {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              }
            : {}),
        },
      });

      console.log("✅ [STATS API] Statistiques récupérées:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: unknown) {
      console.error(
        "❌ [STATS API] Erreur lors de la récupération des statistiques"
      );
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [STATS API] Type d'erreur:", typeof error);
      console.error("❌ [STATS API] Erreur complète:", error);
      console.error("❌ [STATS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [STATS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });

        // Si l'utilisateur n'est pas trouvé (404), retourner null plutôt qu'une erreur
        if (errorObj.response.status === 404) {
          console.log("⚠️ [STATS API] Utilisateur non trouvé, retour de null");
          return null;
        }
      }

      // En cas d'erreur, retourner null
      return null;
    }
  },
};

// Quotes API - Correspond au DTO Java QuoteDTO
export interface QuoteDTO {
  id?: string; // Optionnel pour la création, présent dans la réponse
  title: string;
  description?: string;
  price: number; // BigDecimal en Java, number en TypeScript
  deliveryTime?: string; // Backend utilise deliveryTime
  duration?: string; // Alias pour compatibilité frontend
  createdById?: string; // Backend utilise createdById
  creatorId?: string; // Alias pour compatibilité frontend
  recipientId: string;
  status?: string; // PENDING, ACCEPTED, REJECTED, etc.
  createdAt?: string; // ISO 8601 format
  acceptedAt?: string; // ISO 8601 format
  updatedAt?: string; // ISO 8601 format
  [key: string]: unknown; // Pour les autres champs du QuoteDTO
}

export const quotesAPI = {
  create: async (
    quote: Omit<QuoteDTO, "id" | "createdAt" | "updatedAt" | "acceptedAt">
  ): Promise<QuoteDTO> => {
    try {
      const endpoint = `/quotes`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      // Mapper les champs frontend vers backend
      const backendQuote: Record<string, unknown> = {
        title: quote.title,
        description: quote.description,
        price: quote.price,
        deliveryTime: quote.deliveryTime || quote.duration, // Utiliser deliveryTime pour le backend
        createdById: quote.createdById || quote.creatorId, // Utiliser createdById pour le backend
        recipientId: quote.recipientId,
        status: quote.status,
      };

      console.log("🔵 [QUOTES API] Création d'un devis:", {
        endpoint,
        fullURL,
        quoteFrontend: quote,
        quoteBackend: backendQuote,
      });

      const response = await api.post(endpoint, backendQuote);

      console.log("✅ [QUOTES API] Devis créé:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: unknown) {
      console.error("❌ [QUOTES API] Erreur lors de la création du devis");
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [QUOTES API] Type d'erreur:", typeof error);
      console.error("❌ [QUOTES API] Erreur complète:", error);
      console.error("❌ [QUOTES API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [QUOTES API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  getByCreator: async (creatorId: string): Promise<QuoteDTO[]> => {
    try {
      const endpoint = `/quotes/by-creator?createdById=${encodeURIComponent(
        creatorId
      )}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log(
        "🔵 [QUOTES API] ===== DÉBUT RÉCUPÉRATION DEVIS CRÉATEUR ====="
      );
      console.log("🔵 [QUOTES API] Paramètres:", {
        creatorId,
        creatorIdEncoded: encodeURIComponent(creatorId),
        endpoint,
        baseURL: api.defaults.baseURL,
        fullURL,
      });
      console.log("🔵 [QUOTES API] Headers:", {
        authorization: api.defaults.headers.common["Authorization"]
          ? "Présent"
          : "Absent",
        contentType: api.defaults.headers.common["Content-Type"],
      });

      const response = await api.get(endpoint);

      console.log("✅ [QUOTES API] Réponse reçue:", {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        count: Array.isArray(response.data) ? response.data.length : "N/A",
        data: response.data,
      });

      if (Array.isArray(response.data)) {
        console.log("✅ [QUOTES API] Retour de", response.data.length, "devis");
        console.log(
          "✅ [QUOTES API] ===== FIN RÉCUPÉRATION DEVIS CRÉATEUR (SUCCÈS) ====="
        );
        return response.data;
      }

      console.warn("⚠️ [QUOTES API] La réponse n'est pas un tableau:", {
        data: response.data,
        dataType: typeof response.data,
      });
      console.log(
        "✅ [QUOTES API] ===== FIN RÉCUPÉRATION DEVIS CRÉATEUR (TABLEAU VIDE) ====="
      );
      return [];
    } catch (error: unknown) {
      console.error(
        "❌ [QUOTES API] ===== ERREUR RÉCUPÉRATION DEVIS CRÉATEUR ====="
      );
      const errorObj = error as {
        message?: string;
        stack?: string;
        request?: unknown;
        config?: { url?: string; method?: string };
        response?: {
          status?: number;
          statusText?: string;
          headers?: unknown;
          data?: unknown;
          config?: { url?: string; method?: string };
        };
      };
      console.error("❌ [QUOTES API] Type d'erreur:", typeof error);
      console.error("❌ [QUOTES API] Erreur complète:", error);
      console.error("❌ [QUOTES API] Message:", errorObj?.message);
      console.error("❌ [QUOTES API] Stack:", errorObj?.stack);

      if (errorObj.response) {
        console.error("❌ [QUOTES API] Réponse HTTP d'erreur:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          headers: errorObj.response.headers,
          data: errorObj.response.data,
          url: errorObj.response?.config?.url,
          method: errorObj.response?.config?.method,
        });
      } else if (errorObj.request) {
        console.error("❌ [QUOTES API] Requête envoyée mais pas de réponse:", {
          request: errorObj.request,
          url: errorObj.config?.url,
          method: errorObj.config?.method,
        });
      }

      console.error(
        "❌ [QUOTES API] ===== FIN ERREUR RÉCUPÉRATION DEVIS CRÉATEUR ====="
      );
      return [];
    }
  },

  getByRecipient: async (recipientId: string): Promise<QuoteDTO[]> => {
    try {
      const endpoint = `/quotes/recipient?recipientId=${encodeURIComponent(
        recipientId
      )}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [QUOTES API] Récupération des devis du destinataire:", {
        recipientId,
        endpoint,
        fullURL,
      });

      const response = await api.get(endpoint);

      console.log("✅ [QUOTES API] Devis récupérés:", {
        status: response.status,
        count: Array.isArray(response.data) ? response.data.length : 0,
        data: response.data,
      });

      if (Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    } catch (error: unknown) {
      console.error("❌ [QUOTES API] Erreur lors de la récupération des devis");
      return [];
    }
  },

  getById: async (id: string): Promise<QuoteDTO | null> => {
    try {
      const endpoint = `/quotes/${encodeURIComponent(id)}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [QUOTES API] Récupération d'un devis par ID:", {
        id,
        endpoint,
        fullURL,
      });

      const response = await api.get(endpoint);

      console.log("✅ [QUOTES API] Devis récupéré:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: unknown) {
      console.error("❌ [QUOTES API] Erreur lors de la récupération du devis");
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [QUOTES API] Type d'erreur:", typeof error);
      console.error("❌ [QUOTES API] Erreur complète:", error);
      console.error("❌ [QUOTES API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [QUOTES API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });

        // Si le devis n'est pas trouvé (404), retourner null
        if (errorObj.response.status === 404) {
          console.log("⚠️ [QUOTES API] Devis non trouvé, retour de null");
          return null;
        }
      }

      // En cas d'erreur, retourner null
      return null;
    }
  },

  updateStatus: async (
    quoteId: string,
    status:
      | "PENDING"
      | "ACCEPTED"
      | "REJECTED"
      | "IN_PROGRESS"
      | "PAST"
      | "VALIDATED",
    actorId?: string
  ): Promise<QuoteDTO> => {
    try {
      let endpoint = `/quotes/${encodeURIComponent(
        quoteId
      )}/status?status=${status}`;
      if (actorId) {
        endpoint += `&actorId=${encodeURIComponent(actorId)}`;
      }
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [QUOTES API] Mise à jour du statut du devis:", {
        quoteId,
        status,
        actorId,
        endpoint,
        fullURL,
      });

      const response = await api.patch(endpoint);

      console.log("✅ [QUOTES API] Statut du devis mis à jour:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: unknown) {
      console.error(
        "❌ [QUOTES API] Erreur lors de la mise à jour du statut du devis"
      );
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [QUOTES API] Type d'erreur:", typeof error);
      console.error("❌ [QUOTES API] Erreur complète:", error);
      console.error("❌ [QUOTES API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [QUOTES API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },
};

// Fonction helper pour mapper les données brutes du backend vers les DTOs TypeScript
const mapUserFromBackend = (
  data: unknown
): UserDTO | ProfessionalDTO | ClientDTO | AgencyDTO | EnterpriseDTO => {
  if (!data) {
    throw new Error("Data is required");
  }

  // Caster data en Record<string, unknown> pour accéder aux propriétés
  const dataObj = data as Record<string, unknown>;

  // Mapper les champs de base
  const baseUser: UserDTO = {
    id: dataObj.id as string,
    uid: dataObj.uid as string,
    socialType: dataObj.socialType as string,
    firstName: dataObj.firstName as string,
    lastName: dataObj.lastName as string,
    lastNameMarried: dataObj.lastNameMarried as string | undefined,
    email: dataObj.email as string,
    username: dataObj.username as string,
    profile: dataObj.profile as string | undefined,
    datePassword: dataObj.datePassword as string | undefined,
    phoneNumber: dataObj.phoneNumber as string | undefined,
    birthdate: dataObj.birthdate as string | undefined,
    birthCity: dataObj.birthCity as string | undefined,
    creationDate: dataObj.creationDate as string | undefined,
    updateDate: dataObj.updateDate as string | undefined,
    gender: dataObj.gender as GenderEnum | undefined,
    type: dataObj.type as UserEnum,
    providerEnum: dataObj.providerEnum as ProviderEnum | undefined,
    active: dataObj.active as boolean | undefined,
    createdAt: dataObj.createdAt as string | undefined,

    // Relations DBRef
    address: dataObj.address
      ? {
          id: (dataObj.address as Record<string, unknown>).id as string,
          street: (dataObj.address as Record<string, unknown>).street as string,
          city: (dataObj.address as Record<string, unknown>).city as string,
          postalCode: (dataObj.address as Record<string, unknown>)
            .postalCode as string,
          country: (dataObj.address as Record<string, unknown>)
            .country as string,
          ...(dataObj.address as Record<string, unknown>),
        }
      : undefined,

    reviewUser: dataObj.reviewUser
      ? {
          id: (dataObj.reviewUser as Record<string, unknown>).id as string,
          averageRating: (dataObj.reviewUser as Record<string, unknown>)
            .averageRating as number | undefined,
          totalReviews: (dataObj.reviewUser as Record<string, unknown>)
            .totalReviews as number | undefined,
          ...(dataObj.reviewUser as Record<string, unknown>),
        }
      : undefined,

    photo: dataObj.photo
      ? {
          id: (dataObj.photo as Record<string, unknown>).id as string,
          url: (dataObj.photo as Record<string, unknown>).url as string,
          ...(dataObj.photo as Record<string, unknown>),
        }
      : undefined,

    userPreference: dataObj.userPreference as UserPreferenceDTO | undefined,
    roles: dataObj.roles as RoleDTO[] | undefined,
    chatRooms: dataObj.chatRooms as unknown[] | undefined,
    messages: dataObj.messages as unknown[] | undefined,

    // Champs de statut
    enabled: dataObj.enabled as boolean | undefined,
    emailVerified: dataObj.emailVerified as boolean | undefined,
    isVerified: dataObj.isVerified as boolean | undefined,
    verificationCode: dataObj.verificationCode as string | undefined,
    verificationExpiry: dataObj.verificationExpiry as string | undefined,
    passwordResetToken: dataObj.passwordResetToken as string | undefined,
    tokenExpiry: dataObj.tokenExpiry as string | undefined,
    tokens: dataObj.tokens as string[] | undefined,
    profileFilled: dataObj.profileFilled as boolean | undefined,

    // Organisation
    organization: dataObj.organization
      ? ({
          id: (dataObj.organization as Record<string, unknown>).id as string,
          type: (dataObj.organization as Record<string, unknown>)
            .type as string,
          name: (dataObj.organization as Record<string, unknown>)
            .name as string,
          siretNumber: (dataObj.organization as Record<string, unknown>)
            .siretNumber as string | undefined,
          vatNumber: (dataObj.organization as Record<string, unknown>)
            .vatNumber as string | undefined,
          website: (dataObj.organization as Record<string, unknown>).website as
            | string
            | undefined,
          members: (dataObj.organization as Record<string, unknown>)
            .members as unknown,
          ...(dataObj.organization as Record<string, unknown>),
        } as OrganizationDTO)
      : undefined,

    organizationRole: dataObj.organizationRole as string | undefined,
    influenceurRole: dataObj.influenceurRole as string | undefined,

    // Documents
    documentsAsPro: dataObj.documentsAsPro as DocumentDTO[] | undefined,
    documentsAsClient: dataObj.documentsAsClient as DocumentDTO[] | undefined,

    // Catégories de profil
    userProfileCategories: dataObj.userProfileCategories as
      | UserProfileCategoryDTO[]
      | undefined,

    // Récupération
    recoveryEmail: dataObj.recoveryEmail as string | undefined,
    recoveryPhoneNumber: dataObj.recoveryPhoneNumber as string | undefined,

    // Featured
    isFeatured: dataObj.isFeatured as boolean | undefined,

    // Favoris
    favoritesPro: dataObj.favoritesPro as UserDTO[] | undefined,

    // Conserver tous les autres champs non mappés
    ...dataObj,
  };

  // Mapper selon le type d'utilisateur
  const userType = (dataObj.type || dataObj.userType) as string | undefined;

  if (userType === "PROFESSIONAL") {
    const professional: ProfessionalDTO = {
      ...baseUser,
      type: "PROFESSIONAL" as UserEnum, // S'assurer que le type est défini
      subscriptionEnum: dataObj.subscriptionEnum as
        | SubscriptionEnum
        | undefined,
      bankInformations: dataObj.bankInformations
        ? (dataObj.bankInformations as Array<Record<string, unknown>>).map(
            (bi) => ({
              id: bi.id as string | undefined,
              iban: bi.iban as string | undefined,
              bic: bi.bic as string | undefined,
              ...bi,
            })
          )
        : undefined,
      professionalCard: dataObj.professionalCard
        ? {
            title: (dataObj.professionalCard as Record<string, unknown>)
              .title as string | undefined,
            description: (dataObj.professionalCard as Record<string, unknown>)
              .description as string | undefined,
            price: (dataObj.professionalCard as Record<string, unknown>)
              .price as number | undefined,
            ...(dataObj.professionalCard as Record<string, unknown>),
          }
        : undefined,
      settings: dataObj.settings as SettingsDTO | undefined,
      invitationSent: dataObj.invitationSent as boolean | undefined,
      invitationSentDate: dataObj.invitationSentDate as number | undefined,
      accountStatus: dataObj.accountStatus as AccountStatusEnum | undefined,
      professionalCardId: dataObj.professionalCardId as string | undefined,
    };
    return professional;
  }

  if (userType === "CLIENT") {
    const client: ClientDTO = {
      ...baseUser,
      type: "CLIENT" as UserEnum, // S'assurer que le type est défini
      invitationSent: dataObj.invitationSent as boolean | undefined,
      invitationSentDate: dataObj.invitationSentDate as number | undefined,
      accountStatus: dataObj.accountStatus as AccountStatusEnum | undefined,
      statsClient: dataObj.statsClient as StatsClientDTO | undefined,
    };
    return client;
  }

  if (userType === "AGENCY") {
    const agency: AgencyDTO = {
      ...baseUser,
      type: "AGENCY" as UserEnum, // S'assurer que le type est défini
      agencyName: dataObj.agencyName as string | undefined,
      contactPerson: dataObj.contactPerson as string | undefined,
      website: dataObj.website as string | undefined,
      vatNumber: dataObj.vatNumber as string | undefined,
    };
    return agency;
  }

  if (userType === "ENTERPRISE") {
    const enterprise: EnterpriseDTO = {
      ...baseUser,
      type: "ENTERPRISE" as UserEnum, // S'assurer que le type est défini
      companyName: dataObj.companyName as string | undefined,
      siretNumber: dataObj.siretNumber as string | undefined,
      vatNumber: dataObj.vatNumber as string | undefined,
      contactPerson: dataObj.contactPerson as string | undefined,
      website: dataObj.website as string | undefined,
    };
    return enterprise;
  }

  // Par défaut, retourner UserDTO avec le type si disponible
  return {
    ...baseUser,
    type: (userType as UserEnum) || baseUser.type,
  };
};

// Users API
export const usersAPI = {
  getAllUsers: async (): Promise<UserDTO[]> => {
    try {
      const endpoint = `/users`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [USERS API] Récupération de tous les utilisateurs:", {
        endpoint,
        fullURL,
      });

      const response = await api.get(endpoint);

      console.log("✅ [USERS API] Utilisateurs récupérés:", {
        status: response.status,
        count: Array.isArray(response.data) ? response.data.length : 0,
        data: response.data,
      });

      // Mapper les données
      if (Array.isArray(response.data)) {
        return response.data.map(mapUserFromBackend) as UserDTO[];
      }

      return [];
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [USERS API] Erreur lors de la récupération des utilisateurs"
      );
      console.error("❌ [USERS API] Type d'erreur:", typeof error);
      console.error("❌ [USERS API] Erreur complète:", error);
      console.error("❌ [USERS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [USERS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  getUserById: async (
    id: string
  ): Promise<
    UserDTO | ProfessionalDTO | ClientDTO | AgencyDTO | EnterpriseDTO | null
  > => {
    try {
      const endpoint = `/users/${encodeURIComponent(id)}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [USERS API] Récupération d'un utilisateur par ID:", {
        id,
        endpoint,
        fullURL,
      });

      const response = await api.get(endpoint);

      console.log("✅ [USERS API] Utilisateur récupéré (brut):", {
        status: response.status,
        data: response.data,
      });

      // Mapper les données selon le type d'utilisateur
      const mappedUser = mapUserFromBackend(response.data);

      console.log("✅ [USERS API] Utilisateur mappé:", {
        type: mappedUser?.type,
        id: mappedUser?.id,
        email: mappedUser?.email,
        firstName: mappedUser?.firstName,
        lastName: mappedUser?.lastName,
      });

      return mappedUser;
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [USERS API] Erreur lors de la récupération de l'utilisateur"
      );
      console.error("❌ [USERS API] Type d'erreur:", typeof error);
      console.error("❌ [USERS API] Erreur complète:", error);
      console.error("❌ [USERS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [USERS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });

        // Si l'utilisateur n'est pas trouvé (404), retourner null
        if (errorObj.response.status === 404) {
          console.log("⚠️ [USERS API] Utilisateur non trouvé, retour de null");
          return null;
        }
      }

      // En cas d'erreur, retourner null
      return null;
    }
  },

  updateUserSettings: async (
    userId: string,
    settings: UserSettingsDTO
  ): Promise<UserDTO | null> => {
    try {
      const endpoint = `/users/${encodeURIComponent(userId)}/settings`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [USERS API] ========================================");
      console.log("🔵 [USERS API] MISE À JOUR DES PARAMÈTRES UTILISATEUR");
      console.log("🔵 [USERS API] ========================================");
      console.log("🔵 [USERS API] User ID:", userId);
      console.log("🔵 [USERS API] Endpoint:", endpoint);
      console.log("🔵 [USERS API] Base URL:", api.defaults.baseURL);
      console.log("🔵 [USERS API] URL complète:", fullURL);
      console.log("🔵 [USERS API] Méthode: PUT");
      console.log("🔵 [USERS API] Headers:", {
        "Content-Type": "application/json",
        Authorization: api.defaults.headers.common["Authorization"]
          ? "Bearer ***"
          : "Non défini",
      });
      console.log("🔵 [USERS API] UserSettingsDTO envoyé:", {
        recoveryEmail: settings.recoveryEmail || "Non défini",
        recoveryPhoneNumber: settings.recoveryPhoneNumber || "Non défini",
      });
      console.log(
        "🔵 [USERS API] Payload complet (JSON):",
        JSON.stringify(settings, null, 2)
      );
      console.log("🔵 [USERS API] ========================================");

      const response = await api.put(endpoint, settings);

      console.log("✅ [USERS API] ========================================");
      console.log("✅ [USERS API] PARAMÈTRES UTILISATEUR MIS À JOUR");
      console.log("✅ [USERS API] ========================================");
      console.log("✅ [USERS API] Status HTTP:", response.status);
      console.log("✅ [USERS API] Status Text:", response.statusText);
      console.log("✅ [USERS API] Headers de réponse:", response.headers);
      console.log(
        "✅ [USERS API] Données reçues:",
        JSON.stringify(response.data, null, 2)
      );
      console.log("✅ [USERS API] ========================================");

      return response.data;
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [USERS API] Erreur lors de la mise à jour des paramètres utilisateur"
      );
      console.error("❌ [USERS API] Type d'erreur:", typeof error);
      console.error("❌ [USERS API] Erreur complète:", error);
      console.error("❌ [USERS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [USERS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });

        // Si l'utilisateur n'est pas trouvé (404), retourner null
        if (errorObj.response.status === 404) {
          console.log("⚠️ [USERS API] Utilisateur non trouvé, retour de null");
          return null;
        }
      }

      throw error;
    }
  },

  // Mise à jour d'un client
  updateClient: async (
    userId: string,
    data: Partial<ClientDTO>
  ): Promise<ClientDTO | null> => {
    try {
      const endpoint = `/clients/${encodeURIComponent(userId)}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [USERS API] Mise à jour d'un client:", {
        userId,
        endpoint,
        fullURL,
        data,
      });

      const response = await api.put(endpoint, data);

      console.log("✅ [USERS API] Client mis à jour:", {
        status: response.status,
        data: response.data,
      });

      // Mapper la réponse
      return mapUserFromBackend(response.data) as ClientDTO;
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [USERS API] Erreur lors de la mise à jour du client");
      console.error("❌ [USERS API] Type d'erreur:", typeof error);
      console.error("❌ [USERS API] Erreur complète:", error);
      console.error("❌ [USERS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [USERS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  // Mise à jour d'un professionnel
  updateProfessional: async (
    userId: string,
    data: Partial<ProfessionalDTO>
  ): Promise<ProfessionalDTO | null> => {
    try {
      const endpoint = `/users/pro/${encodeURIComponent(userId)}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [USERS API] Mise à jour d'un professionnel:", {
        userId,
        endpoint,
        fullURL,
        data,
      });

      const response = await api.put(endpoint, data);

      console.log("✅ [USERS API] Professionnel mis à jour:", {
        status: response.status,
        data: response.data,
      });

      // Mapper la réponse
      return mapUserFromBackend(response.data) as ProfessionalDTO;
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [USERS API] Erreur lors de la mise à jour du professionnel"
      );
      console.error("❌ [USERS API] Type d'erreur:", typeof error);
      console.error("❌ [USERS API] Erreur complète:", error);
      console.error("❌ [USERS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [USERS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  // Mise à jour d'une agence
  updateAgency: async (
    userId: string,
    data: Partial<AgencyDTO>
  ): Promise<AgencyDTO | null> => {
    try {
      const endpoint = `/users/agency/${encodeURIComponent(userId)}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [USERS API] Mise à jour d'une agence:", {
        userId,
        endpoint,
        fullURL,
        data,
      });

      const response = await api.put(endpoint, data);

      console.log("✅ [USERS API] Agence mise à jour:", {
        status: response.status,
        data: response.data,
      });

      // Mapper la réponse
      return mapUserFromBackend(response.data) as AgencyDTO;
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [USERS API] Erreur lors de la mise à jour de l'agence");
      console.error("❌ [USERS API] Type d'erreur:", typeof error);
      console.error("❌ [USERS API] Erreur complète:", error);
      console.error("❌ [USERS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [USERS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  // Mise à jour d'une entreprise
  updateEnterprise: async (
    userId: string,
    data: Partial<EnterpriseDTO>
  ): Promise<EnterpriseDTO | null> => {
    try {
      const endpoint = `/users/enterprise/${encodeURIComponent(userId)}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [USERS API] Mise à jour d'une entreprise:", {
        userId,
        endpoint,
        fullURL,
        data,
      });

      const response = await api.put(endpoint, data);

      console.log("✅ [USERS API] Entreprise mise à jour:", {
        status: response.status,
        data: response.data,
      });

      // Mapper la réponse
      return mapUserFromBackend(response.data) as EnterpriseDTO;
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [USERS API] Erreur lors de la mise à jour de l'entreprise"
      );
      console.error("❌ [USERS API] Type d'erreur:", typeof error);
      console.error("❌ [USERS API] Erreur complète:", error);
      console.error("❌ [USERS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [USERS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  resetPassword: async (
    resetPasswordData: ResetPasswordDTO
  ): Promise<string> => {
    try {
      const endpoint = `/auth/reset`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [USERS API] ========================================");
      console.log("🔵 [USERS API] RÉINITIALISATION DU MOT DE PASSE");
      console.log("🔵 [USERS API] ========================================");
      console.log("🔵 [USERS API] Endpoint:", endpoint);
      console.log("🔵 [USERS API] Base URL:", api.defaults.baseURL);
      console.log("🔵 [USERS API] URL complète:", fullURL);
      console.log("🔵 [USERS API] Méthode: POST");
      console.log("🔵 [USERS API] Headers:", {
        "Content-Type": "application/json",
        Authorization: api.defaults.headers.common["Authorization"]
          ? "Bearer ***"
          : "Non défini",
      });
      console.log("🔵 [USERS API] Payload envoyé:", {
        email: resetPasswordData.email,
        password: "***", // Masquer le mot de passe dans les logs
        matchingPassword: "***", // Masquer la confirmation dans les logs
        token: resetPasswordData.token ? "***" : undefined,
        currentPassword: resetPasswordData.currentPassword ? "***" : undefined,
      });
      console.log(
        "🔵 [USERS API] Payload complet (JSON):",
        JSON.stringify(
          {
            email: resetPasswordData.email,
            password: "***",
            matchingPassword: "***",
            token: resetPasswordData.token ? "***" : undefined,
            currentPassword: resetPasswordData.currentPassword
              ? "***"
              : undefined,
          },
          null,
          2
        )
      );
      console.log("🔵 [USERS API] ========================================");

      const response = await api.post(endpoint, resetPasswordData);

      console.log("✅ [USERS API] ========================================");
      console.log("✅ [USERS API] RÉPONSE REÇUE DU BACKEND");
      console.log("✅ [USERS API] ========================================");
      console.log("✅ [USERS API] Status HTTP:", response.status);
      console.log("✅ [USERS API] Status Text:", response.statusText);
      console.log("✅ [USERS API] Headers de réponse:", response.headers);
      console.log(
        "✅ [USERS API] Données reçues:",
        JSON.stringify(response.data, null, 2)
      );
      console.log("✅ [USERS API] ========================================");

      return response.data || "Mot de passe modifié avec succès";
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [USERS API] Erreur lors de la réinitialisation du mot de passe"
      );
      console.error("❌ [USERS API] Type d'erreur:", typeof error);
      console.error("❌ [USERS API] Erreur complète:", error);
      console.error("❌ [USERS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [USERS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  // GET /api/v1/users/search -> recherche d'utilisateurs avec filtres
  searchUsers: async (params: {
    q?: string;
    city?: string;
    minAge?: number;
    maxAge?: number;
    platform?: string;
    gender?: string;
    categoryId?: string;
    subCategoryId?: string;
    page?: number;
    size?: number;
  }): Promise<UserDTO[]> => {
    try {
      // Construire les paramètres de requête
      const queryParams = new URLSearchParams();

      if (params.q) queryParams.append("q", params.q);
      if (params.city) queryParams.append("city", params.city);
      if (params.minAge !== undefined)
        queryParams.append("minAge", params.minAge.toString());
      if (params.maxAge !== undefined)
        queryParams.append("maxAge", params.maxAge.toString());
      if (params.platform) queryParams.append("platform", params.platform);
      if (params.gender) queryParams.append("gender", params.gender);
      if (params.categoryId)
        queryParams.append("categoryId", params.categoryId);
      if (params.subCategoryId)
        queryParams.append("subCategoryId", params.subCategoryId);
      if (params.page !== undefined)
        queryParams.append("page", params.page.toString());
      if (params.size !== undefined)
        queryParams.append("size", params.size.toString());

      const endpoint = `/users/search${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [USERS API] Recherche d'utilisateurs:", {
        params,
        endpoint,
        fullURL,
      });

      const response = await api.get(endpoint);

      console.log("✅ [USERS API] Utilisateurs trouvés:", {
        status: response.status,
        count: Array.isArray(response.data) ? response.data.length : 0,
        data: response.data,
      });

      // Mapper les données
      if (Array.isArray(response.data)) {
        return response.data.map(mapUserFromBackend) as UserDTO[];
      }

      return [];
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [USERS API] Erreur lors de la recherche d'utilisateurs"
      );
      console.error("❌ [USERS API] Type d'erreur:", typeof error);
      console.error("❌ [USERS API] Erreur complète:", error);
      console.error("❌ [USERS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [USERS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      // En cas d'erreur, retourner un tableau vide
      return [];
    }
  },
};

// Featured API - Récupération des utilisateurs mis en avant
export const featuredAPI = {
  // GET /api/v1/featured -> récupère les utilisateurs featured
  getFeatured: async (
    type: "PROFESSIONAL" | "AGENCY" | "ENTERPRISE",
    page: number = 0,
    size: number = 20
  ): Promise<UserDTO[]> => {
    try {
      const endpoint = `/featured?type=${encodeURIComponent(
        type
      )}&page=${page}&size=${size}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [FEATURED API] Récupération des utilisateurs featured:", {
        type,
        page,
        size,
        endpoint,
        fullURL,
      });

      const response = await api.get(endpoint);

      console.log("✅ [FEATURED API] Utilisateurs featured récupérés:", {
        status: response.status,
        count: Array.isArray(response.data) ? response.data.length : 0,
        data: response.data,
      });

      // Mapper les données
      if (Array.isArray(response.data)) {
        return response.data.map(mapUserFromBackend) as UserDTO[];
      }

      return [];
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [FEATURED API] Erreur lors de la récupération des utilisateurs featured"
      );
      console.error("❌ [FEATURED API] Type d'erreur:", typeof error);
      console.error("❌ [FEATURED API] Erreur complète:", error);
      console.error("❌ [FEATURED API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [FEATURED API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      // En cas d'erreur, retourner un tableau vide
      return [];
    }
  },
};

// Applications (Candidatures) API
// Categories API
export const categoriesAPI = {
  getAllCategories: async (): Promise<CategoryDTO[]> => {
    try {
      const endpoint = `/categories`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log(
        "🔵 [CATEGORIES API] Récupération de toutes les catégories:",
        {
          endpoint,
          fullURL,
        }
      );

      const response = await api.get(endpoint);

      console.log("✅ [CATEGORIES API] Catégories récupérées:", {
        status: response.status,
        count: Array.isArray(response.data) ? response.data.length : 0,
        data: response.data,
      });

      if (Array.isArray(response.data)) {
        return (response.data as Array<Record<string, unknown>>).map((cat) => ({
          id: cat.id as string,
          name: cat.name as string,
          description: cat.description as string | undefined,
          subCategories: (
            (cat.subCategories as Array<Record<string, unknown>>) || []
          ).map((sub) => ({
            id: sub.id as string,
            name: sub.name as string,
            description: sub.description as string | undefined,
          })),
        })) as CategoryDTO[];
      }

      return [];
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [CATEGORIES API] Erreur lors de la récupération des catégories"
      );
      console.error("❌ [CATEGORIES API] Type d'erreur:", typeof error);
      console.error("❌ [CATEGORIES API] Erreur complète:", error);
      console.error("❌ [CATEGORIES API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [CATEGORIES API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },
};

// Chat/Conversations API
export const chatAPI = {
  // POST /api/v1/chat/conversations/messages - Créer une conversation en envoyant un message
  sendMessage: async (data: {
    senderId: string;
    recipientId: string;
    content: string;
    clientMessageId?: string;
  }): Promise<MessageDTO> => {
    try {
      const endpoint = `/chat/conversations/messages`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [CHAT API] Envoi d'un message:", {
        endpoint,
        fullURL,
        data,
      });

      const response = await api.post(endpoint, data);

      console.log("✅ [CHAT API] Message envoyé:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [CHAT API] Erreur lors de l'envoi du message");
      console.error("❌ [CHAT API] Type d'erreur:", typeof error);
      console.error("❌ [CHAT API] Erreur complète:", error);
      console.error("❌ [CHAT API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [CHAT API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  // GET /api/v1/chat/all-conversation?recipientId={id} - Lister les conversations
  getAllConversations: async (
    recipientId: string
  ): Promise<ConversationDTO[]> => {
    try {
      const endpoint = `/chat/all-conversation?recipientId=${encodeURIComponent(
        recipientId
      )}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [CHAT API] Récupération des conversations:", {
        recipientId,
        endpoint,
        fullURL,
      });

      const response = await api.get(endpoint);

      console.log("✅ [CHAT API] Conversations récupérées:", {
        status: response.status,
        count: Array.isArray(response.data) ? response.data.length : 0,
        data: response.data,
      });

      if (Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [CHAT API] Erreur lors de la récupération des conversations"
      );
      console.error("❌ [CHAT API] Type d'erreur:", typeof error);
      console.error("❌ [CHAT API] Erreur complète:", error);
      console.error("❌ [CHAT API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [CHAT API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  // GET /api/v1/chat/conversations/messages?userA={id}&userB={id}&since={ISO}&limit={n}
  getMessages: async (params: {
    userA: string;
    userB: string;
    since?: string;
    limit?: number;
  }): Promise<MessageDTO[]> => {
    try {
      const queryParams = new URLSearchParams({
        userA: params.userA,
        userB: params.userB,
      });
      if (params.since) {
        queryParams.append("since", params.since);
      }
      if (params.limit) {
        queryParams.append("limit", params.limit.toString());
      }

      const endpoint = `/chat/conversations/messages?${queryParams.toString()}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [CHAT API] Récupération des messages:", {
        params,
        endpoint,
        fullURL,
      });

      const response = await api.get(endpoint);

      console.log("✅ [CHAT API] Messages récupérés:", {
        status: response.status,
        count: Array.isArray(response.data) ? response.data.length : 0,
        data: response.data,
      });

      if (Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [CHAT API] Erreur lors de la récupération des messages"
      );
      console.error("❌ [CHAT API] Type d'erreur:", typeof error);
      console.error("❌ [CHAT API] Erreur complète:", error);
      console.error("❌ [CHAT API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [CHAT API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  // PUT /api/v1/chat/conversations/mark-read?userA={id}&userB={id}
  markAsRead: async (userA: string, userB: string): Promise<void> => {
    try {
      const endpoint = `/chat/conversations/mark-read?userA=${encodeURIComponent(
        userA
      )}&userB=${encodeURIComponent(userB)}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [CHAT API] Marquage des messages comme lus:", {
        userA,
        userB,
        endpoint,
        fullURL,
      });

      const response = await api.put(endpoint);

      console.log("✅ [CHAT API] Messages marqués comme lus:", {
        status: response.status,
      });
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [CHAT API] Erreur lors du marquage comme lu");
      console.error("❌ [CHAT API] Type d'erreur:", typeof error);
      console.error("❌ [CHAT API] Erreur complète:", error);
      console.error("❌ [CHAT API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [CHAT API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  // GET /api/v1/chat/waiting-message?recipientId={id}
  hasUnreadMessages: async (recipientId: string): Promise<boolean> => {
    try {
      const endpoint = `/chat/waiting-message?recipientId=${encodeURIComponent(
        recipientId
      )}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [CHAT API] Vérification des messages non lus:", {
        recipientId,
        endpoint,
        fullURL,
      });

      const response = await api.get(endpoint);

      console.log("✅ [CHAT API] Vérification effectuée:", {
        status: response.status,
        hasUnread: response.data,
      });

      return response.data === true || response.data === "true";
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [CHAT API] Erreur lors de la vérification des messages non lus"
      );
      console.error("❌ [CHAT API] Type d'erreur:", typeof error);
      console.error("❌ [CHAT API] Erreur complète:", error);
      console.error("❌ [CHAT API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [CHAT API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      return false;
    }
  },
};

export const applicationsAPI = {
  // POST /api/v1/announcements/{announcementId}/applications -> crée une candidature (multipart/form-data)
  create: async (
    announcementId: string,
    applicationData: {
      message: string;
      price?: number;
      photos?: File[];
      videos?: File[];
      applicantId?: string;
    }
  ): Promise<ApplicationDTO> => {
    try {
      const endpoint = `/announcements/${encodeURIComponent(
        announcementId
      )}/applications`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [APPLICATIONS API] Création d'une candidature:", {
        announcementId,
        endpoint,
        fullURL,
        applicationData,
      });

      // Créer FormData pour envoyer les fichiers et paramètres
      const formData = new FormData();

      // Paramètres de requête (@RequestParam)
      if (applicationData.message) {
        formData.append("message", applicationData.message);
      }

      if (applicationData.price !== undefined) {
        formData.append("price", applicationData.price.toString());
      }

      // Récupérer applicantId depuis localStorage si non fourni
      let applicantId = applicationData.applicantId;
      if (!applicantId && typeof window !== "undefined") {
        applicantId = localStorage.getItem("userId") || undefined;
      }

      if (applicantId) {
        formData.append("applicantId", applicantId);
      }

      // Ajouter les photos comme parts nommés "photos" (@RequestPart)
      if (applicationData.photos && applicationData.photos.length > 0) {
        applicationData.photos.forEach((photo) => {
          formData.append("photos", photo);
        });
      }

      // Ajouter les vidéos comme parts nommés "videos" (@RequestPart)
      if (applicationData.videos && applicationData.videos.length > 0) {
        applicationData.videos.forEach((video) => {
          formData.append("videos", video);
        });
      }

      // Optionnel : créer un part "application" avec un JSON si nécessaire
      // Pour l'instant, on n'en a pas besoin car tous les champs sont dans les RequestParam

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ [APPLICATIONS API] Candidature créée:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [APPLICATIONS API] Erreur lors de la création de la candidature"
      );
      console.error("❌ [APPLICATIONS API] Type d'erreur:", typeof error);
      console.error("❌ [APPLICATIONS API] Erreur complète:", error);
      console.error("❌ [APPLICATIONS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [APPLICATIONS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  // GET /api/v1/announcements/{announcementId}/applications -> liste des candidatures pour une annonce
  getByAnnouncement: async (
    announcementId: string
  ): Promise<ApplicationDTO[]> => {
    try {
      const endpoint = `/announcements/${encodeURIComponent(
        announcementId
      )}/applications`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log(
        "🔵 [APPLICATIONS API] Récupération des candidatures pour l'annonce:",
        {
          announcementId,
          endpoint,
          fullURL,
        }
      );

      const response = await api.get(endpoint);

      console.log("✅ [APPLICATIONS API] Candidatures récupérées:", {
        status: response.status,
        count: Array.isArray(response.data) ? response.data.length : 0,
        data: response.data,
      });

      return Array.isArray(response.data) ? response.data : [];
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [APPLICATIONS API] Erreur lors de la récupération des candidatures"
      );
      console.error("❌ [APPLICATIONS API] Type d'erreur:", typeof error);
      console.error("❌ [APPLICATIONS API] Erreur complète:", error);
      console.error("❌ [APPLICATIONS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [APPLICATIONS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      return [];
    }
  },

  // GET /api/v1/announcements/applications/applicant/{applicantId} -> liste par candidat
  getByApplicant: async (applicantId: string): Promise<ApplicationDTO[]> => {
    try {
      const endpoint = `/announcements/applications/applicant/${encodeURIComponent(
        applicantId
      )}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log(
        "🔵 [APPLICATIONS API] Récupération des candidatures du candidat:",
        {
          applicantId,
          endpoint,
          fullURL,
        }
      );

      const response = await api.get(endpoint);

      console.log(
        "✅ [APPLICATIONS API] Candidatures du candidat récupérées:",
        {
          status: response.status,
          count: Array.isArray(response.data) ? response.data.length : 0,
          data: response.data,
        }
      );

      return Array.isArray(response.data) ? response.data : [];
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [APPLICATIONS API] Erreur lors de la récupération des candidatures du candidat"
      );
      console.error("❌ [APPLICATIONS API] Type d'erreur:", typeof error);
      console.error("❌ [APPLICATIONS API] Erreur complète:", error);
      console.error("❌ [APPLICATIONS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [APPLICATIONS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      return [];
    }
  },

  // GET /api/v1/announcements/applications/owner/{ownerId} -> liste des candidatures pour les annonces d'un propriétaire
  getByOwner: async (ownerId: string): Promise<ApplicationDTO[]> => {
    try {
      const endpoint = `/announcements/applications/owner/${encodeURIComponent(
        ownerId
      )}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log(
        "🔵 [APPLICATIONS API] Récupération des candidatures du propriétaire:",
        {
          ownerId,
          endpoint,
          fullURL,
        }
      );

      const response = await api.get(endpoint);

      console.log(
        "✅ [APPLICATIONS API] Candidatures du propriétaire récupérées:",
        {
          status: response.status,
          count: Array.isArray(response.data) ? response.data.length : 0,
          data: response.data,
        }
      );

      return Array.isArray(response.data) ? response.data : [];
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [APPLICATIONS API] Erreur lors de la récupération des candidatures du propriétaire"
      );
      console.error("❌ [APPLICATIONS API] Type d'erreur:", typeof error);
      console.error("❌ [APPLICATIONS API] Erreur complète:", error);
      console.error("❌ [APPLICATIONS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [APPLICATIONS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      return [];
    }
  },

  // GET /api/v1/announcements/applications/{id} -> récupération par id
  getById: async (id: string): Promise<ApplicationDTO | null> => {
    try {
      const endpoint = `/announcements/applications/${encodeURIComponent(id)}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log(
        "🔵 [APPLICATIONS API] Récupération de la candidature par ID:",
        {
          id,
          endpoint,
          fullURL,
        }
      );

      const response = await api.get(endpoint);

      console.log("✅ [APPLICATIONS API] Candidature récupérée:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [APPLICATIONS API] Erreur lors de la récupération de la candidature"
      );
      console.error("❌ [APPLICATIONS API] Type d'erreur:", typeof error);
      console.error("❌ [APPLICATIONS API] Erreur complète:", error);
      console.error("❌ [APPLICATIONS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [APPLICATIONS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      return null;
    }
  },

  // PUT /api/v1/announcements/applications/{id}/status?status=...&requesterId=... -> mise à jour du statut
  updateStatus: async (
    id: string,
    status: "ACCEPTED" | "REJECTED",
    requesterId: string
  ): Promise<ApplicationDTO> => {
    try {
      const endpoint = `/announcements/applications/${encodeURIComponent(
        id
      )}/status?status=${status}&requesterId=${encodeURIComponent(
        requesterId
      )}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log(
        "🔵 [APPLICATIONS API] Mise à jour du statut de la candidature:",
        {
          id,
          status,
          requesterId,
          endpoint,
          fullURL,
        }
      );

      const response = await api.put(endpoint);

      console.log(
        "✅ [APPLICATIONS API] Statut de la candidature mis à jour:",
        {
          status: response.status,
          data: response.data,
        }
      );

      return response.data;
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [APPLICATIONS API] Erreur lors de la mise à jour du statut"
      );
      console.error("❌ [APPLICATIONS API] Type d'erreur:", typeof error);
      console.error("❌ [APPLICATIONS API] Erreur complète:", error);
      console.error("❌ [APPLICATIONS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [APPLICATIONS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },
};

// Reviews API - Correspond au modèle Review Java
export interface ReviewUserRefDTO {
  id: string;
}

export interface ReviewDTO {
  id?: string;
  author?: ReviewUserRefDTO | { id: string };
  receiver?: ReviewUserRefDTO | { id: string };
  overallRating: number; // 1-5
  generalFeedback?: string;
  specificRatings?: {
    punctuality?: number;
    cleanliness?: number;
    service?: number;
    communication?: number;
    professionalism?: number;
    [key: string]: number | undefined;
  };
  characteristics?: string[]; // e.g., ["professional", "friendly"]
  additionalComments?: string;
  createdAt?: string; // ISO 8601 format
  updatedAt?: string; // ISO 8601 format
}

export interface CreateReviewDTO {
  author: { id: string }; // ReviewUser ID (pas directement userId)
  receiver: { id: string }; // ReviewUser ID (pas directement userId)
  overallRating: number;
  generalFeedback?: string;
  specificRatings?: {
    punctuality?: number;
    cleanliness?: number;
    service?: number;
    communication?: number;
    professionalism?: number;
    [key: string]: number | undefined;
  };
  characteristics?: string[];
  additionalComments?: string;
}

// Helper function pour obtenir le ReviewUser ID depuis un User ID
export async function getReviewUserIdFromUserId(
  userId: string
): Promise<string | null> {
  try {
    const user = await usersAPI.getUserById(userId);
    if (user?.reviewUser?.id) {
      return user.reviewUser.id;
    }
    console.warn(
      `⚠️ [REVIEWS API] Aucun ReviewUser trouvé pour l'utilisateur ${userId}`
    );
    return null;
  } catch (error) {
    console.error(
      `❌ [REVIEWS API] Erreur lors de la récupération du ReviewUser ID pour ${userId}:`,
      error
    );
    return null;
  }
}

export const reviewsAPI = {
  // Créer un avis (utilise userId et récupère automatiquement les ReviewUser IDs)
  createReviewFromUserIds: async (
    authorUserId: string,
    receiverUserId: string,
    overallRating: number,
    generalFeedback?: string,
    additionalComments?: string
  ): Promise<ReviewDTO> => {
    try {
      // Récupérer les ReviewUser IDs
      const authorReviewUserId = await getReviewUserIdFromUserId(authorUserId);
      const receiverReviewUserId = await getReviewUserIdFromUserId(
        receiverUserId
      );

      if (!authorReviewUserId || !receiverReviewUserId) {
        throw new Error(
          "Impossible de récupérer les ReviewUser IDs pour créer l'avis"
        );
      }

      const reviewData: CreateReviewDTO = {
        author: { id: authorReviewUserId },
        receiver: { id: receiverReviewUserId },
        overallRating,
        generalFeedback,
        additionalComments,
      };

      return await reviewsAPI.createReview(reviewData);
    } catch (error) {
      console.error(
        "❌ [REVIEWS API] Erreur lors de la création de l'avis depuis userId:",
        error
      );
      throw error;
    }
  },

  // Créer un avis (avec ReviewUser IDs directement)
  createReview: async (data: CreateReviewDTO): Promise<ReviewDTO> => {
    try {
      const endpoint = `/reviews`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [REVIEWS API] Création d'un avis:", {
        endpoint,
        fullURL,
        data,
      });

      const response = await api.post(endpoint, data);

      console.log("✅ [REVIEWS API] Avis créé:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [REVIEWS API] Erreur lors de la création de l'avis");
      console.error("❌ [REVIEWS API] Type d'erreur:", typeof error);
      console.error("❌ [REVIEWS API] Erreur complète:", error);
      console.error("❌ [REVIEWS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [REVIEWS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },

  // Récupérer tous les avis pour un utilisateur (écrits + reçus)
  getAllReviewsByUserId: async (userId: string): Promise<ReviewDTO[]> => {
    try {
      const endpoint = `/reviews/users/${encodeURIComponent(userId)}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log(
        "🔵 [REVIEWS API] Récupération de tous les avis pour l'utilisateur:",
        {
          userId,
          endpoint,
          fullURL,
        }
      );

      const response = await api.get(endpoint);

      console.log("✅ [REVIEWS API] Avis récupérés:", {
        status: response.status,
        count: Array.isArray(response.data) ? response.data.length : 0,
      });

      return Array.isArray(response.data) ? response.data : [];
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [REVIEWS API] Erreur lors de la récupération des avis");
      console.error("❌ [REVIEWS API] Type d'erreur:", typeof error);
      console.error("❌ [REVIEWS API] Erreur complète:", error);
      console.error("❌ [REVIEWS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [REVIEWS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      return [];
    }
  },

  // Récupérer les avis reçus par un utilisateur
  getReceivedReviews: async (userId: string): Promise<ReviewDTO[]> => {
    try {
      const endpoint = `/reviews/users/${encodeURIComponent(userId)}/received`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [REVIEWS API] Récupération des avis reçus:", {
        userId,
        endpoint,
        fullURL,
      });

      const response = await api.get(endpoint);

      console.log("✅ [REVIEWS API] Avis reçus récupérés:", {
        status: response.status,
        count: Array.isArray(response.data) ? response.data.length : 0,
      });

      return Array.isArray(response.data) ? response.data : [];
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [REVIEWS API] Erreur lors de la récupération des avis reçus"
      );
      console.error("❌ [REVIEWS API] Type d'erreur:", typeof error);
      console.error("❌ [REVIEWS API] Erreur complète:", error);
      console.error("❌ [REVIEWS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [REVIEWS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      return [];
    }
  },

  // Récupérer les avis écrits par un utilisateur
  getWrittenReviews: async (userId: string): Promise<ReviewDTO[]> => {
    try {
      const endpoint = `/reviews/users/${encodeURIComponent(userId)}/written`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [REVIEWS API] Récupération des avis écrits:", {
        userId,
        endpoint,
        fullURL,
      });

      const response = await api.get(endpoint);

      console.log("✅ [REVIEWS API] Avis écrits récupérés:", {
        status: response.status,
        count: Array.isArray(response.data) ? response.data.length : 0,
      });

      return Array.isArray(response.data) ? response.data : [];
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error(
        "❌ [REVIEWS API] Erreur lors de la récupération des avis écrits"
      );
      console.error("❌ [REVIEWS API] Type d'erreur:", typeof error);
      console.error("❌ [REVIEWS API] Erreur complète:", error);
      console.error("❌ [REVIEWS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [REVIEWS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      return [];
    }
  },

  // Supprimer un avis
  deleteReview: async (reviewId: string): Promise<void> => {
    try {
      const endpoint = `/reviews/${encodeURIComponent(reviewId)}`;
      const fullURL = `${api.defaults.baseURL}${endpoint}`;

      console.log("🔵 [REVIEWS API] Suppression d'un avis:", {
        reviewId,
        endpoint,
        fullURL,
      });

      const response = await api.delete(endpoint);

      console.log("✅ [REVIEWS API] Avis supprimé:", {
        status: response.status,
        data: response.data,
      });
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error("❌ [REVIEWS API] Erreur lors de la suppression de l'avis");
      console.error("❌ [REVIEWS API] Type d'erreur:", typeof error);
      console.error("❌ [REVIEWS API] Erreur complète:", error);
      console.error("❌ [REVIEWS API] Message:", errorObj?.message);

      if (errorObj.response) {
        console.error("❌ [REVIEWS API] Réponse HTTP:", {
          status: errorObj.response.status,
          statusText: errorObj.response.statusText,
          data: errorObj.response.data,
        });
      }

      throw error;
    }
  },
};

// ============================================
// Campaigns API
// ============================================

export interface CampaignDTO {
  id: string;
  name: string;
  creatorId: string;
  date?: string; // ISO 8601
  photoIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CampaignCreateDTO {
  name: string;
  creatorId: string;
  date?: string; // ISO 8601, optionnel
  photoIds?: string[]; // optionnel, généralement vide au create
}

export interface CampaignPhotoDTO {
  id: string;
  filePath?: string; // ID GridFS pour construire l'URL
  url?: string; // URL complète (optionnel, peut être construit depuis filePath)
  campaignId?: string;
  ownerId?: string;
  orderIndex?: number;
  order?: number; // Alias pour orderIndex
  postId?: string | null;
  // autres champs selon la réponse du backend
}

export type PhotoResponse = CampaignPhotoDTO;

export const campaignsAPI = {
  // Créer une nouvelle campagne
  create: async (payload: CampaignCreateDTO): Promise<CampaignDTO> => {
    try {
      console.log("🔵 [CAMPAIGNS API] Création d'une campagne:", payload);

      const response = await api.post<CampaignDTO>("/campaigns", payload);

      console.log("✅ [CAMPAIGNS API] Campagne créée:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error(
        "❌ [CAMPAIGNS API] Erreur lors de la création de la campagne:",
        error
      );
      throw error;
    }
  },

  // Récupérer une campagne par ID
  getById: async (campaignId: string): Promise<CampaignDTO> => {
    try {
      console.log(
        "🔵 [CAMPAIGNS API] Récupération de la campagne:",
        campaignId
      );

      const response = await api.get<CampaignDTO>(`/campaigns/${campaignId}`);

      console.log("✅ [CAMPAIGNS API] Campagne récupérée:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error(
        "❌ [CAMPAIGNS API] Erreur lors de la récupération de la campagne:",
        error
      );
      throw error;
    }
  },

  // Récupérer toutes les campagnes d'un utilisateur
  listByCreator: async (creatorId: string): Promise<CampaignDTO[]> => {
    try {
      console.log(
        "🔵 [CAMPAIGNS API] Récupération des campagnes pour:",
        creatorId
      );

      const response = await api.get<CampaignDTO[]>(
        `/campaigns/user/${encodeURIComponent(creatorId)}`
      );

      console.log("✅ [CAMPAIGNS API] Campagnes récupérées:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: unknown) {
      console.error(
        "❌ [CAMPAIGNS API] Erreur lors de la récupération des campagnes:",
        error
      );
      // Si l'endpoint n'existe pas ou erreur, retourner un tableau vide
      return [];
    }
  },

  // Ajouter une photo à une campagne
  addPhoto: async (
    campaignId: string,
    file: File,
    ownerId: string
  ): Promise<PhotoResponse> => {
    try {
      console.log("🔵 [CAMPAIGNS API] Ajout d'une photo à la campagne:", {
        campaignId,
        fileName: file.name,
        ownerId,
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("ownerId", ownerId);

      const response = await api.post<PhotoResponse>(
        `/campaigns/${campaignId}/photos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ [CAMPAIGNS API] Photo ajoutée:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error(
        "❌ [CAMPAIGNS API] Erreur lors de l'ajout de la photo:",
        error
      );
      throw error;
    }
  },

  // Modifier l'ordre des photos d'une campagne
  updatePhotoOrder: async (
    campaignId: string,
    photoIds: string[]
  ): Promise<CampaignDTO> => {
    try {
      console.log("🔵 [CAMPAIGNS API] Mise à jour de l'ordre des photos:", {
        campaignId,
        photoIds,
      });

      const response = await api.put<CampaignDTO>(
        `/campaigns/${campaignId}/photos/order`,
        photoIds
      );

      console.log("✅ [CAMPAIGNS API] Ordre des photos mis à jour");
      return response.data;
    } catch (error: unknown) {
      console.error(
        "❌ [CAMPAIGNS API] Erreur lors de la mise à jour de l'ordre:",
        error
      );
      throw error;
    }
  },

  // Supprimer une photo d'une campagne
  removePhoto: async (campaignId: string, photoId: string): Promise<void> => {
    try {
      console.log("🔵 [CAMPAIGNS API] Suppression d'une photo:", {
        campaignId,
        photoId,
      });

      await api.delete(`/campaigns/${campaignId}/photos/${photoId}`);

      console.log("✅ [CAMPAIGNS API] Photo supprimée");
    } catch (error: unknown) {
      console.error(
        "❌ [CAMPAIGNS API] Erreur lors de la suppression de la photo:",
        error
      );
      throw error;
    }
  },

  // Récupérer les photos d'une campagne
  getPhotos: async (campaignId: string): Promise<PhotoResponse[]> => {
    try {
      console.log(
        "🔵 [CAMPAIGNS API] Récupération des photos pour la campagne:",
        campaignId
      );

      const response = await api.get<PhotoResponse[]>(
        `/campaigns/${campaignId}/photos`
      );

      console.log("✅ [CAMPAIGNS API] Photos récupérées:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: unknown) {
      console.error(
        "❌ [CAMPAIGNS API] Erreur lors de la récupération des photos:",
        error
      );
      return [];
    }
  },

  // Supprimer une campagne
  delete: async (campaignId: string): Promise<void> => {
    try {
      console.log("🔵 [CAMPAIGNS API] Suppression de la campagne:", campaignId);

      await api.delete(`/campaigns/${campaignId}`);

      console.log("✅ [CAMPAIGNS API] Campagne supprimée");
    } catch (error: unknown) {
      console.error(
        "❌ [CAMPAIGNS API] Erreur lors de la suppression de la campagne:",
        error
      );
      throw error;
    }
  },
};

// ============================================
// Facebook API
// ============================================

export const facebookAPI = {
  // Publier une photo sur Facebook par ID GridFS avec message et programmation optionnelle
  publishPhotoById: async (
    message: string,
    fileId: string, // ID GridFS du fichier
    scheduledPublishTime?: number // Timestamp Unix en millisecondes
  ): Promise<string> => {
    try {
      console.log("🔵 [FACEBOOK API] Publication d'une photo par ID:", {
        message,
        fileId,
        scheduledPublishTime,
      });

      // Construire les paramètres de requête (query params pour @RequestParam)
      const params = new URLSearchParams();
      params.append("message", message);
      params.append("fileId", fileId);
      if (scheduledPublishTime) {
        params.append("scheduledPublishTime", scheduledPublishTime.toString());
      }

      // Utiliser GET ou POST avec query params - Spring accepte les @RequestParam en POST aussi
      const response = await api.post<string>(
        `/facebook/publish/photoById?${params.toString()}`,
        {} // Body vide, tous les paramètres sont dans l'URL
      );

      console.log(
        "✅ [FACEBOOK API] Photo publiée avec succès:",
        response.data
      );
      return response.data;
    } catch (error: unknown) {
      console.error("❌ [FACEBOOK API] Erreur lors de la publication:", error);
      throw error;
    }
  },
};

export default api;
