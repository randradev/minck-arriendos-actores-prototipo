import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, 
  User, 
  CheckCircle2, 
  XCircle,
  Edit3, 
  Trash2, 
  Fingerprint, 
  ArrowRight,
  ArrowLeft,
  FileText,
  Download,
  Filter,
  Mail,
  Phone,
  Globe,
  MapPin,
  TrendingUp,
  Eye,
  ChevronRight,
  X,
  Search,
  Clock,
  Hourglass,
  ShieldCheck,
  Briefcase,
  Activity,
  Plus,
  Upload,
  AlertTriangle,
  FileUp,
  Shield,
  AlertCircle
} from 'lucide-react';
import { useActors } from '../context/ActorContext';
import { cn } from '../lib/utils';
import { Contract, Document } from '../types';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { StatusManagementDrawer } from '../components/StatusManagementDrawer';

// ... (Modal components remain the same)

// Simple Modal Component for PDF Preview
const PDFModal = ({ isOpen, onClose, docName }: { isOpen: boolean, onClose: () => void, docName: string }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-10 bg-red-50 rounded flex items-center justify-center text-red-600">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-headline font-bold text-on-surface">{docName}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>
        <div className="flex-1 bg-surface-container-low p-8 overflow-auto flex items-center justify-center">
          <div className="w-full max-w-2xl aspect-[1/1.4] bg-white shadow-lg rounded-lg flex flex-col items-center justify-center p-12 text-center space-y-4">
            <FileText className="w-16 h-16 text-outline-variant/30" />
            <p className="text-on-surface-variant font-medium">Vista previa del documento PDF</p>
            <p className="text-xs text-on-surface-variant/60 max-w-xs">En un entorno real, aquí se renderizaría el visor de PDF (PDF.js o iframe).</p>
          </div>
        </div>
        <div className="p-4 border-t border-outline-variant/10 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 rounded-xl border border-outline-variant text-sm font-bold hover:bg-surface-container-low transition-all cursor-pointer">Cerrar</button>
          <button className="px-6 py-2 rounded-xl primary-gradient text-white text-sm font-bold shadow-md hover:opacity-90 transition-all cursor-pointer flex items-center gap-2">
            <Download className="w-4 h-4" /> Descargar
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal Component for Requirements Checklist
const RequirementsModal = ({ isOpen, onClose, docs, nature }: { isOpen: boolean, onClose: () => void, docs: any[], nature: string }) => {
  if (!isOpen) return null;

  const REQUIRED_DOCS = {
    'Natural': ['Cédula de Identidad'],
    'Jurídica': ['E-RUT (SII)', 'Escritura de Constitución', 'Vigencia de Poderes', 'CI del Rep. Legal']
  };

  const items = REQUIRED_DOCS[nature as keyof typeof REQUIRED_DOCS] || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-outline-variant/10">
          <h3 className="font-headline font-bold text-xl text-on-surface">Documentación Requerida para Validación</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-on-surface-variant font-sans">Para completar el proceso de validación, es necesario contar con los siguientes documentos cargados en el sistema:</p>
          <div className="space-y-3">
            {items.map((item, index) => {
              const isVerified = docs.some(d => d.name === item && d.status === 'Aprobado');
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/10 font-sans">
                  <span className="text-sm font-medium text-on-surface">{item}</span>
                  {isVerified ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <span className="text-[10px] font-bold uppercase">Verificado</span>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-on-surface-variant/40">
                      <span className="text-[10px] font-bold uppercase">Pendiente</span>
                      <div className="w-2 h-2 rounded-full bg-outline-variant/40" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-6 bg-surface-container-lowest flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-container transition-all active:scale-95 cursor-pointer font-sans"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

// Contract Summary Modal
const ContractSummaryModal = ({ isOpen, onClose, contract }: { isOpen: boolean, onClose: () => void, contract: Contract | null }) => {
  if (!isOpen || !contract) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
          <h3 className="font-headline font-bold text-xl text-on-surface">Resumen de Contrato</h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60 mb-1">ID Contrato</span>
              <span className="font-mono font-bold text-primary">#{contract.id}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60 mb-1">Estado</span>
              <span className={cn(
                "inline-flex items-center gap-1.5 font-bold text-xs",
                contract.status === 'Vigente' ? "text-green-600" : "text-amber-600"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", contract.status === 'Vigente' ? "bg-green-600" : "bg-amber-600")}></span>
                {contract.status}
              </span>
            </div>
            <div className="col-span-2">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60 mb-1">Propiedad</span>
              <span className="font-bold text-on-surface text-lg">{contract.property}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60 mb-1">Renta Mensual</span>
              <span className="font-bold text-on-surface text-lg">${contract.rent.toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60 mb-1">Rol del Actor</span>
              <span className="font-bold text-on-surface">{contract.role}</span>
            </div>
          </div>
        </div>
        <div className="p-6 bg-surface-container-low border-t border-outline-variant/10 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-outline-variant text-sm font-bold hover:bg-white transition-all cursor-pointer">Cerrar</button>
          <button className="px-6 py-2.5 rounded-xl primary-gradient text-white text-sm font-bold shadow-md hover:opacity-90 transition-all cursor-pointer">
            Ver Contrato Completo
          </button>
        </div>
      </div>
    </div>
  );
};

// Document Upload Modal
const DocumentUploadModal = ({ 
  isOpen, 
  onClose, 
  actorNature, 
  onUpload,
  predefinedType = '',
  isReplacement = false
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  actorNature: string,
  onUpload: (docName: string, isReplacement: boolean) => void,
  predefinedType?: string,
  isReplacement?: boolean
}) => {
  const [docType, setDocType] = useState(predefinedType);
  const [customName, setCustomName] = useState('');
  
  useEffect(() => {
    setDocType(predefinedType);
    setCustomName('');
  }, [predefinedType, isOpen]);

  if (!isOpen) return null;

  const isOther = docType === 'Otro';
  const options = actorNature === 'Natural' 
    ? ['Cédula de Identidad', 'Otro']
    : ['E-RUT (SII)', 'Escritura de Constitución', 'Vigencia de Poderes', 'CI del Rep. Legal', 'Otro'];
  
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
          <h3 className="font-headline font-bold text-xl text-on-surface">
            {isReplacement ? `Actualizar ${predefinedType}` : 'Subir Documento'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Tipo de Documento</label>
            <select 
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              disabled={!!predefinedType}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-sm bg-white appearance-none disabled:bg-surface-container-low disabled:text-on-surface-variant/60"
            >
              <option value="" disabled>Seleccionar tipo...</option>
              {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {isOther && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Nombre del Documento</label>
              <input 
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Ej: Certificado de Antecedentes"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-sm"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Archivo</label>
            <div className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-surface-container-lowest hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <FileUp className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-on-surface">Arrastrar y soltar archivo</p>
                <p className="text-[10px] text-on-surface-variant font-medium mt-1">Formatos aceptados: PDF, JPG, PNG (Máx. 10MB)</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 bg-surface-container-low border-t border-outline-variant/10 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-outline-variant text-sm font-bold hover:bg-white transition-all cursor-pointer">Cancelar</button>
          <button 
            onClick={() => {
              onUpload(isOther ? customName : docType, isReplacement);
              onClose();
            }}
            disabled={!docType || (isOther && !customName)}
            className="px-8 py-2.5 rounded-xl primary-gradient text-white text-sm font-bold shadow-md hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isReplacement ? 'Actualizar' : 'Subir'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Versions Modal
const VersionsModal = ({ isOpen, onClose, doc }: { isOpen: boolean, onClose: () => void, doc: Document | null }) => {
  if (!isOpen || !doc) return null;
  const versions = doc.versions || [];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
          <div>
            <h3 className="font-headline font-bold text-xl text-on-surface">Historial de Versiones</h3>
            <p className="text-xs text-on-surface-variant mt-1">{doc.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>
        <div className="p-6 max-h-[400px] overflow-y-auto space-y-4 no-scrollbar">
          {/* Current Version */}
          <div className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Versión Actual</span>
              <span className="text-[10px] font-medium text-on-surface-variant">{doc.updatedAt}</span>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-on-surface truncate">{doc.name}</p>
                <p className="text-[10px] text-on-surface-variant uppercase">{doc.type} • {doc.size}</p>
              </div>
            </div>
          </div>

          {/* Previous Versions */}
          {versions.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Versiones Anteriores</h4>
              {versions.map((v, idx) => (
                <div key={v.id} className="p-4 rounded-xl border border-outline-variant/10 bg-surface-container-low hover:bg-surface transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-on-surface-variant">V{versions.length - idx}</span>
                    <span className="text-[10px] font-medium text-on-surface-variant">{v.updatedAt}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-on-surface-variant/40" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate">{doc.name}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase">{v.type} • {v.size}</p>
                    </div>
                    <button className="p-2 hover:bg-white rounded-lg text-primary transition-colors cursor-pointer" title="Ver esta versión">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Clock className="w-12 h-12 text-outline-variant/20 mx-auto mb-3" />
              <p className="text-sm text-on-surface-variant italic">No hay versiones anteriores registradas.</p>
            </div>
          )}
        </div>
        <div className="p-6 bg-surface-container-low border-t border-outline-variant/10 flex justify-end">
          <button onClick={onClose} className="px-8 py-2.5 rounded-xl primary-gradient text-white text-sm font-bold shadow-md hover:opacity-90 transition-all cursor-pointer">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
// Rejection Reason Modal
const RejectionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  currentReason = ''
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: (reason: string) => void,
  currentReason?: string
}) => {
  const [reason, setReason] = useState(currentReason);
  const [predefinedReason, setPredefinedReason] = useState('');

  const PREDEFINED_REASONS = [
    'Imagen Borrosa',
    'Documento Vencido',
    'No Corresponde',
    'Información Ilegible',
    'Falta Firma/Timbre'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-outline-variant/10">
          <h3 className="font-headline font-bold text-xl text-on-surface">Motivo del Rechazo</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Razones Comunes</label>
            <select 
              value={predefinedReason}
              onChange={(e) => {
                setPredefinedReason(e.target.value);
                if (e.target.value) setReason(e.target.value);
              }}
              className="w-full px-4 py-2 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-sm bg-white"
            >
              <option value="">Seleccionar una razón...</option>
              {PREDEFINED_REASONS.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Detalle Adicional</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Escribe el motivo detallado..."
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-sm bg-white min-h-[100px] resize-none"
            />
          </div>
        </div>
        <div className="p-6 bg-surface-container-low border-t border-outline-variant/10 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-outline-variant text-sm font-bold hover:bg-white transition-all cursor-pointer">Cancelar</button>
          <button 
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim()}
            className="px-8 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold shadow-md hover:bg-red-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar Rechazo
          </button>
        </div>
      </div>
    </div>
  );
};

export const ActorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { actors, updateActor, addLog, docs: MOCK_DOCS, logs: MOCK_LOGS, contracts } = useActors();
  const actor = actors.find(a => a.id === id);
  
  // State for Role Dashboard
  const [activeRoleTab, setActiveRoleTab] = useState(actor?.mainRole || 'Arrendatario');
  
  // State for PDF Preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  // State for Contract Summary Modal
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  // Workflow State - derived from context when possible, but docs/logs are currently static in context for this prototype
  const [currentDocs, setCurrentDocs] = useState(MOCK_DOCS[actor?.id || ''] || []);
  const currentStatus = actor?.status || 'Pendiente';
  const currentLogs = MOCK_LOGS[actor?.id || ''] || [];

  // State for Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadPredefinedType, setUploadPredefinedType] = useState('');
  const [replaceDocId, setReplaceDocId] = useState<string | null>(null);

  // State for Versions Modal
  const [isVersionsModalOpen, setIsVersionsModalOpen] = useState(false);
  const [versioningDoc, setVersioningDoc] = useState<Document | null>(null);

  // State for Confirmation Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRequirementsModalOpen, setIsRequirementsModalOpen] = useState(false);
  const [isHighlightingUpload, setIsHighlightingUpload] = useState(false);
  const docSectionRef = useRef<HTMLDivElement>(null);
  // State for Rejection Modal
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [confirmAction, setConfirmAction] = useState<{ 
    title?: string, 
    message?: string, 
    onConfirm: () => void,
    confirmLabel?: string,
    variant?: 'danger' | 'success' | 'info',
    icon?: React.ReactNode
  }>({
    onConfirm: () => {}
  });

  const triggerConfirm = (
    onConfirm: () => void, 
    title?: string, 
    message?: string, 
    confirmLabel?: string, 
    variant: 'danger' | 'success' | 'info' = 'danger',
    icon?: React.ReactNode
  ) => {
    setConfirmAction({ onConfirm, title, message, confirmLabel, variant, icon });
    setIsConfirmModalOpen(true);
  };

  // State for Contracts Table
  const [contractSearch, setContractSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [paginationMode, setPaginationMode] = useState<'3' | '5' | '10' | 'Todo' | 'Custom'>('5');
  const [customInput, setCustomInput] = useState('');

  useEffect(() => {
    if (location.hash === '#documentacion') {
      const element = document.getElementById('documentacion');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [location]);

  if (!actor) return <div>Actor no encontrado</div>;

  const REQUIRED_DOCS = {
    'Natural': ['Cédula de Identidad'],
    'Jurídica': ['E-RUT (SII)', 'Escritura de Constitución', 'Vigencia de Poderes', 'CI del Rep. Legal']
  };

  const requiredDocsList = REQUIRED_DOCS[actor.nature as keyof typeof REQUIRED_DOCS] || [];
  const approvedRequiredDocsCount = requiredDocsList.filter(reqDoc => 
    currentDocs.some(d => d.name === reqDoc && d.status === 'Aprobado')
  ).length;
  const progress = requiredDocsList.length > 0 ? (approvedRequiredDocsCount / requiredDocsList.length) * 100 : 0;

  const handleUpload = (docType: string, isReplacement: boolean = false) => {
    const now = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
    
    if (isReplacement && replaceDocId) {
      setCurrentDocs(prev => prev.map(d => {
        if (d.id === replaceDocId) {
          const oldVersion = {
            id: `v-${Date.now()}`,
            updatedAt: d.updatedAt,
            size: d.size,
            type: d.type
          };
          return {
            ...d,
            size: '1.4 MB', // Simulated new size
            updatedAt: now,
            status: 'Pendiente',
            rejectionReason: undefined,
            versions: [oldVersion, ...(d.versions || [])]
          };
        }
        return d;
      }));
      
      // Add log entry
      const newLog = {
        id: `l-${Date.now()}`,
        action: `Se actualizó el archivo de ${docType} por Administrador`,
        timestamp: 'Recién',
        status: 'info' as const
      };
      setCurrentLogs(prev => [newLog, ...prev]);
    } else {
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        name: docType,
        type: 'PDF',
        size: '1.2 MB',
        updatedAt: now,
        status: 'Pendiente'
      };
      setCurrentDocs(prev => [newDoc, ...prev]);
    }
    setReplaceDocId(null);
  };

  const handleApproveDoc = (docId: string) => {
    setCurrentDocs(prev => prev.map(d => {
      if (d.id === docId) {
        const newStatus = d.status === 'Aprobado' ? 'Pendiente' : 'Aprobado';
        return { ...d, status: newStatus, rejectionReason: undefined };
      }
      return d;
    }));
  };

  const handleRejectDoc = (docId: string, reason: string) => {
    setCurrentDocs(prev => prev.map(d => d.id === docId ? { ...d, status: 'Rechazado', rejectionReason: reason } : d));
  };

  const isAllRequiredDocsApproved = requiredDocsList.every(reqDocName => {
    const doc = currentDocs.find(d => d.name === reqDocName);
    return doc && doc.status === 'Aprobado';
  });

  const handleApprove = () => {
    if (!isAllRequiredDocsApproved) return;
    triggerConfirm(
      () => {
        setCurrentStatus('Activo');
      }, 
      'Aprobar y Activar Actor', 
      '¿Estás seguro de que deseas aprobar y activar a este actor? Esto validará su identidad/poderes, habilitará todas sus métricas y lo marcará como ACTIVO.',
      'Aprobar y Activar',
      'success',
      <CheckCircle2 className="w-8 h-8" />
    );
  };

  const allContracts = contracts[actor.id] || [];

  // Filter contracts
  const filteredContracts = allContracts.filter(c => 
    c.property.toLowerCase().includes(contractSearch.toLowerCase()) ||
    c.status.toLowerCase().includes(contractSearch.toLowerCase())
  );

  // Pagination logic
  const effectiveItemsPerPage = paginationMode === 'Todo' ? filteredContracts.length || 1 : itemsPerPage;
  const paginatedContracts = filteredContracts.slice(
    (currentPage - 1) * effectiveItemsPerPage,
    currentPage * effectiveItemsPerPage
  );

  const openPreview = (docName: string) => {
    setSelectedDoc(docName);
    setIsPreviewOpen(true);
  };

  const handleCompleteValidation = () => {
    if (docSectionRef.current) {
      docSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      setIsHighlightingUpload(true);
      setTimeout(() => setIsHighlightingUpload(false), 2000);
    }
  };

  const actorRoles = [actor.mainRole, ...(actor.nature === 'Jurídica' ? ['Rep. Legal'] : [])];
  const availableRoles = ['Arrendador', 'Arrendatario', 'Garante', 'Rep. Legal'];

  return (
    <div className="space-y-8 font-sans">
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">
            Detalle del Actor
          </h1>
          <p className="text-on-surface-variant mt-1 text-sm font-medium">
            Información completa y gestión de <span className="text-primary font-bold">{actor.name}</span>
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-outline-variant/20 text-sm font-bold text-on-surface hover:bg-surface-container-low transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Actores
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Warning for Active Actors with Pending Documents */}
          {currentStatus === 'Activo' && currentDocs.some(d => d.status === 'Pendiente') && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-900">Documentación en Revisión</p>
                <p className="text-xs text-amber-800/80">Hay {currentDocs.filter(d => d.status === 'Pendiente').length} documento nuevo pendiente de revisión.</p>
              </div>
              <button 
                onClick={handleCompleteValidation}
                className="px-4 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-sm cursor-pointer"
              >
                Revisar
              </button>
            </div>
          )}

          {/* Status Alert for Pending Actors */}
          {currentStatus === 'Pendiente' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-headline font-bold text-amber-900">
                  {currentDocs.some(d => d.status === 'Rechazado') ? 'Atención: Documento(s) rechazado(s)' : 'Verificación Pendiente'}
                </h4>
                <p className="text-sm leading-relaxed text-amber-800/80">
                  {currentDocs.some(d => d.status === 'Rechazado') 
                    ? "Existen documentos que han sido rechazados. Por favor, revisa los motivos y sube las versiones corregidas." 
                    : "Este actor se encuentra en proceso de validación. Algunas funcionalidades y métricas de rendimiento estarán limitadas hasta que se complete la verificación de documentos y antecedentes."
                  }
                </p>
                <div className="pt-3 flex flex-wrap gap-3">
                  {progress < 100 ? (
                    <>
                      <button 
                        onClick={handleCompleteValidation}
                        className="px-4 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-sm cursor-pointer"
                      >
                        Completar Validación
                      </button>
                      <button 
                        onClick={() => setIsRequirementsModalOpen(true)}
                        className="px-4 py-1.5 bg-white border border-amber-200 text-amber-700 text-xs font-bold rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                      >
                        Ver Requisitos
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleApprove}
                      className="px-6 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Aprobar y Activar Actor
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Header Identity */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className={cn(
                  "w-24 h-24 rounded-2xl flex items-center justify-center text-white overflow-hidden shadow-inner",
                  actor.nature === 'Jurídica' ? "bg-primary-fixed text-on-primary-fixed-variant" : "bg-secondary-container text-on-secondary-container"
                )}>
                  {actor.nature === 'Jurídica' ? <Building2 className="w-12 h-12" /> : <User className="w-12 h-12" />}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center border-2 border-surface shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-600 fill-green-50" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">{actor.name}</h2>
                  <span className={cn(
                    "px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full",
                    currentStatus === 'Activo' ? "bg-green-100 text-green-800" :
                    currentStatus === 'Pendiente' ? "bg-amber-100 text-amber-800" :
                    currentStatus === 'Bloqueado' ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-800"
                  )}>{currentStatus}</span>
                </div>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-on-surface-variant font-medium text-sm">
                  <span className="flex items-center gap-1"><Fingerprint className="w-4 h-4" /> RUT {actor.rut}</span>
                  <span className={cn(
                    "px-3 py-0.5 text-[11px] font-semibold rounded-full uppercase tracking-wide",
                    actor.nature === 'Jurídica' ? "bg-primary-fixed text-on-primary-fixed-variant" : "bg-secondary-container text-on-secondary-container"
                  )}>{actor.nature}</span>
                </div>
              </div>
            </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate(`/actor/${actor.id}/edit`, { state: { actor } })}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container-low transition-all cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar
                  </button>
                  <button 
                    onClick={() => triggerConfirm(() => console.log('Actor eliminado'), 'Confirmar Eliminación', '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm shadow-sm hover:bg-red-700 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
          </section>

        {/* Datos de Origen */}
        <div className="bg-surface-container-low rounded-xl p-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-4">Datos de Origen</h3>
          <div className={cn(
            "grid gap-6",
            actor.nature === 'Jurídica' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"
          )}>
            {actor.nature === 'Jurídica' ? (
              <>
                <div>
                  <span className="block text-xs text-on-surface-variant opacity-60">Tipo Entidad</span>
                  <span className="font-semibold text-on-surface">{actor.entityType}</span>
                </div>
                <div>
                  <span className="block text-xs text-on-surface-variant opacity-60">Representante Legal</span>
                  {actor.legalRepresentativeName ? (
                    <button 
                      onClick={() => actor.legalRepresentativeId && navigate(`/actor/${actor.legalRepresentativeId}`)}
                      className="group flex items-center gap-2 font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer text-left"
                    >
                      {actor.legalRepresentativeName}
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ) : (
                    <span className="text-sm font-medium text-red-500/70 italic">[Falta asignar Rep. Legal]</span>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="block text-xs text-on-surface-variant opacity-60">Profesión</span>
                  <span className="font-semibold text-on-surface">{actor.profession}</span>
                </div>
                <div>
                  <span className="block text-xs text-on-surface-variant opacity-60">Empleador</span>
                  <span className="font-semibold text-on-surface">{actor.employer}</span>
                </div>
                {actor.representedCompanyId && (
                  <div>
                    <span className="block text-xs text-on-surface-variant opacity-60">Empresa Representada</span>
                    <button 
                      onClick={() => navigate(`/actor/${actor.representedCompanyId}`)}
                      className="group flex items-center gap-2 font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer text-left"
                    >
                      {actor.representedCompanyName}
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Documentación */}
        <div id="documentacion" ref={docSectionRef} className="space-y-4 scroll-mt-20">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-lg text-on-surface">Documentación</h3>
            {(currentStatus === 'Pendiente') && (
              <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-xl border border-outline-variant/10">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Progreso de Validación</span>
                  <span className="text-xs font-extrabold text-primary">{approvedRequiredDocsCount} de {requiredDocsList.length} documentos</span>
                </div>
                <div className="w-24 h-2 bg-outline-variant/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Documentation Warning for Active Actors with Pending/Rejected Docs */}
          {currentStatus === 'Activo' && currentDocs.some(d => d.status === 'Pendiente' || d.status === 'Rechazado') && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-sm font-bold text-amber-900">
                Documentación en revisión: <span className="font-medium">Se ha actualizado un archivo crítico.</span>
              </p>
            </div>
          )}

          {(currentStatus === 'Pendiente') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {requiredDocsList.map(reqDoc => {
                const isVerified = currentDocs.some(d => d.name === reqDoc && d.status === 'Aprobado');
                return (
                  <div key={reqDoc} className={cn(
                    "p-3 rounded-xl border flex items-center gap-3 transition-all",
                    isVerified ? "bg-green-50 border-green-200" : "bg-surface border-outline-variant/10"
                  )}>
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                      isVerified ? "bg-green-100 text-green-600" : "bg-surface-container text-outline"
                    )}>
                      {isVerified ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/40" />}
                    </div>
                    <span className={cn(
                      "text-[11px] font-bold leading-tight",
                      isVerified ? "text-green-800" : "text-on-surface-variant/60"
                    )}>{reqDoc}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/15 overflow-hidden flex flex-col max-h-[600px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {/* Mandatory Slots */}
              {requiredDocsList.map(reqDocName => {
                const doc = currentDocs.find(d => d.name === reqDocName);
                
                if (doc) {
                  return (
                    <div key={doc.id} className={cn(
                      "group relative p-4 rounded-xl border transition-all",
                      doc.status === 'Rechazado' ? "bg-red-50 border-red-200" : "bg-surface border-outline-variant/10 hover:border-primary/40"
                    )}>
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-12 rounded flex flex-col items-center justify-center relative overflow-hidden shrink-0",
                          doc.status === 'Rechazado' ? "bg-red-100 text-red-600 animate-pulse" : "bg-red-50 text-red-600"
                        )}>
                          <FileText className="w-6 h-6" />
                          <div className={cn("absolute bottom-0 w-full h-1", doc.status === 'Rechazado' ? "bg-red-600" : "bg-red-600")}></div>
                          {doc.status === 'Rechazado' && (
                            <div className="absolute top-0 right-0 w-3 h-3 bg-red-600 border-2 border-white rounded-full -translate-y-1 translate-x-1 shadow-sm"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                setVersioningDoc(doc);
                                setIsVersionsModalOpen(true);
                              }}
                              className="block text-sm font-bold text-on-surface truncate hover:text-primary transition-colors cursor-pointer"
                            >
                              {doc.name}
                            </button>
                            {doc.status === 'Aprobado' && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">
                                <CheckCircle2 className="w-3 h-3" />
                                Verificado
                              </span>
                            )}
                            {doc.status === 'Rechazado' && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase tracking-wider">
                                <XCircle className="w-3 h-3" />
                                Re-subir
                              </span>
                            )}
                            {doc.status === 'Pendiente' && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-wider">
                                <Hourglass className="w-3 h-3" />
                                Pendiente
                              </span>
                            )}
                          </div>
                          <span className="block text-[10px] text-on-surface-variant uppercase tracking-wider font-medium">{doc.type} • {doc.size} • {doc.updatedAt}</span>
                        </div>
                        
                        {/* Admin Controls */}
                        <div className="flex items-center gap-1">
                          {(currentStatus === 'Pendiente') && (
                            <div className="flex items-center gap-1 mr-2 pr-2 border-r border-outline-variant/20">
                              <button 
                                onClick={() => handleApproveDoc(doc.id)}
                                className={cn(
                                  "p-2 rounded-lg transition-all cursor-pointer",
                                  doc.status === 'Aprobado' ? "bg-green-600 text-white shadow-md" : "hover:bg-green-100 text-green-600"
                                )}
                                title={doc.status === 'Aprobado' ? "Desverificar (Volver a Pendiente)" : "Aprobar Documento"}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  setRejectingDocId(doc.id);
                                  setIsRejectionModalOpen(true);
                                }}
                                className={cn(
                                  "p-2 rounded-lg transition-all cursor-pointer",
                                  doc.status === 'Rechazado' ? "bg-red-600 text-white shadow-md" : "hover:bg-red-100 text-red-600"
                                )}
                                title="Rechazar Documento"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          
                          <button 
                            onClick={() => openPreview(doc.name)}
                            className="p-2 hover:bg-secondary-container rounded-lg text-on-secondary-container transition-colors cursor-pointer" 
                            title="Vista Previa"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setUploadPredefinedType(doc.name);
                              setReplaceDocId(doc.id);
                              setIsUploadModalOpen(true);
                            }}
                            className="p-2 hover:bg-secondary-container rounded-lg text-on-secondary-container transition-colors cursor-pointer" 
                            title="Actualizar/Reemplazar"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-secondary-container rounded-lg text-on-secondary-container transition-colors cursor-pointer" title="Descargar">
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerConfirm(() => console.log('Documento eliminado'), 'Confirmar Eliminación', '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.')
                            }}
                            className="p-2 hover:bg-error-container rounded-lg text-on-error-container transition-colors cursor-pointer" 
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Rejection Reason Display */}
                      {doc.status === 'Rechazado' && doc.rejectionReason && (
                        <div className="mt-3 p-2 bg-red-100/50 rounded-lg border border-red-200/50">
                          <p className="text-[11px] text-red-800 font-medium">
                            <span className="font-bold uppercase tracking-wider mr-2">Motivo del rechazo:</span>
                            {doc.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                }

                // Empty Slot
                return (
                  <button 
                    key={reqDocName}
                    onClick={() => {
                      setUploadPredefinedType(reqDocName);
                      setIsUploadModalOpen(true);
                    }}
                    className="w-full p-6 rounded-xl border-2 border-dashed border-outline-variant/20 bg-surface-container-lowest hover:border-primary/40 hover:bg-surface-container-low transition-all group flex flex-col items-center justify-center gap-3 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-surface-container border border-outline-variant/10 flex items-center justify-center text-outline-variant/40 group-hover:text-primary/40 transition-colors group-hover:scale-110 transform duration-200">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <span className="block text-sm font-bold text-on-surface-variant group-hover:text-primary transition-colors">Haga clic para subir {reqDocName}</span>
                      <span className="block text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-bold mt-1">Requisito Obligatorio</span>
                    </div>
                  </button>
                );
              })}

              {/* Additional Documents */}
              {currentDocs.filter(d => !requiredDocsList.includes(d.name)).map(doc => (
                <div key={doc.id} className={cn(
                  "group relative p-4 rounded-xl border transition-all bg-surface border-outline-variant/10 hover:border-primary/40"
                )}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-12 rounded bg-secondary-container/10 text-secondary flex flex-col items-center justify-center relative overflow-hidden shrink-0">
                      <FileText className="w-6 h-6" />
                      <div className="absolute bottom-0 w-full h-1 bg-secondary"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setVersioningDoc(doc);
                            setIsVersionsModalOpen(true);
                          }}
                          className="block text-sm font-bold text-on-surface truncate hover:text-primary transition-colors cursor-pointer"
                        >
                          {doc.name}
                        </button>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-secondary-container/20 text-secondary text-[10px] font-bold rounded uppercase tracking-wider">
                          Adicional
                        </span>
                      </div>
                      <span className="block text-[10px] text-on-surface-variant uppercase tracking-wider font-medium">{doc.type} • {doc.size} • {doc.updatedAt}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => openPreview(doc.name)}
                        className="p-2 hover:bg-secondary-container rounded-lg text-on-secondary-container transition-colors cursor-pointer" 
                        title="Vista Previa"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setUploadPredefinedType(doc.name);
                          setReplaceDocId(doc.id);
                          setIsUploadModalOpen(true);
                        }}
                        className="p-2 hover:bg-secondary-container rounded-lg text-on-secondary-container transition-colors cursor-pointer" 
                        title="Actualizar/Reemplazar"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-secondary-container rounded-lg text-on-secondary-container transition-colors cursor-pointer" title="Descargar">
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerConfirm(() => console.log('Documento eliminado'), 'Confirmar Eliminación', '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.')
                        }}
                        className="p-2 hover:bg-error-container rounded-lg text-on-error-container transition-colors cursor-pointer" 
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-outline-variant/10 bg-surface-container-lowest">
              <button 
                onClick={() => {
                  setUploadPredefinedType('Otro');
                  setIsUploadModalOpen(true);
                }}
                className={cn(
                  "w-full py-3 rounded-xl border-2 border-dashed text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2",
                  isHighlightingUpload 
                    ? "border-primary text-primary bg-primary/10 ring-4 ring-primary/20 scale-[1.02] shadow-lg" 
                    : "border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5"
                )}
              >
                <Plus className="w-4 h-4" />
                Subir Otro Documento
              </button>
            </div>
          </div>
        </div>

        {/* Resumen de Contratos */}
        <div className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm font-sans">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline font-bold text-lg text-on-surface">Resumen de Contratos</h3>
              <div className="flex gap-2">
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl border border-outline-variant/10 transition-all",
                  isFilterOpen ? "w-64 opacity-100" : "w-10 opacity-100 overflow-hidden"
                )}>
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="p-1 hover:text-primary transition-colors cursor-pointer shrink-0"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                  {isFilterOpen && (
                    <input 
                      type="text"
                      placeholder="Buscar por propiedad o estado..."
                      value={contractSearch}
                      onChange={(e) => {
                        setContractSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="bg-transparent border-none outline-none text-xs w-full font-medium"
                      autoFocus
                    />
                  )}
                </div>
                <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer"><Download className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-on-surface-variant font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-4 pr-4">ID</th>
                    <th className="pb-4 px-4">Propiedad</th>
                    <th className="pb-4 px-4">Rol</th>
                    <th className="pb-4 px-4 text-right">Renta</th>
                    <th className="pb-4 pl-4 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {paginatedContracts.length > 0 ? paginatedContracts.map(contract => (
                    <tr 
                      key={contract.id} 
                      onClick={() => {
                        setSelectedContract(contract);
                        setIsContractModalOpen(true);
                      }}
                      className="hover:bg-surface-container-low transition-colors group cursor-pointer"
                    >
                      <td className="py-4 pr-4 font-mono text-xs text-primary font-bold">#{contract.id}</td>
                      <td className="py-4 px-4 font-medium">{contract.property}</td>
                      <td className="py-4 px-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold",
                          contract.role === 'Arrendador' ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                        )}>{contract.role}</span>
                      </td>
                      <td className="py-4 px-4 text-right font-bold">${contract.rent.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 font-bold text-xs",
                          contract.status === 'Vigente' ? "text-green-600" : "text-amber-600"
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", contract.status === 'Vigente' ? "bg-green-600" : "bg-amber-600")}></span>
                          {contract.status}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerConfirm(() => console.log('Contrato eliminado'));
                          }}
                          className="p-2 hover:bg-error-container rounded-lg text-on-error-container transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-on-surface-variant italic text-xs">No se encontraron contratos con los filtros aplicados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="mt-6 pt-6 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Filas:</span>
                <div className="flex items-center gap-1.5">
                  {['1', '5', '10', 'Todo'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => {
                        setPaginationMode(mode as any);
                        if (mode === 'Todo') {
                          setItemsPerPage(filteredContracts.length || 1);
                        } else {
                          setItemsPerPage(parseInt(mode));
                        }
                        setCurrentPage(1);
                        setCustomInput('');
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer",
                        paginationMode === mode
                          ? "bg-cyan-900 text-white border-cyan-900 shadow-sm"
                          : "bg-white text-on-surface-variant border-outline-variant/30 hover:border-cyan-900/50"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                  <div className="flex items-center gap-2 ml-2">
                    <label htmlFor="custom-rows" className="text-[10px] font-bold text-on-surface-variant">Personalizar:</label>
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
                        "w-12 px-2 py-1 text-[10px] font-bold bg-white border rounded-lg outline-none transition-all",
                        paginationMode === 'Custom' ? "border-cyan-600 ring-1 ring-cyan-600" : "border-outline-variant/30 focus:border-cyan-600"
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-[11px] text-on-surface-variant font-medium">
                  Mostrando <span className="font-bold text-on-surface">{paginationMode === 'Todo' ? 1 : (currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-bold text-on-surface">{Math.min(currentPage * itemsPerPage, filteredContracts.length)}</span> de <span className="font-bold text-on-surface">{filteredContracts.length}</span>
                </p>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || paginationMode === 'Todo'}
                    className="p-1.5 rounded-md border border-outline-variant/30 disabled:opacity-30 hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3 rotate-180" />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage * itemsPerPage >= filteredContracts.length || paginationMode === 'Todo'}
                    className="p-1.5 rounded-md border border-outline-variant/30 disabled:opacity-30 hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Roles y Rendimiento */}
        <div className="space-y-4">
          <h3 className="font-headline font-bold text-lg text-on-surface">Rendimiento por Rol</h3>
          <div className="bg-surface-container-low rounded-2xl p-1 overflow-hidden">
            <div className="flex border-b border-outline-variant/10">
              {availableRoles.map((role) => {
                const isAvailable = actorRoles.includes(role);
                return (
                  <button
                    key={role}
                    disabled={!isAvailable}
                    onClick={() => setActiveRoleTab(role as any)}
                    className={cn(
                      "flex-1 py-4 px-2 text-[10px] font-bold uppercase tracking-wider transition-all relative",
                      !isAvailable && "opacity-40 grayscale cursor-not-allowed",
                      isAvailable && "cursor-pointer",
                      activeRoleTab === role 
                        ? "text-primary bg-surface-container-lowest" 
                        : isAvailable ? "text-on-surface-variant bg-transparent hover:bg-white/30" : "text-on-surface-variant/40"
                    )}
                  >
                    {role}
                    {activeRoleTab === role && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
                  </button>
                );
              })}
            </div>
            <div className="p-6 bg-surface-container-lowest font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeRoleTab === 'Arrendador' && (
                  <>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Yield Bruto</span>
                      <div className="flex items-end gap-2">
                        <span className={cn(
                          "text-2xl font-headline font-extrabold",
                          actor.status === 'Bloqueado' ? "text-error" : "text-primary"
                        )}>
                          {actor.status === 'Pendiente' ? '0.0%' : actor.status === 'Bloqueado' ? '0.0%' : '6.2%'}
                        </span>
                        {actor.status === 'Activo' && <span className="text-green-600 text-[10px] font-bold mb-1 flex items-center"><TrendingUp className="w-3 h-3" /> +0.4%</span>}
                        {actor.status === 'Bloqueado' && <span className="text-error text-[10px] font-bold mb-1 uppercase tracking-wider">Alerta</span>}
                      </div>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Tasa de Vacancia</span>
                      <div className="flex items-end gap-2">
                        <span className={cn(
                          "text-2xl font-headline font-extrabold",
                          actor.status === 'Bloqueado' ? "text-error" : "text-on-surface"
                        )}>
                          {actor.status === 'Pendiente' ? '0%' : actor.status === 'Bloqueado' ? '100%' : '5%'}
                        </span>
                        {actor.status === 'Bloqueado' && <span className="text-error text-[10px] font-bold mb-1 uppercase tracking-wider">Crítico</span>}
                        {actor.status === 'Activo' && <span className="text-on-surface-variant text-[10px] font-bold mb-1">Prom. Mercado</span>}
                      </div>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Net Cashflow</span>
                      <div className="flex items-end gap-2">
                        <span className={cn(
                          "text-xl font-headline font-extrabold",
                          actor.status === 'Bloqueado' ? "text-error" : "text-on-surface"
                        )}>
                          {actor.status === 'Pendiente' ? '$0' : actor.status === 'Bloqueado' ? 'DETENIDO' : '$8.450.000'}
                        </span>
                        {actor.status === 'Activo' && <span className="text-on-surface-variant text-[10px] font-medium mb-1 uppercase">Mensual</span>}
                      </div>
                    </div>
                  </>
                )}
                {activeRoleTab === 'Arrendatario' && (
                  <>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Score de Puntualidad</span>
                      <div className="flex items-end gap-2">
                        <span className={cn(
                          "text-2xl font-headline font-extrabold",
                          currentStatus === 'Bloqueado' ? "text-error" : "text-green-600"
                        )}>
                          {(currentStatus === 'Pendiente') ? '0/100' : currentStatus === 'Bloqueado' ? '0/100' : '98/100'}
                        </span>
                        {currentStatus === 'Activo' && <ShieldCheck className="w-4 h-4 text-green-600 mb-1" />}
                        {currentStatus === 'Bloqueado' && <span className="text-error text-[10px] font-bold mb-1 uppercase tracking-wider">Alerta</span>}
                      </div>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Días de Mora</span>
                      <div className="flex items-end gap-2">
                        <span className={cn(
                          "text-2xl font-headline font-extrabold",
                          currentStatus === 'Bloqueado' ? "text-error" : "text-on-surface"
                        )}>
                          {(currentStatus === 'Pendiente') ? '0' : currentStatus === 'Bloqueado' ? '30+' : '0.5'}
                        </span>
                        {currentStatus === 'Activo' && <span className="text-on-surface-variant text-[10px] font-medium mb-1 uppercase">Promedio</span>}
                        {currentStatus === 'Bloqueado' && <span className="text-error text-[10px] font-bold mb-1 uppercase tracking-wider">Crítico</span>}
                      </div>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Exposición Total</span>
                      <div className="flex items-end gap-2">
                        <span className={cn(
                          "text-xl font-headline font-extrabold",
                          currentStatus === 'Bloqueado' ? "text-error" : "text-on-surface"
                        )}>
                          {(currentStatus === 'Pendiente') ? '$0' : currentStatus === 'Bloqueado' ? '$12.500.000' : '$12.500.000'}
                        </span>
                        {currentStatus === 'Activo' && <Activity className="w-4 h-4 text-primary mb-1" />}
                      </div>
                    </div>
                  </>
                )}
                {activeRoleTab === 'Garante' && (
                  <>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Ratio de Cobertura</span>
                      <div className="flex items-end gap-2">
                        <span className={cn(
                          "text-2xl font-headline font-extrabold",
                          currentStatus === 'Bloqueado' ? "text-error" : "text-primary"
                        )}>
                          {(currentStatus === 'Pendiente') ? '0.0x' : currentStatus === 'Bloqueado' ? '0.0x' : '3.5x'}
                        </span>
                        {currentStatus === 'Activo' && <span className="text-green-600 text-[10px] font-bold mb-1">Saludable</span>}
                        {currentStatus === 'Bloqueado' && <span className="text-error text-[10px] font-bold mb-1 uppercase tracking-wider">Insuficiente</span>}
                      </div>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Contratos Garantizados</span>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-headline font-extrabold text-on-surface">
                          {(currentStatus === 'Pendiente') ? '0' : '2'}
                        </span>
                        <Briefcase className="w-4 h-4 text-on-surface-variant mb-1" />
                      </div>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Monto Total Avalado</span>
                      <div className="flex items-end gap-2">
                        <span className="text-xl font-headline font-extrabold text-on-surface">
                          {(currentStatus === 'Pendiente') ? '$0' : '$45.000.000'}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                {activeRoleTab === 'Rep. Legal' && (
                  <>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Vigencia de Poderes</span>
                      <div className="flex items-end gap-2">
                        <span className={cn(
                          "text-2xl font-headline font-extrabold",
                          currentStatus === 'Bloqueado' ? "text-error" : "text-amber-600"
                        )}>
                          {(currentStatus === 'Pendiente') ? '0 Días' : currentStatus === 'Bloqueado' ? 'VENCIDO' : '45 Días'}
                        </span>
                        <Clock className="w-4 h-4 text-amber-600 mb-1" />
                      </div>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Siniestralidad</span>
                      <div className="flex items-end gap-2">
                        <span className={cn(
                          "text-2xl font-headline font-extrabold",
                          currentStatus === 'Bloqueado' ? "text-error" : "text-on-surface"
                        )}>
                          {(currentStatus === 'Pendiente') ? '0%' : currentStatus === 'Bloqueado' ? '100%' : '0%'}
                        </span>
                        {currentStatus === 'Activo' && <span className="text-green-600 text-[10px] font-bold mb-1">Óptimo</span>}
                        {currentStatus === 'Bloqueado' && <span className="text-error text-[10px] font-bold mb-1 uppercase tracking-wider">Crítico</span>}
                      </div>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Volumen Administrado</span>
                      <div className="flex items-end gap-2">
                        <span className="text-xl font-headline font-extrabold text-on-surface">
                          {(currentStatus === 'Pendiente') ? '$0' : '$120.000.000'}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Column */}
      <div className="lg:col-span-4 space-y-8">
        {/* Contact Info */}
        <div className="bg-surface-container-low rounded-2xl p-6 space-y-6 shadow-sm">
          <h3 className="font-headline font-bold text-lg text-on-surface">Información de Contacto</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/10">
              <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-primary">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] font-bold uppercase text-on-surface-variant opacity-60">Correo</span>
                <span className="block text-sm font-bold truncate">{actor.email}</span>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/10">
              <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-primary">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] font-bold uppercase text-on-surface-variant opacity-60">Teléfono</span>
                <span className="block text-sm font-bold truncate">{actor.phone}</span>
              </div>
            </div>
            {actor.website && (
              <div className="flex items-start gap-4 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/10">
                <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-primary">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] font-bold uppercase text-on-surface-variant opacity-60">Sitio Web</span>
                  <span className="block text-sm font-bold truncate">{actor.website}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm">
          <h3 className="font-headline font-bold text-lg text-on-surface mb-6">Registro de Actividad</h3>
          <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/30">
            {currentLogs.map(log => (
              <div key={log.id} className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center z-10">
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    log.status === 'success' ? "bg-primary" : log.status === 'warning' ? "bg-amber-400" : "bg-primary/40"
                  )}></span>
                </div>
                <span className="block text-xs font-bold text-on-surface">{log.action}</span>
                <span className="block text-[10px] text-on-surface-variant uppercase tracking-wider font-medium">{log.timestamp}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate(`/actor/${actor.id}/history`)}
            className="w-full mt-8 py-3 rounded-xl bg-surface-container-lowest text-xs font-bold text-primary hover:bg-white transition-all border border-outline-variant/10 cursor-pointer"
          >
            Ver historial completo
          </button>
        </div>

        {/* Operational Status (Jurídica Only) */}
        {actor.nature === 'Jurídica' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-outline-variant/10 flex flex-col items-center space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block w-full">Estado Operativo</h3>
            
            <div className="flex flex-col items-center">
              <div className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full border-2",
                currentStatus === 'Activo' ? "border-green-600 text-green-600 bg-green-50" : "border-error text-error bg-error/5"
              )}>
                {currentStatus === 'Activo' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span className="text-sm font-extrabold uppercase tracking-widest font-headline">{currentStatus}</span>
              </div>
              <p className="mt-3 text-center text-on-surface-variant text-[11px] font-medium leading-relaxed">
                {currentStatus === 'Activo' 
                  ? "Entidad operativa con cumplimiento legal al día y sin deudas registradas."
                  : "El sistema ha restringido la operación debido a una mora pendiente de $450.000."
                }
              </p>
            </div>

            <div className="w-full space-y-3 bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-on-surface">Cumplimiento Legal</span>
                <div className="flex items-center gap-1.5 text-green-700">
                  <span className="text-[10px] font-bold">Poderes vigentes</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-on-surface">Estado Financiero</span>
                <div className={cn("flex items-center gap-1.5", currentStatus === 'Activo' ? "text-green-700" : "text-error")}>
                  <span className="text-[10px] font-bold">{currentStatus === 'Activo' ? 'Al día' : 'Mora detectada'}</span>
                  {currentStatus === 'Activo' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-md hover:bg-primary-container transition-all active:scale-95 cursor-pointer"
            >
              <Shield className="w-5 h-5" />
              Gestionar Estado
            </button>
          </div>
        )}
      </div>
    </div>

      {/* PDF Preview Modal */}
      <PDFModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        docName={selectedDoc || ''} 
      />

      {/* Versions Modal */}
      <VersionsModal 
        isOpen={isVersionsModalOpen}
        onClose={() => {
          setIsVersionsModalOpen(false);
          setVersioningDoc(null);
        }}
        doc={versioningDoc}
      />

      {/* Contract Summary Modal */}
      <ContractSummaryModal 
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        contract={selectedContract}
      />

      {/* Document Upload Modal */}
      <DocumentUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setUploadPredefinedType('');
          setReplaceDocId(null);
        }}
        actorNature={actor.nature}
        onUpload={handleUpload}
        predefinedType={uploadPredefinedType}
        isReplacement={!!replaceDocId}
      />

      {/* Requirements Modal */}
      <RequirementsModal 
        isOpen={isRequirementsModalOpen}
        onClose={() => setIsRequirementsModalOpen(false)}
        docs={currentDocs}
        nature={actor.nature}
      />

      {/* Status Management Drawer */}
      <StatusManagementDrawer 
        actor={{...actor, status: currentStatus}} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onStatusChange={(newStatus) => setCurrentStatus(newStatus as any)}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmAction.onConfirm}
        title={confirmAction.title}
        message={confirmAction.message}
        confirmLabel={confirmAction.confirmLabel}
        variant={confirmAction.variant}
        icon={confirmAction.icon}
      />

      <RejectionModal 
        isOpen={isRejectionModalOpen}
        onClose={() => {
          setIsRejectionModalOpen(false);
          setRejectingDocId(null);
        }}
        onConfirm={(reason) => {
          if (rejectingDocId) handleRejectDoc(rejectingDocId, reason);
          setIsRejectionModalOpen(false);
          setRejectingDocId(null);
        }}
      />
    </div>
  );
};
