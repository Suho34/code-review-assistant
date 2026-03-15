import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { z } from "zod";

const createSessionSchema = z.object({
  type: z.enum(["dsa", "behavioral", "system-design"], {
    message: "type must be one of: dsa, behavioral, system-design",
  }),
});

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.interviewSession.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { messages: true } },
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("GET /api/sessions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Check for existing active session of the same type to resume
    const existingSession = await prisma.interviewSession.findFirst({
      where: {
        userId: session.user.id,
        type: parsed.data.type,
        status: "active",
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingSession) {
      return NextResponse.json(existingSession, { status: 200 });
    }

    const interviewSession = await prisma.interviewSession.create({
      data: {
        userId: session.user.id,
        type: parsed.data.type,
        status: "active",
      },
    });

    return NextResponse.json(interviewSession, { status: 201 });
  } catch (error) {
    console.error("POST /api/sessions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
