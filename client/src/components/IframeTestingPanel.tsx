import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface TestingStatus {
  isInIframe: boolean;
  referer: string;
  origin: string;
  host: string;
  isAllowed: boolean;
  allowedDomains: string[];
  blockLocalhost: boolean;
  isLocalhost: boolean;
  testingMode: boolean;
}

export default function IframeTestingPanel() {
  const [status, setStatus] = useState<TestingStatus | null>(null);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [testDomain, setTestDomain] = useState('https://ejemplo.com');

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/debug/iframe-status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching iframe status:', error);
    }
  };

  const simulateIframe = async (domain: string) => {
    try {
      const response = await fetch(`/api/test/simulate-iframe?referrer=${encodeURIComponent(domain)}&origin=${encodeURIComponent(domain)}`);
      if (response.ok) {
        const data = await response.json();
        setSimulationResult(data);
      }
    } catch (error) {
      console.error('Error simulating iframe:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (!status?.testingMode) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg max-w-md z-50">
      <div className="mb-3">
        <h3 className="font-bold text-sm text-blue-700 mb-2">🔧 Iframe Testing Panel</h3>
        
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>En iframe:</span>
            <span className={status.isInIframe ? 'text-green-600' : 'text-red-600'}>
              {status.isInIframe ? 'Sí' : 'No'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Permitido:</span>
            <span className={status.isAllowed ? 'text-green-600' : 'text-red-600'}>
              {status.isAllowed ? 'Sí' : 'No'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Referer:</span>
            <span className="text-gray-600 truncate max-w-32" title={status.referer}>
              {status.referer || 'N/A'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Localhost:</span>
            <span className={status.isLocalhost ? 'text-orange-600' : 'text-green-600'}>
              {status.isLocalhost ? 'Sí' : 'No'}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t pt-2 space-y-2">
        <div>
          <label className="text-xs font-medium">Probar dominio:</label>
          <input
            type="text"
            value={testDomain}
            onChange={(e) => setTestDomain(e.target.value)}
            className="w-full text-xs border rounded px-2 py-1 mt-1"
            placeholder="https://ejemplo.com"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => simulateIframe(testDomain)}
            className="text-xs flex-1"
          >
            Simular
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchStatus}
            className="text-xs flex-1"
          >
            Refrescar
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => simulateIframe('https://portal.empresa.com')}
            className="text-xs flex-1"
          >
            Test Permitido
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => simulateIframe('https://malicioso.com')}
            className="text-xs flex-1"
          >
            Test Bloqueado
          </Button>
        </div>
      </div>

      {simulationResult && (
        <div className="border-t pt-2 mt-2">
          <div className="text-xs">
            <div className="font-medium mb-1">Resultado de simulación:</div>
            <div className={`p-2 rounded text-xs ${
              simulationResult.isAllowed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {simulationResult.message}
            </div>
            <div className="mt-1 text-gray-500">
              Dominio: {simulationResult.referrer}
            </div>
          </div>
        </div>
      )}

      {status.allowedDomains.length > 0 && (
        <div className="border-t pt-2 mt-2">
          <div className="text-xs">
            <div className="font-medium mb-1">Dominios permitidos:</div>
            <div className="space-y-1">
              {status.allowedDomains.map((domain, i) => (
                <div key={i} className="text-green-600 truncate" title={domain}>
                  {domain}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}