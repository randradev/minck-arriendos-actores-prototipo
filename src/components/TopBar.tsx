import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Settings, Search, ChevronRight, X, User, Building2, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { cn, normalizeRut } from '../lib/utils';
import { MOCK_ACTORS, MOCK_NOTIFICATIONS } from '../mockData';
import { Actor, Notification } from '../types';

interface TopBarProps {
  breadcrumbs: { label: string; href?: string }[];
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export const TopBar = ({ 
  breadcrumbs: initialBreadcrumbs, 
  showSearch = false,
  searchPlaceholder = "Filtrar por nombre, RUT, o entidad..."
}: TopBarProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState(initialBreadcrumbs);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const newNotificationsCount = notifications.filter(n => n.status === 'nuevo').length;

  useEffect(() => {
    if (showNotifications) {
      // Mark as seen after a short delay to let the user see the "new" state first
      const timer = setTimeout(() => {
        setNotifications(prev => prev.map(n => ({ ...n, status: 'visto' })));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showNotifications]);

  useEffect(() => {
    setBreadcrumbs(initialBreadcrumbs);
  }, [initialBreadcrumbs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length >= 3);
    
    // Emit custom event for ActorList to consume
    window.dispatchEvent(new CustomEvent('smart-search', { detail: value }));
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    window.dispatchEvent(new CustomEvent('smart-search', { detail: '' }));
  };

  const handleSuggestionClick = (actor: Actor) => {
    setBreadcrumbs([{ label: 'Actores' }, { label: 'Detalle' }, { label: actor.name }]);
    setShowSuggestions(false);
    setSearchQuery('');
    navigate(`/actor/${actor.id}`);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="text-cyan-900 font-bold">{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const filteredSuggestions = MOCK_ACTORS.filter(actor => {
    if (!searchQuery || searchQuery.length < 3) return false;
    
    const normalizedQuery = normalizeRut(searchQuery);
    const normalizedActorRut = normalizeRut(actor.rut);
    
    return (
      actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      normalizedActorRut.includes(normalizedQuery)
    );
  });

  return (
    <header className="flex justify-between items-center w-full px-6 md:px-12 h-16 sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-outline-variant/10">
      <div className="flex items-center gap-6 flex-1">
        <div className="flex items-center space-x-2 text-on-surface-variant text-sm">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.label}>
              {i > 0 && <ChevronRight className="w-3 h-3" />}
              {crumb.href ? (
                <button 
                  onClick={() => navigate(crumb.href!)}
                  className={cn(
                    "hover:text-primary transition-colors cursor-pointer",
                    i === breadcrumbs.length - 1 ? "text-on-surface font-semibold" : ""
                  )}
                >
                  {crumb.label}
                </button>
              ) : (
                <span className={cn(i === breadcrumbs.length - 1 ? "text-on-surface font-semibold" : "")}>
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {showSearch && (
          <div className="relative max-w-xl w-full hidden lg:block" ref={dropdownRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                className="w-full bg-surface-container-low border-none rounded-lg py-2 pl-10 pr-10 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
                placeholder="Filtrar por nombre, RUT, o entidad..."
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length >= 3 && setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setShowSuggestions(false);
                  }
                }}
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-on-surface transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-outline-variant/15 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full flex items-center gap-4 p-3 hover:bg-surface-container-low rounded-lg transition-colors text-left group"
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                          suggestion.nature === 'Natural' ? "bg-secondary-container text-on-secondary-container" :
                          suggestion.nature === 'Jurídica' ? "bg-primary-fixed text-on-primary-fixed-variant" :
                          "bg-amber-100 text-amber-800"
                        )}>
                          {suggestion.nature === 'Natural' ? <User className="w-5 h-5" /> :
                           suggestion.nature === 'Jurídica' ? <Building2 className="w-5 h-5" /> :
                           <ShieldCheck className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-on-surface truncate">
                            {highlightMatch(suggestion.name, searchQuery)}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                              {highlightMatch(suggestion.rut, searchQuery)}
                            </span>
                            <span className="text-[10px] text-outline">•</span>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                              {suggestion.mainRole}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Search className="w-8 h-8 text-outline mx-auto mb-2 opacity-20" />
                      <p className="text-sm text-on-surface-variant">No se encontraron resultados para "{searchQuery}"</p>
                    </div>
                  )}
                </div>
                <div className="bg-surface-container-low p-2 border-t border-outline-variant/10">
                  <p className="text-[10px] text-on-surface-variant text-center font-medium">
                    Presione <span className="font-bold">Enter</span> para ver todos los resultados
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all relative",
                showNotifications && "bg-surface-container-low"
              )}
            >
              <Bell className="w-5 h-5" />
              {newNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] bg-error text-white text-[9px] font-bold flex items-center justify-center rounded-full ring-2 ring-white px-0.5">
                  {newNotificationsCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-outline-variant/15 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between">
                  <h3 className="font-headline font-bold text-on-surface">Tareas Pendientes</h3>
                  {newNotificationsCount > 0 && (
                    <span className="px-2 py-0.5 bg-error/10 text-error text-[10px] font-bold uppercase tracking-wider rounded-full">
                      {newNotificationsCount} NUEVAS
                    </span>
                  )}
                </div>
                
                <div className="max-h-[320px] overflow-y-auto no-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={cn(
                          "p-4 border-b border-outline-variant/5 last:border-0 transition-colors hover:bg-surface-container-low relative",
                          notification.status === 'nuevo' ? "bg-primary/5" : ""
                        )}
                      >
                        {notification.status === 'nuevo' && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                        )}
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant shrink-0">
                            {notification.actorName.includes('Inmobiliaria') ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className="text-sm font-bold text-on-surface truncate">{notification.actorName}</p>
                              <span className="text-[10px] text-on-surface-variant font-medium">{notification.time}</span>
                            </div>
                            <p className="text-xs text-on-surface-variant mb-3 line-clamp-1">{notification.reason}</p>
                            <button 
                              onClick={() => {
                                setShowNotifications(false);
                                navigate(`/actor/${notification.actorId}#documentacion`);
                              }}
                              className="w-full py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Resolver
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="w-8 h-8 text-outline mx-auto mb-2 opacity-20" />
                      <p className="text-sm text-on-surface-variant">No hay tareas pendientes</p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/notificaciones');
                  }}
                  className="w-full py-3 bg-surface-container-low text-primary text-[11px] font-bold hover:bg-surface-container-highest transition-colors border-t border-outline-variant/10"
                >
                  Ver todas las tareas
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="h-6 w-[1px] bg-outline-variant/20"></div>
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:opacity-80 transition-all">
          AS
        </div>
      </div>
    </header>
  );
};
