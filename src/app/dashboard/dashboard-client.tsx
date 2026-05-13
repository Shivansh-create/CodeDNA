"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Loader2, BrainCircuit, Trophy, Code2, Sparkles, TrendingUp, Download, FileText } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  const handleClientSidePDF = async () => {
    const element = document.getElementById("dashboard-content");
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { backgroundColor: '#000000', scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('CodeDNA_Report_Quick.pdf');
    } catch (err) {
      console.error("Failed to generate PDF", err);
    }
  };

  const handleServerSidePDF = () => {
    window.open(`/api/pdf?username=${githubUsername}`, '_blank');
  };

  if (!data && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-xl mx-auto">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
          <BrainCircuit className="w-10 h-10 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Discover Your CodeDNA</h2>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          We need to analyze your GitHub repositories to generate your developer archetype, skill radar, and career insights. This takes about 10-15 seconds.
        </p>
        <button
          onClick={handleAnalyze}
          className="h-12 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Start Analysis
        </button>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-2xl mx-auto px-6">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
          <motion.div 
            className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {progressVal}%
            </span>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2 animate-pulse">{progressMsg}</h2>
        <div className="w-full h-1 bg-white/5 rounded-full mt-6 overflow-hidden relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressVal}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        {/* Skeleton Loaders for visual effect */}
        <div className="w-full mt-12 space-y-4 opacity-50">
          <div className="h-4 bg-white/5 rounded-full w-3/4 mx-auto animate-pulse" />
          <div className="h-4 bg-white/5 rounded-full w-1/2 mx-auto animate-pulse" />
          <div className="h-4 bg-white/5 rounded-full w-5/6 mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  const radarData = [
    { subject: 'Frontend', A: data.frontendScore, fullMark: 100 },
    { subject: 'Backend', A: data.backendScore, fullMark: 100 },
    { subject: 'DevOps', A: data.devopsScore, fullMark: 100 },
    { subject: 'Architecture', A: data.architectureScore, fullMark: 100 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12" id="dashboard-content">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Developer DNA Overview</h1>
          <p className="text-zinc-400">Your AI-generated engineering profile based on GitHub activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleClientSidePDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium border border-white/10"
          >
            <Download className="w-4 h-4" />
            Quick PDF
          </button>
          <button 
            onClick={handleServerSidePDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-colors text-sm font-medium shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]"
          >
            <FileText className="w-4 h-4" />
            Premium Report
          </button>
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
          <p className="text-2xl font-bold mt-1">{data.archetype}</p>
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
        {/* Radar Chart */}
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

        {/* AI Insights */}
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

          <div className="glass p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-semibold mb-4 text-purple-400 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5" /> Career Recommendations
            </h3>
            <ul className="space-y-3">
              {data.careerRecommendations?.map((rec: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
        {/* Future Trajectory Engine */}
        {data.futureTrajectory && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="md:col-span-2 glass p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent mt-6"
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
                    {data.futureTrajectory.startupPotential}/100
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-zinc-400 text-sm mb-1">Enterprise Suitability</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    {data.futureTrajectory.enterpriseSuitability}/100
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-zinc-400 text-sm mb-1">Open Source Impact</p>
                <p className="text-lg font-medium text-zinc-200 line-clamp-2">
                  {data.futureTrajectory.openSourceTrajectory}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <p className="text-zinc-300 leading-relaxed">
                <span className="font-semibold text-indigo-400">Projected Timeline: </span>
                {data.futureTrajectory.timeline}
              </p>
            </div>
            {data.explanation && (
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5 italic text-zinc-400 text-sm">
                <span className="font-semibold not-italic text-zinc-300">AI Reasoning: </span>
                {data.explanation}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
