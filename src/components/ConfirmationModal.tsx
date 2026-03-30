import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'success' | 'info';
  icon?: React.ReactNode;
}

export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = '¿Estás seguro de que deseas eliminar este elemento?',
  message = 'Esta acción no se puede deshacer y puede afectar a otros registros vinculados.',
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  icon
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          iconBg: 'bg-green-100 text-green-600',
          btnBg: 'bg-green-600 hover:bg-green-700 text-white',
          defaultIcon: <CheckCircle2 className="w-8 h-8" />
        };
      case 'info':
        return {
          iconBg: 'bg-blue-100 text-blue-600',
          btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
          defaultIcon: <AlertTriangle className="w-8 h-8" />
        };
      case 'danger':
      default:
        return {
          iconBg: 'bg-red-100 text-red-600',
          btnBg: 'bg-red-600 hover:bg-red-700 text-white',
          defaultIcon: <AlertTriangle className="w-8 h-8" />
        };
    }
  };

  const styles = getVariantStyles();
  
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 text-center space-y-4">
          <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2", styles.iconBg)}>
            {icon || styles.defaultIcon}
          </div>
          <h3 className="font-headline font-bold text-xl text-on-surface leading-tight">{title}</h3>
          <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
            {message}
          </p>
        </div>
        <div className="p-6 bg-surface-container-low border-t border-outline-variant/10 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 rounded-xl border border-outline-variant text-sm font-bold hover:bg-white transition-all cursor-pointer order-2 sm:order-1"
          >
            {cancelLabel}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn("flex-1 py-3 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer order-1 sm:order-2", styles.btnBg)}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
