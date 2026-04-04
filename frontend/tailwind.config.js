/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        screens: {
            'xs': '320px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        },
        extend: {
            colors: {
                // Paleta oficial Federación Nacional de Cafeteros (Mantenida por compatibilidad)
                fnc: {
                    50: '#FEF2F4',
                    100: '#FDE6EA',
                    200: '#FAC0CB',
                    300: '#F591A0',
                    400: '#ED6075',
                    500: '#D4273D',
                    600: '#A10F2A',
                    700: '#7E0B21',
                    800: '#60091A',
                    900: '#3F0611',
                    950: '#220309',
                },
                charcoal: {
                    50: '#F3F4F5',
                    100: '#E7E9EB',
                    200: '#C3C7CC',
                    300: '#9AA0A9',
                    400: '#6D7682',
                    500: '#4A525C',
                    600: '#353C45',
                    700: '#23282D',
                    800: '#191D21',
                    900: '#0E1114',
                },
                // Estilo skills.sh (Terminal Dark)
                bg: {
                    base: '#0a0a0a',
                    surface: '#111111',
                    elevated: '#1a1a1a',
                    muted: '#222222',
                },
                text: {
                    primary: '#f0f0f0',
                    secondary: '#888888',
                    muted: '#444444',
                    accent: '#ffffff',
                },
                border: {
                    default: '#1f1f1f',
                    strong: '#333333',
                },
                accent: {
                    primary: '#e5e5e5',
                    dim: '#555555',
                }
            },
            fontFamily: {
                mono: [
                    'JetBrains Mono',
                    'Fira Code',
                    'ui-monospace',
                    'SF Mono',
                    'monospace',
                ],
            },
            borderRadius: {
                DEFAULT: '4px',
                md: '6px',
                lg: '8px',
            },
        },
    },
    plugins: [],
}
