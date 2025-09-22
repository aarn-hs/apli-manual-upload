import { AlertTriangle } from "lucide-react";

interface UnauthorizedScreenProps {
  error?: string;
}

export default function UnauthorizedScreen({ error }: UnauthorizedScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto text-center p-6">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Acceso No Autorizado
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No tienes permisos para acceder a esta aplicación. 
          Verifica que el enlace sea correcto y que tengas un token válido.
        </p>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
            <p className="text-red-700 dark:text-red-300 text-sm">
              <strong>Detalles del error:</strong> {error}
            </p>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Si crees que esto es un error, contacta al administrador del sistema.
        </div>
      </div>
    </div>
  );
}