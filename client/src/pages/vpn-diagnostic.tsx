import VpnDiagnostic from '@/components/VpnDiagnostic';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VpnDiagnosticPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Formulario
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Diagnóstico de Conexión VPN
          </h1>
          <p className="text-gray-600">
            Esta herramienta te ayuda a verificar si tu conexión VPN está funcionando correctamente 
            con nuestra aplicación de carga de candidatos.
          </p>
        </div>

        <VpnDiagnostic />

        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Solución de Problemas Comunes</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-900">❌ Error: "Refused to display in a frame"</h3>
              <p className="text-gray-600 mt-1">
                Este error indica que X-Frame-Options está bloqueando el iframe. 
                Intenta cambiar el servidor VPN o contacta a soporte.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">❌ Error: "Access blocked by CORS policy"</h3>
              <p className="text-gray-600 mt-1">
                El servidor VPN está cambiando los headers de origen. 
                Prueba con una ubicación diferente en tu VPN.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">❌ Error: "Failed to fetch"</h3>
              <p className="text-gray-600 mt-1">
                Problema de conectividad general. Verifica que tu VPN permita 
                conexiones a aplicaciones web.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">✅ Recomendaciones</h3>
              <ul className="text-gray-600 mt-1 list-disc list-inside space-y-1">
                <li>Usa servidores VPN en países con buena conectividad (Estados Unidos, Canadá, Europa)</li>
                <li>Evita servidores VPN en países con restricciones de internet</li>
                <li>Si usas una VPN empresarial, contacta a tu administrador de IT</li>
                <li>Algunos proveedores VPN tienen opciones específicas para navegación web</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}