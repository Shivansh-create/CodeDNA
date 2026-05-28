"use client";

import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { BrainCircuit, Trophy, Code2, Sparkles, Terminal, Rocket, Building2, History, GitBranch } from "lucide-react";

export default function ProfileClient({ data, user, isOwner = false }: { data: any; user: any; isOwner?: boolean }) {
  const hasAnalysis = Boolean(data);

  if (!hasAnalysis) {
    return (
      <div className="min-h-screen bg-background text-white pt-24 pb-12 px-6 overflow-hidden relative">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{user.name || user.githubUsername}</h1>
            <p className="text-primary text-lg">@{user.githubUsername}</p>
          </header>

          <div className="glass-panel p-10 rounded-3xl border border-white/10">
            <h2 className="text-3xl font-semibold mb-4">Profile ready, but no intelligence data</h2>
            <p className="text-zinc-400 mb-6">
              This developer has not yet run the AI intelligence scan.
            </p>
            {isOwner ? (
              <p className="text-zinc-200">
                Return to your dashboard and click "Decode My Identity" to generate your profile.
              </p>
            ) : (
              <p className="text-zinc-200">
                Check back later when they generate their developer DNA.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const safeParse = (val: any) => typeof val === 'string' ? JSON.parse(val) : val;
  const archetype = safeParse(data.archetype) || {};
  const dna = safeParse(data.developerDna) || {};
  const career = safeParse(data.careerIntelligence) || {};
  const timeline = safeParse(data.evolutionTimeline) || [];
  const projects = safeParse(data.projectIntelligence) || [];

  const radarData = [
    { subject: 'Frontend', A: data.frontendScore ?? 0, fullMark: 100 },
    { subject: 'Backend', A: data.backendScore ?? 0, fullMark: 100 },
    { subject: 'DevOps', A: data.devopsScore ?? 0, fullMark: 100 },
    { subject: 'Architecture', A: data.architectureScore ?? 0, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-12 px-6 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] mix-blend-screen" />
      </div>
      
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row items-center gap-8">
          {user.image ? (
            <motion.img 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              src={user.image} alt={user.githubUsername} 
              className="w-32 h-32 rounded-full border-4 border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.1)]" 
            />
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.05)]"
            >
              <Code2 className="w-12 h-12 text-zinc-400" />
            </motion.div>
          )}
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl font-bold mb-3 tracking-tight"
            >
              {user.name || user.githubUsername}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="flex items-center gap-3 text-lg"
            >
              <span className="text-primary font-medium">@{user.githubUsername}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300 font-medium">{archetype.name}</span>
            </motion.div>
          </div>
        </header>

        {/* Narrative & Executive Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 opacity-5 blur-[2px] pointer-events-none">
            <BrainCircuit className="w-64 h-64 text-primary" />
          </div>
          
          <div className="relative z-10 max-w-4xl flex flex-col gap-8">
            <div className="flex items-center gap-3 text-primary">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-bold tracking-widest uppercase">AI Identity Narrative</span>
            </div>
            
            <blockquote className="text-2xl md:text-3xl font-medium text-gradient leading-relaxed border-l-4 border-primary/50 pl-6 md:pl-8">
              &ldquo;{data.narrative}&rdquo;
            </blockquote>
            
            <div className="w-24 h-1 bg-gradient-to-r from-primary/50 to-transparent rounded-full" />
            
            <div className="text-lg text-zinc-300 leading-loose font-light whitespace-pre-line">
              {data.summary.replace(/\\n/g, '\n')}
            </div>
          </div>
        </motion.div>

        {/* Radar & DNA */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="glass p-8 rounded-3xl border border-white/5 flex flex-col items-center"
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

          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-lg font-semibold mb-5 text-white flex items-center gap-2">
                 Technical Traits
              </h3>
              <div className="flex flex-wrap gap-2">
                {dna.technicalTraits?.map((str: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary">
                    {str}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden flex-1">
              <h3 className="text-lg font-semibold mb-5 text-white flex items-center gap-2">
                Engineering Focus
              </h3>
              <div className="space-y-4">
                <div>
                   <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Archetype</p>
                   <p className="text-base text-zinc-200">{archetype.description}</p>
                </div>
                <div>
                   <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Ideal Environment</p>
                   <p className="text-base text-zinc-200">{archetype.idealEnvironment}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Evolution Timeline */}
        {timeline.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="glass-panel p-10 rounded-3xl border border-white/5"
          >
             <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
               <History className="w-6 h-6 text-accent" />
               Engineering Evolution
             </h3>
             <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {timeline.map((item: any, i: number) => (
                   <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                     <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-background bg-accent text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                     <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-6 rounded-2xl border border-white/5">
                       <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-lg">{item.phase}</h4>
                          <span className="text-accent font-mono text-sm bg-accent/10 px-2 py-0.5 rounded">{item.year}</span>
                       </div>
                       <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
                     </div>
                   </div>
                ))}
             </div>
          </motion.div>
        )}

        {/* AI Project Intelligence */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="space-y-6"
          >
             <h3 className="text-2xl font-bold flex items-center gap-3 ml-2">
               <GitBranch className="w-6 h-6 text-primary" />
               Project Intelligence
             </h3>
             <div className="grid md:grid-cols-2 gap-6">
                {projects.map((repo: any, i: number) => (
                   <div key={i} className="glass p-6 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-start mb-4">
                         <h4 className="font-bold text-lg text-white truncate pr-4">{repo.repoName}</h4>
                         <span className="text-primary font-mono text-sm bg-primary/10 px-2 py-1 rounded-lg border border-primary/20 shrink-0">
                           Score: {repo.score}
                         </span>
                      </div>
                      <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                        {repo.architectureNotes}
                      </p>
                      <div className="pt-4 border-t border-white/5">
                         <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Scalability</p>
                         <p className="text-sm text-zinc-400">{repo.scalability}</p>
                      </div>
                   </div>
                ))}
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
