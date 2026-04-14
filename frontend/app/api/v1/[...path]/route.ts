import { NextRequest, NextResponse } from 'next/server';
import { mockHealthScore, mockDepartmentKpis, mockCompliance, generatePlayerTrend } from '@/mocks/kpiData';

// Simulation Configuration
const MOCK_LATENCY = Number(process.env.SLM_SIMULATION_LATENCY_MS ?? '800');

async function artificialDelay() {
  if (MOCK_LATENCY > 0) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY));
  }
}

// ── GET HANDLER ─────────────────────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join('/');
  
  await artificialDelay();

  // 1. KPI Dashboards (Simulate 60s ISR via Segment Config)
  if (pathString.includes('kpis/clubs/')) {
    if (pathString.endsWith('health-score')) {
      return NextResponse.json({ success: true, data: mockHealthScore });
    }
    if (pathString.includes('departments/')) {
      const dept = path[path.length - 1];
      return NextResponse.json({ success: true, data: mockDepartmentKpis[dept] || [] });
    }
    if (pathString.endsWith('compliance')) {
      return NextResponse.json({ success: true, data: mockCompliance });
    }
  }

  // 2. Members & Academies
  if (pathString === 'academies') {
    return NextResponse.json({
      success: true,
      data: [
        { id: "acc-001", nameEn: "Al-Faisaly Academy", nameAr: "أكاديمية الفيصلي", city: "Harmah", isActive: true }
      ]
    });
  }

  // Fallback for demo
  return NextResponse.json({ 
    success: true, 
    data: { message: "Demo Mock Response", path: pathString },
    _audit: { timestamp: new Date().toISOString(), tenant: request.headers.get('x-clubos-tenant-id') }
  });
}

// ── POST HANDLER (AI Streaming Simulation) ──────────────────────────────────
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join('/');

  await artificialDelay();

  // AI/SLM Streaming
  if (pathString.startsWith('ai/')) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const chunks = [
          "Analyzing Al-Faisaly FC performance metrics...",
          "\nDetected dip in U-17 defensive KPIs in Saudi Youth League.",
          "\nRecommendation: Adjust defensive line width by 5m against direct-play opponents.",
          "\nGeneration context: Saudi Sport MoS Compliance v1.2"
        ];
        
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk));
          await new Promise((resolve) => setTimeout(resolve, 300)); // Simulated AI thought latency
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return NextResponse.json({ success: true, message: "Action simulated in Demo Mode" });
}

// ISR Segment Config
export const revalidate = 60; // ISR for KPI aggregate data
