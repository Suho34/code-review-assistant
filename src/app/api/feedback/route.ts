import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { generateText, Output } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { ratelimit } from "@/lib/ratelimit";
import { z } from "zod";

// ─── AI Client ───────────────────────────────────────────────────────────────

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// ─── Constants ───────────────────────────────────────────────────────────────

const FEEDBACK_TIMEOUT_MS = 30_000;
const MIN_MESSAGES_REQUIRED = 2;
const MAX_RETRIES = 2;

// ─── Schema ──────────────────────────────────────────────────────────────────

const feedbackSchema = z.object({
  clarity: z.number().min(0).max(10),
  depth: z.number().min(0).max(10),
  communication: z.number().min(0).max(10),
  technicalAccuracy: z.number().min(0).max(10),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  summary: z.string(),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error(`Operation timed out after ${ms}ms`)),
      ms,
    ),
  );
  return Promise.race([promise, timeout]);
}

async function withRetry<T>(fn: () => Promise<T>, retries: number): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 500 * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}

function calculateScore(
  feedback: z.infer<typeof feedbackSchema>,
  interviewType: string,
): number {
  const isTechnical = interviewType.toLowerCase().includes("technical");
  if (isTechnical) {
    return (
      feedback.clarity * 0.2 +
      feedback.depth * 0.25 +
      feedback.communication * 0.15 +
      feedback.technicalAccuracy * 0.4
    );
  }
  return (
    feedback.clarity * 0.3 +
    feedback.depth * 0.2 +
    feedback.communication * 0.35 +
    feedback.technicalAccuracy * 0.15
  );
}

function buildFeedbackPrompt(
  interviewType: string,
  conversationText: string,
): string {
  const typeContext: Record<string, string> = {
    dsa: `This is a Data Structures & Algorithms interview. Focus on:
- Correctness and efficiency of solutions
- Problem-solving approach and thought process
- Knowledge of time/space complexity
- Code clarity and edge case handling
- Ability to optimize when prompted`,

    behavioral: `This is a Behavioral interview. Focus on:
- Use of the STAR method (Situation, Task, Action, Result)
- Specificity of examples — vague answers score lower
- Evidence of ownership, leadership, and self-awareness
- Communication clarity and structured storytelling
- Emotional intelligence and interpersonal skills`,

    "system-design": `This is a System Design interview. Focus on:
- Requirements gathering before jumping into design
- High-level architecture clarity and component selection
- Awareness of scalability, reliability, and trade-offs
- Depth when drilling into specific components
- Ability to reason about distributed systems concepts`,
  };

  const context =
    typeContext[interviewType.toLowerCase()] ||
    "This is a general technical interview. Evaluate overall communication, technical knowledge, and problem-solving.";

  return `You are a senior engineering hiring manager evaluating a mock interview for a junior developer candidate (0–1 years of experience). Calibrate your scores accordingly — hold them to a junior standard, not a senior one.

${context}

SCORING RUBRIC (0–10 integers only):
- clarity:           How clearly and concisely did the candidate express their thoughts?
- depth:             Did they go beyond surface-level answers with examples or technical detail?
- communication:     Was their language structured, confident, and easy to follow?
- technicalAccuracy: Were their technical statements correct and appropriately detailed?

SCORING SCALE:
- 9–10: Exceptional. Would impress at any company.
- 7–8:  Strong. Clear hire signal for a junior role.
- 5–6:  Average. Shows potential but needs improvement.
- 3–4:  Weak. Significant gaps in knowledge or communication.
- 0–2:  Very poor. Little to no relevant response.

OUTPUT REQUIREMENTS:
- strengths: 3 specific things the candidate did well. Be concrete — reference what they actually said.
- improvements: 3 specific, actionable things they should work on. Not generic advice.
- summary: 2–3 sentence honest assessment of their overall performance. Be direct. Do not soften weak performances.

Be honest and calibrated. A score of 8+ should be genuinely earned, not given for participation.

INTERVIEW TRANSCRIPT:
${conversationText}`;
}

// ─── Route Handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // ── Auth ──────────────────────────────────────────────────────────────
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Rate Limit ────────────────────────────────────────────────────────
    const { success } = await ratelimit.limit(session.user.id);
    if (!success) {
      return NextResponse.json(
        {
          error:
            "Too many requests. Please wait before generating feedback again.",
        },
        { status: 429 },
      );
    }

    // ── Input Validation ──────────────────────────────────────────────────
    const body = await request.json().catch(() => null);
    if (!body?.sessionId || typeof body.sessionId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid sessionId" },
        { status: 400 },
      );
    }
    const { sessionId } = body;

    // ── Fetch Session ─────────────────────────────────────────────────────
    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!interviewSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (interviewSession.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ── Guard: session must be completed ──────────────────────────────────
    if (interviewSession.status !== "completed") {
      console.warn(
        `[feedback] Guard failed: session ${sessionId} status is ${interviewSession.status}`,
      );
      return NextResponse.json(
        {
          error: `Feedback can only be generated for completed sessions (current: ${interviewSession.status})`,
        },
        { status: 400 },
      );
    }

    // ── Guard: must have enough messages ──────────────────────────────────
    if (interviewSession.messages.length < MIN_MESSAGES_REQUIRED) {
      return NextResponse.json(
        { error: "Not enough conversation data to generate feedback" },
        { status: 400 },
      );
    }

    // ── Idempotency check ─────────────────────────────────────────────────
    const existingFeedback = await prisma.sessionFeedback.findUnique({
      where: { sessionId },
    });

    if (existingFeedback) {
      console.info(`[feedback] Cache hit for session ${sessionId}`);
      return NextResponse.json(existingFeedback);
    }

    // ── Build Prompt ──────────────────────────────────────────────────────
    const rawConversation = interviewSession.messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const prompt = buildFeedbackPrompt(interviewSession.type, rawConversation);

    // ── Generate Feedback (with timeout + retry) ──────────────────────────
    let feedback: z.infer<typeof feedbackSchema>;
    try {
      console.info(
        `[feedback] Requesting Gemini analysis for session ${sessionId}...`,
      );
      const result = await withTimeout(
        withRetry(
          () =>
            generateText({
              model: google("gemini-2.5-flash"),
              experimental_output: Output.object({ schema: feedbackSchema }),
              prompt,
            }),
          MAX_RETRIES,
        ),
        FEEDBACK_TIMEOUT_MS,
      );
      feedback = result.experimental_output;
    } catch (aiError: any) {
      console.error(
        `[feedback] Gemini failed for session ${sessionId}:`,
        aiError,
      );
      return NextResponse.json(
        {
          error: "Failed to generate feedback.",
          details: aiError.message || String(aiError),
        },
        { status: 503 },
      );
    }

    // ── Calculate Weighted Score ──────────────────────────────────────────
    const totalScore = calculateScore(feedback, interviewSession.type);

    // ── Persist (transaction) ─────────────────────────────────────────────
    let result;
    try {
      result = await prisma.$transaction(async (tx) => {
        const savedFeedback = await tx.sessionFeedback.create({
          data: {
            sessionId,
            clarity: feedback.clarity,
            depth: feedback.depth,
            communication: feedback.communication,
            technicalAccuracy: feedback.technicalAccuracy,
            strengths: feedback.strengths,
            improvements: feedback.improvements,
            summary: feedback.summary,
          },
        });

        await tx.interviewSession.update({
          where: { id: sessionId },
          data: { score: totalScore },
        });

        return savedFeedback;
      });
    } catch (dbError: any) {
      // P2002 = unique constraint violation = race condition, another request won
      if (dbError?.code === "P2002") {
        console.warn(
          `[feedback] Race condition on session ${sessionId}, returning existing`,
        );
        const existing = await prisma.sessionFeedback.findUnique({
          where: { sessionId },
        });
        return NextResponse.json(existing);
      }
      console.error(`[feedback] DB error for session ${sessionId}:`, dbError);
      return NextResponse.json(
        { error: "Failed to save feedback. Please try again." },
        { status: 500 },
      );
    }

    // ── Observability ─────────────────────────────────────────────────────
    console.info(
      `[feedback] Generated | session=${sessionId} user=${session.user.id} ` +
        `type=${interviewSession.type} score=${totalScore.toFixed(1)} ` +
        `duration=${Date.now() - startTime}ms`,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(`[feedback] Unhandled error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
