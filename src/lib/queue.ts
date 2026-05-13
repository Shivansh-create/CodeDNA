import { Queue } from 'bullmq';
import { redis } from './redis';

export const analysisQueue = new Queue('github-analysis', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 1000,
  },
});

export interface AnalysisJobData {
  userId: string;
  githubUsername: string;
}
