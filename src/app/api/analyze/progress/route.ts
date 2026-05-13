import { NextRequest } from "next/server";
import { analysisQueue } from "@/lib/queue";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return new Response("Missing jobId", { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const job = await analysisQueue.getJob(jobId);
      if (!job) {
        sendEvent({ error: "Job not found" });
        controller.close();
        return;
      }

      // Ensure the job belongs to the user
      if (job.data.userId !== session.user.id) {
        sendEvent({ error: "Unauthorized access to job" });
        controller.close();
        return;
      }

      const intervalId = setInterval(async () => {
        try {
          const currentJob = await analysisQueue.getJob(jobId);
          if (!currentJob) {
            clearInterval(intervalId);
            controller.close();
            return;
          }

          const state = await currentJob.getState();
          const progress = currentJob.progress;

          sendEvent({ state, progress });

          if (state === "completed" || state === "failed") {
            if (state === "completed") {
              const result = currentJob.returnvalue;
              sendEvent({ state, progress: 100, result });
            } else {
              const err = currentJob.failedReason;
              sendEvent({ state, error: err });
            }
            clearInterval(intervalId);
            controller.close();
          }
        } catch (error) {
          console.error("SSE Error:", error);
          clearInterval(intervalId);
          controller.close();
        }
      }, 1000);

      req.signal.addEventListener("abort", () => {
        clearInterval(intervalId);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
