
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { UserProfile, CareerOpportunity, RoadmapStep, GroundingSource } from "../types";

const API_KEY = process.env.API_KEY || "";

/**
 * Utility to extract search grounding sources from Gemini response
 */
const extractSources = (response: any): GroundingSource[] => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return chunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title || "Official Source",
      uri: chunk.web.uri,
    }));
};

export const fetchOpportunities = async (profile: UserProfile): Promise<CareerOpportunity[]> => {
  if (!API_KEY) return [];

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const isHS = profile.educationLevel === 'High School';
  const majorContext = isHS ? `Favorite Subjects/Area: ${profile.major}` : `Major/Field: ${profile.major}`;
  
  const prompt = `Search for currently open and legitimate career opportunities (internships, graduate programs, fellowships, summer camps, or junior jobs) for a user with the following profile:
  - Education Level: ${profile.educationLevel}
  - ${majorContext}
  - Current Stage: ${profile.currentStage}
  - Future Aspiration: ${profile.futureGoal}
  - Interests: ${profile.interests.join(", ")}

  Rules:
  1. Only include opportunities that are CURRENTLY open for application (not past deadlines).
  2. Focus on "Upcoming" opportunities with deadlines in the next 1-3 months.
  3. Source only from reputed companies, official government sites, or established global institutions.
  4. Return details for exactly 5-6 high-value matches.
  5. Return the data as a clean JSON array.

  JSON Schema Structure:
  {
    "opportunities": [
      {
        "id": "unique-id",
        "title": "Role Title",
        "organization": "Company Name",
        "type": "Internship/Job/Fellowship/Program",
        "deadline": "YYYY-MM-DD",
        "eligibility": "Brief criteria",
        "description": "Quick overview",
        "matchReason": "Why it's perfect for this user's path to becoming ${profile.futureGoal}",
        "officialUrl": "https://..."
      }
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            opportunities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  organization: { type: Type.STRING },
                  type: { type: Type.STRING },
                  deadline: { type: Type.STRING },
                  eligibility: { type: Type.STRING },
                  description: { type: Type.STRING },
                  matchReason: { type: Type.STRING },
                  officialUrl: { type: Type.STRING },
                },
                required: ["id", "title", "organization", "type", "deadline", "officialUrl"],
              }
            }
          }
        }
      },
    });

    const sources = extractSources(response);
    const result = JSON.parse(response.text || '{"opportunities": []}');
    
    return (result.opportunities || []).map((opp: CareerOpportunity) => ({
      ...opp,
      sources: sources
    }));
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    return [];
  }
};

export const generateRoadmap = async (profile: UserProfile): Promise<RoadmapStep[]> => {
  if (!API_KEY) return [];

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `Generate a high-end 5-step career learning roadmap for a user wanting to become a ${profile.futureGoal}.
  Profile:
  - Education: ${profile.educationLevel} (${profile.major})
  - Interests: ${profile.interests.join(", ")}

  IMPORTANT: Prioritize recommending specific, high-quality COURSES and LEARNING PATHS (e.g., from Coursera, edX, MIT OCW, specialized bootcamps).
  
  Each step should include:
  1. A specific course or project title.
  2. The platform/provider.
  3. Why this specific course is better than others for reaching the goal of ${profile.futureGoal}.
  
  Return a JSON array of steps.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Switched to Flash for better speed
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['Course', 'Skill', 'Project', 'Certification'] },
                  provider: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["id", "title", "description", "type", "reason"]
              }
            }
          }
        }
      }
    });

    const sources = extractSources(response);
    const result = JSON.parse(response.text || '{"steps": []}');
    
    return (result.steps || []).map((step: RoadmapStep) => ({
      ...step,
      sources: sources
    }));
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return [];
  }
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
  if (!API_KEY) return;
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Explain this career step warmly and encouragingly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Generation Error:", error);
    return undefined;
  }
};
