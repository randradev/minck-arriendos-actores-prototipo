import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Toaster } from 'sonner';
import { Chatbot } from './components/Chatbot';

export const Layout = () => {
  const location = useLocation();
  
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return [{ label: 'Actores' }, { label: 'Directorio' }];
    if (path === '/properties') return [{ label: 'Propiedades' }, { label: 'Directorio' }];
    if (path.startsWith('/actor/')) {
      if (path.endsWith('/history')) {
        const actorId = path.split('/')[2];
        return [
          { label: 'Actores', href: '/' }, 
          { label: 'Detalle del Actor', href: `/actor/${actorId}` },
          { label: 'Historial del Actor' }
        ];
      }
      return [{ label: 'Actores', href: '/' }, { label: 'Detalle del Actor' }];
    }
    if (path.startsWith('/edit/')) return [{ label: 'Actores', href: '/' }, { label: 'Edición' }];
    if (path === '/register') return [{ label: 'Actores', href: '/' }, { label: 'Registro' }];
    return [{ label: 'Actores', href: '/' }];
  };

  const isPropertiesPage = location.pathname === '/properties';

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main className="md:ml-64 min-h-screen flex flex-col">
        <TopBar 
          breadcrumbs={getBreadcrumbs()} 
          showSearch={location.pathname === '/' || isPropertiesPage}
          searchPlaceholder={isPropertiesPage ? "Filtrar por nombre, Rol SII o dirección..." : undefined}
        />
        <div className="px-6 md:px-12 py-8 flex-1">
          <Outlet />
        </div>
      </main>
      <Toaster position="top-right" richColors closeButton />
      <Chatbot />
    </div>
  );
};
