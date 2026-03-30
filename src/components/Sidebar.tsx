import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Actores', href: '/' },
    { icon: Building2, label: 'Entidades', href: '/entities' },
    { icon: BarChart3, label: 'Reportes', href: '/reports' },
    { icon: Settings, label: 'Configuración', href: '/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-outline-variant/10 flex flex-col py-6 z-40 hidden md:flex">
      <div className="px-6 mb-10">
        <h1 className="font-headline font-extrabold text-primary text-2xl tracking-tight">Actores</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            className={({ isActive }) => cn(
              "flex items-center px-4 py-3 rounded-lg transition-all duration-200 group",
              isActive 
                ? "text-primary font-bold border-r-4 border-primary bg-surface-container-low" 
                : "text-on-surface-variant hover:bg-surface-container-low"
            )}
          >
            <item.icon className={cn("mr-3 w-5 h-5", "group-hover:scale-110 transition-transform")} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-3 pt-6 border-t border-outline-variant/10 space-y-1">
        <button className="w-full primary-gradient text-white py-3 rounded-xl font-semibold text-sm mb-6 flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:opacity-90 transition-all active:scale-95">
          <Plus className="w-4 h-4" />
          Nuevo Arriendo
        </button>
        
        <a href="#" className="flex items-center px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-all">
          <HelpCircle className="mr-3 w-5 h-5" />
          <span className="text-sm font-medium">Ayuda</span>
        </a>
        <a href="#" className="flex items-center px-4 py-3 text-error hover:bg-error-container/20 rounded-lg transition-all">
          <LogOut className="mr-3 w-5 h-5" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </a>
      </div>
    </aside>
  );
};
