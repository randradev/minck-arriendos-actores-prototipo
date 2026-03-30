import React from 'react';
import { MOCK_NOTIFICATIONS } from '../mockData';
import { Bell, CheckCircle2, Clock, User, Building2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export const Notifications = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-headline font-extrabold text-on-surface tracking-tight">Historial de Tareas</h1>
            <p className="text-on-surface-variant text-sm font-medium">Gestiona todas las notificaciones y tareas pendientes.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
        <div className="divide-y divide-outline-variant/10">
          {MOCK_NOTIFICATIONS.map((notification) => (
            <div 
              key={notification.id} 
              className={cn(
                "p-6 flex items-center gap-6 transition-colors hover:bg-surface-container-low",
                notification.status === 'nuevo' ? "bg-primary/5" : ""
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant shrink-0 relative">
                {notification.actorName.includes('Inmobiliaria') ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
                {notification.status === 'nuevo' && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full ring-2 ring-white"></span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-on-surface truncate">{notification.actorName}</h3>
                  <span className="text-xs text-on-surface-variant flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {notification.time}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant mb-4">{notification.reason}</p>
                <button 
                  onClick={() => navigate(`/actor/${notification.actorId}#documentacion`)}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Resolver Tarea
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
