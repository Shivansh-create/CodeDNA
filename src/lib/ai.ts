import { GoogleGenAI } from "@google/genai";
import { prisma } from "./prisma";
import { aggregateGithubData } from "./github";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  apiVersion: "v1alpha",
});

export async function processAnalysis(userId: string, username: string, updateProgress: (msg: string, percent: number) => Promise<void>, githubToken?: string) {
  await updateProgress("Fetching GitHub data...", 10);
  const githubData = await aggregateGithubData(username, githubToken);

  await updateProgress("Analyzing developer patterns with AI...", 50);

  const prompt = `
  You are an elite AI engineering profiler, decoding the precise "Developer DNA" of a software engineer based on their GitHub data.
  Generate a deeply cinematic, psychological, and highly analytical profile.
  The profile must sound like an AI uncovering their core engineering identity. 

  Data:
  - Repositories Count: ${githubData.reposCount}
  - Total Stars: ${githubData.totalStars}
  - Total Forks: ${githubData.totalForks}
  - Languages Bytes: ${JSON.stringify(githubData.languages)}
  - Bio: ${githubData.profile.bio || "N/A"}
  - Public Repos: ${githubData.profile.public_repos}
  - Top 15 Repos Intelligence (names, descriptions, topics, dates): ${JSON.stringify(githubData.repoIntelligence)}

  Output MUST be a valid JSON object matching this exact schema:
  {
    "overallScore": number (0-100),
    "archetype": {
      "name": string (e.g., "Systems Architect", "Product Engineer", "Experimental Hacker"),
      "description": string (Why they fit this),
      "idealEnvironment": string (What kind of team/company they thrive in)
    },
    "summary": string (A professional summary of their engineering style),
    "narrative": string (A cinematic, slightly edgy observation that starts with something like "Your repositories suggest..." or "You appear to thrive in...". Make it emotionally engaging and insightful. No generic statements. "Holy shit, this platform actually understands me" is the goal.),
    "frontendScore": number (0-100),
    "backendScore": number (0-100),
    "devopsScore": number (0-100),
    "architectureScore": number (0-100),
    "developerDna": {
      "technicalTraits": string[] (e.g., "Frontend Polish", "Rapid Prototyping", "Modular Architecture"),
      "workflowHabits": string[],
      "strengths": string[],
      "weaknesses": string[]
    },
    "evolutionTimeline": [
      {
        "year": number,
        "phase": string (e.g., "Learning Fundamentals", "Scaling Systems"),
        "description": string
      }
    ],
    "projectIntelligence": [
      {
        "repoName": string,
        "architectureNotes": string,
        "scalability": string,
        "score": number (0-100)
      }
    ],
    "careerIntelligence": {
      "startupFit": number (0-100),
      "enterpriseFit": number (0-100),
      "roleRecommendations": string[],
      "hiringSignals": string[]
    }
  }

  CRITICAL INSTRUCTIONS FOR JSON OUTPUT:
  1. Your response MUST be a 100% valid, parseable JSON object.
  2. Do NOT wrap the output in markdown blocks (e.g. \`\`\`json). Output the raw JSON directly.
  3. Do NOT include literal newline characters inside strings. Use \\n instead.
  4. Ensure all double quotes inside strings are properly escaped as \\".
  `;

  const modelCandidates = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.1",
    "gemini-2.0"
  ];

  let result: any = null;
  let usedModel: string | null = null;
  let lastError: any = null;

  for (const modelName of modelCandidates) {
    try {
      usedModel = modelName;
      result = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          maxOutputTokens: 8192,
          temperature: 0.4,
        }
      });

      console.log(`Using Gemini/Google model: ${modelName}`);
      break;
    } catch (error: any) {
      lastError = error;
      const message = String(error.message || error);
      if (
        message.toLowerCase().includes("not found") ||
        message.toLowerCase().includes("unsupported") ||
        message.toLowerCase().includes("404") ||
        message.toLowerCase().includes("503") ||
        message.toLowerCase().includes("429") ||
        message.toLowerCase().includes("high demand") ||
        message.toLowerCase().includes("unavailable")
      ) {
        console.warn(`Model ${modelName} unavailable/busy, trying next model.`);
        continue;
      }
      throw error;
    }
  }

  if (!result) {
    throw lastError || new Error("No available Gemini/Google model could be used for analysis.");
  }

  const aiContent = result.text || result?.candidates?.[0]?.content?.map((part: any) => part?.text ?? part).join("") || undefined;
  if (!aiContent) {
    throw new Error(`Failed to generate AI response from model ${usedModel}`);
  }

  await updateProgress("Finalizing insights...", 90);
  
  let cleanJson = aiContent;
  if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
  }
  cleanJson = cleanJson.trim();

  let analysis;
  try {
    analysis = JSON.parse(cleanJson);
  } catch (error) {
    console.error("Failed to parse JSON. Raw AI Output:", aiContent);
    throw new Error("AI returned invalid JSON format.");
  }

  const savedResult = await prisma.analysisResult.upsert({
    where: { userId },
    update: {
      ...analysis,
      rawGithubData: githubData,
    },
    create: {
      userId,
      ...analysis,
      rawGithubData: githubData,
    },
  });

  await updateProgress("Complete", 100);
  return savedResult;
}
