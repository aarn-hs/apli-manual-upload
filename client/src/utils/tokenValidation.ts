import { jwtVerify, createRemoteJWKSet } from "jose";

interface TokenPayload {
  iss: string;
  aud: string;
  user_id: string;
  email: string;
  email_verified: boolean;
  iat: number;
  exp: number;
  sub: string; // Firebase ID token required field
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Obtener configuración de variables de entorno
const EXPECTED_ISS = import.meta.env.VITE_FIREBASE_ISS || "https://securetoken.google.com/recruitment-azure-production";
const EXPECTED_AUD = import.meta.env.VITE_FIREBASE_AUD || "recruitment-azure-production";

// JWKS endpoint for Firebase tokens
const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));

export async function validateToken(tokenString: string): Promise<ValidationResult> {
  try {
    // Si no hay token, es inválido
    if (!tokenString || tokenString.trim() === '') {
      console.error('Token validation: No token provided');
      return {
        isValid: false,
        error: "Token no proporcionado"
      };
    }

    // Verificar y validar JWT con firma usando JWKS
    let result;
    try {
      result = await jwtVerify(tokenString, JWKS, {
        issuer: EXPECTED_ISS,
        audience: EXPECTED_AUD,
        clockTolerance: 60 // 60 segundos de tolerancia
      });
    } catch (error) {
      console.error('JWT verification failed:', error);
      return {
        isValid: false,
        error: "Token inválido o firma no verificada"
      };
    }

    const payload = result.payload as unknown as TokenPayload;

    // Verificar que todas las claves requeridas estén presentes
    const requiredKeys = ['iss', 'aud', 'user_id', 'email', 'email_verified', 'iat', 'exp', 'sub'];
    for (const key of requiredKeys) {
      if (!(key in payload)) {
        console.error(`Missing required claim: ${key}`);
        return {
          isValid: false,
          error: "Token incompleto"
        };
      }
    }

    // Validar que email_verified sea true
    if (payload.email_verified !== true) {
      console.error('Email not verified');
      return {
        isValid: false,
        error: "Email no verificado"
      };
    }

    // Validar que sub === user_id (requerimiento Firebase)
    if (payload.sub !== payload.user_id) {
      console.error('Subject mismatch: sub !== user_id');
      return {
        isValid: false,
        error: "Token inválido"
      };
    }

    // Si todas las validaciones pasan
    return {
      isValid: true
    };

  } catch (error) {
    console.error('Unexpected token validation error:', error);
    return {
      isValid: false,
      error: "Error de validación"
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