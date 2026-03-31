import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActors } from '../context/ActorContext';
import { toast } from 'sonner';
import { geminiModel, SYSTEM_PROMPT } from '../lib/gemini';

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

  const callGeminiWithRetry = async (prompt: string, userMsg: string, retries = 2): Promise<string> => {
    try {
      const result = await geminiModel.generateContent([prompt, `Usuario: ${userMsg}`]);
      return result.response.text();
    } catch (err: any) {
      if (retries > 0 && (err.message?.includes("fetch") || err.message?.includes("network"))) {
        console.warn(`Error de red detectado. Reintentando... (${retries} intentos restantes)`);
        await new Promise(res => setTimeout(resolve => res(null), 1000));
        return callGeminiWithRetry(prompt, userMsg, retries - 1);
      }
      throw err;
    }
  };

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

      const responseTextRaw = await callGeminiWithRetry(fullPrompt, message);
      const responseText = responseTextRaw.replace(/```json/g, '').replace(/```/g, '').trim();

      let parsedResponse: ChatResponse;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON Parse Error. Raw response:", responseText);
        throw new Error("La IA respondió en un formato no válido. Intenta de nuevo.");
      }

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
      console.error("Gemini Error:", error);
      setIsProcessing(false);
      
      let errorMsg = "Lo siento, tuve un problema técnico.";
      
      if (error.message?.includes("API_KEY_INVALID")) {
        errorMsg = "Error: La API KEY es inválida. Revisa tu archivo .env";
      } else if (error.message?.includes("fetch") || error.message?.includes("Network")) {
        errorMsg = "Error de conexión: Google AI no responde. Revisa tu internet o si un bloqueador de anuncios está interfiriendo.";
      } else {
        errorMsg = `Error: ${error.message || "Ocurrió un error inesperado"}`;
      }

      return {
        text: errorMsg,
        action: { type: 'none', label: 'Error' }
      };
    }
  };

  return { processMessage, isProcessing };
};
