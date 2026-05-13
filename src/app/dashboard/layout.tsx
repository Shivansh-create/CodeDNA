import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Code2, LayoutDashboard, Settings, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 hidden md:flex flex-col bg-zinc-950/50 backdrop-blur-xl">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold tracking-tight">CodeDNA</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 text-white font-medium">
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </Link>
          {session.user?.githubUsername ? (
            <Link
              href={`/profile/${(session.user as any).githubUsername}`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              Profile
            </Link>
          ) : (
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-500 bg-white/5">
              <UserIcon className="w-4 h-4" />
              Profile
            </div>
          )}
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            {session.user.image ? (
              <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-indigo-400" />
              </div>
            )}
            <div className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              <p className="font-medium">{session.user.name}</p>
              <p className="text-zinc-500 text-xs">{(session.user as any).githubUsername || "GitHub User"}</p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        {/* Top Header Mobile */}
        <header className="md:hidden h-16 border-b border-white/10 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
          <span className="font-bold tracking-tight">CodeDNA</span>
          {session.user.image && (
            <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full" />
          )}
        </header>

        <div className="p-6 md:p-10 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
