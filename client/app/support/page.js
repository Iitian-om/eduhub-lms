"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { API_BASE_URL } from "../utils/api";

const BOT_NAME = "EduBuddy";
const QUICK_PROMPTS = [
  "How do I reset my password?",
  "Where can I see my enrolled courses?",
  "How do instructors upload content?",
  "What can I do on the dashboard?",
];

export default function SupportPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const endOfMessagesRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi, I’m ${BOT_NAME}. I can help with EduHub website questions, account flow, courses, content, and platform navigation.`,
    },
  ]);
  const [prompt, setPrompt] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [rateLimit, setRateLimit] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, router, user]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (messageText) => {
    const cleanText = messageText.trim();
    if (!cleanText || sending) {
      return;
    }

    setError("");
    setSending(true);
    setMessages((current) => [...current, { role: "user", content: cleanText }]);
    setPrompt("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/support/chatbot`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: cleanText }),
      });

      const data = await response.json();

      if (!response.ok) {
        const limitNotice = data?.retryAfterSeconds
          ? ` Try again in about ${data.retryAfterSeconds} seconds.`
          : "";
        throw new Error(data?.message || `Support bot request failed.${limitNotice}`);
      }

      setRateLimit(data.rateLimit || null);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
          source: data.source,
          botName: data.botName || BOT_NAME,
        },
      ]);
    } catch (requestError) {
      setError(requestError.message || "The support bot could not answer right now.");
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I could not respond right now. Please try again in a moment.",
          source: "error",
          botName: BOT_NAME,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[radial-gradient(circle_at_top,_#e6fbfb,_#f7f9fa_55%,_#eef6f7)]">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-[#29C7C9] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading support chat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[90vh] bg-[radial-gradient(circle_at_top,_rgba(41,199,201,0.16),_transparent_35%),linear-gradient(180deg,_#f7f9fa_0%,_#eef6f7_100%)] px-4 py-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#29C7C9]">EduHub Support</p>
              <h1 className="mt-2 text-3xl font-bold text-[#22292F] sm:text-4xl">
                Chat with <span className="text-[#29C7C9]">{BOT_NAME}</span>
              </h1>
              <p className="mt-2 max-w-2xl text-gray-600">
                Ask about courses, dashboards, profiles, content uploads, or general website help. This chat is limited to EduHub-specific support.
              </p>
            </div>
            <div className="rounded-2xl border border-[#d7f2f3] bg-[#f0fbfb] px-4 py-3 text-sm text-[#0f766e]">
              <div className="font-semibold">Authenticated access</div>
              <div>Messages are rate limited to protect cost and abuse.</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <section className="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#22292F]">Conversation</h2>
                <p className="text-sm text-gray-500">Only 5 messages per window per role.</p>
              </div>
              <div className="rounded-full bg-[#e6f7f8] px-3 py-1 text-xs font-semibold text-[#0f766e]">
                {rateLimit ? `${rateLimit.remaining} of ${rateLimit.limit} left` : "Fresh session"}
              </div>
            </div>

            <div className="h-[520px] overflow-y-auto px-5 py-5">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                        message.role === "user"
                          ? "bg-[#29C7C9] text-white"
                          : "bg-slate-50 text-[#22292F] border border-slate-100"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#29C7C9]">
                          {message.botName || BOT_NAME}
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.source && message.role === "assistant" && (
                        <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                          {message.source === "faq" ? "Answered from EduHub knowledge base" : message.source === "ai" ? "Generated with Gemma via OpenRouter" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={endOfMessagesRef} />
              </div>
            </div>

            <div className="border-t border-slate-100 p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => sendMessage(item)}
                    disabled={sending}
                    className="rounded-full border border-[#d9f3f4] bg-[#f4fcfc] px-3 py-1.5 text-xs font-medium text-[#0f766e] transition hover:bg-[#e8fbfb] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <form
                className="flex flex-col gap-3 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  sendMessage(prompt);
                }}
              >
                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Ask EduBuddy anything about EduHub..."
                  rows={3}
                  className="min-h-[56px] flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#29C7C9] focus:ring-4 focus:ring-[#dff7f7]"
                />
                <button
                  type="submit"
                  disabled={sending || !prompt.trim()}
                  className="rounded-2xl bg-[#29C7C9] px-5 py-3 font-semibold text-white transition hover:bg-[#22b3b5] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>

              {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/70 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <h3 className="text-lg font-semibold text-[#22292F]">What EduBuddy can help with</h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li>Account login, registration, and profile questions</li>
                <li>Course browsing, enrollment, and progress tracking</li>
                <li>Books, notes, research papers, and upload flows</li>
                <li>Dashboard, admin, and instructor navigation</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/70 bg-[#0f172a] p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7ddfe0]">Safety and cost</p>
              <h3 className="mt-2 text-lg font-semibold">Built to stay focused</h3>
              <p className="mt-3 text-sm text-slate-300">
                The bot stays inside EduHub topics, uses a short local knowledge base first, and only calls Gemma via OpenRouter when needed.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}