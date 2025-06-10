import { useEffect, useState } from 'react';

interface IframeStatus {
  isInIframe: boolean;
  isAllowed: boolean;
  parentDomain: string;
  error?: string;
  isLoading: boolean;
}

export function useIframeProtection() {
  const [status, setStatus] = useState<IframeStatus>({
    isInIframe: false,
    isAllowed: true,
    parentDomain: '',
    isLoading: true
  });

  useEffect(() => {
    const checkIframeStatus = async () => {
      try {
        // Detectar si está en iframe
        const isInIframe = window !== window.top;
        let parentDomain = '';

        if (isInIframe) {
          try {
            // Intentar obtener el dominio padre
            parentDomain = document.referrer || window.location.ancestorOrigins?.[0] || '';
          } catch (e) {
            // Cross-origin restrictions pueden impedir acceso
            parentDomain = document.referrer || '';
          }
        }

        // Consultar el estado al servidor
        const response = await fetch('/api/debug/iframe-status');
        if (response.ok) {
          const serverStatus = await response.json();
          
          setStatus({
            isInIframe: serverStatus.isInIframe || isInIframe,
            isAllowed: serverStatus.isAllowed,
            parentDomain: serverStatus.referer || parentDomain,
            isLoading: false
          });
        } else {
          // Si el endpoint no está disponible, asumir que está permitido
          setStatus({
            isInIframe,
            isAllowed: true,
            parentDomain,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Error checking iframe status:', error);
        setStatus({
          isInIframe: window !== window.top,
          isAllowed: true,
          parentDomain: document.referrer || '',
          error: 'Unable to verify iframe status',
          isLoading: false
        });
      }
    };

    checkIframeStatus();
  }, []);

  return status;
}