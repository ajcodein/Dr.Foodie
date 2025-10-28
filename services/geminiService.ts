import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { FoodInfo, ComparisonFoodInfo } from '../types';

const foodInfoSchema = {
  type: Type.OBJECT,
  properties: {
    foodName: { type: Type.STRING, description: "The common name of the food item." },
    description: { type: Type.STRING, description: "A brief, one-paragraph description of the food." },
    imageQuery: { type: Type.STRING, description: "A simple, effective search query for a realistic, high-quality photo of this food. For example: 'fresh ripe avocado'." },
    nutritionFacts: {
      type: Type.OBJECT,
      description: "Nutritional information per 100g serving.",
      properties: {
        calories: { type: Type.NUMBER },
        protein: { type: Type.NUMBER, description: "in grams" },
        carbohydrates: { type: Type.NUMBER, description: "in grams" },
        fat: { type: Type.NUMBER, description: "in grams" },
        fiber: { type: Type.NUMBER, description: "in grams" },
        sugar: { type: Type.NUMBER, description: "in grams" },
        sodium: { type: Type.NUMBER, description: "in milligrams" },
        cholesterol: { type: Type.NUMBER, description: "in milligrams" },
      },
    },
    vitaminsAndMinerals: {
      type: Type.ARRAY,
      description: "List of key vitamins and minerals with their approximate amount per 100g serving.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          amount: { type: Type.STRING, description: "e.g., '15mg', '400mcg'" },
          percentDV: { type: Type.STRING, description: "Percentage of Daily Value, e.g., '25%'" }
        }
      }
    },
    healthBenefits: {
      type: Type.ARRAY,
      description: "A list of 3-5 science-based health benefits.",
      items: { type: Type.STRING }
    },
    overuseWarnings: {
      type: Type.ARRAY,
      description: "A list of 1-3 potential health risks or warnings associated with overconsumption. If none, return an empty array.",
      items: { type: Type.STRING }
    },
    healthierAlternatives: {
      type: Type.ARRAY,
      description: "A list of 2-3 healthier alternatives with a brief reason. If none are obvious, return an empty array.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          reason: { type: Type.STRING }
        }
      }
    }
  },
  required: ["foodName", "description", "imageQuery", "nutritionFacts", "vitaminsAndMinerals", "healthBenefits", "overuseWarnings"]
};

const foodComparisonSchema = {
  type: Type.ARRAY,
  description: "An array of nutritional information for the requested foods.",
  items: {
    type: Type.OBJECT,
    properties: {
      foodName: { type: Type.STRING },
      imageQuery: { type: Type.STRING, description: "A simple, effective search query for a realistic, high-quality photo of this food." },
      nutritionFacts: {
        type: Type.OBJECT,
        description: "Nutritional information per 100g serving.",
        properties: {
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER, description: "in grams" },
          carbohydrates: { type: Type.NUMBER, description: "in grams" },
          fat: { type: Type.NUMBER, description: "in grams" },
        },
      },
    },
    required: ["foodName", "imageQuery", "nutritionFacts"]
  }
};


export const getFoodInfo = async (foodName: string): Promise<FoodInfo> => {
    // FIX: The GoogleGenAI constructor requires an object with the apiKey.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Provide a detailed nutritional analysis for ${foodName}. Ensure all data is accurate, science-based, and presented per 100g serving.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: foodInfoSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as FoodInfo;
    } catch (error) {
        console.error("Error fetching food info:", error);
        throw new Error("Failed to fetch nutritional information from AI. Please try again.");
    }
};

export const compareFoods = async (foodNames: string[]): Promise<ComparisonFoodInfo[]> => {
    if (foodNames.length < 2) {
        throw new Error("At least two foods are required for comparison.");
    }
    
    // FIX: The GoogleGenAI constructor requires an object with the apiKey.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Provide a nutritional comparison for the following foods: ${foodNames.join(', ')}. Focus on calories, protein, carbs, and fat per 100g serving.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: foodComparisonSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ComparisonFoodInfo[];
    } catch (error) {
        console.error("Error comparing foods:", error);
        throw new Error("Failed to fetch food comparison data from AI. Please try again.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    // FIX: The GoogleGenAI constructor requires an object with the apiKey.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        console.warn("No image data found in Gemini response for prompt:", prompt);
        return ""; // Return empty string if no image found
    } catch (error) {
        console.error("Error generating image:", error);
        return ""; // Return empty string on error
    }
};