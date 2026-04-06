import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActors } from '../context/ActorContext';
import { toast } from 'sonner';
import { SYSTEM_PROMPT, getGeminiApiKey } from '../lib/gemini';

interface ChatResponse {
  text: string;
  action?: {
    type: 'nav' | 'update' | 'query' | 'none';
    label: string;
    target?: string;
    params?: { field: string; value: any };
  };
}

export const useChatAgent = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { actors, updateActor, addLog } = useActors();
  const navigate = useNavigate();

  const processMessage = async (message: string): Promise<ChatResponse> => {
    setIsProcessing(true);
    
    try {
      const actorsContext = actors.map(a => ({
        id: a.id,
        name: a.name,
        rut: a.rut,
        status: a.status,
        nature: a.nature,
        mainRole: a.mainRole,
        profession: a.profession,
        employer: a.employer,
        entityType: a.entityType
      }));

      const fullPrompt = SYSTEM_PROMPT.replace('{{ACTORS_DATA}}', JSON.stringify(actorsContext, null, 2));
      const apiKey = getGeminiApiKey();

      // Siempre usamos el PROXY para evitar CORS y Timeouts en el navegador
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: fullPrompt, 
          message,
          apiKey: apiKey // Enviamos la clave del localStorage al proxy
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en el servidor proxy');
      }

      const parsedResponse: ChatResponse = await response.json();

      // Procesar acciones si existen
      if (parsedResponse.action) {
        const { type, target, params, label } = parsedResponse.action;

        if (type === 'nav' && target) {
          toast.info(`Navegando a: ${label || target}`, { duration: 2000 });
          navigate(target);
        } 
        else if (type === 'update' && target && params) {
          updateActor(target, { [params.field]: params.value });
          const actorName = actors.find(a => a.id === target)?.name || 'Actor';
          addLog(target, { 
            action: `${params.field} actualizado vía MINCK-PILOT: ${params.value}`, 
            status: params.field === 'status' && params.value === 'Bloqueado' ? 'warning' : 'success' 
          });
          toast.success(`${params.field} de ${actorName} actualizado`);
        }
      }

      setIsProcessing(false);
      return parsedResponse;

    } catch (error: any) {
      console.error("Chat Agent Error:", error);
      setIsProcessing(false);
      
      return {
        text: `Error de conexión: No pude procesar tu solicitud a través del proxy. ${error.message.includes('API key') ? 'Verifica tu API Key en Configuración.' : error.message}`,
        action: { type: 'none', label: 'Error' }
      };
    }
  };

  return { processMessage, isProcessing };
};
