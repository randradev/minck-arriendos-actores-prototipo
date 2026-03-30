import React from 'react';
import { ActorStatus } from '../types';
import { cn } from '../lib/utils';

export const StatusBadge = ({ status }: { status: ActorStatus }) => {
  const styles = {
    Activo: "bg-green-100 text-green-800",
    Pendiente: "bg-amber-100 text-amber-800",
    Bloqueado: "bg-red-100 text-red-800",
    Archivado: "bg-slate-100 text-slate-800",
  };

  return (
    <span className={cn(
      "px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full",
      styles[status]
    )}>
      {status}
    </span>
  );
};
