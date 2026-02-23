/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Paleta oficial Federación Nacional de Cafeteros
                fnc: {
                    50: '#FEF2F4',
                    100: '#FDE6EA',
                    200: '#FAC0CB',
                    300: '#F591A0',
                    400: '#ED6075',
                    500: '#D4273D',
                    600: '#A10F2A',   // 🔴 Rojo FNC principal
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
                    700: '#23282D',   // 🔲 Carbón FNC
                    800: '#191D21',
                    900: '#0E1114',
                },
            },
        },
    },
    plugins: [],
}
