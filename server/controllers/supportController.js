import { consumeAiChatQuota, getChatbotRateLimitStatus } from "../middlewares/chatbotRateLimit.js";

// FAQ-first support bot controller for EduHub.
const SUPPORT_KNOWLEDGE_BASE = [
    {
        keywords: ["login", "sign in", "log in", "password", "register", "signup", "sign up"],
        answer: "Use the Login or Register pages to access your EduHub account. If you cannot sign in, check that your email and password match the account you created and reset your password from the login flow if that option is available.",
    },
    {
        keywords: ["profile", "account", "edit profile", "change name", "change photo"],
        answer: "You can update your profile from the Profile section after signing in. Profile edits are handled through the authenticated user routes, so make sure you are logged in before trying to save changes.",
    },
    {
        keywords: ["course", "courses", "enroll", "enrollment", "progress"],
        answer: "EduHub supports course browsing, enrollment, and progress tracking. Check the Courses page to explore available courses and your dashboard for enrollment or progress-related actions.",
    },
    {
        keywords: ["book", "books", "note", "notes", "research paper", "paper", "upload"],
        answer: "EduHub includes content areas for books, notes, and research papers, with upload and management features for authorized users. If you are looking for a specific content type, use the matching section in the app.",
    },
    {
        keywords: ["admin", "instructor", "dashboard", "analytics", "reports"],
        answer: "Admins and instructors have dedicated dashboards for managing users, content, analytics, and platform activity. Access depends on your role after login.",
    },
    {
        keywords: ["payment", "payments", "checkout", "refund", "razorpay"],
        answer: "Payment integration is planned in the project roadmap. If you are asking about a live payment flow, that part may still be under development.",
    },
    {
        keywords: ["contact", "support", "help", "faq"],
        answer: "For site help, use this support bot for quick guidance or the Contact page for general questions. If you need account-specific help, log in first so the backend can verify your session.",
    },
];

const MAX_MESSAGE_LENGTH = 500;
const SUPPORT_BOT_NAME = process.env.SUPPORT_BOT_NAME || "EduBuddy";
const SUPPORT_BOT_SYSTEM_CONTEXT = process.env.SUPPORT_BOT_SYSTEM_CONTEXT ||
    "You are EduHub's support assistant. Help only with EduHub usage and refuse unrelated requests.";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const PRIMARY_MODEL = process.env.AI_MODEL || "google/gemma-2-9b-it";
const FALLBACK_MODEL = "google/gemma-3-27b-it";
const TIMEOUT_MS = 10000;
const PROVIDER_FALLBACK_ANSWER = "AI assistant is temporarily unavailable. I can still help with EduHub basics like login, dashboard, courses, and uploads.";

const normalizeText = (value) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const getKeywordScore = (message, keywords) => {
    return keywords.reduce((score, keyword) => {
        return message.includes(keyword) ? score + 1 : score;
    }, 0);
};

const findKnowledgeBaseAnswer = (message) => {
    const normalizedMessage = normalizeText(message);
    let bestMatch = null;
    let bestScore = 0;

    for (const entry of SUPPORT_KNOWLEDGE_BASE) {
        const score = getKeywordScore(normalizedMessage, entry.keywords);
        if (score > bestScore) {
            bestScore = score;
            bestMatch = entry.answer;
        }
    }

    return bestScore > 0 ? bestMatch : null;
};

const buildSystemPrompt = () => {
    return [
        `You are ${SUPPORT_BOT_NAME}, an EduHub website ai assistant.`,
        "Answer only EduHub LMS questions and keep replies concise.",
        "Politely refuse unrelated prompts and never reveal secrets or private data.",
        SUPPORT_BOT_SYSTEM_CONTEXT,
    ].join(" ");
};

const parseProviderError = (status, responseText) => {
    let parsedError;
    try {
        parsedError = JSON.parse(responseText);
    } catch {
        parsedError = null;
    }

    const providerCode = parsedError?.error?.code || null;
    const providerType = parsedError?.error?.type || null;
    const providerMessage = parsedError?.error?.message || responseText;

    const aiError = new Error(`AI service request failed with ${status}: ${providerMessage}`);
    aiError.status = status;
    aiError.providerCode = providerCode;
    aiError.providerType = providerType;
    aiError.providerMessage = providerMessage;
    return aiError;
};

const shouldRetryWithFallbackModel = (error) => {
    const status = error?.status;
    const code = (error?.providerCode || "").toLowerCase();
    const type = (error?.providerType || "").toLowerCase();
    const message = (error?.providerMessage || "").toLowerCase();

    if (status === 404) return true;
    if (status === 400 && (message.includes("model") || code.includes("model") || type.includes("model"))) return true;
    if (code === "model_not_found") return true;
    return false;
};

const isProviderUnavailableError = (error) => {
    const status = error?.status;
    const code = (error?.providerCode || "").toLowerCase();
    const type = (error?.providerType || "").toLowerCase();

    return (
        status === 401 ||
        status === 403 ||
        status === 429 ||
        code === "insufficient_quota" ||
        type === "insufficient_quota" ||
        code === "invalid_api_key" ||
        type === "invalid_api_key"
    );
};

const requestCompletion = async ({ apiKey, model, message }) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        console.info(`[support-bot] Requesting model: ${model}`);

        const response = await fetch(OPENROUTER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: "system", content: buildSystemPrompt() },
                    { role: "user", content: message },
                ],
                temperature: 0.2,
                max_tokens: 200,
            }),
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw parseProviderError(response.status, errorText);
        }

        const data = await response.json();
        if (data?.usage) {
            console.info("[support-bot] usage:", data.usage);
        }

        const answer = data?.choices?.[0]?.message?.content?.trim();

        if (!answer) {
            throw new Error("AI service returned an empty response");
        }

        return { answer, model };
    } finally {
        clearTimeout(timeoutId);
    }
};

const callAiAssistant = async (message) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        console.warn("No OPENROUTER_API_KEY configured for support assistant.");
        return null;
    }

    try {
        return await requestCompletion({ apiKey, model: PRIMARY_MODEL, message });
    } catch (error) {
        if (!shouldRetryWithFallbackModel(error)) {
            throw error;
        }

        console.warn(`[support-bot] Primary model failed, retrying with fallback model ${FALLBACK_MODEL}. Reason:`, error?.message || error);
        return requestCompletion({ apiKey, model: FALLBACK_MODEL, message });
    }
};

export const getSupportBotReply = async (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({
            success: false,
            message: "Please send a support question.",
        });
    }

    const trimmedMessage = message.trim();

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
        return res.status(400).json({
            success: false,
            message: `Please keep your question under ${MAX_MESSAGE_LENGTH} characters.`,
        });
    }

    // Prefer local answers first to reduce latency and provider cost.
    const localAnswer = findKnowledgeBaseAnswer(trimmedMessage);
    if (localAnswer) {
        return res.status(200).json({
            success: true,
            source: "faq",
            answer: localAnswer,
            botName: SUPPORT_BOT_NAME,
            rateLimit: req.chatbotRateLimit || getChatbotRateLimitStatus(req.user),
        });
    }

    const quotaResult = consumeAiChatQuota(req.user);
    if (!quotaResult?.allowed) {
        return res.status(quotaResult.status || 429).json({
            success: false,
            message: quotaResult.message || "You have reached the AI chatbot message limit. Please try again later.",
            retryAfterSeconds: quotaResult.retryAfterSeconds,
            resetAt: quotaResult.resetAt,
            rateLimit: quotaResult.rateLimit,
        });
    }

    const aiRateLimit = quotaResult.rateLimit;

    const hasAiKey = Boolean(process.env.OPENROUTER_API_KEY);
    if (!hasAiKey) {
        return res.status(200).json({
            success: true,
            source: "fallback",
            answer: PROVIDER_FALLBACK_ANSWER,
            botName: SUPPORT_BOT_NAME,
            rateLimit: aiRateLimit,
        });
    }

    try {
        const aiResult = await callAiAssistant(trimmedMessage);
        const aiAnswer = aiResult?.answer;

        if (aiAnswer) {
            return res.status(200).json({
                success: true,
                source: "ai",
                answer: aiAnswer,
                botName: SUPPORT_BOT_NAME,
                rateLimit: aiRateLimit,
            });
        }
    } catch (error) {
        console.error("Support bot AI request failed:", error?.message || error);

        if (error?.name === "AbortError" || isProviderUnavailableError(error)) {
            return res.status(200).json({
                success: true,
                source: "fallback",
                answer: PROVIDER_FALLBACK_ANSWER,
                botName: SUPPORT_BOT_NAME,
                rateLimit: aiRateLimit,
            });
        }

        return res.status(503).json({
            success: false,
            message: "Support assistant is temporarily unavailable.",
            fallback: "Ask a short EduHub-specific question, or configure OPENROUTER_API_KEY for live AI responses.",
            botName: SUPPORT_BOT_NAME,
            reason: process.env.NODE_ENV === "development" ? (error?.message || "Unknown AI service error") : undefined,
            rateLimit: aiRateLimit,
        });
    }

    return res.status(503).json({
        success: false,
        message: "Support assistant is temporarily unavailable.",
        fallback: "Ask a short EduHub-specific question, or configure OPENROUTER_API_KEY for live AI responses.",
        botName: SUPPORT_BOT_NAME,
        rateLimit: aiRateLimit,
    });
};