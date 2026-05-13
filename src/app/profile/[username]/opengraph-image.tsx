import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';
export const alt = 'CodeDNA Developer Profile';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { username: string } }) {
  // We can't use prisma directly in edge runtime easily without Prisma Accelerate,
  // but for the sake of the project architecture we will just assume standard serverless or mock it if it fails.
  // Actually, we can fetch from our own API or just show the username in a cool gradient.

  const username = params.username;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #000000, #1e1b4b, #31104a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 'bold', marginBottom: 20 }}>
          CodeDNA Intelligence Engine
        </div>
        <div style={{ fontSize: 40, color: '#a5b4fc', marginBottom: 40 }}>
          Developer Profile Analysis
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bolder',
            background: 'linear-gradient(to right, #818cf8, #c084fc)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          @{username}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
