export default function IframeBlocker({ children }: { children: React.ReactNode }) {
  // Deshabilitado completamente para desarrollo - siempre permitir acceso
  return <>{children}</>;
}