import type { ContentType } from "@/types";

// ─── Content Types ──────────────────────────────────────────
export const CONTENT_TYPES: { value: ContentType; label: string; icon: string }[] = [
  { value: "email", label: "Email", icon: "Mail" },
  { value: "whatsapp", label: "WhatsApp", icon: "MessageCircle" },
  { value: "linkedin", label: "LinkedIn", icon: "Linkedin" },
  { value: "job_description", label: "Job Description", icon: "FileText" },
  { value: "offer_letter", label: "Offer Letter", icon: "FileCheck" },
  { value: "other", label: "Other", icon: "File" },
];

// ─── Risk Levels ────────────────────────────────────────────
export const RISK_CONFIG = {
  safe: {
    label: "Low Risk",
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.1)",
    borderColor: "rgba(16, 185, 129, 0.3)",
    description: "This content appears to be legitimate.",
  },
  suspicious: {
    label: "Suspicious",
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.1)",
    borderColor: "rgba(245, 158, 11, 0.3)",
    description: "This content has some concerning elements. Proceed with caution.",
  },
  high_risk: {
    label: "High Risk",
    color: "#EF4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.3)",
    description: "This content shows strong indicators of being a scam.",
  },
} as const;

// ─── Severity Config ────────────────────────────────────────
export const SEVERITY_CONFIG = {
  high: { label: "High", color: "#EF4444", bgColor: "rgba(239, 68, 68, 0.15)" },
  medium: { label: "Medium", color: "#F59E0B", bgColor: "rgba(245, 158, 11, 0.15)" },
  low: { label: "Low", color: "#10B981", bgColor: "rgba(16, 185, 129, 0.15)" },
} as const;

// ─── Sample Messages for Demo ───────────────────────────────
export const SAMPLE_MESSAGES = [
  {
    title: "Suspicious Job Email",
    contentType: "email" as ContentType,
    content: `Subject: Congratulations! You've been selected for Software Engineer at Google

Dear Candidate,

We are pleased to inform you that after reviewing your resume on Naukri.com, you have been shortlisted for the position of Software Engineer at Google India Pvt Ltd.

Package: ₹25 LPA - ₹45 LPA
Location: Bangalore / Remote
Joining: Immediate

To confirm your position, please complete the following steps:
1. Pay a refundable registration fee of ₹4,999 via UPI to process your application
2. Share your Aadhaar card and PAN card for verification
3. Reply with your current salary slip

This offer is valid for 24 hours only. Delay may result in cancellation.

Regards,
HR Team - Google India
hr.google.recruitment2024@gmail.com
WhatsApp: +91 9876543210`,
  },
  {
    title: "Fake Internship Offer",
    contentType: "whatsapp" as ContentType,
    content: `Hi! 👋

I'm Priya from Amazon HR department. We found your profile on LinkedIn and we're impressed!

We have an exciting internship opportunity for you:
- Stipend: ₹50,000/month
- Duration: 3 months
- 100% Remote
- Certificate from Amazon

No interview needed! Just pay ₹2,999 training fee to get started.

Send payment to this UPI: amazon.hr@paytm

Hurry! Only 5 spots left! 🔥

Reply YES to confirm your seat.`,
  },
  {
    title: "Legitimate Job Posting",
    contentType: "job_description" as ContentType,
    content: `Software Engineer - Frontend

About the role:
We're looking for a Frontend Engineer to join our product team at Razorpay. You'll work on building scalable payment solutions used by millions of businesses.

Requirements:
- 2+ years of experience with React/Next.js
- Strong TypeScript skills
- Experience with REST APIs and GraphQL
- Good understanding of web performance
- CS degree preferred but not required

What we offer:
- Competitive salary based on experience
- Stock options (ESOPs)
- Health insurance for you and family
- Flexible work hours
- Learning & development budget

How to apply:
Visit careers.razorpay.com and submit your application with resume.

Razorpay is an equal opportunity employer.`,
  },
];

// ─── Navigation ─────────────────────────────────────────────
export const DASHBOARD_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Analyze", href: "/analyze", icon: "Search" },
  { label: "History", href: "/history", icon: "History" },
];

// ─── App Config ─────────────────────────────────────────────
export const APP_CONFIG = {
  name: "JobShield AI",
  description: "AI-powered job scam detector that protects job seekers from fraudulent offers",
  maxContentLength: 10000,
  maxFreeAnalysesPerDay: 10,
};
