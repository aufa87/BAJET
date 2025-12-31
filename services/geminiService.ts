
// This file is now a stub to satisfy remaining imports if any, 
// though the app has been updated to remove AI feature usage.

export const generateImage = async (prompt: string, settings: any): Promise<string | null> => {
  console.warn("AI Image generation is disabled.");
  return null;
};

export const generateSpeech = async (text: string): Promise<string | null> => {
  console.warn("AI Speech generation is disabled.");
  return null;
};

export const chatWithGemini = async (message: string, history: any[]): Promise<string> => {
  return "AI Chat functionality has been disabled as requested.";
};
