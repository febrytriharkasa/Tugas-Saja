import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Assalamu’alaikum! Ada yang bisa kami bantu seputar pendaftaran PPDB atau informasi sekolah?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionToken, setSessionToken] = useState(null);

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
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    message: userText,
                    session_token: sessionToken,
                }),
            });

            const data = await res.json();
            if (data.session_token) setSessionToken(data.session_token);
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
                        onClick={() => setOpen(true)}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 bg-primary hover:bg-primary-light text-white rounded-full shadow-lg flex items-center gap-2"
                        aria-label="Buka Chat AI"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="font-semibold text-sm hidden sm:inline">Tanya SMALISKA AI</span>
                    </motion.button>
                )}

                {open && (
                    <motion.div
                        key="chat-window"
                        initial={{ opacity: 0, scale: 0.85, y: 30, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 30 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[450px]"
                    >
                        <div className="bg-primary p-4 text-white flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                <span className="font-bold text-sm">SMALISKA Virtual Assistant</span>
                            </div>
                            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm bg-slate-50">
                            {messages.map((m, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] p-3 rounded-lg ${m.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>{m.text}</div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-200 p-3 rounded-lg text-slate-400 text-xs animate-pulse">
                                        Sedang mengetik...
                                    </div>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSend} className="p-2 border-t border-slate-200 bg-white flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ketik pertanyaan Anda..."
                                className="flex-1 border-slate-300 rounded-lg text-sm focus:border-primary focus:ring-primary px-3 py-2"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="p-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
