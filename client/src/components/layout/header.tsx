import { Link } from "wouter";

export default function Header() {
  return (
    <header className="bg-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="title text-black">Apli</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/" className="body-text hover:text-azure">Inicio</Link></li>
            <li><Link href="/candidates" className="body-text hover:text-azure">Candidatos</Link></li>
            <li><Link href="/reports" className="body-text hover:text-azure">Reportes</Link></li>
            <li><Link href="/settings" className="body-text hover:text-azure">Configuración</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
