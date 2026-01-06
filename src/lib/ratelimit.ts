// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import type { RateLimitResult, RateLimitHeaders, RateLimitIdentifier } from '@/types/ratelimit.types';

// Initialize Redis client (falls back to in-memory if no Redis URL provided)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : undefined;

// Create in-memory cache as fallback
class InMemoryCache extends Map {
  private expirations = new Map<string, number>();

  set(key: string, value: any, ttl?: number): this {
    super.set(key, value);
    if (ttl) {
      this.expirations.set(key, Date.now() + ttl * 1000);
    }
    return this;
  }

  get(key: string): any {
    const expiration = this.expirations.get(key);
    if (expiration && Date.now() > expiration) {
      this.delete(key);
      this.expirations.delete(key);
      return undefined;
    }
    return super.get(key);
  }
}

const cache = new InMemoryCache();

// Authentication rate limiter - very strict (5 requests per 15 minutes)
export const authLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      analytics: true,
      prefix: '@ratelimit/auth',
    })
  : {
      limit: async (identifier: string) => {
        const key = `auth:${identifier}`;
        const now = Date.now();
        const windowMs = 15 * 60 * 1000; // 15 minutes
        const requests = cache.get(key) || [];
        
        // Filter out old requests
        const recentRequests = requests.filter((time: number) => now - time < windowMs);
        
        if (recentRequests.length >= 5) {
          const oldestRequest = Math.min(...recentRequests);
          const resetTime = oldestRequest + windowMs;
          
          return {
            success: false,
            limit: 5,
            remaining: 0,
            reset: resetTime,
            pending: Promise.resolve(),
          };
        }
        
        recentRequests.push(now);
        cache.set(key, recentRequests, 900); // 15 minutes TTL
        
        return {
          success: true,
          limit: 5,
          remaining: 5 - recentRequests.length,
          reset: now + windowMs,
          pending: Promise.resolve(),
        };
      },
    };

// Email rate limiter - strict (3 requests per hour)
export const emailLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '60 m'),
      analytics: true,
      prefix: '@ratelimit/email',
    })
  : {
      limit: async (identifier: string) => {
        const key = `email:${identifier}`;
        const now = Date.now();
        const windowMs = 60 * 60 * 1000; // 1 hour
        const requests = cache.get(key) || [];
        
        const recentRequests = requests.filter((time: number) => now - time < windowMs);
        
        if (recentRequests.length >= 3) {
          const oldestRequest = Math.min(...recentRequests);
          const resetTime = oldestRequest + windowMs;
          
          return {
            success: false,
            limit: 3,
            remaining: 0,
            reset: resetTime,
            pending: Promise.resolve(),
          };
        }
        
        recentRequests.push(now);
        cache.set(key, recentRequests, 3600); // 1 hour TTL
        
        return {
          success: true,
          limit: 3,
          remaining: 3 - recentRequests.length,
          reset: now + windowMs,
          pending: Promise.resolve(),
        };
      },
    };

// General API rate limiter (100 requests per minute)
export const apiLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '60 s'),
      analytics: true,
      prefix: '@ratelimit/api',
    })
  : {
      limit: async (identifier: string) => {
        const key = `api:${identifier}`;
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minute
        const requests = cache.get(key) || [];
        
        const recentRequests = requests.filter((time: number) => now - time < windowMs);
        
        if (recentRequests.length >= 100) {
          const oldestRequest = Math.min(...recentRequests);
          const resetTime = oldestRequest + windowMs;
          
          return {
            success: false,
            limit: 100,
            remaining: 0,
            reset: resetTime,
            pending: Promise.resolve(),
          };
        }
        
        recentRequests.push(now);
        cache.set(key, recentRequests, 60); // 1 minute TTL
        
        return {
          success: true,
          limit: 100,
          remaining: 100 - recentRequests.length,
          reset: now + windowMs,
          pending: Promise.resolve(),
        };
      },
    };

// Strict rate limiter for sensitive operations (2 requests per hour)
export const strictLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(2, '60 m'),
      analytics: true,
      prefix: '@ratelimit/strict',
    })
  : {
      limit: async (identifier: string) => {
        const key = `strict:${identifier}`;
        const now = Date.now();
        const windowMs = 60 * 60 * 1000; // 1 hour
        const requests = cache.get(key) || [];
        
        const recentRequests = requests.filter((time: number) => now - time < windowMs);
        
        if (recentRequests.length >= 2) {
          const oldestRequest = Math.min(...recentRequests);
          const resetTime = oldestRequest + windowMs;
          
          return {
            success: false,
            limit: 2,
            remaining: 0,
            reset: resetTime,
            pending: Promise.resolve(),
          };
        }
        
        recentRequests.push(now);
        cache.set(key, recentRequests, 3600); // 1 hour TTL
        
        return {
          success: true,
          limit: 2,
          remaining: 2 - recentRequests.length,
          reset: now + windowMs,
          pending: Promise.resolve(),
        };
      },
    };

/**
 * Extract rate limit identifier from request (IP address or user ID)
 */
export function getRateLimitIdentifier(request: NextRequest, userId?: string): RateLimitIdentifier {
  if (userId) {
    return `user:${userId}`;
  }
  
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a generic identifier
  return 'anonymous';
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(result: RateLimitResult): RateLimitHeaders {
  const headers: RateLimitHeaders = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };
  
  if (!result.success) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
    headers['Retry-After'] = retryAfter.toString();
  }
  
  return headers;
}

/**
 * Handle rate limit response
 */
export function handleRateLimitResponse(result: RateLimitResult): NextResponse {
  const headers = createRateLimitHeaders(result);
  
  return NextResponse.json(
    {
      error: 'Too many requests',
      message: 'You have exceeded the rate limit. Please try again later.',
      retryAfter: headers['Retry-After'],
    },
    {
      status: 429,
      headers: headers as Record<string, string>,
    }
  );
}
