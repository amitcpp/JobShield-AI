import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { analyzeContent } from "@/lib/gemini";
import Analysis from "@/models/analysis";
import dbConnect from "@/lib/db";

const analyzeSchema = z.object({
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(10000, "Content must be under 10,000 characters"),
  contentType: z.enum([
    "email",
    "whatsapp",
    "linkedin",
    "job_description",
    "offer_letter",
    "other",
  ]),
});

export async function POST(request: Request) {
  try {
    // 1. Authenticate
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // 2. Parse and validate body
    const body = await request.json();
    const parsed = analyzeSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json(
        { success: false, error: errors },
        { status: 400 }
      );
    }

    const { content, contentType } = parsed.data;

    // 3. Connect to DB
    await dbConnect();

    // 4. Analyze with Gemini
    const geminiResult = await analyzeContent(content, contentType);

    // 5. Save to MongoDB
    const analysis = await Analysis.create({
      userId,
      contentType,
      originalContent: content,
      contentPreview: content.substring(0, 150),
      riskScore: geminiResult.riskScore,
      verdict: geminiResult.verdict,
      summary: geminiResult.summary,
      redFlags: geminiResult.redFlags,
      categories: geminiResult.categories,
      recommendations: geminiResult.recommendations,
      companyLegitimacy: geminiResult.companyLegitimacy,
      salaryRealityCheck: geminiResult.salaryRealityCheck,
      phishingDetection: geminiResult.phishingDetection,
    });

    // 6. Return the saved analysis
    return NextResponse.json(
      { success: true, data: analysis },
      { status: 201 }
    );
  } catch (error) {
    console.error("Analysis API error:", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
