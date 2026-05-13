"use client";

import { signIn, useSession } from "next-auth/react";
import { motion, Variants } from "framer-motion";
import { Code2, BrainCircuit, Activity, ChevronRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className} width="24" height="24">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />

      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">CodeDNA</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="text-sm font-medium hover:text-indigo-400 transition-colors"
          >
            Sign In
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 relative z-10">
        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          <motion.div variants={itemVars} className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm font-medium mb-8 text-indigo-300 border-indigo-500/20">
            <Zap className="w-4 h-4" />
            <span>CodeDNA Intelligence Engine v1.0</span>
          </motion.div>
          
          <motion.h1 variants={itemVars} className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Your GitHub Profile Has a <br />
            <span className="text-gradient">Personality.</span> Discover It.
          </motion.h1>
          
          <motion.p variants={itemVars} className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl leading-relaxed">
            Connect your GitHub account and let our AI engine analyze your repositories, commits, and languages to reveal your deep engineering archetype.
          </motion.p>
          
          <motion.div variants={itemVars} className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="h-14 px-8 rounded-full bg-white text-black font-semibold flex items-center gap-3 hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
            >
              <GithubIcon className="w-5 h-5" />
              Analyze Your Developer DNA
              <ChevronRight className="w-4 h-4 ml-2 opacity-50" />
            </button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-6 mt-32"
        >
          <div className="glass p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20">
              <BrainCircuit className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Personality Engine</h3>
            <p className="text-zinc-400 leading-relaxed">
              We process your raw coding data through GPT-4o to generate your unique engineering archetype and career insights.
            </p>
          </div>

          <div className="glass p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Productivity Patterns</h3>
            <p className="text-zinc-400 leading-relaxed">
              Visualize your most productive hours, coding consistency, and language distribution across all your repositories.
            </p>
          </div>

          <div className="glass p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
              <Code2 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Skill Radar</h3>
            <p className="text-zinc-400 leading-relaxed">
              Automatically calculate your frontend, backend, DevOps, and architecture strengths based on repository technologies.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
