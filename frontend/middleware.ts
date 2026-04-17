import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 0. Skip for MSW service worker
  if (pathname === '/mockServiceWorker.js') {
    return NextResponse.next();
  }

  // 1. Path Parsing
  const pathParts = pathname.split('/').filter(Boolean);
  const locale = pathParts[0] || 'ar-SA';
  const tenantCandidate = pathParts[1]; 
  
  // 2. Prepare Tenant Logic
  let tenantId = 'default_tenant';
  let nextUrl = request.nextUrl.clone();

  if (tenantCandidate === 'alfaisaly') {
    tenantId = 'alfaisaly_fc';
    
    // Rewrite path to remove the tenant part for internal routing
    const newPathname = `/${locale}/${pathParts.slice(2).join('/')}`;
    nextUrl.pathname = newPathname;
  }

  // 2. Create response (either from intlMiddleware or a rewrite)
  const response = tenantId !== 'default_tenant' 
    ? NextResponse.rewrite(nextUrl)
    : intlMiddleware(request);

  // 3. Legacy Auth Logic (from proxy.ts) preserved for the generated response
  const isProtected = pathname.includes("/dashboard") || pathname.includes("/admin");
  const token = request.cookies.get("clubos_token")?.value;

  if (isProtected && !token && process.env.DEMO_MODE !== 'true') {
     // Redirect logic if needed (placeholder)
  }

  // Inject Tenant into Headers
  response.headers.set('x-clubos-tenant-id', tenantId);

  // 4. AI Guard for /api/v1/ai/*
  if (pathname.includes('/api/v1/ai/')) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Authentication required for AI interactions' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  // 5. Audit Logging (Demo Simulation)
  if (pathname.startsWith('/api/v1/')) {
    const ip = (request as any).ip ?? '127.0.0.1';
    console.log(`[Demo Audit] API Interaction: ${pathname} from IP: ${ip} | Tenant: ${tenantId}`);
  }

  return response;
}

export const config = {
  matcher: [
    '/', 
    '/(ar-SA|en-US)/:path*', 
    '/api/v1/:path*',
    '/mockServiceWorker.js',
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};

