import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const publicUsers = await prisma.user.findMany({
    where: { isPublicProfile: true, allowSeoIndexing: true, githubUsername: { not: null } },
    select: { githubUsername: true },
  });

  const profileUrls = publicUsers.map((user) => ({
    url: `${baseUrl}/profile/${user.githubUsername}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...profileUrls,
  ];
}
