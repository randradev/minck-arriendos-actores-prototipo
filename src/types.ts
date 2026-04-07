export type EntityNature = 'Natural' | 'Jurídica';
export type ActorStatus = 'Activo' | 'Pendiente' | 'Bloqueado' | 'Archivado';
export type ActorRole = 'Arrendatario' | 'Arrendador' | 'Garante' | 'Representante Legal' | 'Aval';

export interface LegalRepresentativeReference {
  id: string;
  name: string;
  rut: string;
  phone?: string;
  email?: string;
}

export interface Actor {
  id: string;
  name: string;
  rut: string;
  nature: EntityNature;
  status: ActorStatus;
  email: string;
  phone: string;
  website?: string;
  mainRole: ActorRole;
  roles: ActorRole[];
  // Specific fields
  profession?: string;
  entityType?: string;
  legalRepresentatives?: LegalRepresentativeReference[];
  representedCompanyId?: string;
  representedCompanyName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  property: string;
  role: ActorRole;
  rent: number;
  status: 'Vigente' | 'Finalizado' | 'En Prórroga';
}

export interface DocumentVersion {
  id: string;
  updatedAt: string;
  size: string;
  type: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  updatedAt: string;
  status?: 'Pendiente' | 'Aprobado' | 'Rechazado';
  rejectionReason?: string;
  versions?: DocumentVersion[];
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

export interface Notification {
  id: string;
  actorName: string;
  actorId: string;
  reason: string;
  time: string;
  status: 'nuevo' | 'visto';
}
