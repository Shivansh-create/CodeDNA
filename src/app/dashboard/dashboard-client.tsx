"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { BrainCircuit, Trophy, Code2, Sparkles, Network, Terminal, Rocket, Building2 } from "lucide-react";
import ScanSequence from "./scan-sequence";

export default function DashboardClient({ 
  initialData, 
  githubUsername 
}: { 
  initialData: any; 
  githubUsername: string; 
}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("Initializing neural analysis...");
  const [progressVal, setProgressVal] = useState(0);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError("");
      setProgressMsg("Connecting to intelligence engine...");
      setProgressVal(5);
      
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: githubUsername }),
      });
      
      const initData = await res.json();
      if (!initData.success) throw new Error(initData.error || "Failed to start analysis");

      const eventSource = new EventSource(`/api/analyze/progress?jobId=${initData.jobId}`);

      eventSource.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        if (payload.error) {
          setError(payload.error);
          setLoading(false);
          eventSource.close();
          return;
        }

        if (payload.progress && typeof payload.progress === 'object') {
          setProgressVal(payload.progress.percent || progressVal);
          setProgressMsg(payload.progress.msg || progressMsg);
        }

        if (payload.state === "completed") {
          setData(payload.result);
          setLoading(false);
          eventSource.close();
        } else if (payload.state === "failed") {
          setError(payload.error || "Analysis failed");
          setLoading(false);
          eventSource.close();
        }
      };

      eventSource.onerror = () => {
        setError("Lost connection to analysis engine.");
        setLoading(false);
        eventSource.close();
      };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!data && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-2xl mx-auto relative px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-24 h-24 glass-panel rounded-full flex items-center justify-center mb-8 border border-white/10"
        >
          <Network className="w-12 h-12 text-primary" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500"
        >
          Initialize Intelligence Scan
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-xl mx-auto"
        >
          We will analyze your repository architecture, commit history, and code patterns to decode your unique Developer DNA.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={handleAnalyze}
          className="h-14 px-10 rounded-full bg-white text-black hover:bg-zinc-200 font-semibold text-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          <Sparkles className="w-5 h-5" />
          Decode My Identity
        </motion.button>
        {error && <p className="text-red-400 mt-6">{error}</p>}
      </div>
    );
  }

  if (loading) {
    return <ScanSequence progressVal={progressVal} progressMsg={progressMsg} />;
  }

  const safeParse = (val: any) => typeof val === 'string' ? JSON.parse(val) : val;
  const archetype = safeParse(data.archetype) || {};
  const dna = safeParse(data.developerDna) || {};
  const career = safeParse(data.careerIntelligence) || {};

  const radarData = [
    { subject: 'Frontend', A: data.frontendScore, fullMark: 100 },
    { subject: 'Backend', A: data.backendScore, fullMark: 100 },
    { subject: 'DevOps', A: data.devopsScore, fullMark: 100 },
    { subject: 'Architecture', A: data.architectureScore, fullMark: 100 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-10" id="dashboard-content">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      {/* Narrative Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-4xl mx-auto mb-16 relative"
      >
        <div className="absolute top-0 right-0 flex items-center gap-4">
          <button 
            onClick={handleAnalyze}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium border border-white/10 text-zinc-300"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            Re-Scan Identity
          </button>
          <button 
            onClick={() => {
              // Sign out from NextAuth
              import("next-auth/react").then((m) => m.signOut({ callbackUrl: '/' }));
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors text-sm font-medium border border-red-500/20 text-red-400"
          >
            Sign Out
          </button>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium mb-6 text-primary border border-primary/20 shadow-lg">
          <BrainCircuit className="w-4 h-4" />
          AI Engineering Profiler Active
        </div>
        
        <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 max-w-4xl mx-auto relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles className="w-32 h-32 text-primary" />
          </div>
          <h1 className="text-xl md:text-2xl font-medium leading-relaxed tracking-wide text-gradient relative z-10 italic">
            &ldquo;{data.narrative || "Decoding your engineering philosophy..."}&rdquo;
          </h1>
        </div>
      </motion.div>

      {/* Top Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-panel p-8 rounded-3xl relative overflow-hidden group col-span-1"
        >
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
            <Trophy className="w-16 h-16 text-primary" />
          </div>
          <p className="text-zinc-400 font-medium mb-2 uppercase tracking-widest text-sm">Archetype</p>
          <h2 className="text-3xl font-bold mb-4">{archetype.name}</h2>
          <div className="w-12 h-1 bg-primary mb-4 rounded-full" />
          <p className="text-zinc-300 leading-relaxed text-sm">
            {archetype.description}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass p-8 rounded-3xl col-span-2 border border-white/5 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 relative z-10">
            <Terminal className="w-5 h-5 text-accent" />
            Engineering Summary
          </h3>
          <div className="text-zinc-300 leading-loose text-sm md:text-base font-light mb-8 relative z-10 whitespace-pre-line">
            {data.summary ? data.summary.replace(/\\n/g, '\n') : ""}
          </div>
          
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="glass-panel p-4 rounded-xl border border-white/5">
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Ideal Environment</p>
              <p className="text-sm font-medium text-white">{archetype.idealEnvironment}</p>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/5">
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Technical Focus</p>
              <p className="text-sm font-medium text-white">{dna.technicalTraits?.[0] || "Generalist"}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center"
        >
          <h3 className="text-xl font-semibold self-start mb-6 w-full flex items-center gap-3">
            <Code2 className="w-5 h-5 text-primary" />
            Developer DNA Radar
          </h3>
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 13, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Skills" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Deep Insights */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
          className="flex flex-col gap-6"
        >
          <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
            <h3 className="text-lg font-semibold mb-5 text-white flex items-center gap-2">
               Technical Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {dna.strengths?.map((str: string, i: number) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-300">
                  {str}
                </span>
              ))}
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
            <h3 className="text-lg font-semibold mb-5 text-white flex items-center gap-2">
              Workflow Habits
            </h3>
            <div className="flex flex-wrap gap-2">
              {dna.workflowHabits?.map((habit: string, i: number) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-sm text-accent-foreground">
                  {habit}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Career Intelligence */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] flex-1 bg-white/10" />
          <h2 className="text-2xl font-bold text-center tracking-tight">Career Intelligence</h2>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <div className="glass-panel p-8 rounded-3xl border border-white/5">
              <div className="flex justify-between items-start mb-6">
                 <div>
                   <h3 className="text-xl font-bold flex items-center gap-2 mb-1"><Rocket className="w-5 h-5 text-orange-400" /> Startup Fit</h3>
                   <p className="text-zinc-400 text-sm">Velocity & Autonomy</p>
                 </div>
                 <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                    {career.startupFit}%
                 </span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-gradient-to-r from-orange-400 to-red-400" style={{ width: `${career.startupFit}%` }} />
              </div>
              <div className="text-sm text-zinc-400 mt-4">
                 <strong>Hiring Signals:</strong> {career.hiringSignals?.[0]}
              </div>
           </div>

           <div className="glass-panel p-8 rounded-3xl border border-white/5">
              <div className="flex justify-between items-start mb-6">
                 <div>
                   <h3 className="text-xl font-bold flex items-center gap-2 mb-1"><Building2 className="w-5 h-5 text-blue-400" /> Enterprise Fit</h3>
                   <p className="text-zinc-400 text-sm">Scale & Process</p>
                 </div>
                 <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    {career.enterpriseFit}%
                 </span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400" style={{ width: `${career.enterpriseFit}%` }} />
              </div>
              <div className="text-sm text-zinc-400 mt-4">
                 <strong>Recommended Roles:</strong> {career.roleRecommendations?.slice(0, 2).join(", ")}
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
