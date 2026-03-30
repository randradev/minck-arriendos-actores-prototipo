import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Handshake, 
  Phone, 
  Calendar, 
  User, 
  Filter, 
  Search, 
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Mail,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { MOCK_ACTORS } from '../mockData';

interface HistoryEvent {
  id: string;
  type: 'Documentos' | 'Contratos' | 'Datos de Contacto' | 'Sistema';
  action: string;
  user: string;
  timestamp: string;
  details?: string;
  status?: 'success' | 'warning' | 'info';
}

const MOCK_HISTORY: HistoryEvent[] = [
  {
    id: '1',
    type: 'Documentos',
    action: 'Se cargó Documento ID: RUT_VALIDADO.pdf',
    user: 'Andrés Silva',
    timestamp: '30 Mar 2026, 14:20',
    status: 'success'
  },
  {
    id: '2',
    type: 'Contratos',
    action: 'Renovación de Contrato #8842 - Depto 402',
    user: 'Sistema',
    timestamp: '28 Mar 2026, 09:15',
    details: 'Vigencia extendida hasta Mar 2027',
    status: 'info'
  },
  {
    id: '3',
    type: 'Datos de Contacto',
    action: 'Actualización de Correo Electrónico',
    user: 'Andrés Silva',
    timestamp: '25 Mar 2026, 11:45',
    details: 'De: j.perez@old.com a: juan.perez@empresa.cl',
    status: 'warning'
  },
  {
    id: '4',
    type: 'Documentos',
    action: 'Se eliminó Documento: PODER_SIMPLE_VENCIDO.pdf',
    user: 'María González',
    timestamp: '20 Mar 2026, 16:30',
    status: 'warning'
  },
  {
    id: '5',
    type: 'Contratos',
    action: 'Nuevo Contrato Registrado #9120',
    user: 'Andrés Silva',
    timestamp: '15 Mar 2026, 10:00',
    status: 'success'
  },
  {
    id: '6',
    type: 'Sistema',
    action: 'Cambio de estado: Pendiente -> Activo',
    user: 'Sistema',
    timestamp: '10 Mar 2026, 08:00',
    status: 'success'
  }
];

export const ActorHistory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const actor = MOCK_ACTORS.find(a => a.id === id);
  
  const [filterType, setFilterType] = useState<string>('Todos');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  if (!actor) return <div>Actor no encontrado</div>;

  const filteredEvents = MOCK_HISTORY.filter(event => {
    if (filterType !== 'Todos' && event.type !== filterType) return false;
    // Date filtering logic would go here
    return true;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Documentos': return <FileText className="w-4 h-4" />;
      case 'Contratos': return <Handshake className="w-4 h-4" />;
      case 'Datos de Contacto': return <Phone className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">
            Historial de Actividad
          </h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            Trazabilidad completa de acciones para <span className="font-bold text-primary">{actor.name}</span>
          </p>
        </div>
        
        <button 
          onClick={() => navigate(`/actor/${id}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-outline-variant/20 text-sm font-bold text-on-surface hover:bg-surface-container-low transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Detalle
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Filtrar por:</span>
        </div>
        
        <div className="flex items-center gap-2">
          {['Todos', 'Documentos', 'Contratos', 'Datos de Contacto'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                filterType === type 
                  ? "bg-cyan-900 text-white border-cyan-900 shadow-md" 
                  : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/20 hover:border-primary/30"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="h-6 w-[1px] bg-outline-variant/20 hidden lg:block"></div>

        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-on-surface-variant" />
            <input 
              type="date" 
              className="bg-surface-container-low border-none rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-primary/20"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
            <span className="text-xs text-outline">a</span>
            <input 
              type="date" 
              className="bg-surface-container-low border-none rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-primary/20"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-outline-variant/20"></div>

        <div className="space-y-8">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="relative pl-16 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
              {/* Timeline Dot */}
              <div className={cn(
                "absolute left-[18px] top-0 w-8 h-8 rounded-full border-4 border-surface flex items-center justify-center z-10 shadow-sm",
                event.status === 'success' ? "bg-teal-500 text-white" :
                event.status === 'warning' ? "bg-amber-500 text-white" :
                "bg-cyan-600 text-white"
              )}>
                {getEventIcon(event.type)}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-all group">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                        event.type === 'Documentos' ? "bg-blue-50 text-blue-700" :
                        event.type === 'Contratos' ? "bg-purple-50 text-purple-700" :
                        event.type === 'Datos de Contacto' ? "bg-orange-50 text-orange-700" :
                        "bg-slate-50 text-slate-700"
                      )}>
                        {event.type}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-on-surface-variant">
                        <Clock className="w-3 h-3" />
                        {event.timestamp}
                      </div>
                    </div>
                    
                    <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                      {event.action}
                    </h3>
                    
                    {event.details && (
                      <p className="text-sm text-on-surface-variant bg-surface-container-low p-3 rounded-xl border border-outline-variant/5">
                        {event.details}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 bg-surface-container-lowest px-4 py-2 rounded-xl border border-outline-variant/10 self-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {event.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">{event.user}</p>
                      <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Usuario Responsable</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-surface-container-low p-6 rounded-2xl border border-dashed border-outline-variant/30 text-center">
        <p className="text-xs text-on-surface-variant font-medium">
          Mostrando {filteredEvents.length} eventos de trazabilidad. Los registros del sistema son inmutables.
        </p>
      </div>
    </div>
  );
};
