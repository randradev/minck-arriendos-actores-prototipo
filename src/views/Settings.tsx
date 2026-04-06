import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Key, 
  Eye, 
  EyeOff, 
  Bot, 
  Database,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

export const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    // Simular un pequeño retardo para feedback visual
    setTimeout(() => {
      localStorage.setItem('GEMINI_API_KEY', apiKey);
      setIsSaving(false);
      toast.success('Configuración guardada correctamente', {
        description: 'La clave de Gemini API ha sido actualizada y persistida localmente.',
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />
      });
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl primary-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <SettingsIcon className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">Configuración</h1>
            <p className="text-on-surface-variant text-sm font-medium">Gestiona las preferencias y claves del sistema MINCK.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Panel Izquierdo: Información */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-on-surface">Inteligencia Artificial</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              MINCK-PILOT utiliza los modelos de Google Gemini para procesar lenguaje natural y ejecutar acciones automáticas en el Directorio de Actores.
            </p>
            <div className="mt-4 p-3 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-[10px] text-primary font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Seguridad de Datos
              </p>
              <p className="text-[10px] text-primary/70 mt-1 font-medium">
                Tu clave se almacena únicamente en este navegador (localStorage). Nunca se envía a servidores de terceros excepto a la API de Google.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-secondary" />
              <h3 className="font-bold text-on-surface">Estado del Sistema</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant">Modo de Ejecución</span>
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-tighter">Prototipo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant">Persistencia local</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tighter">Activa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Configuración de API */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-outline-variant/10 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/5">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface">Gemini API Key</h3>
                <p className="text-xs text-on-surface-variant">Ingresa tu clave personal de Google AI Studio para habilitar el chatbot.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">
                  Google Gemini API Key
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Pega aquí tu API Key de Google"
                    className="w-full pl-11 pr-12 py-3.5 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-mono"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-surface-container rounded-xl text-on-surface-variant transition-colors"
                    title={showKey ? "Ocultar clave" : "Mostrar clave"}
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-on-surface-variant/60 ml-1">
                  Puedes obtener una clave gratuita en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Google AI Studio</a>.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    apiKey ? "bg-green-500 animate-pulse" : "bg-red-500"
                  )}></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {apiKey ? "Clave configurada" : "Sin clave configurada"}
                  </span>
                </div>
                
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-3.5 primary-gradient text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6">
            <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
              <Bot className="w-4 h-4" />
              ¿Qué puedo hacer con MINCK-PILOT?
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Consultar deudas de arrendatarios",
                "Actualizar números telefónicos",
                "Cambiar estados a 'Bloqueado'",
                "Navegar entre perfiles de actores",
                "Ver historial de movimientos",
                "Registrar nuevos avales"
              ].map((tip, i) => (
                <li key={i} className="flex items-center gap-2 text-[11px] text-primary/80 font-medium">
                  <div className="w-1 h-1 rounded-full bg-primary/40"></div>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for conditional classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
