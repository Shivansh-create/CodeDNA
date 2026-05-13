import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  // Try to fetch existing analysis
  const existingAnalysis = await prisma.analysisResult.findUnique({
    where: { userId: session.user.id },
  });

  const githubUsername = (session.user as any).githubUsername;

  return (
    <DashboardClient 
      initialData={existingAnalysis} 
      githubUsername={githubUsername}
    />
  );
}
