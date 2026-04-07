import { Property } from './types/Property';

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'P1',
    fantasyName: 'Oficina Central Las Condes',
    siiRol: '1234-56',
    address: 'Av. Apoquindo 4500',
    unit: 'Oficina 1201',
    commune: 'Las Condes',
    region: 'Metropolitana',
    coordinates: { lat: -33.4145, lng: -70.5847 },
    type: 'Oficina',
    totalSurfaceM2: 120,
    usefulSurfaceM2: 110,
    terraceSurfaceM2: 10,
    distribution: { privates: 4, bathrooms: 2, floors: 1 },
    parkingCount: 2,
    storageCount: 1,
    buildYear: 2015,
    referentialRentValue: 45,
    currency: 'UF',
    fiscalAppraisal: 150000000,
    contributionsAmount: 450000,
    averageCommonExpense: 280000,
    serviceAccountNumbers: {
      electricity: '9876543-2',
      water: '1234567-8'
    },
    cbrsInscription: {
      fojas: '12345',
      number: '6789',
      year: '2015',
      pdfUrl: '/docs/cbrs_p1.pdf'
    },
    technicalDocUrls: {
      cip: '/docs/cip_p1.pdf',
      finalReception: '/docs/rf_p1.pdf'
    },
    multimediaUrls: {
      photos: ['https://placehold.co/600x400?text=Oficina+1', 'https://placehold.co/600x400?text=Oficina+2'],
      virtualTour: 'https://my.matterport.com/show/?m=example'
    },
    ownerId: '2', // Inversiones Los Andes SpA
    status: 'Disponible',
    createdAt: daysAgo(100),
    updatedAt: daysAgo(5)
  },
  {
    id: 'P2',
    fantasyName: 'Departamento Parque Providencia',
    siiRol: '5678-90',
    address: 'Av. Providencia 1234',
    unit: 'Depto 402',
    commune: 'Providencia',
    region: 'Metropolitana',
    type: 'Departamento',
    totalSurfaceM2: 75,
    usefulSurfaceM2: 70,
    terraceSurfaceM2: 5,
    distribution: { privates: 2, bathrooms: 2, floors: 1 },
    parkingCount: 1,
    storageCount: 1,
    buildYear: 2018,
    referentialRentValue: 750000,
    currency: 'CLP',
    fiscalAppraisal: 95000000,
    contributionsAmount: 120000,
    averageCommonExpense: 115000,
    cbrsInscription: {
      fojas: '5544',
      number: '3322',
      year: '2018',
      pdfUrl: '/docs/cbrs_p2.pdf'
    },
    technicalDocUrls: {},
    multimediaUrls: {
      photos: ['https://placehold.co/600x400?text=Depto+1']
    },
    ownerId: '7', // Carlos Andrés Vicuña
    status: 'Arrendada',
    createdAt: daysAgo(200),
    updatedAt: daysAgo(30)
  },
  {
    id: 'P3',
    fantasyName: 'Bodega Logística Quilicura',
    siiRol: '9988-77',
    address: 'Panamericana Norte 9000',
    unit: 'Bodega 05',
    commune: 'Quilicura',
    region: 'Metropolitana',
    type: 'Bodega',
    totalSurfaceM2: 500,
    distribution: { privates: 1, bathrooms: 1, floors: 1 },
    parkingCount: 4,
    storageCount: 0,
    buildYear: 2020,
    referentialRentValue: 85,
    currency: 'UF',
    fiscalAppraisal: 320000000,
    contributionsAmount: 850000,
    averageCommonExpense: 450000,
    cbrsInscription: {
      fojas: '8877',
      number: '1122',
      year: '2020'
      // pdfUrl: undefined -> Falta PDF, por eso está Pendiente
    },
    technicalDocUrls: {},
    multimediaUrls: {
      photos: ['https://placehold.co/600x400?text=Bodega+1']
    },
    ownerId: '2', // Inversiones Los Andes SpA
    status: 'Pendiente',
    createdAt: daysAgo(15),
    updatedAt: daysAgo(1)
  },
  {
    id: 'P4',
    fantasyName: 'Casa Familiar Peñaflor',
    siiRol: '4433-22',
    address: 'Calle Las Acacias 567',
    commune: 'Peñaflor',
    region: 'Metropolitana',
    type: 'Casa',
    totalSurfaceM2: 350,
    usefulSurfaceM2: 140,
    terraceSurfaceM2: 210,
    distribution: { privates: 3, bathrooms: 2, floors: 1 },
    parkingCount: 2,
    storageCount: 1,
    buildYear: 1995,
    referentialRentValue: 950000,
    currency: 'CLP',
    fiscalAppraisal: 85000000,
    contributionsAmount: 0,
    averageCommonExpense: 0,
    cbrsInscription: {
      fojas: '1122',
      number: '3344',
      year: '1995',
      pdfUrl: '/docs/cbrs_p4.pdf'
    },
    technicalDocUrls: {},
    multimediaUrls: {
      photos: ['https://placehold.co/600x400?text=Casa+1']
    },
    ownerId: '11', // Fernando Tapia Soto
    status: 'Inactiva', // Mantención
    createdAt: daysAgo(500),
    updatedAt: daysAgo(10)
  }
];
