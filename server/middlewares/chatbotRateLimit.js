const RATE_LIMITS = {
    User: {
        limit: 5,
        windowMs: 60 * 60 * 1000,
    },
    Instructor: {
        limit: 10,
        windowMs: 60 * 60 * 1000,
    },
    Admin: {
        limit: null,
        windowMs: 60 * 60 * 1000,
    },
    Mod: {
        limit: 15,
        windowMs: 60 * 60 * 1000,
    },
};

// In-memory counters are enough for single-instance dev/prod setups.
const usageStore = new Map();

const pruneExpiredEntries = (now) => {
    for (const [key, record] of usageStore.entries()) {
        if (record.resetAt <= now) {
            usageStore.delete(key);
        }
    }
};

export const chatbotRateLimit = (req, res, next) => {
    const userId = req.user?._id?.toString();
    const role = req.user?.role || "User";
    const config = RATE_LIMITS[role] || RATE_LIMITS.User;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Not logged in",
        });
    }

    const now = Date.now();

    if (usageStore.size > 1000) {
        pruneExpiredEntries(now);
    }

    if (config.limit === null) {
        req.chatbotRateLimit = {
            remaining: null,
            limit: null,
            resetAt: null,
            windowMs: config.windowMs,
            unlimited: true,
        };

        return next();
    }

    const key = `${userId}:${role}`;
    const currentRecord = usageStore.get(key);

    req.chatbotRateLimit = {
        remaining: config.limit,
        limit: config.limit,
        resetAt: now + config.windowMs,
        windowMs: config.windowMs,
        unlimited: false,
    };

    if (currentRecord && currentRecord.resetAt > now) {
        req.chatbotRateLimit.remaining = Math.max(0, config.limit - currentRecord.count);
        req.chatbotRateLimit.resetAt = currentRecord.resetAt;
    }

    return next();
};

export const consumeAiChatQuota = (user) => {
    const userId = user?._id?.toString();
    const role = user?.role || "User";
    const config = RATE_LIMITS[role] || RATE_LIMITS.User;

    if (!userId) {
        return {
            allowed: false,
            status: 401,
            message: "Not logged in",
        };
    }

    const now = Date.now();

    if (usageStore.size > 1000) {
        pruneExpiredEntries(now);
    }

    if (config.limit === null) {
        return {
            allowed: true,
            rateLimit: {
                remaining: null,
                limit: null,
                resetAt: null,
                windowMs: config.windowMs,
                unlimited: true,
            },
        };
    }

    const key = `${userId}:${role}`;
    const currentRecord = usageStore.get(key);

    if (!currentRecord || currentRecord.resetAt <= now) {
        const resetAt = now + config.windowMs;
        usageStore.set(key, {
            count: 1,
            resetAt,
        });

        return {
            allowed: true,
            rateLimit: {
                remaining: config.limit - 1,
                limit: config.limit,
                resetAt,
                windowMs: config.windowMs,
                unlimited: false,
            },
        };
    }

    if (currentRecord.count >= config.limit) {
        const retryAfterSeconds = Math.max(1, Math.ceil((currentRecord.resetAt - now) / 1000));

        return {
            allowed: false,
            status: 429,
            message: "You have reached the AI chatbot message limit. Please try again later.",
            retryAfterSeconds,
            resetAt: currentRecord.resetAt,
            rateLimit: {
                remaining: 0,
                limit: config.limit,
                resetAt: currentRecord.resetAt,
                windowMs: config.windowMs,
                unlimited: false,
            },
        };
    }

    currentRecord.count += 1;
    usageStore.set(key, currentRecord);

    return {
        allowed: true,
        rateLimit: {
            remaining: config.limit - currentRecord.count,
            limit: config.limit,
            resetAt: currentRecord.resetAt,
            windowMs: config.windowMs,
            unlimited: false,
        },
    };
};

export const getChatbotRateLimitStatus = (user) => {
    const userId = user?._id?.toString();
    const role = user?.role || "User";
    const config = RATE_LIMITS[role] || RATE_LIMITS.User;

    if (!userId) {
        return null;
    }

    if (config.limit === null) {
        return {
            remaining: null,
            limit: null,
            resetAt: null,
            windowMs: config.windowMs,
            unlimited: true,
        };
    }

    const now = Date.now();
    const key = `${userId}:${role}`;
    const currentRecord = usageStore.get(key);

    if (!currentRecord || currentRecord.resetAt <= now) {
        return {
            remaining: config.limit,
            limit: config.limit,
            resetAt: now + config.windowMs,
            windowMs: config.windowMs,
            unlimited: false,
        };
    }

    return {
        remaining: Math.max(0, config.limit - currentRecord.count),
        limit: config.limit,
        resetAt: currentRecord.resetAt,
        windowMs: config.windowMs,
        unlimited: false,
    };
};