import { prisma } from "@/lib/prisma";
import { Trophy, Search, Star, GitBranch, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  const topUsers = await prisma.analysisResult.findMany({
    where: {
      user: {
        isPublicProfile: true,
      }
    },
    include: {
      user: true,
    },
    orderBy: {
      overallScore: 'desc'
    },
    take: 50,
  });

  return (
    <div className="min-h-screen bg-black text-white px-6 py-24 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm font-medium mb-6 text-indigo-300 border-indigo-500/20">
            <Trophy className="w-4 h-4" />
            <span>Global Rankings</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Developer <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Discover the top engineers ranked by their CodeDNA analysis.
          </p>
        </header>

        <div className="glass rounded-3xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search developers..." 
                className="w-full bg-black/50 border border-white/10 rounded-full pl-10 pr-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
          </div>
          
          <div className="divide-y divide-white/5">
            {topUsers.map((result, index) => (
              <div key={result.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-6">
                  <div className="w-12 text-center">
                    <span className={`text-2xl font-bold ${index < 3 ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400' : 'text-zinc-500'}`}>
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    {result.user.image ? (
                      <Image src={result.user.image} alt={result.user.name || "User"} width={48} height={48} className="rounded-full" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-500/20" />
                    )}
                    <div>
                      <h3 className="text-xl font-bold">{result.user.name || result.user.githubUsername}</h3>
                      <p className="text-indigo-400 font-medium">{(result.archetype as any)?.name || 'Unknown Archetype'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right hidden md:block">
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                      {result.overallScore}
                    </p>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Score</p>
                  </div>
                  <Link 
                    href={`/profile/${result.user.githubUsername}`}
                    className="p-3 rounded-full bg-white/5 group-hover:bg-indigo-600 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5 group-hover:text-white" />
                  </Link>
                </div>
              </div>
            ))}
            
            {topUsers.length === 0 && (
              <div className="p-12 text-center text-zinc-500">
                No public profiles found yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
