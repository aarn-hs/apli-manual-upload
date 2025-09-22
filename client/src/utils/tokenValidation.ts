import { decodeJwt } from "jose";

interface TokenPayload {
  iss: string;
  aud: string;
  user_id: string;
  email: string;
  email_verified: boolean;
  iat: number;
  exp: number;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const EXPECTED_ISS = "https://securetoken.google.com/recruitment-azure-production";
const EXPECTED_AUD = "recruitment-azure-production";

export function validateToken(tokenString: string): ValidationResult {
  try {
    // Si no hay token, es inválido
    if (!tokenString || tokenString.trim() === '') {
      return {
        isValid: false,
        error: "Token no proporcionado"
      };
    }

    // Decodificar el JWT (sin validar firma)
    let payload: TokenPayload;
    try {
      payload = decodeJwt(tokenString) as TokenPayload;
    } catch (error) {
      return {
        isValid: false,
        error: "Token malformado o inválido"
      };
    }

    // Verificar que todas las claves requeridas estén presentes
    const requiredKeys = ['iss', 'aud', 'user_id', 'email', 'email_verified', 'iat', 'exp'];
    for (const key of requiredKeys) {
      if (!(key in payload)) {
        return {
          isValid: false,
          error: `Clave requerida '${key}' no encontrada en el token`
        };
      }
    }

    // Validar issuer
    if (payload.iss !== EXPECTED_ISS) {
      return {
        isValid: false,
        error: `Issuer inválido. Esperado: ${EXPECTED_ISS}, Recibido: ${payload.iss}`
      };
    }

    // Validar audience
    if (payload.aud !== EXPECTED_AUD) {
      return {
        isValid: false,
        error: `Audience inválido. Esperado: ${EXPECTED_AUD}, Recibido: ${payload.aud}`
      };
    }

    // Validar expiración
    const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    if (payload.exp <= currentTime) {
      return {
        isValid: false,
        error: "Token expirado"
      };
    }

    // Si todas las validaciones pasan
    return {
      isValid: true
    };

  } catch (error) {
    return {
      isValid: false,
      error: `Error inesperado al validar el token: ${error}`
    };
  }
}

export function getTokenFromUrl(): string | null {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token');
  } catch (error) {
    console.error('Error al extraer token de la URL:', error);
    return null;
  }
}