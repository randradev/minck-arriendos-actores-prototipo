import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, 
  User, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight, 
  Search, 
  UserPlus,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  Globe,
  Fingerprint,
  Lock,
  ExternalLink,
  Upload,
  Eye,
  Trash2,
  Shield,
  AlertTriangle,
  History,
  Edit3,
  RotateCcw
} from 'lucide-react';
import { MOCK_ACTORS } from '../mockData';
import { cn } from '../lib/utils';
import { StatusManagementDrawer } from '../components/StatusManagementDrawer';
import { ConfirmationModal } from '../components/ConfirmationModal';

export const ActorEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Try to get actor from navigation state first, fallback to mock data
  const [actor, setActor] = useState(location.state?.actor || MOCK_ACTORS.find(a => a.id === id));
  const [loading, setLoading] = useState(!actor);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!actor && id) {
      // Simulate loading if not in state
      const timer = setTimeout(() => {
        const found = MOCK_ACTORS.find(a => a.id === id);
        setActor(found);
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [id, actor]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    profession: '',
    employer: '',
    entityType: ''
  });

  useEffect(() => {
    if (actor) {
      setFormData({
        name: actor.name,
        email: actor.email,
        phone: actor.phone,
        website: actor.website || '',
        profession: actor.profession || '',
        employer: actor.employer || '',
        entityType: actor.entityType || (actor.nature === 'Natural' ? 'Persona Natural' : 'Sociedad por Acciones (SpA)')
      });
    }
  }, [actor]);

  const isDirty = (field: keyof typeof formData) => {
    const originalValue = (actor as any)[field] || '';
    return formData[field] !== originalValue;
  };

  const handleReset = (field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: (actor as any)[field] || ''
    }));
  };

  // State for Confirmation Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ title?: string, message?: string, onConfirm: () => void }>({
    onConfirm: () => {}
  });

  const triggerConfirm = (onConfirm: () => void, title?: string, message?: string) => {
    setConfirmAction({ onConfirm, title, message });
    setIsConfirmModalOpen(true);
  };

  // Navigation Guard State
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | number | null>(null);

  const hasChanges = Object.keys(formData).some(key => isDirty(key as keyof typeof formData));

  const handleExitAttempt = (target?: string | number) => {
    if (hasChanges) {
      setPendingNavigation(target ?? -1);
      setIsExitModalOpen(true);
    } else {
      if (target) {
        if (typeof target === 'string') navigate(target);
        else navigate(target);
      } else {
        navigate(-1);
      }
    }
  };

  const confirmExit = () => {
    setIsExitModalOpen(false);
    if (pendingNavigation !== null) {
      if (typeof pendingNavigation === 'string') navigate(pendingNavigation);
      else navigate(pendingNavigation);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-on-surface-variant font-medium animate-pulse">Cargando datos del actor...</p>
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-on-surface font-headline">Actor no encontrado</h2>
          <p className="text-on-surface-variant max-w-xs">No pudimos localizar la ficha solicitada. Es posible que haya sido eliminada o el ID sea incorrecto.</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 primary-gradient text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all"
        >
          Volver al Listado
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface font-headline tracking-tight">Editar Actor: {actor.name}</h1>
          <div className="mt-2">
            <span className={cn(
              "inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider",
              actor.nature === 'Jurídica' ? "bg-primary-fixed text-on-primary-fixed-variant" : "bg-secondary-container text-on-secondary-container"
            )}>
              Persona {actor.nature}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleExitAttempt()}
            className="px-6 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-sm font-semibold hover:bg-surface-container-low transition-colors"
          >
            Cancelar
          </button>
          <button className="px-6 py-2.5 rounded-xl primary-gradient text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity">
            Guardar Cambios
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Column */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Section: Información Básica */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                {actor.nature === 'Jurídica' ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <h3 className="text-xl font-bold font-headline">Información Básica</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2 col-span-2">
                <label className="text-[0.75rem] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                  {actor.nature === 'Jurídica' ? 'Razón Social' : 'Nombre Completo'}
                  {isDirty('name') && (
                    <span className="flex items-center gap-1 text-amber-600 animate-in fade-in zoom-in duration-200">
                      <Edit3 className="w-3 h-3" />
                      <span className="text-[9px] font-bold">Editado</span>
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input 
                    className={cn(
                      "w-full bg-surface-container-low border-none border-b-2 focus:border-primary focus:ring-0 rounded-t-xl px-4 py-3 text-on-surface transition-all",
                      isDirty('name') ? "border-amber-400 bg-amber-50/30" : "border-transparent"
                    )}
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  {isDirty('name') && (
                    <button 
                      onClick={() => handleReset('name')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                      title="Revertir cambios"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-2 relative group">
                <label className="text-[0.75rem] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                  RUT <Lock className="w-3 h-3 text-outline" />
                </label>
                <div className="relative">
                  <input 
                    className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-on-surface-variant cursor-not-allowed opacity-70" 
                    disabled 
                    type="text" 
                    value={actor.rut}
                  />
                  <div className="absolute invisible group-hover:visible bottom-full left-0 mb-2 w-64 p-3 bg-on-surface text-white text-[10px] rounded-lg shadow-xl z-10 leading-relaxed border border-white/10">
                    Bloqueado por contratos vigentes. No se permite editar el identificador tributario de una entidad con obligaciones contractuales activas.
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                  Tipo de Entidad
                  {isDirty('entityType') && (
                    <span className="flex items-center gap-1 text-amber-600 animate-in fade-in zoom-in duration-200">
                      <Edit3 className="w-3 h-3" />
                    </span>
                  )}
                </label>
                <div className="relative group">
                  <select 
                    value={formData.entityType}
                    onChange={(e) => setFormData({...formData, entityType: e.target.value})}
                    disabled
                    className={cn(
                      "w-full bg-surface-container border-none rounded-xl px-4 py-3 text-on-surface-variant cursor-not-allowed opacity-70 appearance-none transition-all"
                    )}
                  >
                    <option value="Persona Natural">Persona Natural</option>
                    <option value="Limitada (Ltda.)">Limitada (Ltda.)</option>
                    <option value="E.I.R.L.">E.I.R.L.</option>
                    <option value="Sociedad Anónima (S.A.)">Sociedad Anónima (S.A.)</option>
                    <option value="Sociedad por Acciones (SpA)">Sociedad por Acciones (SpA)</option>
                  </select>
                  <div className="absolute invisible group-hover:visible bottom-full left-0 mb-2 w-64 p-3 bg-on-surface text-white text-[10px] rounded-lg shadow-xl z-10 leading-relaxed border border-white/10">
                    El tipo de entidad es estructural y no puede modificarse después de la creación del registro.
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                  Correo Electrónico
                  {isDirty('email') && (
                    <span className="flex items-center gap-1 text-amber-600 animate-in fade-in zoom-in duration-200">
                      <Edit3 className="w-3 h-3" />
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input 
                    className={cn(
                      "w-full bg-surface-container-low border-none border-b-2 focus:border-primary focus:ring-0 rounded-t-xl px-4 py-3 text-on-surface transition-all",
                      isDirty('email') ? "border-amber-400 bg-amber-50/30" : "border-transparent"
                    )}
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  {isDirty('email') && (
                    <button 
                      onClick={() => handleReset('email')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                  Teléfono de Contacto
                  {isDirty('phone') && (
                    <span className="flex items-center gap-1 text-amber-600 animate-in fade-in zoom-in duration-200">
                      <Edit3 className="w-3 h-3" />
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input 
                    className={cn(
                      "w-full bg-surface-container-low border-none border-b-2 focus:border-primary focus:ring-0 rounded-t-xl px-4 py-3 text-on-surface transition-all",
                      isDirty('phone') ? "border-amber-400 bg-amber-50/30" : "border-transparent"
                    )}
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  {isDirty('phone') && (
                    <button 
                      onClick={() => handleReset('phone')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              {actor.nature === 'Jurídica' ? (
                <div className="space-y-2 col-span-2">
                  <label className="text-[0.75rem] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                    Sitio Web
                    {isDirty('website') && (
                      <span className="flex items-center gap-1 text-amber-600 animate-in fade-in zoom-in duration-200">
                        <Edit3 className="w-3 h-3" />
                      </span>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        className={cn(
                          "w-full bg-surface-container-low border-none border-b-2 focus:border-primary focus:ring-0 rounded-t-xl px-4 py-3 text-on-surface transition-all",
                          isDirty('website') ? "border-amber-400 bg-amber-50/30" : "border-transparent"
                        )}
                        type="url" 
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                      />
                      {isDirty('website') && (
                        <button 
                          onClick={() => handleReset('website')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <button className="p-3 text-primary hover:bg-primary-fixed/30 rounded-xl transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[0.75rem] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                      Profesión u oficio
                      {isDirty('profession') && (
                        <span className="flex items-center gap-1 text-amber-600 animate-in fade-in zoom-in duration-200">
                          <Edit3 className="w-3 h-3" />
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input 
                        className={cn(
                          "w-full bg-surface-container-low border-none border-b-2 focus:border-primary focus:ring-0 rounded-t-xl px-4 py-3 text-on-surface transition-all",
                          isDirty('profession') ? "border-amber-400 bg-amber-50/30" : "border-transparent"
                        )}
                        type="text" 
                        value={formData.profession}
                        onChange={(e) => setFormData({...formData, profession: e.target.value})}
                      />
                      {isDirty('profession') && (
                        <button 
                          onClick={() => handleReset('profession')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.75rem] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                      Empleador
                      {isDirty('employer') && (
                        <span className="flex items-center gap-1 text-amber-600 animate-in fade-in zoom-in duration-200">
                          <Edit3 className="w-3 h-3" />
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input 
                        className={cn(
                          "w-full bg-surface-container-low border-none border-b-2 focus:border-primary focus:ring-0 rounded-t-xl px-4 py-3 text-on-surface transition-all",
                          isDirty('employer') ? "border-amber-400 bg-amber-50/30" : "border-transparent"
                        )}
                        type="text" 
                        value={formData.employer}
                        onChange={(e) => setFormData({...formData, employer: e.target.value})}
                      />
                      {isDirty('employer') && (
                        <button 
                          onClick={() => handleReset('employer')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  {actor.representedCompanyId && (
                    <div className="space-y-2">
                      <label className="text-[0.75rem] font-bold text-on-surface-variant uppercase tracking-wider">Empresa Representada</label>
                      <div className="flex gap-2">
                        <input className="flex-1 bg-surface-container border-none rounded-xl px-4 py-3 text-on-surface-variant cursor-not-allowed opacity-70" disabled type="text" value={actor.representedCompanyName}/>
                        <button 
                          onClick={() => navigate(`/actor/${actor.representedCompanyId}`)}
                          className="p-3 text-primary hover:bg-primary-fixed/30 rounded-xl transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Section: Representante Legal (Only for Juridical) */}
          {actor.nature === 'Jurídica' && (
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-outline-variant/10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">Representante Legal</h3>
                </div>
              </div>
              <div className="p-5 rounded-2xl border border-dashed border-outline-variant bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{actor.legalRepresentativeName}</p>
                    <p className="text-xs text-on-surface-variant">RUT: 15.882.341-0</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => actor.legalRepresentativeId && navigate(`/actor/${actor.legalRepresentativeId}`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-on-surface text-sm font-bold shadow-sm border border-outline-variant hover:bg-surface-container-low transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Ficha
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-primary text-sm font-bold shadow-sm border border-outline-variant hover:bg-primary-fixed/10 transition-colors">
                    <Search className="w-4 h-4" />
                    Cambiar
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Section: Estado Operativo */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-bold font-headline">Estado Operativo</h3>
              </div>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "flex items-center gap-3 px-8 py-3 rounded-full border-2 shadow-sm",
                  actor.status === 'Activo' ? "bg-green-100 border-green-500 text-green-800" : "bg-red-100 border-red-500 text-red-800"
                )}>
                  {actor.status === 'Activo' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                  <span className="text-lg font-extrabold uppercase tracking-widest font-headline">{actor.status}</span>
                </div>
                <p className="mt-4 text-center text-on-surface-variant text-sm font-medium max-w-md">
                  {actor.status === 'Activo' 
                    ? "Entidad operativa con cumplimiento legal al día y sin deudas registradas."
                    : "El sistema ha restringido la operación debido a una mora pendiente de $450.000."
                  }
                </p>
              </div>
              
              <div className="w-full max-w-sm space-y-3 bg-surface-container-low/50 p-6 rounded-2xl border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface">Documentación</span>
                  <div className="flex items-center gap-2 text-green-700">
                    <span className="text-xs font-bold">Al día</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface">Estado Financiero</span>
                  <div className={cn("flex items-center gap-2", actor.status === 'Activo' ? "text-green-700" : "text-error")}>
                    <span className="text-xs font-bold">{actor.status === 'Activo' ? 'Al día' : 'Mora detectada'}</span>
                    {actor.status === 'Activo' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface">Vigencia Legal</span>
                  <div className="flex items-center gap-2 text-green-700">
                    <span className="text-xs font-bold">Poderes vigentes</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center gap-2 px-10 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-md hover:bg-primary-container transition-all active:scale-95"
              >
                <Shield className="w-5 h-5" />
                Gestionar Estado
              </button>
              <p className="text-[10px] text-outline font-bold uppercase tracking-widest">
                Última actualización: 26 Mar 2026 por Sistema (Automático)
              </p>
            </div>
          </section>

          {/* Impact Summary */}
          <div className="p-4 bg-surface-container-low rounded-2xl flex items-center gap-4 border border-outline-variant/30">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary text-white flex items-center justify-center text-[10px] font-bold">3P</div>
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-secondary text-white flex items-center justify-center text-[10px] font-bold">3C</div>
            </div>
            <p className="text-sm text-on-surface-variant font-medium">
              Esta edición afectará a <span className="text-on-surface font-bold">3 propiedades</span> y <span className="text-on-surface font-bold">3 contratos vigentes</span> vinculados a este actor.
            </p>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Historial de Registro */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-outline-variant/10">
            <h4 className="text-sm font-bold font-headline uppercase tracking-widest text-on-surface-variant mb-6">Historial de Registro</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-outline-variant mt-1.5 z-10 relative"></div>
                  <div className="absolute top-4 left-1 w-px h-full bg-outline-variant/30"></div>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium">Creación del Registro</p>
                  <p className="text-sm font-bold text-on-surface">{actor.createdAt}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 z-10 relative"></div>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium">Última Modificación</p>
                  <p className="text-sm font-bold text-on-surface">{actor.updatedAt}</p>
                </div>
              </div>
              <div className="pt-6 border-t border-outline-variant/30 mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface-variant">Estado de Cuenta</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider rounded-full">Al día</span>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl p-8 border border-error/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
            <div className="flex items-center gap-2 mb-4 text-error">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-sm font-bold font-headline uppercase tracking-widest">Zona de Peligro</h4>
            </div>
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-on-surface font-headline">Eliminar Actor</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Esta acción es irreversible y afectará permanentemente el historial de contratos y auditoría relacionados con esta entidad.
              </p>
              <button 
                onClick={() => triggerConfirm(() => console.log('Actor eliminado'))}
                className="w-full py-2.5 rounded-xl border-2 border-error text-error text-sm font-bold hover:bg-error/5 transition-colors"
              >
                Eliminar Actor
              </button>
            </div>
          </div>
        </div>
      </div>

      <StatusManagementDrawer 
        actor={actor} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmAction.onConfirm}
        title={confirmAction.title}
        message={confirmAction.message}
      />

      {/* Exit Warning Modal */}
      <ConfirmationModal 
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={confirmExit}
        title="¿Estás seguro de salir?"
        message="Tienes cambios sin guardar que se perderán si abandonas esta pantalla"
        confirmLabel="Sí, salir sin guardar"
        cancelLabel="No, continuar editando"
        variant="info"
      />
    </div>
  );
};
