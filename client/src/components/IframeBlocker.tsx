export default function IframeBlocker({ children }: { children: React.ReactNode }) {
  // Deshabilitado durante desarrollo
  return <>{children}</>;
}