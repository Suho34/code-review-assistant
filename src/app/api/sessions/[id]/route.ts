import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { z } from "zod";

const patchSessionSchema = z
  .object({
    status: z
      .enum(["active", "completed", "abandoned"], {
        message: "status must be one of: active, completed, abandoned",
      })
      .optional(),
    score: z
      .number()
      .min(0, "score must be between 0 and 10")
      .max(10, "score must be between 0 and 10")
      .optional(),
  })
  .refine((data) => data.status !== undefined || data.score !== undefined, {
    message: "At least one of status or score must be provided",
  });

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the session belongs to the user
    const existing = await prisma.interviewSession.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = patchSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const updateData: { status?: string; score?: number; completedAt?: Date } =
      {};

    if (parsed.data.status !== undefined) {
      updateData.status = parsed.data.status;
      if (parsed.data.status === "completed") {
        updateData.completedAt = new Date();
      }
    }

    if (parsed.data.score !== undefined) {
      updateData.score = parsed.data.score;
    }

    const updated = await prisma.interviewSession.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/sessions/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
