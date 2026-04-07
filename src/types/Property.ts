export type PropertyType = 'Oficina' | 'Departamento' | 'Bodega' | 'Local Comercial' | 'Casa' | 'Terreno' | 'Estacionamiento';
export type PropertyStatus = 'Pendiente' | 'Disponible' | 'Arrendada' | 'Inactiva';
export type ChileanRegion = 'Metropolitana' | 'Valparaíso' | 'Biobío' | 'Antofagasta' | 'Araucanía' | 'Coquimbo' | 'O\'Higgins' | 'Los Lagos' | 'Maule' | 'Los Ríos' | 'Atacama' | 'Arica y Parinacota' | 'Tarapacá' | 'Ñuble' | 'Aysén' | 'Magallanes';
export type ChileanCommune = 'Santiago' | 'Peñaflor' | 'Providencia' | 'Las Condes' | 'Pudahuel' | 'Quilicura' | 'Ñuñoa' | 'Vitacura' | 'Lo Barnechea' | 'Colina' | 'Lampa';

export interface CbrsInscription {
  fojas: string;
  number: string;
  year: string;
  pdfUrl?: string; // Si falta, el estado debe ser 'Pendiente' según reglas
}

export interface Property {
  // A. Identificación y Ubicación
  id: string;
  fantasyName: string;
  siiRol: string; // Formato: 1234-56
  address: string;
  unit?: string; // Depto, Oficina, Unidad
  commune: ChileanCommune;
  region: ChileanRegion;
  coordinates?: {
    lat: number;
    lng: number;
  };

  // B. Atributos Físicos y Uso
  type: PropertyType;
  totalSurfaceM2: number;
  usefulSurfaceM2?: number;
  terraceSurfaceM2?: number;
  distribution: {
    privates: number;
    bathrooms: number;
    floors: number;
  };
  parkingCount: number;
  storageCount: number;
  buildYear: number;

  // C. Información Financiera
  referentialRentValue: number;
  currency: 'CLP' | 'UF';
  fiscalAppraisal: number;
  contributionsAmount: number;
  averageCommonExpense: number;
  serviceAccountNumbers?: {
    electricity?: string;
    water?: string;
    gas?: string;
  };

  // D. Dossier Legal y Multimedia
  cbrsInscription: CbrsInscription;
  technicalDocUrls: {
    cip?: string;
    finalReception?: string;
    deed?: string; // Escritura
    plans?: string;
  };
  multimediaUrls: {
    photos: string[];
    virtualTour?: string;
    inventoryPhotos?: string[];
  };

  // E. Relaciones
  ownerId: string; // ID del Actor (Arrendador)

  // F. Metadatos de Sistema
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
}
