import React, { useState, useMemo } from 'react';
import { X, Shield, CheckCircle2, AlertTriangle, History, AlertCircle, Info } from 'lucide-react';
import { Actor } from '../types';
import { cn } from '../lib/utils';
import { MOCK_CONTRACTS } from '../mockData';
import { toast } from 'sonner';

interface StatusManagementDrawerProps {
  actor: Actor;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (newStatus: string) => void;
}

export const StatusManagementDrawer = ({ actor, isOpen, onClose, onStatusChange }: StatusManagementDrawerProps) => {
  const [selectedStatus, setSelectedStatus] = useState(actor.status);
  const [justification, setJustification] = useState('');

  const activeContracts = useMemo(() => {
    const contracts = MOCK_CONTRACTS[actor.id] || [];
    return contracts.filter(c => c.status === 'Vigente' || c.status === 'En Prórroga');
  }, [actor.id]);

  const hasActiveContracts = activeContracts.length > 0;

  const availableTransitions = useMemo(() => {
    return ['Activo', 'Pendiente', 'Bloqueado', 'Archivado'] as const;
  }, []);

  const isStatusDisabled = (status: string) => {
    if (status === actor.status) return true;
    
    // Matrix Logic
    if (actor.status === 'Activo') {
      if (status === 'Bloqueado' || status === 'Archivado') {
        // Check contract restriction for Archivado
        if (status === 'Archivado' && hasActiveContracts) return true;
        return false;
      }
      return true;
    }
    
    if (actor.status === 'Bloqueado') {
      if (status === 'Activo' || status === 'Archivado') {
        // Check contract restriction for Archivado
        if (status === 'Archivado' && hasActiveContracts) return true;
        return false;
      }
      return true;
    }

    if (actor.status === 'Pendiente') {
      return true; // Managed by system
    }

    if (actor.status === 'Archivado') {
      return !(status === 'Activo' || status === 'Bloqueado');
    }

    return false;
  };

  const isJustificationMandatory = useMemo(() => {
    if (actor.status === 'Bloqueado' && selectedStatus === 'Activo') return true;
    if (selectedStatus === 'Archivado') return true;
    if (selectedStatus === 'Bloqueado') return true;
    return false;
  }, [actor.status, selectedStatus]);

  const canConfirm = useMemo(() => {
    if (selectedStatus === actor.status) return false;
    if (isJustificationMandatory && !justification.trim()) return false;
    return true;
  }, [selectedStatus, actor.status, isJustificationMandatory, justification]);

  const handleConfirm = () => {
    if (!canConfirm) return;
    
    // Simulate API call
    setTimeout(() => {
      if (onStatusChange) {
        onStatusChange(selectedStatus);
      }
      toast.success('Estado actualizado exitosamente', {
        description: `El actor ${actor.name} ahora está en estado ${selectedStatus.toUpperCase()}.`,
      });
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300 cursor-pointer" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/15 flex items-start justify-between bg-white shrink-0">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-primary shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-headline text-xl font-bold text-on-surface leading-tight">Gestionar Estado Operativo</h2>
              <p className="text-sm text-on-surface-variant">{actor.name} - {actor.rut}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-container-high p-1 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
          {/* Diagnosis */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              {actor.nature === 'Jurídica' ? 'Diagnóstico de Cumplimiento Corporativo' : 'Diagnóstico de Cumplimiento'}
            </h3>
            <div className="space-y-3">
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface leading-none mb-1">
                    {actor.nature === 'Jurídica' ? 'Situación Tributaria (SII)' : 'Documentación'}
                  </span>
                  <span className="text-xs text-on-surface-variant">Al día</span>
                </div>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <X className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface leading-none mb-1">
                    {actor.nature === 'Jurídica' ? 'Estado Financiero / DICOM' : 'Financiero'}
                  </span>
                  <span className="text-xs text-error font-medium">Mora detectada: $450.000</span>
                </div>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface leading-none mb-1">
                    {actor.nature === 'Jurídica' ? 'Vigencia de Poderes' : 'Vigencia Legal'}
                  </span>
                  <span className="text-xs text-amber-700">Vence en 15 días</span>
                </div>
              </div>
            </div>
          </section>

          {/* Status Selection */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block">Nuevo Estado Manual</label>
              {actor.status === 'Pendiente' && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                  Gestión por Sistema
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {availableTransitions.map((status) => {
                const isDisabled = isStatusDisabled(status);
                const isArchivadoRestricted = status === 'Archivado' && hasActiveContracts;
                
                return (
                  <div key={status} className="relative group/btn">
                    <button
                      disabled={isDisabled}
                      onClick={() => setSelectedStatus(status as any)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl border transition-all",
                        selectedStatus === status 
                          ? "border-primary bg-primary-fixed/5 ring-4 ring-primary/5" 
                          : "border-outline-variant/20 hover:bg-surface-container-low",
                        isDisabled && "opacity-50 cursor-not-allowed grayscale"
                      )}
                    >
                      <div className={cn("w-3 h-3 rounded-full", 
                        status === 'Activo' ? "bg-green-500" : 
                        status === 'Pendiente' ? "bg-amber-500" : 
                        status === 'Bloqueado' ? "bg-error" : "bg-slate-600"
                      )} />
                      <span className={cn("text-sm font-bold", selectedStatus === status ? "text-primary" : "text-on-surface-variant")}>
                        {status}
                      </span>
                    </button>
                    
                    {isArchivadoRestricted && (
                      <div className="absolute invisible group-hover/btn:visible bottom-full left-0 mb-2 w-48 p-2 bg-on-surface text-white text-[10px] rounded-lg shadow-xl z-20 leading-tight">
                        No se puede archivar: El actor posee contratos activos.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Warning */}
          {selectedStatus === 'Bloqueado' && actor.status !== 'Bloqueado' && (
            <div className="bg-error-container/20 p-4 rounded-xl flex gap-3 border border-error/10 animate-in zoom-in-95 duration-200">
              <AlertCircle className="w-5 h-5 text-error shrink-0" />
              <p className="text-[13px] font-medium text-on-error-container leading-relaxed">
                <span className="font-bold">El actor será bloqueado.</span> Se restringirá la creación de nuevos contratos y el acceso a servicios hasta regularizar la situación.
              </p>
            </div>
          )}

          {selectedStatus === 'Archivado' && actor.status !== 'Archivado' && (
            <div className="bg-slate-100 p-4 rounded-xl flex gap-3 border border-slate-200 animate-in zoom-in-95 duration-200">
              <AlertCircle className="w-5 h-5 text-slate-600 shrink-0" />
              <p className="text-[13px] font-medium text-slate-700 leading-relaxed">
                <span className="font-bold">El actor será Archivado.</span> Se archivará su ficha y no podrá participar en nuevos procesos comerciales.
              </p>
            </div>
          )}

          {/* Justification */}
          <section className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1">
              Motivo del cambio manual
              {isJustificationMandatory && <span className="text-error">*</span>}
            </label>
            <textarea 
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className={cn(
                "w-full h-28 bg-surface-container-low rounded-xl p-4 text-sm border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none placeholder:text-on-surface-variant/40 resize-none transition-all",
                isJustificationMandatory && !justification ? "border-error/30" : "border-outline-variant/10"
              )}
              placeholder={isJustificationMandatory ? "Este campo es obligatorio para el cambio de estado seleccionado..." : "Ej: Se autoriza activación temporal por compromiso de pago presencial..."}
            />
          </section>

          {/* History */}
          <section className="space-y-4 pb-10">
            <div className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              <History className="w-4 h-4" />
              Historial de Cambios
            </div>
            <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/30">
              <div className="flex items-start gap-4 relative">
                <div className="w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-primary/10 shrink-0 mt-1 z-10"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant font-semibold uppercase">26/03/26 • 19:14</span>
                  <span className="text-xs font-bold text-on-surface">Sistema cambió a <span className="text-green-600">Activo</span></span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">Motivo: Documentación validada exitosamente</span>
                </div>
              </div>
              <div className="flex items-start gap-4 relative">
                <div className="w-3.5 h-3.5 rounded-full bg-error ring-4 ring-error/10 shrink-0 mt-1 z-10"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant font-semibold uppercase">10/01/26 • 10:00</span>
                  <span className="text-xs font-bold text-on-surface">Admin_Marco cambió a <span className="text-error">Bloqueado</span></span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">Motivo: Mora detectada por sistema contable</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-outline-variant/15 flex gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-xl border border-outline-variant/20"
          >
            Cancelar
          </button>
          <button 
            disabled={!canConfirm}
            onClick={handleConfirm}
            className="flex-[1.5] py-3 text-sm font-bold text-white bg-primary hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-xl shadow-lg shadow-primary/10"
          >
            Confirmar y Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
