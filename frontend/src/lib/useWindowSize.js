import { useState, useEffect } from 'react';

/**
 * Hook reutilizable para detectar el ancho del viewport.
 * Útil para adaptar configuración de gráficos Recharts.
 * 
 * @returns {{ width: number, isMobile: boolean, isTablet: boolean, isDesktop: boolean }}
 */
export function useWindowSize() {
    const [size, setSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({ width: window.innerWidth });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        width: size.width,
        isMobile: size.width < 640,
        isTablet: size.width >= 640 && size.width < 1024,
        isDesktop: size.width >= 1024,
    };
}
