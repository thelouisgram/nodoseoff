import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { strictLimiter, createRateLimitHeaders } from '@/lib/ratelimit';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? ''
const SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ?? '';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId, shouldSoftDelete = false } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Apply user-based rate limiting (in addition to IP-based middleware limit)
        const rateLimitResult = await strictLimiter.limit(`user:${userId}`);
        const rateLimitHeaders = createRateLimitHeaders(rateLimitResult);
        
        if (!rateLimitResult.success) {
            return res.status(429)
                .setHeader('X-RateLimit-Limit', rateLimitHeaders['X-RateLimit-Limit'])
                .setHeader('X-RateLimit-Remaining', rateLimitHeaders['X-RateLimit-Remaining'])
                .setHeader('X-RateLimit-Reset', rateLimitHeaders['X-RateLimit-Reset'])
                .setHeader('Retry-After', rateLimitHeaders['Retry-After'] || '3600')
                .json({ 
                    error: 'Too many requests',
                    message: 'You have exceeded the rate limit for account deletion. Please try again later.',
                    retryAfter: rateLimitHeaders['Retry-After']
                });
        }

        const { error } = await supabase.auth.admin.deleteUser(userId, shouldSoftDelete);

        if (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ error: 'Failed to delete user' });
        }

        res.status(200)
            .setHeader('X-RateLimit-Limit', rateLimitHeaders['X-RateLimit-Limit'])
            .setHeader('X-RateLimit-Remaining', rateLimitHeaders['X-RateLimit-Remaining'])
            .setHeader('X-RateLimit-Reset', rateLimitHeaders['X-RateLimit-Reset'])
            .json({ message: 'User account deleted successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}
