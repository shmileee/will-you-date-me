import { useEffect, useState } from 'react';

export interface ViewportSize {
  w: number;
  h: number;
}

function read(): ViewportSize {
  if (typeof window === 'undefined') return { w: 0, h: 0 };
  return { w: window.innerWidth, h: window.innerHeight };
}

export function useViewportSize(): ViewportSize {
  const [size, setSize] = useState<ViewportSize>(read);

  useEffect(() => {
    function onResize() {
      setSize(read());
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
}
