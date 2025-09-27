import { GoogleGenAI, Type } from "@google/genai";
import type { Language, TranscriptResult, CaptionResult } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const transcribeAndGenerate = async (mediaFile: File, language: Language): Promise<TranscriptResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const mediaPart = await fileToGenerativePart(mediaFile);

  const prompt = `You are an expert transcriber and social media content creator. Your task is to process the provided audio or video file.
  1. Transcribe the audio from the file accurately into ${language.name} (language code: ${language.code}).
  2. Based on the transcription, create an extremely short and punchy caption, strictly one sentence. This caption MUST be very short, suitable for a quick glance on TikTok. It should be intriguing, tell part of the story, and must urge viewers to comment by asking a question or including a call-to-action.
  3. Generate exactly 5 of the most relevant and effective hashtags for the content, suitable for both TikTok and YouTube. Hashtags should be specific to the content. If the content is about history or ancient stories, you MUST include the hashtags: #history, #educational, #trivia, #fyp, and one more hashtag related to the main character or specific topic of the story. For other topics, generate relevant hashtags.
  4. Create a compelling and SEO-friendly YouTube title based on the transcript. The title must be under 100 characters and follow the format 'Catchy Hook: Descriptive Subtitle'. For example: 'Unraveling Ancient Mysteries: A Journey Through Time'.
  5. Return the result in the specified JSON format.`;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [mediaPart, { text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transcript: {
              type: Type.STRING,
              description: `The transcribed text from the audio in ${language.name}.`
            },
            tiktok_caption: {
              type: Type.STRING,
              description: "An extremely short, single-sentence caption suitable for TikTok that encourages comments."
            },
            hashtags: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              },
              description: "An array of 5 relevant hashtags for TikTok, each starting with '#', including genre or character names."
            },
            youtube_title: {
              type: Type.STRING,
              description: "A compelling YouTube title under 100 characters in 'Hook: Subtitle' format."
            }
          },
          required: ["transcript", "tiktok_caption", "hashtags", "youtube_title"]
        },
      }
    });

    const responseText = result.text.trim();
    const parsedResult = JSON.parse(responseText) as TranscriptResult;

    if (!parsedResult.transcript || !parsedResult.tiktok_caption || !Array.isArray(parsedResult.hashtags) || !parsedResult.youtube_title) {
        throw new Error("Invalid response format from API.");
    }
    
    return parsedResult;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to process the file. The file might be corrupted, unsupported, or the content could not be analyzed. Please try a different file.");
  }
};

export const generateCaptionFromTranscript = async (transcript: string, language: Language): Promise<CaptionResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `You are a viral TikTok and YouTube content strategist. Based on the following text transcribed in ${language.name}, your task is to generate a COMPLETELY NEW and DIFFERENT caption, set of hashtags, and YouTube title. The user was not satisfied with the previous set.
  1. Create a fresh, extremely short, and punchy TikTok caption, strictly one sentence. It MUST be very brief. The caption should be intriguing, tell part of the story, and must urge viewers to comment by asking a question or including a call-to-action.
  2. Generate exactly 5 of the most relevant, trending, and viral-worthy hashtags for the content, suitable for both TikTok and YouTube. Hashtags should be specific to the content. If the content is about history or ancient stories, you MUST include the hashtags: #history, #educational, #trivia, #fyp, and one more hashtag related to the main character or specific topic of the story. For other topics, generate new, relevant hashtags.
  3. Create a new, compelling, and SEO-friendly YouTube title. It must be under 100 characters, different from any previous suggestions, and follow the format 'Catchy Hook: Descriptive Subtitle'. For example: 'Unraveling Ancient Mysteries: A Journey Through Time'.
  4. Ensure your output is in the specified JSON format.
  
  Transcript: "${transcript}"`;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tiktok_caption: {
              type: Type.STRING,
              description: "A new, extremely short, single-sentence caption suitable for TikTok that encourages comments."
            },
            hashtags: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              },
              description: "A new array of 5 relevant and viral hashtags for TikTok, each starting with '#', including genre or character names."
            },
            youtube_title: {
              type: Type.STRING,
              description: "A new, compelling YouTube title under 100 characters in 'Hook: Subtitle' format."
            }
          },
          required: ["tiktok_caption", "hashtags", "youtube_title"]
        },
      }
    });
    
    const responseText = result.text.trim();
    const parsedResult = JSON.parse(responseText) as CaptionResult;

    if (!parsedResult.tiktok_caption || !Array.isArray(parsedResult.hashtags) || !parsedResult.youtube_title) {
      throw new Error("Invalid response format from API for caption regeneration.");
    }

    return parsedResult;

  } catch (error) {
    console.error("Gemini API call for regeneration failed:", error);
    throw new Error("Failed to regenerate the content. Please try again.");
  }
};