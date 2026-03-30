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
  User,
  TrendingUp,
  Verified,
  ArrowRight
} from 'lucide-react';
import { MOCK_ACTORS } from '../mockData';
import { StatusBadge } from '../components/StatusBadge';
import { cn, normalizeRut } from '../lib/utils';
import { ConfirmationModal } from '../components/ConfirmationModal';

export const ActorList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paginationMode, setPaginationMode] = useState<'1' | '5' | '10' | 'Todo' | 'Custom'>('10');
  const [customInput, setCustomInput] = useState('');

  // State for Confirmation Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ title?: string, message?: string, onConfirm: () => void }>({
    onConfirm: () => {}
  });

  const triggerConfirm = (onConfirm: () => void, title?: string, message?: string) => {
    setConfirmAction({ onConfirm, title, message });
    setIsConfirmModalOpen(true);
  };

  // Listen for search query from TopBar
  useEffect(() => {
    const handleSmartSearch = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setSearchQuery(detail || '');
      setCurrentPage(1);
    };
    window.addEventListener('smart-search', handleSmartSearch);
    return () => window.removeEventListener('smart-search', handleSmartSearch);
  }, []);

  const filteredActors = MOCK_ACTORS.filter(actor => {
    // Tab filter
    const matchesTab = 
      activeTab === 'Todos' || 
      (activeTab === 'Activos' && actor.status === 'Activo') ||
      (activeTab === 'Pendientes' && actor.status === 'Pendiente') ||
      (activeTab === 'Bloqueados' && actor.status === 'Bloqueado') ||
      (activeTab === 'Archivados' && actor.status === 'Archivado');
    
    // Search filter
    const normalizedQuery = normalizeRut(searchQuery);
    const normalizedActorRut = normalizeRut(actor.rut);
    
    const matchesSearch = 
      actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      normalizedActorRut.includes(normalizedQuery) ||
      actor.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Calculate counts based on search query for each tab
  const getCountForTab = (tabLabel: string) => {
    return MOCK_ACTORS.filter(actor => {
      const matchesTab = 
        tabLabel === 'Todos' || 
        (tabLabel === 'Activos' && actor.status === 'Activo') ||
        (tabLabel === 'Pendientes' && actor.status === 'Pendiente') ||
        (tabLabel === 'Bloqueados' && actor.status === 'Bloqueado') ||
        (tabLabel === 'Archivados' && actor.status === 'Archivado');
      
      const normalizedQuery = normalizeRut(searchQuery);
      const normalizedActorRut = normalizeRut(actor.rut);
      
      const matchesSearch = 
        actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        normalizedActorRut.includes(normalizedQuery) ||
        actor.email.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    }).length;
  };

  const tabs = [
    { label: 'Todos', count: getCountForTab('Todos') },
    { label: 'Activos', count: getCountForTab('Activos') },
    { label: 'Pendientes', count: getCountForTab('Pendientes') },
    { label: 'Bloqueados', count: getCountForTab('Bloqueados') },
    { label: 'Archivados', count: getCountForTab('Archivados') },
  ];

  const handleTabChange = (tabLabel: string) => {
    setActiveTab(tabLabel);
    setCurrentPage(1);
    // If "Todo" was active, we need to update itemsPerPage to the new filtered count
    if (paginationMode === 'Todo') {
      // We'll handle this in an effect or just recalculate
    }
  };

  // Effect to handle "Todo" mode when filtered list changes
  useEffect(() => {
    if (paginationMode === 'Todo') {
      setItemsPerPage(filteredActors.length || 1);
    }
  }, [filteredActors.length, paginationMode]);

  const paginatedActors = filteredActors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
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

        {/* Actions Group */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors bg-white rounded-xl border border-outline-variant/10">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="px-5 py-2.5 primary-gradient text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-primary/10 hover:opacity-90 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Agregar Actor
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-outline-variant/15">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Nombre del Actor</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">RUT / ID</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant text-center">Tipo de Entidad</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Rol Principal</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Estado</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {paginatedActors.map((actor) => (
                <tr key={actor.id} className="group hover:bg-surface-container-low transition-colors duration-200 cursor-pointer" onClick={() => navigate(`/actor/${actor.id}`)}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-on-surface">{actor.name}</p>
                      <p className="text-[11px] text-on-surface-variant">{actor.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-on-surface">{actor.rut}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold",
                      actor.nature === 'Jurídica' ? "bg-primary-fixed text-on-primary-fixed-variant" : "bg-secondary-container text-on-secondary-container"
                    )}>
                      {actor.nature === 'Jurídica' ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {actor.nature}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-secondary">{actor.mainRole}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("w-1.5 h-1.5 rounded-full", 
                          actor.status === 'Activo' ? "bg-teal-500" : 
                          actor.status === 'Pendiente' ? "bg-amber-500" : 
                          actor.status === 'Archivado' ? "bg-slate-500" : "bg-red-500"
                        )}></span>
                        <span className={cn("text-xs font-bold",
                          actor.status === 'Activo' ? "text-teal-700" : 
                          actor.status === 'Pendiente' ? "text-amber-700" : 
                          actor.status === 'Archivado' ? "text-slate-700" : "text-red-700"
                        )}>{actor.status}</span>
                      </div>
                      {actor.status === 'Pendiente' && <span className="text-[10px] text-amber-700/70 italic">Falta validación de RUT</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => navigate(`/actor/${actor.id}`)} className="p-2 hover:bg-secondary-container rounded-md text-on-secondary-container transition-colors" title="Ver Detalle del Actor">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => navigate(`/actor/${actor.id}/edit`, { state: { actor } })} className="p-2 hover:bg-secondary-container rounded-md text-on-secondary-container transition-colors" title="Editar Actor">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => triggerConfirm(() => console.log('Actor eliminado'))}
                        className="p-2 hover:bg-error-container rounded-md text-error transition-colors" 
                        title="Eliminar Actor"
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
        
        {/* Pagination & Data Density Control */}
        <div className="px-6 py-5 bg-surface-container-low/30 border-t border-outline-variant/10 flex flex-col lg:flex-row items-center justify-between gap-6 font-sans">
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Filas por página:</span>
              <div className="flex items-center gap-2">
                {['1', '5', '10', 'Todo'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setPaginationMode(mode as any);
                      if (mode === 'Todo') {
                        setItemsPerPage(filteredActors.length || 1);
                      } else {
                        setItemsPerPage(parseInt(mode));
                      }
                      setCurrentPage(1);
                      setCustomInput('');
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
                
                <div className="flex items-center gap-2 ml-4">
                  <label htmlFor="custom-rows" className="text-xs font-bold text-on-surface-variant whitespace-nowrap">
                    Personalizar:
                  </label>
                  <div className="relative group">
                    <input
                      id="custom-rows"
                      type="number"
                      min="1"
                      placeholder="N°"
                      value={customInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomInput(val);
                        if (val !== '') {
                          const num = parseInt(val);
                          if (!isNaN(num) && num > 0) {
                            setItemsPerPage(num);
                            setPaginationMode('Custom');
                            setCurrentPage(1);
                          }
                        }
                      }}
                      className={cn(
                        "w-20 px-3 py-1.5 text-xs font-bold bg-white border rounded-xl focus:ring-2 focus:ring-cyan-600/20 outline-none transition-all placeholder:text-[10px] placeholder:font-medium",
                        paginationMode === 'Custom'
                          ? "border-cyan-600 ring-1 ring-cyan-600"
                          : "border-outline-variant/30 focus:border-cyan-600"
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <p className="text-xs text-on-surface-variant font-medium">
              {filteredActors.length > 0 ? (
                <>
                  Mostrando <span className="font-bold text-on-surface">{paginationMode === 'Todo' ? 1 : (currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-bold text-on-surface">{Math.min(currentPage * itemsPerPage, filteredActors.length)}</span> de <span className="font-bold text-on-surface">{filteredActors.length}</span> actores
                  <span className="mx-3 text-outline-variant/50">|</span>
                  Página <span className="font-bold text-on-surface">{currentPage}</span> de <span className="font-bold text-on-surface">{Math.ceil(filteredActors.length / itemsPerPage) || 1}</span>
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
                disabled={currentPage * itemsPerPage >= filteredActors.length || paginationMode === 'Todo'}
                className={cn(
                  "p-2 rounded-lg bg-white border border-outline-variant/30 transition-all shadow-sm",
                  (currentPage * itemsPerPage >= filteredActors.length || paginationMode === 'Todo')
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

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary-container p-6 rounded-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/80 mb-1">Crecimiento</p>
            <h4 className="text-2xl font-bold text-white font-headline">+12</h4>
            <p className="text-sm text-white/70 mt-4">Nuevos actores registrados este mes</p>
          </div>
          <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Balance de Portafolio</p>
            <div className="flex items-end gap-2">
              <h4 className="text-2xl font-bold text-on-surface font-headline">65%</h4>
              <span className="text-xs text-teal-600 font-medium mb-1">Entidades Jurídicas</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-6 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>

        <div className="bg-secondary-container/30 p-6 rounded-2xl border border-outline-variant/15 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-secondary-container mb-1">Fidelidad de Cartera</p>
            <h4 className="text-2xl font-bold text-on-secondary-container font-headline">2.4 Años</h4>
          </div>
          <p className="text-xs text-on-secondary-container mt-4 font-sans">Tiempo promedio de permanencia de actores en el sistema.</p>
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
