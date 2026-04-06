import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Modelo estricto solicitado: gemini-3-flash-preview
const MODEL_NAME = "gemini-3-flash-preview"; 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.1,
  },
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ]
});

app.post('/api/chat', async (req, res) => {
  const { prompt, message, apiKey } = req.body;

  try {
    // Identificar el origen de la clave para el log solicitado
    let activeApiKey;
    let keySource;

    if (apiKey && apiKey.trim() !== "") {
      activeApiKey = apiKey;
      keySource = "CONFIGURACIÓN (Interfaz/LocalStorage)";
    } else {
      activeApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
      keySource = "VARIABLES DE ENTORNO (Servidor/.env)";
    }
    
    // Log en la consola del servidor
    console.log(`[${new Date().toLocaleTimeString()}] 🤖 Petición procesada. API Key extraída de: ${keySource}`);

    if (!activeApiKey) {
      return res.status(400).json({ error: "No se proporcionó una Gemini API Key en ninguna fuente." });
    }

    const requestGenAI = new GoogleGenerativeAI(activeApiKey);
    const requestModel = requestGenAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ]
    });

    const result = await requestModel.generateContent([prompt, `Usuario: ${message}`]);
    const response = await result.response;
    const text = response.text();
    
    // Limpieza de bloques de código markdown
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    // Adjuntamos el origen de la clave en la respuesta para visibilidad del frontend
    res.json({
      ...parsedData,
      _debug: {
        keySource: keySource,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error en Gemini Proxy:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`\n🚀 MINCK Chatbot Proxy en http://localhost:${port}`);
  console.log(`Usando modelo: ${MODEL_NAME}\n`);
});
