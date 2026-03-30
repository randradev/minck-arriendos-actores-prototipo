import { Actor, Contract, Document, ActivityLog, Notification } from './types';

export const MOCK_ACTORS: Actor[] = [
  {
    id: '1',
    name: 'Juan Pablo Rodríguez Silva',
    rut: '12.345.678-9',
    nature: 'Natural',
    status: 'Activo',
    email: 'j.rodriguez@email.cl',
    phone: '+56 9 1234 5678',
    mainRole: 'Arrendatario',
    roles: ['Arrendatario', 'Representante Legal'],
    profession: 'Ingeniero Civil',
    employer: 'Constructora Beta S.A.',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '2',
    name: 'Inversiones Los Andes SpA',
    rut: '76.543.210-K',
    nature: 'Jurídica',
    status: 'Activo',
    email: 'contacto@losandes-inv.cl',
    phone: '+56 2 2345 6789',
    website: 'https://www.losandes-inv.cl',
    mainRole: 'Arrendador',
    roles: ['Arrendador'],
    entityType: 'SpA',
    legalRepresentativeId: '1',
    legalRepresentativeName: 'Juan Pablo Rodríguez Silva',
    createdAt: '2022-05-10T09:00:00Z',
    updatedAt: '2023-11-12T11:15:00Z',
  },
  {
    id: '3',
    name: 'María Ignacia Valenzuela Soto',
    rut: '15.678.901-2',
    nature: 'Natural',
    status: 'Pendiente',
    email: 'm.valenzuela@gmail.com',
    phone: '+56 9 8765 4321',
    mainRole: 'Arrendatario',
    roles: ['Arrendatario', 'Garante'],
    profession: 'Abogada',
    employer: 'Estudio Jurídico Valenzuela & Asociados',
    createdAt: '2024-03-01T15:20:00Z',
    updatedAt: '2024-03-01T15:20:00Z',
  },
  {
    id: '4',
    name: 'Roberto Carlos Muñoz Herrera',
    rut: '8.901.234-5',
    nature: 'Natural',
    status: 'Bloqueado',
    email: 'r.munoz@outlook.cl',
    phone: '+56 9 5555 4444',
    mainRole: 'Arrendatario',
    roles: ['Arrendatario'],
    profession: 'Comerciante',
    employer: 'Independiente',
    createdAt: '2021-08-20T10:00:00Z',
    updatedAt: '2024-01-05T09:45:00Z',
  },
  {
    id: '5',
    name: 'Agrícola del Maule Ltda',
    rut: '77.890.123-4',
    nature: 'Jurídica',
    status: 'Activo',
    email: 'administracion@agricoladelmaule.cl',
    phone: '+56 75 233 4455',
    mainRole: 'Arrendador',
    roles: ['Arrendador'],
    entityType: 'Ltda',
    legalRepresentativeId: '6',
    legalRepresentativeName: 'Carmen Gloria Lagos Ruíz',
    createdAt: '2020-03-15T08:30:00Z',
    updatedAt: '2023-12-01T16:00:00Z',
  },
  {
    id: '6',
    name: 'Carmen Gloria Lagos Ruíz',
    rut: '10.234.567-8',
    nature: 'Natural',
    status: 'Activo',
    email: 'c.lagos@agricoladelmaule.cl',
    phone: '+56 9 9888 7766',
    mainRole: 'Representante Legal',
    roles: ['Representante Legal', 'Aval'],
    profession: 'Contadora',
    employer: 'Agrícola del Maule Ltda',
    createdAt: '2020-03-10T14:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z',
  },
  {
    id: '7',
    name: 'Inmobiliaria El Roble S.A.',
    rut: '96.321.456-7',
    nature: 'Jurídica',
    status: 'Archivado',
    email: 'info@elroblesa.cl',
    phone: '+56 2 3344 5566',
    mainRole: 'Arrendador',
    roles: ['Arrendador'],
    entityType: 'S.A.',
    legalRepresentativeId: '8',
    legalRepresentativeName: 'Andrés Felipe Tagle',
    createdAt: '2019-11-20T09:00:00Z',
    updatedAt: '2023-06-30T17:00:00Z',
  },
  {
    id: '8',
    name: 'Andrés Felipe Tagle',
    rut: '11.456.789-0',
    nature: 'Natural',
    status: 'Activo',
    email: 'a.tagle@inmobiliaria.cl',
    phone: '+56 9 7766 5544',
    mainRole: 'Representante Legal',
    roles: ['Representante Legal'],
    profession: 'Arquitecto',
    employer: 'Independiente',
    createdAt: '2019-11-15T11:00:00Z',
    updatedAt: '2024-01-20T09:30:00Z',
  },
  {
    id: '9',
    name: 'Sebastián Ignacio Piñera Echenique',
    rut: '18.345.678-K',
    nature: 'Natural',
    status: 'Pendiente',
    email: 's.pinera@gmail.com',
    phone: '+56 9 6655 4433',
    mainRole: 'Garante',
    roles: ['Garante', 'Aval'],
    profession: 'Economista',
    employer: 'Universidad del Desarrollo',
    createdAt: '2024-03-10T12:00:00Z',
    updatedAt: '2024-03-10T12:00:00Z',
  },
  {
    id: '10',
    name: 'Transportes Rápidos S.A.',
    rut: '88.765.432-1',
    nature: 'Jurídica',
    status: 'Activo',
    email: 'logistica@transportesrapidos.cl',
    phone: '+56 2 5566 7788',
    mainRole: 'Arrendatario',
    roles: ['Arrendatario', 'Representante Legal'],
    entityType: 'S.A.',
    legalRepresentativeId: '1',
    legalRepresentativeName: 'Juan Pablo Rodríguez Silva',
    createdAt: '2021-05-20T10:00:00Z',
    updatedAt: '2024-02-15T11:30:00Z',
  }
];

export const MOCK_CONTRACTS: Record<string, Contract[]> = {
  '1': [
    { id: 'C-001', property: 'Departamento 402, Providencia', role: 'Arrendatario', rent: 650000, status: 'Vigente' }
  ],
  '2': [
    { id: 'C-002', property: 'Local Comercial 12, Las Condes', role: 'Arrendador', rent: 1200000, status: 'Vigente' }
  ],
  '4': [
    { id: 'C-003', property: 'Bodega 5, Quilicura', role: 'Arrendatario', rent: 300000, status: 'Finalizado' }
  ],
  '5': [
    { id: 'C-004', property: 'Predio Agrícola, Curicó', role: 'Arrendador', rent: 2500000, status: 'Vigente' }
  ],
  '10': [
    { id: 'C-005', property: 'Oficina 1501, Santiago Centro', role: 'Arrendatario', rent: 1800000, status: 'Vigente' }
  ]
};

export const MOCK_DOCS: Record<string, Document[]> = {
  '1': [
    {
      id: 'D-101',
      name: 'Cédula de Identidad',
      type: 'PDF',
      size: '1.2 MB',
      updatedAt: '2024-01-10T14:30:00Z',
      status: 'Aprobado',
      versions: [
        { id: 'V-1', updatedAt: '2023-01-15T10:05:00Z', size: '1.1 MB', type: 'PDF' },
        { id: 'V-2', updatedAt: '2024-01-10T14:30:00Z', size: '1.2 MB', type: 'PDF' }
      ]
    },
    { id: 'D-102', name: 'Liquidación de Sueldo 1', type: 'PDF', size: '0.8 MB', updatedAt: '2024-02-01T09:00:00Z', status: 'Aprobado' }
  ],
  '2': [
    { id: 'D-201', name: 'Estatutos Sociales', type: 'PDF', size: '5.4 MB', updatedAt: '2022-05-10T11:00:00Z', status: 'Aprobado' },
    { id: 'D-202', name: 'Certificado de Vigencia', type: 'PDF', size: '2.1 MB', updatedAt: '2023-11-12T10:00:00Z', status: 'Aprobado' }
  ],
  '3': [
    { id: 'D-301', name: 'Cédula de Identidad', type: 'JPG', size: '2.5 MB', updatedAt: '2024-03-01T15:20:00Z', status: 'Pendiente' }
  ],
  '4': [
    { id: 'D-401', name: 'Cédula de Identidad', type: 'PDF', size: '1.5 MB', updatedAt: '2021-08-20T10:30:00Z', status: 'Aprobado' },
    { id: 'D-402', name: 'Certificado de Antecedentes', type: 'PDF', size: '0.5 MB', updatedAt: '2024-01-05T09:00:00Z', status: 'Rechazado', rejectionReason: 'Documento vencido hace más de 30 días.' }
  ],
  '9': [
    { id: 'D-901', name: 'Cédula de Identidad', type: 'PDF', size: '1.3 MB', updatedAt: '2024-03-10T12:00:00Z', status: 'Pendiente' },
    { id: 'D-902', name: 'Certificado de Renta', type: 'PDF', size: '0.9 MB', updatedAt: '2024-03-10T12:00:00Z', status: 'Pendiente' }
  ]
};

export const MOCK_LOGS: Record<string, ActivityLog[]> = {
  '1': [
    { id: 'L-101', action: 'Creación de actor', timestamp: '2023-01-15T10:00:00Z', status: 'success' },
    { id: 'L-102', action: 'Documento Cédula Identidad subido', timestamp: '2024-01-10T14:30:00Z', status: 'info' }
  ],
  '3': [
    { id: 'L-301', action: 'Pre-registro online realizado', timestamp: '2024-03-01T15:20:00Z', status: 'info' }
  ],
  '4': [
    { id: 'L-401', action: 'Bloqueo automático de sistema', timestamp: '2024-01-05T09:45:00Z', status: 'error' },
    { id: 'L-402', action: 'Razón: Bloqueo por comportamiento de pago histórico reportado', timestamp: '2024-01-05T09:46:00Z', status: 'warning' }
  ],
  '10': [
    { id: 'L-1001', action: 'Actualización de representante legal', timestamp: '2024-02-15T11:30:00Z', status: 'success' }
  ]
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'N-1', actorName: 'María Ignacia Valenzuela Soto', actorId: '3', reason: 'Documento pendiente de validación: Cédula de Identidad', time: 'hace 2 horas', status: 'nuevo' },
  { id: 'N-2', actorName: 'Sebastián Ignacio Piñera Echenique', actorId: '9', reason: 'Nuevos documentos cargados para revisión', time: 'hace 1 día', status: 'nuevo' },
  { id: 'N-3', actorName: 'Roberto Carlos Muñoz Herrera', actorId: '4', reason: 'Alerta de bloqueo de actor en el sistema', time: 'hace 3 días', status: 'visto' }
];
