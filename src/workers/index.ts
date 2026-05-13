import { Worker } from 'bullmq';
import { redis } from '../lib/redis';
import { processAnalysis } from '../lib/ai';
import { prisma } from '../lib/prisma';

console.log('Starting Analysis Worker...');

// Test Redis connection
redis.ping().then(() => {
  console.log('✅ Redis connection successful');
}).catch((err) => {
  console.error('❌ Redis connection failed:', err);
});

const worker = new Worker(
  'github-analysis',
  async (job) => {
    console.log(`🔄 Processing job ${job.id} for user ${job.data.githubUsername}`);

    try {
      const { userId, githubUsername } = job.data;

      // Get the user's GitHub access token
      const account = await prisma.account.findFirst({
        where: {
          userId,
          provider: 'github'
        }
      });

      const githubToken = account?.access_token ?? undefined;
      console.log(`🔑 GitHub token found: ${!!githubToken}`);

      await processAnalysis(userId, githubUsername, async (msg, percent) => {
        await job.updateProgress({ msg, percent });
        console.log(`📊 Progress: ${percent}% - ${msg}`);
      }, githubToken);

      console.log(`✅ Job ${job.id} completed successfully`);
      return { success: true };
    } catch (error) {
      console.error(`❌ Job ${job.id} failed:`, error);
      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 1,
  }
);

worker.on('failed', (job, err) => {
  if (job) {
    console.error(`Job ${job.id} failed:`, err);
  }
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});
