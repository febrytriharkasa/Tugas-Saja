import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const SESSION_KEY = 'chat_session_token';

export default function ChatWidgetPanel() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Assalamu’alaikum! Ada yang bisa kami bantu seputar pendaftaran PPDB atau informasi sekolah?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionToken, setSessionToken] = useState(() => {
        try {
            return window.sessionStorage.getItem(SESSION_KEY);
        } catch {
            return null;
        }
    });
    const scrollRef = useRef(null);

    useEffect(() => {
        if (!sessionToken) return;

        let cancelled = false;

        fetch(`/api/chat/history?session_token=${encodeURIComponent(sessionToken)}`, {
            headers: { Accept: 'application/json' },
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (cancelled || !data?.messages?.length) return;
                setMessages((prev) => [
                    ...prev,
                    ...data.messages.map((m) => ({ role: m.role, text: m.content })),
                ]);
            })
            .catch(() => {
                // Riwayat gagal dimuat — biarkan sapaan saja, chat tetap bisa dipakai.
            });

        return () => { cancelled = true; };
    }, [sessionToken]);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages, loading, open]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userText = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', text: userText }]);
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    message: userText,
                    session_token: sessionToken,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessages((prev) => [...prev, {
                    role: 'assistant',
                    text: data.message || 'Mohon maaf, terjadi gangguan. Silakan coba lagi.',
                }]);
                return;
            }

            if (data.session_token && data.session_token !== sessionToken) {
                setSessionToken(data.session_token);
                try {
                    window.sessionStorage.setItem(SESSION_KEY, data.session_token);
                } catch {
                    // Penyimpanan browser tidak tersedia — sesi baru tiap kirim.
                }
            }

            setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
        } catch (err) {
            setMessages((prev) => [...prev, { role: 'assistant', text: 'Mohon maaf, terjadi gangguan koneksi. Silakan coba lagi.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence mode="wait">
                {!open && (
                    <motion.button
                        key="chat-trigger"
                        type="button"
                        onClick={() => setOpen(true)}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                        className="flex items-center gap-2 rounded-full bg-primary p-4 text-white shadow-lg transition hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="sr-only text-sm font-semibold sm:not-sr-only sm:inline">Tanya SMA XYZ AI</span>
                    </motion.button>
                )}

                {open && (
                    <motion.div
                        key="chat-window"
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 30 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        style={{ transformOrigin: 'bottom right' }}
                        className="flex h-[450px] w-80 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl sm:w-96"
                    >
                        <div className="flex items-center justify-between bg-primary p-4 text-white">
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
                                <span className="text-sm font-bold">SMA XYZ Virtual Assistant</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Tutup chat"
                                className="rounded text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4 text-sm" aria-live="polite">
                            {messages.map((m, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.22, ease: 'easeOut' }}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] rounded-lg p-3 ${m.role === 'user' ? 'rounded-br-none bg-primary text-white' : 'rounded-bl-none border border-slate-200 bg-white text-slate-800 shadow-sm'}`}>{m.text}</div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-500 animate-pulse">
                                        Sedang mengetik...
                                    </div>
                                </div>
                            )}
                            <p className="text-center text-[10px] text-slate-400">Jangan kirim data pribadi ke asisten ini.</p>
                        </div>

                        <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-200 bg-white p-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ketik pertanyaan Anda..."
                                aria-label="Tulis pertanyaan"
                                className="flex-1 rounded-lg border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                aria-label="Kirim pesan"
                                className="rounded-lg bg-primary p-2 text-white transition hover:bg-primary-light disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
