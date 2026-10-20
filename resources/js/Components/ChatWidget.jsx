import { lazy, Suspense, useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

// Chatbot bukan konten kritis: chunk-nya baru diunduh saat browser idle supaya
// tidak menambah beban LCP/TBT halaman publik.
const ChatWidgetPanel = lazy(() => import('./ChatWidgetPanel'));

export default function ChatWidget() {
    const { settings = {} } = usePage().props;
    const enabled = settings.chat_enabled !== '0';
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        if ('requestIdleCallback' in window) {
            const id = window.requestIdleCallback(() => setReady(true), { timeout: 2500 });

            return () => window.cancelIdleCallback(id);
        }

        const timer = window.setTimeout(() => setReady(true), 1500);

        return () => window.clearTimeout(timer);
    }, [enabled]);

    if (!enabled || !ready) {
        return null;
    }

    return (
        <Suspense fallback={null}>
            <ChatWidgetPanel />
        </Suspense>
    );
}
