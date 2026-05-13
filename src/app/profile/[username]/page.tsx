import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Lock } from "lucide-react";
import ProfileClient from "./profile-client";

export const dynamic = 'force-dynamic';

export default async function PublicProfilePage({ params }: { params: { username?: string } }) {
  const username = params.username;

  if (!username || username === "undefined") {
    return notFound();
  }

  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { githubUsername: username },
    include: { analysisResult: true },
  });

  if (!user) {
    return notFound();
  }

  const isOwner = session?.user?.id === user.id;

  if (!user.isPublicProfile && !isOwner) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-zinc-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Profile is Private</h1>
        <p className="text-zinc-400 max-w-md">
          {username} has chosen to keep their CodeDNA profile private.
        </p>
      </div>
    );
  }

  return <ProfileClient data={user.analysisResult} user={user} isOwner={isOwner} />;
}
