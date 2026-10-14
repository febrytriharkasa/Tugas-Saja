import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    DEFAULT: '#065F46',
                    light: '#047857',
                    dark: '#004532',
                    container: '#065F46',
                    fixed: '#A6F2D1',
                    'fixed-dim': '#8BD6B6',
                },
                secondary: {
                    DEFAULT: '#006780',
                    light: '#06B6D4',
                    dark: '#0E7490',
                    container: '#76DCFF',
                    fixed: '#B7EAFF',
                },
                tertiary: {
                    DEFAULT: '#D97706',
                    light: '#F59E0B',
                    dark: '#5E3000',
                    container: '#804300',
                },
                surface: {
                    DEFAULT: '#FAF8FF',
                    dim: '#D2D9F4',
                    bright: '#FAF8FF',
                    'container-low': '#F2F3FF',
                    container: '#EAEDFF',
                    'container-high': '#E2E7FF',
                    'container-highest': '#DAE2FD',
                },
                canvas: '#F8FAFC',
                slate: {
                    850: '#0F172A',
                },
            },
            borderRadius: {
                sm: '0.25rem',
                DEFAULT: '0.5rem',
                md: '0.75rem',
                lg: '1rem',
                xl: '1.5rem',
            },
            boxShadow: {
                'card': '0 4px 12px -2px rgba(15, 23, 42, 0.04)',
                'card-hover': '0 12px 24px -4px rgba(6, 95, 70, 0.08)',
            },
        },
    },

    plugins: [forms],
};
