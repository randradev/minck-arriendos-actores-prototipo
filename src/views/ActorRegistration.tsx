import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Building2, 
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
  X,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ConfirmationModal } from '../components/ConfirmationModal';

// Mock database of natural persons
const INITIAL_NATURAL_PERSONS = [
  { id: '1', name: 'Roberto Carlos Benítez', rut: '12.345.678-9', email: 'r.benitez@empresa.com', phone: '+56 9 8765 4321' },
  { id: '2', name: 'Juan Pérez González', rut: '15.882.341-0', email: 'juan.perez@gmail.com', phone: '+56 9 1234 5678' },
];

// Helper to format Chilean RUT
const formatRut = (value: string) => {
  const clean = value.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length === 0) return '';
  
  // Only allow 'K' as the last character
  const body = clean.slice(0, -1).replace(/[^0-9]/g, '');
  const lastChar = clean.slice(-1);
  const finalClean = body + lastChar;

  if (finalClean.length === 1) return finalClean;
  
  const dv = finalClean.slice(-1);
  const bodyPart = finalClean.slice(0, -1);
  
  return bodyPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
};

// Helper to format Passport (AAXNNNNNN)
const formatPassport = (value: string) => {
  const clean = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  let formatted = '';
  for (let i = 0; i < clean.length && i < 9; i++) {
    const char = clean[i];
    if (i < 2) { // AA
      if (/[A-Z]/.test(char)) formatted += char;
    } else if (i === 2) { // X (Digit control)
      if (/[0-9]/.test(char)) formatted += char;
    } else { // NNNNNN
      if (/[0-9]/.test(char)) formatted += char;
    }
  }
  return formatted;
};

export const ActorRegistration = () => {
  const navigate = useNavigate();
  const [nature, setNature] = useState<'Natural' | 'Jurídica'>('Natural');
  const [docType, setDocType] = useState('RUT');
  const [rut, setRut] = useState('');
  const [showRutError, setShowRutError] = useState(false);

  // Main Form State
  const [mainDocNumber, setMainDocNumber] = useState('');
  const [mainName, setMainName] = useState('');
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Documentation State
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, { fileName: string; status: 'Pendiente'; docNumber?: string }>>({});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [tempDocNumber, setTempDocNumber] = useState('');

  // Legal Representative Search State
  const [naturalPersons, setNaturalPersons] = useState(INITIAL_NATURAL_PERSONS);
  const [repSearch, setRepSearch] = useState('');
  const [showRepResults, setShowRepResults] = useState(false);
  const [selectedRep, setSelectedRep] = useState<{ name: string; rut: string } | null>(null);
  const [showNotFoundAlert, setShowNotFoundAlert] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Modal Form State
  const [modalData, setModalData] = useState({
    docType: 'RUN',
    docNumber: '',
    fullName: '',
    email: '',
    phone: ''
  });
  const [attemptedModalSubmit, setAttemptedModalSubmit] = useState(false);

  // Navigation Guard State
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const isFormDirty = mainDocNumber.trim() !== '' || mainName.trim() !== '' || Object.keys(uploadedDocs).length > 0 || selectedRep !== null;

  const handleExitAttempt = () => {
    if (isFormDirty) {
      setIsExitModalOpen(true);
    } else {
      navigate('/');
    }
  };

  const confirmExit = () => {
    setIsExitModalOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isFormDirty]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowRepResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNatureChange = (newNature: 'Natural' | 'Jurídica') => {
    setNature(newNature);
    if (newNature === 'Jurídica') {
      setDocType('RUT');
    }
  };

  const handleRepSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = formatRut(e.target.value);
    setRepSearch(val);
    setSelectedRep(null);
    
    // Trigger search logic
    const exactMatch = naturalPersons.find(p => p.rut === val);
    const partialMatches = naturalPersons.filter(p => p.rut.startsWith(val) || p.name.toLowerCase().includes(val.toLowerCase()));

    if (exactMatch) {
      setShowRepResults(false);
      setShowNotFoundAlert(false);
      setSelectedRep({ name: exactMatch.name, rut: exactMatch.rut });
    } else if (val.length > 0) {
      if (partialMatches.length > 0) {
        setShowRepResults(true);
        setShowNotFoundAlert(false);
      } else {
        setShowRepResults(false);
        setShowNotFoundAlert(true);
      }
    } else {
      setShowRepResults(false);
      setShowNotFoundAlert(false);
    }
  };

  const selectRep = (person: typeof INITIAL_NATURAL_PERSONS[0]) => {
    setSelectedRep({ name: person.name, rut: person.rut });
    setRepSearch(person.rut);
    setShowRepResults(false);
    setShowNotFoundAlert(false);
  };

  const openRegistrationModal = () => {
    setModalData({
      ...modalData,
      docNumber: repSearch,
      fullName: '',
      email: '',
      phone: ''
    });
    setAttemptedModalSubmit(false);
    setIsModalOpen(true);
  };

  const isModalValid = () => {
    return modalData.fullName.trim() !== '' && modalData.docType !== '' && modalData.docNumber.trim() !== '';
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedModalSubmit(true);

    if (!isModalValid()) return;

    // Silent creation
    const newPerson = {
      id: Date.now().toString(),
      name: modalData.fullName,
      rut: modalData.docNumber,
      email: modalData.email,
      phone: modalData.phone
    };
    setNaturalPersons([...naturalPersons, newPerson]);
    
    // Auto-assign
    setSelectedRep({ name: newPerson.name, rut: newPerson.rut });
    setRepSearch(newPerson.rut);
    setIsModalOpen(false);
    setShowNotFoundAlert(false);

    // Success Feedback
    setToastMessage('Registro creado exitosamente');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const isFormValid = () => {
    const basicValid = mainDocNumber.trim() !== '' && mainName.trim() !== '';
    if (nature === 'Jurídica') {
      return basicValid && selectedRep !== null;
    }
    return basicValid;
  };

  const handleCreateActor = () => {
    setAttemptedSubmit(true);
    if (isFormValid()) {
      setToastMessage('Registro creado exitosamente');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/');
      }, 2000);
    }
  };

  const docSlots = nature === 'Natural' 
    ? ['Cédula de Identidad']
    : ['E-RUT (SII)', 'Escritura de Constitución', 'Vigencia de Poderes', 'CI del Rep. Legal'];

  const handleUploadClick = (slot: string) => {
    setActiveSlot(slot);
    setTempFile(null);
    setTempDocNumber('');
    setIsUploadModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTempFile(e.target.files[0]);
    }
  };

  const confirmUpload = () => {
    if (activeSlot && tempFile) {
      setUploadedDocs({
        ...uploadedDocs,
        [activeSlot]: { 
          fileName: tempFile.name, 
          status: 'Pendiente',
          docNumber: tempDocNumber 
        }
      });
      setIsUploadModalOpen(false);
      setToastMessage('Documento cargado correctamente');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const removeDoc = (slot: string) => {
    const newDocs = { ...uploadedDocs };
    delete newDocs[slot];
    setUploadedDocs(newDocs);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">Registro de Actor</h2>
          <p className="text-on-surface-variant">Complete el formulario para dar de alta una nueva entidad en el sistema.</p>
        </div>
        
        <button 
          onClick={handleExitAttempt}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-outline-variant/20 text-sm font-bold text-on-surface hover:bg-surface-container-low transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Actores
        </button>
      </div>

      {/* Main Form Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/15 shadow-sm space-y-12">
        {/* Section 1: Nature Selection */}
        <section className="space-y-6">
          <h3 className="font-headline text-lg font-bold text-on-surface">Seleccione el tipo de entidad</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              onClick={() => handleNatureChange('Natural')}
              className={cn(
                "relative group cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300",
                nature === 'Natural' 
                  ? "border-primary bg-primary-fixed/5 ring-4 ring-primary/5" 
                  : "border-outline-variant hover:border-primary-fixed-dim opacity-70"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                  nature === 'Natural' ? "bg-primary text-white" : "bg-secondary-container text-on-secondary-container"
                )}>
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-headline font-bold text-on-surface">Persona Natural</p>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Individuos que actúan por cuenta propia, profesionales independientes o prestadores de servicios personales.</p>
                </div>
              </div>
              {nature === 'Natural' && (
                <div className="absolute top-4 right-4 text-primary">
                  <CheckCircle2 className="w-6 h-6 fill-primary-fixed/30" />
                </div>
              )}
            </div>

            <div 
              onClick={() => handleNatureChange('Jurídica')}
              className={cn(
                "relative group cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300",
                nature === 'Jurídica' 
                  ? "border-primary bg-primary-fixed/5 ring-4 ring-primary/5" 
                  : "border-outline-variant hover:border-primary-fixed-dim opacity-70"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  nature === 'Jurídica' ? "bg-primary text-white" : "bg-primary-fixed text-on-primary-fixed-variant"
                )}>
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-headline font-bold text-on-surface">Persona Jurídica</p>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Empresas, organizaciones o fundaciones con RUT institucional y representación legal.</p>
                </div>
              </div>
              {nature === 'Jurídica' && (
                <div className="absolute top-4 right-4 text-primary">
                  <CheckCircle2 className="w-6 h-6 fill-primary-fixed/30" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 2: Basic Info */}
        <section className="space-y-6">
          <h3 className="font-headline text-lg font-bold text-on-surface">Información Básica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">
                Tipo de documento <span className="text-error">*</span>
              </label>
              {nature === 'Natural' ? (
                <select 
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-xl text-sm px-4 py-3 transition-colors appearance-none"
                >
                  <option value="RUN">RUN</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              ) : (
                <div className="w-full bg-surface-container-low border-0 border-b-2 border-transparent rounded-t-xl text-sm px-4 py-3 text-on-surface/50">
                  RUT
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">
                N° Documento <span className="text-error">*</span>
              </label>
              <input 
                value={mainDocNumber}
                onChange={(e) => {
                  const val = (nature === 'Jurídica' || docType === 'RUN') 
                    ? formatRut(e.target.value) 
                    : formatPassport(e.target.value);
                  setMainDocNumber(val);
                }}
                className={cn(
                  "w-full bg-surface-container-low border-0 border-b-2 focus:border-primary focus:ring-0 rounded-t-xl text-sm px-4 py-3 transition-colors",
                  attemptedSubmit && mainDocNumber.trim() === '' ? "border-error bg-error/5" : "border-transparent"
                )}
                placeholder={nature === 'Jurídica' || docType === 'RUN' ? "12.345.678-9" : "AAXNNNNNN"}
                type="text"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">
                {nature === 'Jurídica' ? 'Razón Social' : 'Nombre Completo'} <span className="text-error">*</span>
              </label>
              <input 
                value={mainName}
                onChange={(e) => setMainName(e.target.value)}
                className={cn(
                  "w-full bg-surface-container-low border-0 border-b-2 focus:border-primary focus:ring-0 rounded-t-xl text-sm px-4 py-3 transition-colors",
                  attemptedSubmit && mainName.trim() === '' ? "border-error bg-error/5" : "border-transparent"
                )}
                placeholder={nature === 'Jurídica' ? 'Ej: Inversiones Globales SpA' : 'Ej: Juan Pérez González'}
                type="text"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">Correo electrónico</label>
              <input 
                className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-xl text-sm px-4 py-3 transition-colors" 
                placeholder="nombre@ejemplo.com"
                type="email"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">Teléfono</label>
              <input 
                className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-xl text-sm px-4 py-3 transition-colors" 
                placeholder="+56 9 1234 5678"
                type="tel"
              />
            </div>
            {nature === 'Jurídica' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">Sitio web</label>
                <input 
                  className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-xl text-sm px-4 py-3 transition-colors" 
                  placeholder="https://www.tusitio.com"
                  type="url"
                />
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Specific Attributes */}
        <section className="space-y-6">
          <h3 className="font-headline text-lg font-bold text-on-surface">
            Atributos Específicos ({nature})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {nature === 'Jurídica' ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">Tipo de entidad</label>
                  <select className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-xl text-sm px-4 py-3 transition-colors appearance-none">
                    <option>Sociedad por Acciones (SpA)</option>
                    <option>Soc. de Responsabilidad Limitada (Ltda.)</option>
                    <option>Empresa Individual de Responsabilidad Limitada (EIRL)</option>
                    <option>Sociedad Anónima (S.A.)</option>
                    <option>Org. sin Fines de Lucro (ORG)</option>
                    <option>Entidades Estatales (EST)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">Representante Legal (RUT)</label>
                  <div className="relative" ref={searchRef}>
                    <div className="relative">
                      <input 
                        value={repSearch}
                        onChange={handleRepSearchChange}
                        className={cn(
                          "w-full bg-surface-container-low border-0 border-b-2 focus:border-primary focus:ring-0 rounded-t-xl text-sm px-4 py-3 pr-12 transition-colors font-sans",
                          selectedRep ? "text-primary font-bold border-transparent" : (attemptedSubmit && nature === 'Jurídica' ? "border-error bg-error/5" : "border-transparent")
                        )}
                        placeholder="15.882.341-0"
                        type="text"
                      />
                      <div className="absolute right-4 top-3 flex items-center gap-2">
                        {selectedRep ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : (
                          <Search className="w-4 h-4 text-on-surface-variant" />
                        )}
                      </div>
                    </div>

                    {/* Autocomplete Dropdown */}
                    <AnimatePresence>
                      {showRepResults && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-50 left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl overflow-hidden"
                        >
                          {naturalPersons
                            .filter(p => p.rut.includes(repSearch))
                            .map(person => (
                              <div 
                                key={person.id}
                                onClick={() => selectRep(person)}
                                className="px-4 py-3 hover:bg-surface-container-low cursor-pointer transition-colors border-b border-outline-variant/10 last:border-0"
                              >
                                <p className="text-sm font-bold text-on-surface font-sans">{person.name}</p>
                                <p className="text-xs text-on-surface-variant font-sans">{person.rut}</p>
                              </div>
                            ))
                          }
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Selected Representative Display */}
                    {selectedRep && (
                      <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-lg border border-primary/20 animate-in fade-in zoom-in duration-300">
                        <User className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-bold text-primary font-sans">Vínculo: {selectedRep.name}</span>
                        <button 
                          onClick={() => { setSelectedRep(null); setRepSearch(''); }}
                          className="ml-auto text-on-surface-variant hover:text-error transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Not Found Alert */}
                    <AnimatePresence>
                      {showNotFoundAlert && !selectedRep && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 space-y-3">
                            <div className="flex items-center gap-2 px-4 py-3 bg-[#FFF4E5] border border-[#FFD599] rounded-xl">
                              <AlertCircle className="w-5 h-5 text-[#E67E22]" />
                              <span className="text-sm font-medium text-[#D35400] font-sans">El RUN ingresado no está registrado</span>
                            </div>
                            <button 
                              onClick={openRegistrationModal}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary-container text-on-secondary-container font-bold text-sm hover:bg-secondary-container/80 transition-all active:scale-95 font-sans"
                            >
                              <UserPlus className="w-4 h-4" />
                              Registrar como nuevo actor
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">Profesión u oficio</label>
                  <input 
                    className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-xl text-sm px-4 py-3 transition-colors" 
                    placeholder="Ej: Diseñador Industrial"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">Empleador</label>
                  <input 
                    className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-xl text-sm px-4 py-3 transition-colors" 
                    placeholder="Nombre de la empresa o institución"
                    type="text"
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* Section 4: Optional Documentation */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-lg font-bold text-on-surface">Carga de Documentación (Opcional)</h3>
            <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest bg-surface-container-low px-2 py-1 rounded-md">
              {Object.keys(uploadedDocs).length} de {docSlots.length} cargados
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {docSlots.map((slot) => {
              const isUploaded = !!uploadedDocs[slot];
              return (
                <div 
                  key={slot}
                  className={cn(
                    "relative group rounded-2xl border-2 transition-all duration-300 p-5 flex flex-col gap-4 font-sans",
                    isUploaded 
                      ? "border-primary/20 bg-primary/5" 
                      : "border-dashed border-outline-variant hover:border-primary/40 hover:bg-surface-container-low"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      isUploaded ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"
                    )}>
                      <FileText className="w-5 h-5" />
                    </div>
                    {isUploaded && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-white/80 rounded-full border border-primary/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-amber-700 uppercase">Pendiente</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-on-surface uppercase tracking-tight line-clamp-1">{slot}</p>
                    {isUploaded ? (
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-primary font-medium truncate">{uploadedDocs[slot].fileName}</p>
                        {uploadedDocs[slot].docNumber && (
                          <p className="text-[9px] text-on-surface-variant font-mono">{uploadedDocs[slot].docNumber}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-[10px] text-on-surface-variant">Sin archivo seleccionado</p>
                    )}
                  </div>

                  {isUploaded ? (
                    <button 
                      onClick={() => removeDoc(slot)}
                      className="mt-auto flex items-center justify-center gap-2 py-2 rounded-xl bg-white border border-outline-variant/30 text-[10px] font-bold text-error hover:bg-error/5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                      Eliminar
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleUploadClick(slot)}
                      className="mt-auto flex items-center justify-center gap-2 py-2 rounded-xl bg-primary text-white text-[10px] font-bold hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <UserPlus className="w-3 h-3" />
                      Cargar Archivo
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-on-surface-variant/70 italic flex items-center gap-2">
            <Info className="w-3 h-3" />
            Puede completar el registro ahora y cargar estos documentos más tarde desde la ficha del actor.
          </p>
        </section>
      </div>

      {/* Quick Registration Modal (Drawer) */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface-container-lowest shadow-2xl z-[101] flex flex-col font-sans"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-outline-variant/10 relative">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-8 right-8 p-2 rounded-full hover:bg-surface-container-low transition-colors"
                >
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Gestión de Terceros</p>
                <h2 className="text-2xl font-headline font-extrabold text-[#004D5C] leading-tight">Registrar Representante Legal</h2>
                <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">
                  Asocie una persona natural como representante legal facultado para esta entidad jurídica.
                </p>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {/* Mandatory Data */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-error" />
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Datos Obligatorios</p>
                  </div>

                  <div className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">NOMBRE COMPLETO <span className="text-error">*</span></label>
                      <input 
                        value={modalData.fullName}
                        onChange={(e) => setModalData({...modalData, fullName: e.target.value})}
                        className={cn(
                          "w-full bg-surface-container-low border-0 border-b-2 focus:border-primary focus:ring-0 rounded-t-xl text-sm px-4 py-3 transition-colors",
                          attemptedModalSubmit && modalData.fullName.trim() === '' ? "border-error bg-error/5" : "border-transparent"
                        )}
                        placeholder="Ej: Roberto Carlos Benítez"
                        type="text"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">TIPO DE DOCUMENTO <span className="text-error">*</span></label>
                        <select 
                          value={modalData.docType}
                          onChange={(e) => setModalData({...modalData, docType: e.target.value})}
                          className={cn(
                            "w-full bg-surface-container-low border-0 border-b-2 focus:border-primary focus:ring-0 rounded-t-xl text-sm px-4 py-3 transition-colors appearance-none",
                            attemptedModalSubmit && modalData.docType === '' ? "border-error bg-error/5" : "border-transparent"
                          )}
                        >
                          <option value="RUN">RUN</option>
                          <option value="Pasaporte">Pasaporte</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">N° DOCUMENTO <span className="text-error">*</span></label>
                        <input 
                          value={modalData.docNumber}
                          onChange={(e) => {
                            const val = modalData.docType === 'RUN' 
                              ? formatRut(e.target.value) 
                              : formatPassport(e.target.value);
                            setModalData({...modalData, docNumber: val});
                          }}
                          className={cn(
                            "w-full bg-surface-container-low border-0 border-b-2 focus:border-primary focus:ring-0 rounded-t-xl text-sm px-4 py-3 transition-colors",
                            attemptedModalSubmit && modalData.docNumber.trim() === '' ? "border-error bg-error/5" : "border-transparent"
                          )}
                          placeholder={modalData.docType === 'RUN' ? "12.345.678-9" : "AAXNNNNNN"}
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Data */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/30" />
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Datos de Contacto (Opcional)</p>
                  </div>

                  <div className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">CORREO ELECTRÓNICO</label>
                      <input 
                        value={modalData.email}
                        onChange={(e) => setModalData({...modalData, email: e.target.value})}
                        className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-xl text-sm px-4 py-3 transition-colors" 
                        placeholder="r.benitez@empresa.com"
                        type="email"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">TELÉFONO</label>
                      <div className="flex gap-2">
                        <div className="w-16 bg-surface-container-low border-0 border-b-2 border-transparent rounded-t-xl text-sm px-4 py-3 text-on-surface-variant flex items-center justify-center">
                          +56
                        </div>
                        <input 
                          value={modalData.phone}
                          onChange={(e) => setModalData({...modalData, phone: e.target.value})}
                          className="flex-1 bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-xl text-sm px-4 py-3 transition-colors" 
                          placeholder="9 8765 4321"
                          type="tel"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Note */}
                <div className="bg-primary/5 rounded-2xl p-4 flex gap-4 border border-primary/10">
                  <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    El representante legal debe estar previamente habilitado en el padrón nacional de contribuyentes para las validaciones automáticas correspondientes.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-outline-variant/10 space-y-4">
                <button 
                  onClick={handleModalSubmit}
                  className={cn(
                    "w-full py-4 rounded-xl bg-[#004D5C] text-white font-bold text-sm transition-all shadow-lg shadow-[#004D5C]/20",
                    !isModalValid() ? "opacity-50 cursor-not-allowed" : "hover:bg-[#003D49] active:scale-[0.98]"
                  )}
                >
                  Confirmar Representante
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Upload Documentation Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-2xl z-[151] overflow-hidden font-sans"
            >
              <div className="p-8 border-b border-outline-variant/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="w-6 h-6" />
                  </div>
                  <button 
                    onClick={() => setIsUploadModalOpen(false)}
                    className="p-2 rounded-full hover:bg-surface-container-low transition-colors"
                  >
                    <X className="w-5 h-5 text-on-surface-variant" />
                  </button>
                </div>
                <h3 className="text-xl font-headline font-extrabold text-on-surface">Cargar Documento</h3>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">Seleccione el archivo correspondiente al requisito solicitado.</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">Tipo de Documento</label>
                  <div className="w-full bg-surface-container-low border-0 border-b-2 border-primary/20 rounded-t-xl text-sm px-4 py-3 text-on-surface font-bold">
                    {activeSlot}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">N° Documento Asociado (Opcional)</label>
                  <input 
                    type="text"
                    value={tempDocNumber}
                    onChange={(e) => {
                      const isRutRelated = activeSlot?.includes('RUT') || activeSlot?.includes('CI') || activeSlot?.includes('Cédula');
                      const isPassport = activeSlot?.includes('Pasaporte');
                      const val = isRutRelated ? formatRut(e.target.value) : (isPassport ? formatPassport(e.target.value) : e.target.value.toUpperCase());
                      setTempDocNumber(val);
                    }}
                    placeholder={activeSlot?.includes('RUT') || activeSlot?.includes('CI') || activeSlot?.includes('Cédula') ? "12.345.678-9" : (activeSlot?.includes('Pasaporte') ? "AAXNNNNNN" : "N° Documento")}
                    className="w-full bg-surface-container-low border-0 border-b-2 border-primary/20 rounded-t-xl text-sm px-4 py-3 text-on-surface focus:border-primary focus:ring-0 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">Archivo</label>
                  <div className="relative">
                    <input 
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className={cn(
                      "w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all",
                      tempFile ? "border-primary bg-primary/5" : "border-outline-variant bg-surface-container-low hover:border-primary/40"
                    )}>
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        tempFile ? "bg-primary text-white" : "bg-white text-on-surface-variant"
                      )}>
                        {tempFile ? <CheckCircle2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-on-surface">
                          {tempFile ? tempFile.name : "Haga clic o arrastre un archivo"}
                        </p>
                        <p className="text-[10px] text-on-surface-variant mt-1">Formatos permitidos: PDF, JPG, PNG (Máx. 10MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-surface-container-low flex gap-3">
                <button 
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-outline-variant text-sm font-bold text-on-surface hover:bg-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmUpload}
                  disabled={!tempFile}
                  className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                  Cargar Archivo
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-3 bg-[#E8F5E9] border border-[#A5D6A7] rounded-2xl shadow-xl"
          >
            <div className="w-6 h-6 rounded-full bg-[#4CAF50] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-[#2E7D32] font-sans">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Actions */}
      {/* Footer Actions */}
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <button 
          onClick={handleExitAttempt}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors py-2 px-4 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Listado
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExitAttempt}
            className="px-6 py-2.5 rounded-xl border border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleCreateActor}
            className={cn(
              "px-8 py-2.5 rounded-xl primary-gradient text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center",
              !isFormValid() ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"
            )}
          >
            Crear actor
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

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
