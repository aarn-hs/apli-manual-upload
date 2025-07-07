import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, RefreshCw, Wifi } from 'lucide-react';

interface DiagnosticResult {
  success: boolean;
  clientIP: string;
  headers: Record<string, string>;
  timestamp: string;
  testingMode: boolean;
  allowedDomains: string[];
  error?: string;
}

export default function VpnDiagnostic() {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostic = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/vpn-test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Diagnostic error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (loading) return <Badge variant="secondary"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Diagnosticando...</Badge>;
    if (error) return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
    if (result?.success) return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Funcionando</Badge>;
    return <Badge variant="outline"><Wifi className="w-3 h-3 mr-1" />Sin probar</Badge>;
  };

  const isVpnDetected = () => {
    if (!result) return false;
    const forwarded = result.headers['x-forwarded-for'];
    const realIp = result.headers['x-real-ip'];
    return !!(forwarded || realIp);
  };

  useEffect(() => {
    // Ejecutar diagnóstico automáticamente al cargar
    runDiagnostic();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              Diagnóstico de Conexión VPN
            </CardTitle>
            <CardDescription>
              Verifica si tu conexión VPN está funcionando correctamente con nuestra aplicación
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Estado de la conexión:</span>
          <Button onClick={runDiagnostic} disabled={loading} size="sm">
            {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {loading ? 'Probando...' : 'Probar Conexión'}
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Error de Conexión</span>
            </div>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <p className="text-xs text-red-600 mt-2">
              Esto puede ocurrir si estás usando una VPN que bloquea ciertos tipos de conexiones.
              Intenta cambiar la ubicación de tu servidor VPN o desconectarte temporalmente.
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">IP del Cliente:</span>
                <p className="text-gray-600">{result.clientIP}</p>
              </div>
              <div>
                <span className="font-medium">VPN Detectada:</span>
                <p className="text-gray-600">
                  {isVpnDetected() ? (
                    <span className="text-blue-600">Sí (usando proxy/VPN)</span>
                  ) : (
                    <span className="text-green-600">No (conexión directa)</span>
                  )}
                </p>
              </div>
              <div>
                <span className="font-medium">Modo de Prueba:</span>
                <p className="text-gray-600">
                  {result.testingMode ? (
                    <span className="text-orange-600">Activado (desarrollo)</span>
                  ) : (
                    <span className="text-blue-600">Desactivado (producción)</span>
                  )}
                </p>
              </div>
              <div>
                <span className="font-medium">Última Prueba:</span>
                <p className="text-gray-600">
                  {new Date(result.timestamp).toLocaleString('es-ES')}
                </p>
              </div>
            </div>

            {result.headers && Object.keys(result.headers).length > 0 && (
              <div>
                <span className="font-medium text-sm">Headers de Conexión:</span>
                <div className="mt-2 bg-gray-50 p-3 rounded-md text-xs space-y-1 max-h-40 overflow-y-auto">
                  {Object.entries(result.headers).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex">
                        <span className="font-mono text-gray-500 w-32 shrink-0">{key}:</span>
                        <span className="font-mono text-gray-800 break-all">{value}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {result.success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Conexión Exitosa</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Tu conexión VPN está funcionando correctamente con nuestra aplicación.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Este diagnóstico verifica la conectividad entre tu VPN y nuestros servidores</p>
          <p>• Si experimentas problemas, intenta cambiar la ubicación de tu servidor VPN</p>
          <p>• Algunos proveedores de VPN pueden requerir configuración adicional para aplicaciones web</p>
        </div>
      </CardContent>
    </Card>
  );
}