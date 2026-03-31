import { Actor, Contract, Document, ActivityLog, Notification } from './types';

// Helper para generar fechas coherentes
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const MOCK_ACTORS: Actor[] = [
  // --- ACTORES ORIGINALES (PRESERVADOS Y MEJORADOS) ---
  {
    id: '1',
    name: 'Juan Pablo Rodríguez Silva',
    rut: '12.345.678-9',
    nature: 'Natural',
    status: 'Activo',
    email: 'jp.rodriguez@email.com',
    phone: '+56 9 8765 4321',
    mainRole: 'Arrendatario',
    roles: ['Arrendatario', 'Representante Legal'],
    profession: 'Ingeniero Civil',
    employer: 'Constructora Delta SpA',
    createdAt: daysAgo(365),
    updatedAt: daysAgo(10)
  },
  {
    id: '2',
    name: 'Inversiones Los Andes SpA',
    rut: '76.123.456-K',
    nature: 'Jurídica',
    status: 'Activo',
    email: 'contacto@losandesinv.cl',
    phone: '+56 2 2345 6789',
    website: 'www.losandesinv.cl',
    mainRole: 'Arrendador',
    roles: ['Arrendador'],
    entityType: 'SpA',
    legalRepresentativeId: '1',
    legalRepresentativeName: 'Juan Pablo Rodríguez Silva',
    createdAt: daysAgo(200),
    updatedAt: daysAgo(5)
  },
  {
    id: '3',
    name: 'Inversiones Norte S.A.',
    rut: '96.555.444-3',
    nature: 'Jurídica',
    status: 'Pendiente',
    email: 'admin@inorten.cl',
    phone: '+56 2 2987 6543',
    mainRole: 'Arrendatario',
    roles: ['Arrendatario'],
    entityType: 'S.A.',
    legalRepresentativeId: '4',
    legalRepresentativeName: 'Roberto Carlos Muñoz Herrera',
    createdAt: daysAgo(30),
    updatedAt: daysAgo(2)
  },
  {
    id: '4',
    name: 'Roberto Carlos Muñoz Herrera',
    rut: '15.882.341-0',
    nature: 'Natural',
    status: 'Bloqueado',
    email: 'roberto.munoz@freemail.cl',
    phone: '+56 9 5555 4444',
    mainRole: 'Garante',
    roles: ['Garante', 'Representante Legal'],
    profession: 'Contador Auditor',
    employer: 'Independiente',
    createdAt: daysAgo(150),
    updatedAt: daysAgo(1)
  },
  {
    id: '5',
    name: 'María José Valenzuela',
    rut: '18.222.333-4',
    nature: 'Natural',
    status: 'Activo',
    email: 'mj.valenzuela@gmail.com',
    phone: '+56 9 1111 2222',
    mainRole: 'Arrendatario',
    roles: ['Arrendatario'],
    profession: 'Abogada',
    employer: 'Estudio Jurídico & Asociados',
    createdAt: daysAgo(400),
    updatedAt: daysAgo(20)
  },
  {
    id: '6',
    name: 'Transportes TransChile Ltda.',
    rut: '77.888.999-5',
    nature: 'Jurídica',
    status: 'Activo',
    email: 'logistica@transchile.cl',
    phone: '+56 2 2888 1111',
    mainRole: 'Arrendatario',
    roles: ['Arrendatario'],
    entityType: 'Ltda.',
    legalRepresentativeId: '5',
    legalRepresentativeName: 'María José Valenzuela',
    createdAt: daysAgo(100),
    updatedAt: daysAgo(5)
  },
  {
    id: '7',
    name: 'Carlos Andrés Vicuña',
    rut: '10.444.555-6',
    nature: 'Natural',
    status: 'Archivado',
    email: 'cvicuna@oldmail.com',
    phone: '+56 9 3333 4444',
    mainRole: 'Arrendador',
    roles: ['Arrendador'],
    profession: 'Médico',
    employer: 'Clínica Alemana',
    createdAt: daysAgo(800),
    updatedAt: daysAgo(300)
  },
  {
    id: '8',
    name: 'Servicios Informáticos BitSpA',
    rut: '76.999.000-1',
    nature: 'Jurídica',
    status: 'Pendiente',
    email: 'info@bitspa.io',
    phone: '+56 2 2777 0000',
    mainRole: 'Garante',
    roles: ['Garante'],
    entityType: 'SpA',
    legalRepresentativeId: '9',
    legalRepresentativeName: 'Lucía Fernanda Rojas',
    createdAt: daysAgo(10),
    updatedAt: daysAgo(1)
  },
  {
    id: '9',
    name: 'Lucía Fernanda Rojas',
    rut: '17.666.777-8',
    nature: 'Natural',
    status: 'Activo',
    email: 'lucia.rojas@bitspa.io',
    phone: '+56 9 6666 7777',
    mainRole: 'Representante Legal',
    roles: ['Representante Legal', 'Aval'],
    profession: 'Ingeniera de Software',
    employer: 'Google Chile',
    createdAt: daysAgo(60),
    updatedAt: daysAgo(5)
  },
  {
    id: '10',
    name: 'Inmobiliaria San Pedro E.I.R.L.',
    rut: '75.222.111-2',
    nature: 'Jurídica',
    status: 'Bloqueado',
    email: 'contacto@sanpedro.cl',
    phone: '+56 2 2444 5555',
    mainRole: 'Arrendador',
    roles: ['Arrendador'],
    entityType: 'E.I.R.L.',
    legalRepresentativeId: '11',
    legalRepresentativeName: 'Fernando Tapia Soto',
    createdAt: daysAgo(500),
    updatedAt: daysAgo(2)
  },
  {
    id: '11',
    name: 'Fernando Tapia Soto',
    rut: '11.333.444-5',
    nature: 'Natural',
    status: 'Activo',
    email: 'f.tapia@email.cl',
    phone: '+56 9 9900 8888',
    mainRole: 'Representante Legal',
    roles: ['Representante Legal'],
    profession: 'Arquitecto',
    employer: 'Municipalidad de Providencia',
    createdAt: daysAgo(600),
    updatedAt: daysAgo(10)
  }
];

export const MOCK_CONTRACTS: Record<string, Contract[]> = {
  '1': [
    { id: 'C-101', property: 'Departamento 402 - Providencia', rent: 550000, status: 'Vigente', role: 'Arrendatario' },
    { id: 'C-102', property: 'Oficina 1201 - Las Condes', rent: 1200000, status: 'Finalizado', role: 'Arrendatario' }
  ],
  '2': [
    { id: 'C-201', property: 'Bodega Central 05 - Quilicura', rent: 2500000, status: 'Vigente', role: 'Arrendador' },
    { id: 'C-202', property: 'Local Comercial 14 - Mall Plaza', rent: 3800000, status: 'Vigente', role: 'Arrendador' }
  ],
  '3': [
    { id: 'C-301', property: 'Terreno Industrial Lote B - Lampa', rent: 4500000, status: 'Vigente', role: 'Arrendatario' }
  ],
  '6': [
    { id: 'C-601', property: 'Estacionamiento Flota A - Pudahuel', rent: 900000, status: 'Vigente', role: 'Arrendatario' }
  ]
};

export const MOCK_DOCS: Record<string, Document[]> = {
  '1': [
    { id: 'D-1', name: 'Cédula de Identidad', type: 'PDF', size: '1.2 MB', updatedAt: '15 Mar 2026', status: 'Aprobado' }
  ],
  '3': [
    { id: 'D-3', name: 'E-RUT (SII)', type: 'PDF', size: '0.8 MB', updatedAt: '28 Mar 2026', status: 'Pendiente' },
    { id: 'D-4', name: 'Escritura de Constitución', type: 'PDF', size: '4.5 MB', updatedAt: '28 Mar 2026', status: 'Rechazado', rejectionReason: 'Falta timbre de notaría en página 4' }
  ],
  '4': [
    { id: 'D-5', name: 'Cédula de Identidad', type: 'JPG', size: '2.1 MB', updatedAt: '10 Feb 2026', status: 'Aprobado' }
  ],
  '8': [
    { id: 'D-8', name: 'Vigencia de Poderes', type: 'PDF', size: '1.5 MB', updatedAt: 'Recién', status: 'Pendiente' }
  ]
};

export const MOCK_LOGS: Record<string, ActivityLog[]> = {
  '1': [
    { id: 'L-1', action: 'Acceso al portal de pagos', timestamp: 'Hace 2 horas', status: 'info' },
    { id: 'L-2', action: 'Actualización de correo electrónico', timestamp: 'Hace 2 días', status: 'success' }
  ],
  '4': [
    { id: 'L-3', action: 'Bloqueo preventivo por morosidad en contrato C-105', timestamp: 'Hace 1 día', status: 'warning' },
    { id: 'L-4', action: 'Intento de carga de documento inválido', timestamp: 'Hace 3 días', status: 'error' }
  ],
  '10': [
    { id: 'L-5', action: 'Actor bloqueado por reporte de fraude externo', timestamp: 'Hace 12 horas', status: 'warning' }
  ]
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'N-1', actorName: 'Inversiones Norte S.A.', actorId: '3', reason: 'Tiene documentos rechazados que requieren acción', time: 'Hace 30 min', status: 'nuevo' },
  { id: 'N-2', actorName: 'Servicios Informáticos BitSpA', actorId: '8', reason: 'Nuevos documentos cargados para revisión', time: 'Hace 1 día', status: 'nuevo' },
  { id: 'N-3', actorName: 'Roberto Carlos Muñoz Herrera', actorId: '4', reason: 'Alerta de bloqueo de actor en el sistema', time: 'Hace 3 días', status: 'visto' }
];
