import React, { useEffect, useMemo, useRef, useState } from 'react';

const GOOGLE_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

function normalizeGeminiParts(parts) {
  if (!Array.isArray(parts)) return [];
  return parts
    .map((p) => {
      if (!p) return '';
      if (typeof p.text === 'string') return p.text;
      return '';
    })
    .filter(Boolean);
}

export default function GeminiChat({ className = '' }) {
  const [messages, setMessages] = useState(() => [
    {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      role: 'assistant',
      content: 'How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const listRef = useRef(null);
  const inputRef = useRef(null);

  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  const canSend = useMemo(() => {
    return !isLoading && input.trim().length > 0;
  }, [isLoading, input]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;
    if (isLoading) return;

    setError('');
    setIsLoading(true);
    setInput('');

    const userMsg = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      role: 'user',
      content: text,
    };
    const assistantMsgId = crypto.randomUUID?.() ?? `${Date.now()}-a`;

    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
      },
    ]);

    try {
      if (!apiKey) {
        throw new Error('Missing REACT_APP_GEMINI_API_KEY in your .env file.');
      }

      const history = [...messages, userMsg].slice(-8);
      const payload = {
        contents: history.map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 1024,
        },
      };

      const res = await fetch(`${GOOGLE_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`Gemini API error: ${res.status} ${txt}`);
      }

      const data = await res.json();
      const textParts = data?.candidates?.[0]?.content?.parts ?? [];
      const parts = normalizeGeminiParts(textParts);
      const finalText = parts.join('') || '';

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMsgId ? { ...m, content: finalText } : m))
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId ? { ...m, content: 'Sorry — something went wrong.' } : m
        )
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus?.();
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) sendMessage();
    }
  }

  return (
    <div className={className}>
      <div className="chatHeader" aria-hidden="true">
        <div className="chatHeaderLeft">
          <div className="chatBrand" />
        </div>
      </div>

      <div ref={listRef} className="chatMessages" role="log" aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'msgRow msgUser' : 'msgRow msgAssistant'}>
            <div className="msgBubble">
              <div className="msgText">{m.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="msgRow msgAssistant">
            <div className="msgBubble">
              <div className="msgText">
                <span className="typingDot" />
                <span className="typingDot" />
                <span className="typingDot" />
              </div>
            </div>
          </div>
        )}
      </div>

      {error ? <div className="chatError">{error}</div> : null}

      <div className="composer">
        <textarea
          ref={inputRef}
          className="composerInput"
          value={input}
          rows={1}
          placeholder="Message Gemini…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isLoading}
        />
        <button className="composerSend" onClick={sendMessage} disabled={!canSend} aria-label="Send">
          <img className="composerSendIcon" alt="send" src={new URL('./assets/send.svg', import.meta.url).toString()} />
        </button>
      </div>
    </div>
  );
}

