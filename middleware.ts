// middleware.ts (root of project)
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './src/lib/supabase/middleware'
import { 
  emailLimiter, 
  strictLimiter, 
  apiLimiter,
  getRateLimitIdentifier,
  createRateLimitHeaders,
  handleRateLimitResponse
} from './src/lib/ratelimit'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    let rateLimitResult;
    const identifier = getRateLimitIdentifier(request);
    
    // Apply different rate limiters based on the endpoint
    if (pathname === '/api/send-mail') {
      rateLimitResult = await emailLimiter.limit(identifier);
    } else if (pathname === '/api/deleteUser') {
      rateLimitResult = await strictLimiter.limit(identifier);
    } else {
      rateLimitResult = await apiLimiter.limit(identifier);
    }
    
    // If rate limit exceeded, return 429 response
    if (!rateLimitResult.success) {
      return handleRateLimitResponse(rateLimitResult);
    }
    
    // Continue with session update and add rate limit headers
    const response = await updateSession(request);
    const headers = createRateLimitHeaders(rateLimitResult);
    
    // Add rate limit headers to response
    Object.entries(headers).forEach(([key, value]) => {
      if (value !== undefined) {
        response.headers.set(key, value);
      }
    });
    
    return response;
  }
  
  // For non-API routes, just update session
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}