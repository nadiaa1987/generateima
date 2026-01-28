import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not set in the environment.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Edits or generates a new image based on an input image and a prompt.
 * Uses gemini-2.5-flash-image for image-to-image capabilities.
 */
export const generateEditedImage = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  const ai = getClient();
  
  // Clean base64 string if it contains the data URL prefix
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt || "Enhance this image based on its visual content.",
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
        ],
      },
      // Note: responseMimeType is not supported for nano banana series (flash-image)
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    // If only text is returned (e.g., refusal or description), throw an error
    const textPart = parts.find(p => p.text);
    if (textPart) {
        throw new Error(`Model returned text instead of image: ${textPart.text}`);
    }

    throw new Error("No valid image data found in response");

  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    throw new Error(error.message || "Failed to generate image");
  }
};
