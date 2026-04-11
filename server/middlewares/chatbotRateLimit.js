const RATE_LIMITS = {
    User: {
        limit: 5,
        windowMs: 30 * 60 * 1000,
    },
    Instructor: {
        limit: 5,
        windowMs: 60 * 60 * 1000,
    },
    Admin: {
        limit: 5,
        windowMs: 30 * 60 * 1000,
    },
    Mod: {
        limit: 5,
        windowMs: 30 * 60 * 1000,
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

    // Key by user and role so role window changes apply predictably.
    const key = `${userId}:${role}`;
    const currentRecord = usageStore.get(key);

    if (!currentRecord || currentRecord.resetAt <= now) {
        usageStore.set(key, {
            count: 1,
            resetAt: now + config.windowMs,
        });

        req.chatbotRateLimit = {
            remaining: config.limit - 1,
            limit: config.limit,
            resetAt: now + config.windowMs,
            windowMs: config.windowMs,
        };

        return next();
    }

    if (currentRecord.count >= config.limit) {
        const retryAfterSeconds = Math.max(1, Math.ceil((currentRecord.resetAt - now) / 1000));

        return res.status(429).json({
            success: false,
            message: "You have reached the chatbot message limit. Please try again later.",
            retryAfterSeconds,
            resetAt: currentRecord.resetAt,
        });
    }

    currentRecord.count += 1;
    usageStore.set(key, currentRecord);

    req.chatbotRateLimit = {
        remaining: config.limit - currentRecord.count,
        limit: config.limit,
        resetAt: currentRecord.resetAt,
        windowMs: config.windowMs,
    };

    return next();
};