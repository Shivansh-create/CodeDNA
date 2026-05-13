import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { BrainCircuit, Trophy, Code2, Sparkles, TrendingUp } from "lucide-react";
import ProfileClient from "@/app/profile/[username]/profile-client";

export default async function PrintRenderPage({ params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({
    where: { githubUsername: params.username },
    include: { analysisResult: true },
  });

  if (!user || !user.analysisResult) {
    return notFound();
  }

  const data = user.analysisResult;
  
  // We can just reuse ProfileClient since it renders everything nicely,
  // but we can add a specific class to the body for printing if needed.
  // Actually, Puppeteer can just snapshot the ProfileClient route directly.
  // But wait! Recharts animations might mess up the snapshot if taken too early.
  // We should pass a prop to disable animations, or just use CSS to disable animations in print media.
  
  return (
    <div className="bg-black text-white min-h-screen" style={{ animation: 'none !important', transition: 'none !important' }}>
      {/* We reuse ProfileClient, but in Puppeteer we will wait for networkidle0 */}
      <ProfileClient data={data} user={user} />
      
      {/* Inject styles to disable animations for the PDF render */}
      <style dangerouslySetInnerHTML={{__html: `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `}} />
    </div>
  );
}
