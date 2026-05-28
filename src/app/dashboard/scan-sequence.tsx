"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Cpu, Code2, Network } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScanSequence({
  progressVal,
  progressMsg,
}: {
  progressVal: number;
  progressMsg: string;
}) {
  const [nodes, setNodes] = useState<{ id: number; x: number; y: number }[]>([]);

  // Generate random nodes for the background network effect
  useEffect(() => {
    const newNodes = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setNodes(newNodes);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] w-full overflow-hidden bg-background">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      {/* Neural Network Nodes Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            className="absolute w-2 h-2 rounded-full bg-primary"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        {/* Connecting lines simulation (just a few glowing gradients crossing) */}
        <motion.div
          className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{ opacity: [0, 0.5, 0], scaleY: [1, 2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-accent to-transparent"
          animate={{ opacity: [0, 0.5, 0], scaleX: [1, 2, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="z-10 flex flex-col items-center text-center max-w-2xl mx-auto px-6">
        {/* Central Glowing Orb / Brain */}
        <div className="relative w-40 h-40 mb-12 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="absolute inset-2 border border-primary/30 rounded-full" />
          <motion.div
            className="absolute inset-0 border-2 border-primary rounded-full border-t-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 border-2 border-accent rounded-full border-b-transparent border-r-transparent"
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          
          <div className="relative z-10 glass-panel w-20 h-20 rounded-full flex items-center justify-center border border-white/10">
            <BrainCircuit className="w-10 h-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
          </div>
        </div>

        {/* Dynamic Text */}
        <motion.h2 
          className="text-3xl font-bold mb-4 tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Decoding Engineering Patterns...
        </motion.h2>
        <motion.p 
          className="text-zinc-400 text-lg h-8"
          key={progressMsg}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {progressMsg}
        </motion.p>

        {/* Progress Bar */}
        <div className="w-full max-w-md mt-10">
          <div className="flex justify-between text-sm font-mono text-primary mb-2">
            <span>[AI_SCAN_ACTIVE]</span>
            <span>{progressVal}%</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progressVal}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Simulated Processing Logs */}
        <div className="w-full max-w-md mt-12 glass-panel p-4 rounded-lg border border-white/5 text-left font-mono text-xs text-zinc-500 overflow-hidden relative h-24">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none z-10" />
          <motion.div
            animate={{ y: [-100, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="flex flex-col gap-2"
          >
            <p className="text-primary/70">{`> Analyzing commit history density...`}</p>
            <p className="text-accent/70">{`> Mapping architectural dependencies...`}</p>
            <p className="text-zinc-400">{`> Identifying recurring framework patterns...`}</p>
            <p className="text-primary/70">{`> Computing codebase scalability metric...`}</p>
            <p className="text-accent/70">{`> Extracting Developer DNA vectors...`}</p>
            <p className="text-zinc-400">{`> Finalizing archetype classification...`}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
