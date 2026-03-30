import { Actor, Contract, Document, ActivityLog, Notification } from './types';

export const MOCK_ACTORS: Actor[] = [
  {
    id: '1',
    name: 'Inmobiliaria Andes SpA',
    rut: '76.432.110-K',
    nature: 'Jurídica',
    status: 'Activo',
    email: 'contacto@andes-spa.cl',
    phone: '+56 2 2841 9900',
    website: 'www.andes-spa.cl',
    mainRole: 'Arrendador',
    roles: ['Arrendador', 'Representante Legal'],
    entityType: 'Sociedad por Acciones (SpA)',
    legalRepresentativeId: '9',
    legalRepresentativeName: 'Roberto Sánchez',
    createdAt: '2023-03-15',
    updatedAt: '2023-07-20',
  },
  {
    id: '2',
    name: 'Javiera Morales',
    rut: '15.890.332-4',
    nature: 'Natural',
    status: 'Activo',
    email: 'j.morales@gmail.com',
    phone: '+56 9 8765 4321',
    mainRole: 'Arrendatario',
    roles: ['Arrendatario', 'Garante'],
    profession: 'Arquitecta',
    employer: 'Estudio Urbano Ltda',
    createdAt: '2023-10-12',
    updatedAt: '2024-03-26',
  },
  {
    id: '9',
    name: 'Roberto Sánchez',
    rut: '10.234.567-8',
    nature: 'Natural',
    status: 'Activo',
    email: 'r.sanchez@andes-spa.cl',
    phone: '+56 9 9988 7766',
    mainRole: 'Representante Legal',
    roles: ['Representante Legal'],
    profession: 'Abogado',
    employer: 'Inmobiliaria Andes SpA',
    representedCompanyId: '1',
    representedCompanyName: 'Inmobiliaria Andes SpA',
    createdAt: '2023-03-15',
    updatedAt: '2023-07-20',
  },
  {
    id: '3',
    name: 'Transportes Ruiz EIRL',
    rut: '77.102.004-5',
    nature: 'Jurídica',
    status: 'Pendiente',
    email: 'admin@truiz.cl',
    phone: '+56 2 2555 1234',
    mainRole: 'Garante',
    roles: ['Garante'],
    entityType: 'Empresa Individual (EIRL)',
    createdAt: '2024-01-10',
    updatedAt: '2024-03-27',
  },
  {
    id: '4',
    name: 'Carlos Peña',
    rut: '12.445.678-9',
    nature: 'Natural',
    status: 'Activo',
    email: 'c.pena@outlook.com',
    phone: '+56 9 1122 3344',
    mainRole: 'Arrendatario',
    roles: ['Arrendatario'],
    profession: 'Ingeniero',
    employer: 'Tech Solutions',
    createdAt: '2023-05-20',
    updatedAt: '2024-02-15',
  },
  {
    id: '5',
    name: 'Constructora del Sur Ltda',
    rut: '76.111.222-3',
    nature: 'Jurídica',
    status: 'Archivado',
    email: 'info@con-sur.cl',
    phone: '+56 2 2999 8888',
    mainRole: 'Garante',
    roles: ['Garante'],
    entityType: 'Responsabilidad Limitada (Ltda.)',
    createdAt: '2022-11-05',
    updatedAt: '2023-12-10',
  },
  {
    id: '6',
    name: 'Elena Rivas',
    rut: '18.223.445-6',
    nature: 'Natural',
    status: 'Archivado',
    email: 'e.rivas@gmail.com',
    phone: '+56 9 5555 4444',
    mainRole: 'Aval',
    roles: ['Aval'],
    profession: 'Contadora',
    employer: 'Independiente',
    createdAt: '2023-01-15',
    updatedAt: '2024-01-20',
  },
  {
    id: '7',
    name: 'Logística Express SpA',
    rut: '76.888.999-0',
    nature: 'Jurídica',
    status: 'Bloqueado',
    email: 'contacto@logex.cl',
    phone: '+56 2 2777 6666',
    mainRole: 'Arrendatario',
    roles: ['Arrendatario'],
    entityType: 'Sociedad por Acciones (SpA)',
    createdAt: '2023-08-10',
    updatedAt: '2024-02-28',
  },
  {
    id: '8',
    name: 'Ricardo Valdés',
    rut: '14.233.901-2',
    nature: 'Natural',
    status: 'Pendiente',
    email: 'r.valdes@gmail.com',
    phone: '+56 9 1234 5678',
    mainRole: 'Arrendatario',
    roles: ['Arrendatario'],
    profession: 'Abogado',
    employer: 'Valdés & Asociados',
    createdAt: '2024-03-25',
    updatedAt: '2024-03-29',
  }
];

export const MOCK_CONTRACTS: Record<string, Contract[]> = {
  '1': [
    { id: 'C-8429', property: 'Edificio Panorámico II', role: 'Arrendador', rent: 2100000, status: 'Vigente' },
    { id: 'C-7712', property: 'Oficina 402 Costanera', role: 'Arrendador', rent: 1450000, status: 'Vigente' },
    { id: 'C-9011', property: 'Local 15 Mall Plaza', role: 'Representante Legal', rent: 3800000, status: 'En Prórroga' },
  ],
  '2': [
    { id: 'CON-7721', property: 'Av. Vitacura 4501, Depto 1204', role: 'Arrendatario', rent: 1250000, status: 'Vigente' },
    { id: 'CON-4412', property: 'Condell 110, Oficina 402', role: 'Garante', rent: 890000, status: 'Vigente' },
    { id: 'CON-1209', property: 'Pasaje El Sol 22, Casa B', role: 'Arrendatario', rent: 450000, status: 'Finalizado' },
  ],
  '9': [
    { id: 'C-9011', property: 'Local 15 Mall Plaza', role: 'Representante Legal', rent: 3800000, status: 'En Prórroga' },
  ],
  '4': [
    { id: 'C-5521', property: 'Depto 302, Providencia', role: 'Arrendatario', rent: 750000, status: 'Vigente' },
  ],
  '7': [
    { id: 'C-1102', property: 'Bodega 5, Quilicura', role: 'Arrendatario', rent: 1200000, status: 'Vigente' },
  ]
};

export const MOCK_DOCS: Record<string, Document[]> = {
  '1': [
    { id: 'd1', name: 'Escritura de Constitución', type: 'PDF', size: '2.4 MB', updatedAt: 'Jul 2023', status: 'Aprobado' },
    { id: 'd1b', name: 'E-RUT (SII)', type: 'PDF', size: '0.8 MB', updatedAt: 'Jul 2023', status: 'Aprobado' },
    { id: 'd1c', name: 'Vigencia de Poderes', type: 'PDF', size: '1.5 MB', updatedAt: 'Jul 2023', status: 'Aprobado' },
    { id: 'd1d', name: 'CI del Rep. Legal', type: 'PDF', size: '1.1 MB', updatedAt: 'Jul 2023', status: 'Aprobado' }
  ],
  '2': [
    { id: 'd2', name: 'Cédula de Identidad', type: 'PDF', size: '2.4 MB', updatedAt: 'Oct 2023', status: 'Aprobado' }
  ],
  '3': [
    { id: 'd3a', name: 'E-RUT (SII)', type: 'PDF', size: '0.5 MB', updatedAt: 'Mar 2024', status: 'Pendiente' },
    { id: 'd3b', name: 'Escritura de Constitución', type: 'PDF', size: '3.1 MB', updatedAt: 'Mar 2024', status: 'Aprobado' },
    { id: 'd3c', name: 'Vigencia de Poderes', type: 'PDF', size: '1.2 MB', updatedAt: 'Mar 2024', status: 'Pendiente' },
    { id: 'd3d', name: 'CI del Rep. Legal', type: 'PDF', size: '0.8 MB', updatedAt: 'Mar 2024', status: 'Aprobado' }
  ],
  '9': [
    { id: 'd9', name: 'Cédula de Identidad', type: 'PDF', size: '1.8 MB', updatedAt: 'Mar 2023', status: 'Aprobado' }
  ],
  '4': [
    { id: 'd4', name: 'Cédula de Identidad', type: 'PDF', size: '1.2 MB', updatedAt: 'Feb 2024', status: 'Aprobado' }
  ],
  '7': [
    { id: 'd7', name: 'Escritura de Constitución', type: 'PDF', size: '0.9 MB', updatedAt: 'Ago 2023', status: 'Aprobado' },
    { id: 'd7b', name: 'E-RUT (SII)', type: 'PDF', size: '0.4 MB', updatedAt: 'Ago 2023', status: 'Aprobado' },
    { id: 'd7c', name: 'Vigencia de Poderes', type: 'PDF', size: '1.1 MB', updatedAt: 'Ago 2023', status: 'Aprobado' },
    { id: 'd7d', name: 'CI del Rep. Legal', type: 'PDF', size: '0.8 MB', updatedAt: 'Ago 2023', status: 'Aprobado' }
  ]
};

export const MOCK_LOGS: Record<string, ActivityLog[]> = {
  '1': [
    { id: 'l1', action: 'Contrato Renovado', timestamp: 'Hace 2 horas', status: 'success' },
    { id: 'l2', action: 'Actualización de Poderes', timestamp: 'Ayer, 16:45 PM', status: 'warning' },
    { id: 'l3', action: 'Cobro Ejecutado', timestamp: '02 Ago, 2023', status: 'info' },
  ],
  '2': [
    { id: 'l4', action: 'Carga de documento ID', timestamp: 'Hoy, 14:20 PM', status: 'success' },
    { id: 'l5', action: 'Actualización de teléfono', timestamp: 'Ayer, 09:15 AM', status: 'info' },
    { id: 'l6', action: 'Creación de ficha', timestamp: '12 Oct, 2023', status: 'info' },
  ],
  '9': [
    { id: 'l9', action: 'Creación de ficha', timestamp: '15 Mar, 2023', status: 'info' },
  ]
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    actorName: 'Javiera Morales',
    actorId: '2',
    reason: 'Falta validar RUT',
    time: 'Hace 2m',
    status: 'nuevo'
  },
  {
    id: 'n2',
    actorName: 'Inmobiliaria Andes SpA',
    actorId: '1',
    reason: 'Escritura social no cargada',
    time: 'Hace 1h',
    status: 'nuevo'
  },
  {
    id: 'n3',
    actorName: 'Ricardo Valdés',
    actorId: '8',
    reason: 'Pendiente firma digital',
    time: 'Hace 3h',
    status: 'nuevo'
  }
];
