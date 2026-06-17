import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalysis extends Document {
  userId: string;
  contentType: string;
  originalContent: string;
  contentPreview: string;
  riskScore: number;
  verdict: string;
  summary: string;
  redFlags: Array<{
    severity: string;
    title: string;
    description: string;
    quote?: string;
    whySuspicious: string;
    commonScamPattern: string;
    suggestedAction: string;
  }>;
  categories: {
    languageAnalysis: { score: number; findings: string[] };
    financialIndicators: { score: number; findings: string[] };
    legitimacyChecks: { score: number; findings: string[] };
    patternMatching: { score: number; findings: string[] };
    contactInfo: { score: number; findings: string[] };
  };
  recommendations: string[];
  companyLegitimacy: {
    name: string | null;
    confidenceScore: number;
    hasOfficialWebsite: boolean;
    websiteUrl?: string;
    legitimacyIndicators: string[];
  };
  salaryRealityCheck: {
    isSalaryMentioned: boolean;
    extractedSalary?: string;
    isUnrealistic: boolean;
    unrealisticReason?: string;
    suspiciousCommission: boolean;
    payToWorkRisk: boolean;
    analysisDetails: string;
  };
  phishingDetection: {
    credentialTheftRisk: boolean;
    fakeInterviewLinksRisk: boolean;
    suspiciousAttachmentsRisk: boolean;
    suspiciousUrlsRisk: boolean;
    detectedUrls: Array<{
      url: string;
      domain: string;
      isSuspicious: boolean;
      reason?: string;
    }>;
    analysisDetails: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema(
  {
    score: { type: Number, required: true, min: 0, max: 100 },
    findings: [{ type: String }],
  },
  { _id: false }
);

const RedFlagSchema = new Schema(
  {
    severity: {
      type: String,
      required: true,
      enum: ["high", "medium", "low"],
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    quote: { type: String },
    whySuspicious: { type: String, default: "" },
    commonScamPattern: { type: String, default: "" },
    suggestedAction: { type: String, default: "" },
  },
  { _id: false }
);

const PhishingUrlSchema = new Schema(
  {
    url: { type: String, required: true },
    domain: { type: String, required: true },
    isSuspicious: { type: Boolean, default: false },
    reason: { type: String },
  },
  { _id: false }
);

const CompanyLegitimacySchema = new Schema(
  {
    name: { type: String, default: null },
    confidenceScore: { type: Number, default: 0 },
    hasOfficialWebsite: { type: Boolean, default: false },
    websiteUrl: { type: String },
    legitimacyIndicators: [{ type: String }],
  },
  { _id: false }
);

const SalaryRealityCheckSchema = new Schema(
  {
    isSalaryMentioned: { type: Boolean, default: false },
    extractedSalary: { type: String },
    isUnrealistic: { type: Boolean, default: false },
    unrealisticReason: { type: String },
    suspiciousCommission: { type: Boolean, default: false },
    payToWorkRisk: { type: Boolean, default: false },
    analysisDetails: { type: String, default: "" },
  },
  { _id: false }
);

const PhishingDetectionSchema = new Schema(
  {
    credentialTheftRisk: { type: Boolean, default: false },
    fakeInterviewLinksRisk: { type: Boolean, default: false },
    suspiciousAttachmentsRisk: { type: Boolean, default: false },
    suspiciousUrlsRisk: { type: Boolean, default: false },
    detectedUrls: [PhishingUrlSchema],
    analysisDetails: { type: String, default: "" },
  },
  { _id: false }
);

const AnalysisSchema = new Schema<IAnalysis>(
  {
    userId: { type: String, required: true, index: true },
    contentType: {
      type: String,
      required: true,
      enum: [
        "email",
        "whatsapp",
        "linkedin",
        "job_description",
        "offer_letter",
        "other",
      ],
    },
    originalContent: { type: String, required: true },
    contentPreview: { type: String, required: true },
    riskScore: { type: Number, required: true, min: 0, max: 100 },
    verdict: {
      type: String,
      required: true,
      enum: ["safe", "suspicious", "high_risk"],
    },
    summary: { type: String, required: true },
    redFlags: [RedFlagSchema],
    categories: {
      languageAnalysis: { type: CategorySchema, required: true },
      financialIndicators: { type: CategorySchema, required: true },
      legitimacyChecks: { type: CategorySchema, required: true },
      patternMatching: { type: CategorySchema, required: true },
      contactInfo: { type: CategorySchema, required: true },
    },
    recommendations: [{ type: String }],
    companyLegitimacy: { type: CompanyLegitimacySchema, required: true, default: () => ({}) },
    salaryRealityCheck: { type: SalaryRealityCheckSchema, required: true, default: () => ({}) },
    phishingDetection: { type: PhishingDetectionSchema, required: true, default: () => ({}) },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user queries
AnalysisSchema.index({ userId: 1, createdAt: -1 });

const Analysis: Model<IAnalysis> =
  mongoose.models.Analysis || mongoose.model<IAnalysis>("Analysis", AnalysisSchema);

export default Analysis;
