// ============================================================
// JobShield AI — TypeScript Type Definitions
// ============================================================

export type ContentType =
  | "email"
  | "whatsapp"
  | "linkedin"
  | "job_description"
  | "offer_letter"
  | "other";

export type Verdict = "safe" | "suspicious" | "high_risk";

export type FlagSeverity = "high" | "medium" | "low";

// ─── Red Flag ───────────────────────────────────────────────
export interface RedFlag {
  severity: FlagSeverity;
  title: string;
  description: string;
  quote?: string;
  whySuspicious: string;
  commonScamPattern: string;
  suggestedAction: string;
}

// ─── Category Analysis ─────────────────────────────────────
export interface CategoryAnalysis {
  score: number;
  findings: string[];
}

// ─── Analysis Categories ────────────────────────────────────
export interface AnalysisCategories {
  languageAnalysis: CategoryAnalysis;
  financialIndicators: CategoryAnalysis;
  legitimacyChecks: CategoryAnalysis;
  patternMatching: CategoryAnalysis;
  contactInfo: CategoryAnalysis;
}

// ─── Advanced Upgrades ──────────────────────────────────────
export interface CompanyLegitimacy {
  name: string | null;
  confidenceScore: number;
  hasOfficialWebsite: boolean;
  websiteUrl?: string;
  legitimacyIndicators: string[];
}

export interface SalaryRealityCheck {
  isSalaryMentioned: boolean;
  extractedSalary?: string;
  isUnrealistic: boolean;
  unrealisticReason?: string;
  suspiciousCommission: boolean;
  payToWorkRisk: boolean;
  analysisDetails: string;
}

export interface PhishingUrl {
  url: string;
  domain: string;
  isSuspicious: boolean;
  reason?: string;
}

export interface PhishingDetection {
  credentialTheftRisk: boolean;
  fakeInterviewLinksRisk: boolean;
  suspiciousAttachmentsRisk: boolean;
  suspiciousUrlsRisk: boolean;
  detectedUrls: PhishingUrl[];
  analysisDetails: string;
}

// ─── Analysis Result ────────────────────────────────────────
export interface AnalysisResult {
  _id: string;
  userId: string;
  contentType: ContentType;
  originalContent: string;
  contentPreview: string;
  riskScore: number;
  verdict: Verdict;
  summary: string;
  redFlags: RedFlag[];
  categories: AnalysisCategories;
  recommendations: string[];
  companyLegitimacy: CompanyLegitimacy;
  salaryRealityCheck: SalaryRealityCheck;
  phishingDetection: PhishingDetection;
  createdAt: string;
  updatedAt: string;
}

// ─── API Request/Response ───────────────────────────────────
export interface AnalyzeRequest {
  content: string;
  contentType: ContentType;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Stats ──────────────────────────────────────────────────
export interface UserStats {
  totalAnalyses: number;
  safeCount: number;
  suspiciousCount: number;
  highRiskCount: number;
  recentAnalyses: AnalysisResult[];
}

// ─── Gemini Response ────────────────────────────────────────
export interface GeminiAnalysisResponse {
  riskScore: number;
  verdict: Verdict;
  summary: string;
  redFlags: RedFlag[];
  categories: AnalysisCategories;
  recommendations: string[];
  companyLegitimacy: CompanyLegitimacy;
  salaryRealityCheck: SalaryRealityCheck;
  phishingDetection: PhishingDetection;
}

// ─── Admin Stats ─────────────────────────────────────────────
export interface AdminStats {
  totalScans: number;
  scamRate: number;
  averageRiskScore: number;
  activeUsersCount: number;
  contentTypeDistribution: { type: string; count: number }[];
  verdictDistribution: { verdict: string; count: number }[];
  dailyScans: { date: string; count: number }[];
  topScamPatterns: { pattern: string; count: number }[];
  recentScans: {
    _id: string;
    userId: string;
    contentType: ContentType;
    riskScore: number;
    verdict: Verdict;
    createdAt: string;
  }[];
}
