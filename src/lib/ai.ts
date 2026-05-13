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
  Analyze the following GitHub developer data and generate a detailed engineering personality profile.
  You are an expert technical recruiter and senior staff engineer evaluating a candidate.

  Data:
  - Repositories Count: ${githubData.reposCount}
  - Total Stars: ${githubData.totalStars}
  - Total Forks: ${githubData.totalForks}
  - Languages Bytes: ${JSON.stringify(githubData.languages)}
  - Bio: ${githubData.profile.bio || "N/A"}
  - Public Repos: ${githubData.profile.public_repos}
  - Top 15 Repos Intelligence (names, descriptions, topics, dates): ${JSON.stringify(githubData.repoIntelligence)}

  You must deeply analyze their architecture sophistication, open source trajectory, and startup vs enterprise suitability.
  Provide explanations for why you chose the archetype and scores.
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
          responseMimeType: "text/plain",
          maxOutputTokens: 800,
          temperature: 0.3,
        }
      });

      console.log(`Using Gemini/Google model: ${modelName}`);
      break;
    } catch (error: any) {
      lastError = error;
      const message = String(error.message || error);
      if (message.toLowerCase().includes("not found") || message.toLowerCase().includes("unsupported") || message.toLowerCase().includes("404")) {
        console.warn(`Model ${modelName} unavailable, trying next model.`);
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
  const analysis = JSON.parse(aiContent);

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
