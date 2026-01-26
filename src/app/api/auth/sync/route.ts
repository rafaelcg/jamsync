import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface NextAuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string;
}

interface NextAuthSession {
  user: NextAuthUser;
  accessToken?: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as NextAuthSession | null;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, name, image, username } = session.user;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = (session.user as any).provider || "unknown";

    // Sync user with database
    const user = await prisma.user.upsert({
      where: { email: email! },
      update: {
        displayName: name || username || email?.split("@")[0] || "User",
        avatarUrl: image,
      },
      create: {
        email: email!,
        username: username || email?.split("@")[0] || `user_${Date.now()}`,
        displayName: name || username || email?.split("@")[0] || "User",
        avatarUrl: image,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Auth sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync authentication" },
      { status: 500 }
    );
  }
}
