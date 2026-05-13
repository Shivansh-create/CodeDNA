import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isPublicProfile, allowSeoIndexing } = await req.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        isPublicProfile: Boolean(isPublicProfile),
        allowSeoIndexing: Boolean(allowSeoIndexing),
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
