import rateLimit from 'express-rate-limit';

// General search rate limiter
export const searchRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many search requests, please try again later.',
        retryAfter: Math.ceil(15 * 60 / 60) // minutes
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Too many search requests, please try again later.',
            retryAfter: Math.ceil(15 * 60 / 60)
        });
    }
});

// Strict rate limiter for authenticated users
export const authenticatedSearchRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Higher limit for authenticated users
    message: {
        success: false,
        message: 'Too many search requests, please try again later.',
        retryAfter: Math.ceil(15 * 60 / 60)
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        // Use user ID if authenticated, otherwise use IP
        return req.user ? req.user._id : req.ip;
    },
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Too many search requests, please try again later.',
            retryAfter: Math.ceil(15 * 60 / 60)
        });
    }
});

// Burst rate limiter for short time periods
export const burstRateLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // limit each IP to 20 requests per minute
    message: {
        success: false,
        message: 'Too many requests in a short time, please slow down.',
        retryAfter: 60 // seconds
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Too many requests in a short time, please slow down.',
            retryAfter: 60
        });
    }
});

// Analytics rate limiter (for admin endpoints)
export const analyticsRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // limit each IP to 50 requests per hour
    message: {
        success: false,
        message: 'Too many analytics requests, please try again later.',
        retryAfter: Math.ceil(60 * 60 / 60) // minutes
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Too many analytics requests, please try again later.',
            retryAfter: Math.ceil(60 * 60 / 60)
        });
    }
});

export default {
    searchRateLimit,
    authenticatedSearchRateLimit,
    burstRateLimit,
    analyticsRateLimit
}; 