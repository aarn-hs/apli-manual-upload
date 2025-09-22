import { useState, useEffect } from "react";
import { validateToken, getTokenFromUrl } from "@/utils/tokenValidation";

interface UseTokenValidationResult {
  isValid: boolean;
  loading: boolean;
  error?: string;
}

export function useTokenValidation(): UseTokenValidationResult {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const performValidation = async () => {
      try {
        // Extraer token de la URL
        const token = getTokenFromUrl();
        
        if (!token) {
          setIsValid(false);
          setError("Token no encontrado en los parámetros de la URL");
          setLoading(false);
          return;
        }

        // Validar el token (función ahora es async)
        const validationResult = await validateToken(token);
        
        setIsValid(validationResult.isValid);
        setError(validationResult.error);
        setLoading(false);
      } catch (err) {
        setIsValid(false);
        setError("Error inesperado durante la validación");
        setLoading(false);
        console.error("Error en useTokenValidation:", err);
      }
    };

    performValidation();
  }, []); // Solo se ejecuta al montar el componente

  return { isValid, loading, error };
}