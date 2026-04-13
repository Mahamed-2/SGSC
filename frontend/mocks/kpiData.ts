import { ClubHealthScore, KpiValue, ComplianceStatus, TrendPoint } from "@/types";

export const mockHealthScore: ClubHealthScore = {
  clubId: "faisaly-001",
  totalScore: 78.5,
  categoryScores: {
    "Football Ops": 82,
    "Medical": 71,
    "Finance": 89,
    "HR": 72
  },
  calculatedAt: new Date().toISOString()
};

export const mockDepartmentKpis: Record<string, KpiValue[]> = {
  "FOOTBALL_OPS": [
    { nameEn: "Match Win Rate", nameAr: "معدل الفوز", value: 64, unit: "%", trend: "Up" },
    { nameEn: "Youth Promotion", nameAr: "تصعيد الناشئين", value: 12, unit: "%", trend: "Up" },
    { nameEn: "Goals per Match", nameAr: "الأهداف / مباراة", value: 2.3, unit: "Goals", trend: "Stable" }
  ],
  "MEDICAL": [
    { nameEn: "Injury Rate", nameAr: "معدل الإصابات", value: 4.2, unit: "%", trend: "Down" },
    { nameEn: "Avg Recovery", nameAr: "وقت التعافي", value: 14, unit: "Days", trend: "Down" },
    { nameEn: "Prevention Compliance", nameAr: "الامتثال الوقائي", value: 95, unit: "%", trend: "Up" }
  ]
};

export const mockCompliance: ComplianceStatus = {
  clubId: "faisaly-001",
  completionPercentage: 88,
  requirements: [
    { nameEn: "Saudi Governance Pillar 1", nameAr: "ركيزة الحوكمة 1", isMet: true, level: "Mandatory" },
    { nameEn: "Financial Transparency", nameAr: "الشفافية المالية", isMet: true, level: "Mandatory" },
    { nameEn: "Environmental Impact", nameAr: "الأثر البيئي", isMet: false, level: "Standard" }
  ]
};

export const generatePlayerTrend = (): TrendPoint[] => {
  const points: TrendPoint[] = [];
  const now = new Date();
  for (let i = 10; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    points.push({
      date: d.toISOString(),
      metricType: "PerformanceScore",
      value: 70 + Math.random() * 25
    });
  }
  return points;
};
