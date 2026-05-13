import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { analysisQueue } from "@/lib/queue";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Optional: Return existing analysis if already done recently
    // const existingAnalysis = await prisma.analysisResult.findFirst({
    //   where: { userId: session.user.id },
    // });
    // if (existingAnalysis) {
    //   return NextResponse.json({ existing: true, data: existingAnalysis });
    // }

    // Add job to BullMQ queue
    const job = await analysisQueue.add('github-analysis', {
      userId: session.user.id,
      githubUsername: username,
    });

    return NextResponse.json({ 
      success: true, 
      jobId: job.id,
      message: "Analysis job queued successfully"
    });
  } catch (error: any) {
    console.error("Queue Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
