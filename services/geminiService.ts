import { GoogleGenAI } from "@google/genai";
import { LoveNoteRequest } from '../types';

export const generateLoveNote = async (request: LoveNoteRequest): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not set. Returning mock response.");
    return "My love for you is endless, like the stars in the sky. (API Key missing)";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let prompt = `Write a short, cute, and ${request.tone} love note for my partner`;
    if (request.partnerName) {
      prompt += ` named ${request.partnerName}`;
    }
    prompt += ". Keep it under 50 words. Make it heartwarming.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "You are my everything!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I love you more than words can say! (Error generating poem)";
  }
};

export const generateValentineImage = async (): Promise<string | null> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY missing for image generation");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: "Two incredibly adorable fluffy teddy bears hugging tightly with pure joy, surrounded by a magical glow of floating red and pink hearts, soft cinematic lighting, pastel color palette, high-detailed fur texture, 3D Pixar-style animation render, dreamy bokeh background, sparkles, ultra-cute, heartwarming masterpiece." }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    console.error("Failed to generate image", e);
    return null;
  }
};

export const generateProposalImage = async (): Promise<string | null> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY missing for image generation");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: "A cute 3D rendered fluffy teddy bear holding a big red heart, looking hopeful and shy, asking a question, soft pastel pink background, high quality, adorable, valentine's day theme, studio lighting" }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    console.error("Failed to generate image", e);
    return null;
  }
};