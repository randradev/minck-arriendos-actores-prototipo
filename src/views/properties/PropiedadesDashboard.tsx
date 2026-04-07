import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  Building2, 
  MapPin,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  Home,
  AlertCircle,
  CheckCircle2,
  Verified
} from 'lucide-react';
import { MOCK_PROPERTIES } from '../../PropiedadesMocks';
import { Property, PropertyStatus } from '../../types/Property';
import { cn } from '../../lib/utils';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export const PropiedadesDashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [activeTab, setActiveTab] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paginationMode, setPaginationMode] = useState<'10' | '50' | '100' | 'Todo'>('10');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  // State for Confirmation Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ title?: string, message?: string, onConfirm: () => void }>({
    onConfirm: () => {}
  });

  const triggerConfirm = (onConfirm: () => void, title?: string, message?: string) => {
    setConfirmAction({ onConfirm, title, message });
    setIsConfirmModalOpen(true);
  };

  // Listen for search query from TopBar (Smart Search)
  useEffect(() => {
    const handleSmartSearch = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setSearchQuery(detail || '');
      setCurrentPage(1);
    };
    window.addEventListener('smart-search', handleSmartSearch);
    return () => window.removeEventListener('smart-search', handleSmartSearch);
  }, []);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronUp className="w-3 h-3 opacity-20" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-3 h-3 text-primary" /> 
      : <ChevronDown className="w-3 h-3 text-primary" />;
  };

  const filteredProperties = [...properties].filter(prop => {
    // Tab filter
    const matchesTab = 
      activeTab === 'Todos' || 
      (activeTab === 'Disponibles' && prop.status === 'Disponible') ||
      (activeTab === 'Pendientes' && prop.status === 'Pendiente') ||
      (activeTab === 'Arrendadas' && prop.status === 'Arrendada') ||
      (activeTab === 'Inactivas' && prop.status === 'Inactiva');
    
    // Search filter
    const matchesSearch = 
      prop.fantasyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.siiRol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.address.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  }).sort((a, b) => {
    if (!sortConfig) return 0;
    
    const { key, direction } = sortConfig;
    let valA = a[key as keyof Property];
    let valB = b[key as keyof Property];

    if (valA === undefined) valA = '';
    if (valB === undefined) valB = '';

    if (valA < valB) {
      return direction === 'asc' ? -1 : 1;
    }
    if (valA > valB) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getCountForTab = (tabLabel: string) => {
    return properties.filter(prop => {
      const matchesTab = 
        tabLabel === 'Todos' || 
        (tabLabel === 'Disponibles' && prop.status === 'Disponible') ||
        (tabLabel === 'Pendientes' && prop.status === 'Pendiente') ||
        (tabLabel === 'Arrendadas' && prop.status === 'Arrendada') ||
        (tabLabel === 'Inactivas' && prop.status === 'Inactiva');
      
      const matchesSearch = 
        prop.fantasyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.siiRol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.address.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    }).length;
  };

  const tabs = [
    { label: 'Todos', count: getCountForTab('Todos') },
    { label: 'Disponibles', count: getCountForTab('Disponibles') },
    { label: 'Pendientes', count: getCountForTab('Pendientes') },
    { label: 'Arrendadas', count: getCountForTab('Arrendadas') },
    { label: 'Inactivas', count: getCountForTab('Inactivas') },
  ];

  const handleTabChange = (tabLabel: string) => {
    setActiveTab(tabLabel);
    setCurrentPage(1);
  };

  // Effect to handle "Todo" mode when filtered list changes
  useEffect(() => {
    if (paginationMode === 'Todo') {
      setItemsPerPage(filteredProperties.length || 1);
    }
  }, [filteredProperties.length, paginationMode]);

  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Metrics Calculations
  const totalProperties = properties.length;
  const leasedCount = properties.filter(p => p.status === 'Arrendada').length;
  const occupancyRate = totalProperties > 0 ? Math.round((leasedCount / totalProperties) * 100) : 0;
  const pendingCount = properties.filter(p => p.status === 'Pendiente').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumbs - Now handled by Layout/TopBar, but keeping layout symmetry */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">Directorio de Propiedades</h1>
        <p className="text-on-surface-variant text-sm font-medium">Gestiona tu cartera de inmuebles, estados y documentación legal.</p>
      </div>

      {/* Unified Filter and Actions Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Tabs Group */}
        <div className="flex flex-wrap gap-2 p-1 bg-surface-container-low rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleTabChange(tab.label)}
              className={cn(
                "px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-3 transition-all",
                activeTab === tab.label 
                  ? "bg-cyan-900 text-white shadow-md" 
                  : "text-on-surface-variant hover:bg-white/50"
              )}
            >
              {tab.label}
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[10px]",
                activeTab === tab.label ? "bg-white/20" : "bg-on-surface/10"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Actions Group - Search input removed to avoid duplication with TopBar */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors bg-white rounded-xl border border-outline-variant/10">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button 
            className="px-5 py-2.5 primary-gradient text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-primary/10 hover:opacity-90 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nueva Propiedad
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-outline-variant/15">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Nombre / Fantasía</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Rol SII</th>
                <th 
                  onClick={() => requestSort('type')}
                  className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant text-center cursor-pointer hover:bg-surface-container-high transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    Tipo
                    {renderSortIcon('type')}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('commune')}
                  className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant cursor-pointer hover:bg-surface-container-high transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Comuna
                    {renderSortIcon('commune')}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('status')}
                  className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant cursor-pointer hover:bg-surface-container-high transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Estado
                    {renderSortIcon('status')}
                  </div>
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {paginatedProperties.map((prop) => (
                <tr key={prop.id} className="group hover:bg-surface-container-low transition-colors duration-200 cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Home className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">{prop.fantasyName}</p>
                        <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {prop.address}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-medium text-on-surface">{prop.siiRol}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold bg-secondary-container text-on-secondary-container">
                      {prop.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-secondary">{prop.commune}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("w-1.5 h-1.5 rounded-full", 
                          prop.status === 'Disponible' ? "bg-teal-500" : 
                          prop.status === 'Pendiente' ? "bg-amber-500" : 
                          prop.status === 'Arrendada' ? "bg-blue-500" : "bg-red-500"
                        )}></span>
                        <span className={cn("text-xs font-bold",
                          prop.status === 'Disponible' ? "text-teal-700" : 
                          prop.status === 'Pendiente' ? "text-amber-700" : 
                          prop.status === 'Arrendada' ? "text-blue-700" : "text-red-700"
                        )}>{prop.status}</span>
                      </div>
                      {prop.status === 'Pendiente' && (
                        <span className="text-[10px] text-amber-700/70 italic flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-2.5 h-2.5" />
                          Faltan documentos críticos
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-secondary-container rounded-md text-on-secondary-container transition-colors" title="Ver Detalle">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-secondary-container rounded-md text-on-secondary-container transition-colors" title="Editar">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => triggerConfirm(() => console.log('Propiedad eliminada'))}
                        className="p-2 hover:bg-error-container rounded-md text-error transition-colors" 
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Full Pagination & Data Density Control - Exact Symmetry with Actores */}
        <div className="px-6 py-5 bg-surface-container-low/30 border-t border-outline-variant/10 flex flex-col lg:flex-row items-center justify-between gap-6 font-sans">
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Filas por página:</span>
              <div className="flex items-center gap-2">
                {['10', '50', '100', 'Todo'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setPaginationMode(mode as any);
                      if (mode === 'Todo') {
                        setItemsPerPage(filteredProperties.length || 1);
                      } else {
                        setItemsPerPage(parseInt(mode));
                      }
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "px-4 py-1.5 text-xs font-bold rounded-xl border transition-all",
                      paginationMode === mode
                        ? "bg-cyan-900 text-white border-cyan-900 shadow-md shadow-cyan-900/20" 
                        : "bg-white text-on-surface-variant border-outline-variant/30 hover:border-cyan-900/50 hover:bg-surface"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <p className="text-xs text-on-surface-variant font-medium">
              {filteredProperties.length > 0 ? (
                <>
                  Mostrando <span className="font-bold text-on-surface">{paginationMode === 'Todo' ? 1 : (currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-bold text-on-surface">{Math.min(currentPage * itemsPerPage, filteredProperties.length)}</span> de <span className="font-bold text-on-surface">{filteredProperties.length}</span> propiedades
                  <span className="mx-3 text-outline-variant/50">|</span>
                  Página <span className="font-bold text-on-surface">{currentPage}</span> de <span className="font-bold text-on-surface">{Math.ceil(filteredProperties.length / itemsPerPage) || 1}</span>
                </>
              ) : (
                "No se encontraron resultados"
              )}
            </p>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || paginationMode === 'Todo'}
                className={cn(
                  "p-2 rounded-lg bg-white border border-outline-variant/30 transition-all shadow-sm",
                  (currentPage === 1 || paginationMode === 'Todo')
                    ? "opacity-30 cursor-not-allowed" 
                    : "text-on-surface-variant hover:text-cyan-900 hover:border-cyan-900 hover:shadow-md active:scale-95"
                )}
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              
              <button 
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * itemsPerPage >= filteredProperties.length || paginationMode === 'Todo'}
                className={cn(
                  "p-2 rounded-lg bg-white border border-outline-variant/30 transition-all shadow-sm",
                  (currentPage * itemsPerPage >= filteredProperties.length || paginationMode === 'Todo')
                    ? "opacity-30 cursor-not-allowed" 
                    : "text-on-surface-variant hover:text-cyan-900 hover:border-cyan-900 hover:shadow-md active:scale-95"
                )}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-cyan-900 p-6 rounded-2xl relative overflow-hidden group shadow-lg shadow-cyan-900/10">
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/80 mb-1">Total Propiedades</p>
            <h4 className="text-3xl font-bold text-white font-headline">{totalProperties}</h4>
            <p className="text-sm text-white/60 mt-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white/40" />
              Patrimonio inmobiliario bajo gestión
            </p>
          </div>
          <Building2 className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15 flex flex-col justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">% de Ocupación</p>
            <div className="flex items-end gap-2">
              <h4 className="text-3xl font-bold text-on-surface font-headline">{occupancyRate}%</h4>
              <span className="text-xs text-blue-600 font-bold mb-1">Arrendadas</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-2 rounded-full mt-6 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${occupancyRate}%` }}></div>
          </div>
        </div>

        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800 mb-1">Propiedades Pendientes</p>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <h4 className="text-3xl font-bold text-amber-900 font-headline">{pendingCount}</h4>
          </div>
          <p className="text-xs text-amber-800/70 mt-4 font-medium leading-relaxed">Requieren regularización de documentos críticos para ser comercializadas.</p>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmAction.onConfirm}
        title={confirmAction.title}
        message={confirmAction.message}
      />
    </div>
  );
};
