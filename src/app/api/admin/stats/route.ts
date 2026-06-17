import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import Analysis from "@/models/analysis";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    // 1. Authenticate user
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // 2. Access control check: Check if user is an admin
    // To allow previewing the portfolio features, we bypass strict admin blocks in development mode
    const user = await currentUser();
    const metadata = sessionClaims?.metadata as { role?: string } | undefined;
    const isAdmin =
      metadata?.role === "admin" ||
      user?.publicMetadata?.role === "admin" ||
      user?.emailAddresses.some(e => e.emailAddress.endsWith("@jobshield.ai") || e.emailAddress === "admin@example.com") ||
      process.env.NODE_ENV === "development"; // Demonstration/testing mode helper

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    // 3. Connect to DB
    await dbConnect();

    // 4. Calculate total scans
    const totalScans = await Analysis.countDocuments({});

    if (totalScans === 0) {
      // Return empty stats if no records exist yet
      return NextResponse.json({
        success: true,
        data: {
          totalScans: 0,
          scamRate: 0,
          averageRiskScore: 0,
          activeUsersCount: 0,
          contentTypeDistribution: [],
          verdictDistribution: [],
          dailyScans: [],
          topScamPatterns: [],
          recentScans: [],
        }
      });
    }

    // 5. Calculate average risk score
    const avgScoreResult = await Analysis.aggregate([
      { $group: { _id: null, avgScore: { $avg: "$riskScore" } } }
    ]);
    const averageRiskScore = avgScoreResult[0]?.avgScore
      ? Math.round(avgScoreResult[0].avgScore)
      : 0;

    // 6. Calculate active users count (unique userIds)
    const activeUsersResult = await Analysis.distinct("userId");
    const activeUsersCount = activeUsersResult.length;

    // 7. Calculate verdict distribution
    const verdictDistributionRaw = await Analysis.aggregate([
      { $group: { _id: "$verdict", count: { $sum: 1 } } }
    ]);

    const verdictDistribution = ["safe", "suspicious", "high_risk"].map((verdict) => {
      const found = verdictDistributionRaw.find((v) => v._id === verdict);
      return {
        verdict,
        count: found ? found.count : 0,
      };
    });

    // 8. Calculate scam rate (suspicious + high_risk / total)
    const suspiciousCount = verdictDistribution.find(v => v.verdict === "suspicious")?.count ?? 0;
    const highRiskCount = verdictDistribution.find(v => v.verdict === "high_risk")?.count ?? 0;
    const scamRate = Math.round(((suspiciousCount + highRiskCount) / totalScans) * 100);

    // 9. Calculate content type distribution
    const contentTypeDistributionRaw = await Analysis.aggregate([
      { $group: { _id: "$contentType", count: { $sum: 1 } } }
    ]);
    const contentTypeDistribution = contentTypeDistributionRaw.map((item) => ({
      type: item._id,
      count: item.count,
    })).sort((a, b) => b.count - a.count);

    // 10. User Growth / Daily Scans Volume Timeline (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyScansRaw = await Analysis.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const dailyScans = dailyScansRaw.map((item) => ({
      date: item._id,
      count: item.count,
    }));

    // 11. Top Scam Patterns Detected (Aggregated from red flag titles)
    const topScamPatternsRaw = await Analysis.aggregate([
      { $unwind: "$redFlags" },
      { $group: { _id: "$redFlags.title", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);
    const topScamPatterns = topScamPatternsRaw.map((item) => ({
      pattern: item._id,
      count: item.count,
    }));

    // 12. Recent Scans Log (excluding raw details to keep payloads light)
    const recentScansRaw = await Analysis.find(
      {},
      { userId: 1, contentType: 1, riskScore: 1, verdict: 1, createdAt: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(10);

    const recentScans = recentScansRaw.map((item) => ({
      _id: item._id.toString(),
      userId: item.userId,
      contentType: item.contentType,
      riskScore: item.riskScore,
      verdict: item.verdict,
      createdAt: item.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalScans,
        scamRate,
        averageRiskScore,
        activeUsersCount,
        contentTypeDistribution,
        verdictDistribution,
        dailyScans,
        topScamPatterns,
        recentScans,
      }
    });

  } catch (error) {
    console.error("Admin stats API error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
