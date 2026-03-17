import { streamText, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { prisma } from "@/lib/db";
import { getSystemPrompt } from "./prompt";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ratelimit } from "@/lib/ratelimit";

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Rate limiting
    const { success, limit, remaining, reset } = await ratelimit.limit(
      session.user.id
    );

    if (!success) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          details: `You have reached the limit of ${limit} AI requests per 24 hours. Rate limit will reset at ${new Date(
            reset
          ).toLocaleString()}.`,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { messages, sessionId, interviewType } = body;

    if (!sessionId || !interviewType) {
      return new Response(
        JSON.stringify({ error: "Missing sessionId or interviewType" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Verify session ownership
    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
    });

    if (!interviewSession) {
      return new Response(JSON.stringify({ error: "Session not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (interviewSession.userId !== session.user.id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. Check message count limit (Max 20 messages)
    const messageCount = await prisma.message.count({
      where: { sessionId },
    });

    if (messageCount >= 20) {
      return new Response(
        JSON.stringify({
          error: "Message limit reached",
          details: "This interview session has reached the maximum of 20 messages.",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const latestMessage = messages[messages.length - 1];

    // Extract plain text from v6 parts array
    const extractText = (message: any): string => {
      // v6 UIMessage — uses parts
      if (message.parts && Array.isArray(message.parts)) {
        return message.parts
          .filter((p: any) => p.type === "text")
          .map((p: any) => p.text)
          .join("");
      }
      // fallback for plain string content
      if (typeof message.content === "string") return message.content;
      return "";
    };

    if (latestMessage.role === "user") {
      await prisma.message.create({
        data: {
          sessionId,
          role: "user",
          content: extractText(latestMessage),
        },
      });
    }

    const systemPrompt = getSystemPrompt(interviewType);

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      async onFinish({ text }) {
        await prisma.message.create({
          data: {
            sessionId,
            role: "assistant",
            content: text,
          },
        });
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
