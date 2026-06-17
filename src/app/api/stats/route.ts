import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Analysis from "@/models/analysis";

// GET /api/stats — get user analysis statistics
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const [totalAnalyses, safeCount, suspiciousCount, highRiskCount, recentAnalyses] =
      await Promise.all([
        Analysis.countDocuments({ userId }),
        Analysis.countDocuments({ userId, verdict: "safe" }),
        Analysis.countDocuments({ userId, verdict: "suspicious" }),
        Analysis.countDocuments({ userId, verdict: "high_risk" }),
        Analysis.find({ userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        totalAnalyses,
        safeCount,
        suspiciousCount,
        highRiskCount,
        recentAnalyses,
      },
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
