import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Actor, Contract, Document, ActivityLog, Notification } from '../types';
import { 
  MOCK_ACTORS, 
  MOCK_CONTRACTS, 
  MOCK_DOCS, 
  MOCK_LOGS, 
  MOCK_NOTIFICATIONS 
} from '../mockData';

interface ActorContextType {
  actors: Actor[];
  contracts: Record<string, Contract[]>;
  docs: Record<string, Document[]>;
  logs: Record<string, ActivityLog[]>;
  notifications: Notification[];
  updateActor: (id: string, updates: Partial<Actor>) => void;
  addLog: (actorId: string, log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
}

const ActorContext = createContext<ActorContextType | undefined>(undefined);

export const ActorProvider = ({ children }: { children: ReactNode }) => {
  const [actors, setActors] = useState<Actor[]>(MOCK_ACTORS);
  const [contracts] = useState<Record<string, Contract[]>>(MOCK_CONTRACTS);
  const [docs] = useState<Record<string, Document[]>>(MOCK_DOCS);
  const [logs, setLogs] = useState<Record<string, ActivityLog[]>>(MOCK_LOGS);
  const [notifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const updateActor = (id: string, updates: Partial<Actor>) => {
    setActors(prev => prev.map(actor => 
      actor.id === id ? { ...actor, ...updates, updatedAt: new Date().toISOString() } : actor
    ));
  };

  const addLog = (actorId: string, log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...log,
      id: `L-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => ({
      ...prev,
      [actorId]: [newLog, ...(prev[actorId] || [])]
    }));
  };

  return (
    <ActorContext.Provider value={{ 
      actors, 
      contracts, 
      docs, 
      logs, 
      notifications, 
      updateActor,
      addLog
    }}>
      {children}
    </ActorContext.Provider>
  );
};

export const useActors = () => {
  const context = useContext(ActorContext);
  if (context === undefined) {
    throw new Error('useActors must be used within an ActorProvider');
  }
  return context;
};
