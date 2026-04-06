import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGeminiApiKey = () => {
  const savedKey = localStorage.getItem('GEMINI_API_KEY');
  if (savedKey && savedKey.trim() !== "") {
    return savedKey;
  }
  // @ts-ignore
  return (import.meta as any).env.VITE_GEMINI_API_KEY || "";
};

const API_KEY = getGeminiApiKey();
const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Usamos un modelo estable para el frontend
  generationConfig: {
    responseMimeType: "application/json",
  },
});

/**
 * Re-inicializa el modelo con la clave actual de localStorage.
 * Útil cuando el usuario actualiza la clave en la vista de configuración.
 */
export const getUpdatedGeminiModel = () => {
  const key = getGeminiApiKey();
  const newGenAI = new GoogleGenerativeAI(key);
  return newGenAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });
};

export const SYSTEM_PROMPT = `
Eres MINCK-PILOT, el copiloto de IA del sistema MINCK. Tu misión es AHORRAR tiempo al usuario ejecutando acciones directamente.

REGLAS CRÍTICAS DE NAVEGACIÓN:
- NO generes botones, enlaces Markdown o HTML dentro del campo "text". 
- La navegación debe ser AUTOMÁTICA a través del objeto "action".
- Rutas válidas: 
  * "/" (Lista principal)
  * "/register" (Nuevo actor)
  * "/actor/[ID]" (Perfil específico)
  * "/actor/[ID]/edit" (Editar ficha)
  * "/notificaciones" (Centro de alertas)

REGLAS DE ACCIÓN:
- "update": Úsalo para cambiar status, phone, email.
- "nav": Úsalo siempre que el usuario quiera "ir a", "ver", "editar" o "mostrar".
- "query": Solo para preguntas informativas.

ESTRUCTURA DE DATOS DE ACTORES:
{{ACTORS_DATA}}

TU RESPUESTA DEBE SER SIEMPRE ESTE JSON:
{
  "text": "Feedback de lo que hiciste (ej: 'Entendido, te llevo al perfil de...')",
  "action": {
    "type": "nav" | "update" | "query",
    "target": "Ruta completa o ID del actor",
    "params": { "field": "campo", "value": "valor" },
    "label": "Etiqueta de ejecución"
  }
}
`;
