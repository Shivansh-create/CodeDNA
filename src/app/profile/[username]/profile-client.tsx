"use client";

import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { BrainCircuit, Trophy, Code2, Sparkles, TrendingUp } from "lucide-react";

export default function ProfileClient({ data, user, isOwner = false }: { data: any; user: any; isOwner?: boolean }) {
  const hasAnalysis = Boolean(data);
  const radarData = [
    { subject: 'Frontend', A: data?.frontendScore ?? 0, fullMark: 100 },
    { subject: 'Backend', A: data?.backendScore ?? 0, fullMark: 100 },
    { subject: 'DevOps', A: data?.devopsScore ?? 0, fullMark: 100 },
    { subject: 'Architecture', A: data?.architectureScore ?? 0, fullMark: 100 },
  ];

  const futureTrajectory = data?.futureTrajectory ? (typeof data.futureTrajectory === 'string' ? JSON.parse(data.futureTrajectory) : data.futureTrajectory) : null;

  if (!hasAnalysis) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6 overflow-hidden relative">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{user.name || user.githubUsername}</h1>
            <p className="text-indigo-400 text-lg">@{user.githubUsername}</p>
          </header>

          <div className="glass p-10 rounded-3xl border border-white/10">
            <h2 className="text-3xl font-semibold mb-4">Profile ready, but no analysis yet</h2>
            <p className="text-zinc-400 mb-6">
              This developer has a CodeDNA profile, but they have not generated AI analysis yet.
            </p>
            {isOwner ? (
              <p className="text-zinc-200">
                You can return to your dashboard and click "Start Analysis" to generate your profile report.
              </p>
            ) : (
              <p className="text-zinc-200">
                Come back when they generate their analysis to see the full developer profile.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row items-center gap-6">
          {user.image ? (
            <img src={user.image} alt={user.githubUsername} className="w-24 h-24 rounded-full border-4 border-indigo-500/30" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Code2 className="w-10 h-10 text-indigo-400" />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold mb-2">{user.name || user.githubUsername}</h1>
            <p className="text-xl text-indigo-400 font-medium">@{user.githubUsername} • {data.archetype}</p>
          </div>
        </header>

        {/* Top Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-2xl relative overflow-hidden group border border-white/10 bg-gradient-to-br from-indigo-500/10 to-transparent"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl">
                <Trophy className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {data.overallScore}/100
              </span>
            </div>
            <h3 className="text-zinc-400 font-medium">Overall Mastery Score</h3>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass p-6 rounded-2xl border border-white/10 md:col-span-2"
          >
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Executive Summary
            </h3>
            <p className="text-zinc-300 leading-relaxed text-lg">
              {data.summary}
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="glass p-6 rounded-2xl border border-white/10 flex flex-col items-center"
          >
            <h3 className="text-xl font-semibold self-start mb-6 w-full border-b border-white/10 pb-4 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-blue-400" />
              Skill Radar
            </h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 14 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Skills" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            <div className="glass p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-green-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Key Strengths
              </h3>
              <ul className="space-y-3">
                {data.strengths?.map((str: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0" />
                    {str}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {futureTrajectory && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent mt-6"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BrainCircuit className="w-6 h-6 text-purple-400" />
              Future Trajectory Engine
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-zinc-400 text-sm mb-1">Startup Potential</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                    {futureTrajectory.startupPotential}/100
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-zinc-400 text-sm mb-1">Enterprise Suitability</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    {futureTrajectory.enterpriseSuitability}/100
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-zinc-400 text-sm mb-1">Open Source Impact</p>
                <p className="text-lg font-medium text-zinc-200 line-clamp-2">
                  {futureTrajectory.openSourceTrajectory}
                </p>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <p className="text-zinc-300 leading-relaxed">
                <span className="font-semibold text-indigo-400">Projected Timeline: </span>
                {futureTrajectory.timeline}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
