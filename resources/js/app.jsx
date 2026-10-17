import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './Contexts/ThemeContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Proteksi InfinityFree: jika request XHR tidak membawa cookie __test, server
// membalas halaman HTML (bukan JSON Inertia) sehingga Inertia menampilkan modal
// putih. Kita cegah modal tersebut dan arahkan user lewat full page reload agar
// browser menyelesaikan challenge cookie InfinityFree secara normal.
router.on('invalid', (event) => {
    // Cegah Inertia menampilkan modal putih default
    event.preventDefault();

    const responseUrl =
        event?.detail?.response?.request?.responseURL ||
        event?.detail?.error?.config?.url ||
        window.location.href;

    // Anti-looping: jika URL yang sama sudah pernah mengalihkan, pulangkan ke
    // halaman utama agar tidak berputar tanpa henti
    const key = `inertia-invalid-${responseUrl}`;
    try {
        if (sessionStorage.getItem(key)) {
            window.location.href = '/';
            return;
        }
        sessionStorage.setItem(key, '1');
    } catch {
        // sessionStorage tidak tersedia (sandbox) — lanjut redirect saja
    }

    // Redirect full page: cookie InfinityFree hanya bisa di-set oleh
    // navigasi browser biasa, bukan lewat XHR
    window.location.href = responseUrl;
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
