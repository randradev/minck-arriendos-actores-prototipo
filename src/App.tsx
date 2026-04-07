/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { ActorList } from './views/ActorList';
import { ActorProfile } from './views/ActorProfile';
import { ActorRegistration } from './views/ActorRegistration';
import { ActorEdit } from './views/ActorEdit';
import { Notifications } from './views/Notifications';
import { ActorHistory } from './views/ActorHistory';
import { Settings } from './views/Settings';
import { PropiedadesDashboard } from './views/properties/PropiedadesDashboard';
import { ActorProvider } from './context/ActorContext';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-on-surface-variant">
    <h2 className="text-2xl font-bold">{title}</h2>
    <p>Esta vista está en desarrollo para el prototipo.</p>
  </div>
);

export default function App() {
  return (
    <ActorProvider>
      <BrowserRouter basename="/minck-arriendos-actores-prototipo-deploy">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ActorList />} />
            <Route path="actor/:id" element={<ActorProfile />} />
            <Route path="actor/:id/history" element={<ActorHistory />} />
            <Route path="register" element={<ActorRegistration />} />
            <Route path="actor/:id/edit" element={<ActorEdit />} />
            <Route path="notificaciones" element={<Notifications />} />
            <Route path="dashboard" element={<Placeholder title="Dashboard" />} />
            <Route path="properties" element={<PropiedadesDashboard />} />
            <Route path="reports" element={<Placeholder title="Reportes" />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ActorProvider>
  );
}
