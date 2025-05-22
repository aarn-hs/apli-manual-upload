import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="important mb-4">Apli</h3>
            <p className="body-text">Sistema de gestión de candidatos para empresas de retail.</p>
          </div>
          <div>
            <h3 className="important mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="body-text hover:text-blue">Inicio</Link></li>
              <li><Link href="/candidates" className="body-text hover:text-blue">Candidatos</Link></li>
              <li><Link href="/reports" className="body-text hover:text-blue">Reportes</Link></li>
              <li><Link href="/help" className="body-text hover:text-blue">Ayuda</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="important mb-4">Contacto</h3>
            <p className="body-text">soporte@apli.com</p>
            <p className="body-text">+52 55 1234 5678</p>
          </div>
        </div>
        <div className="border-t border-dark-grey mt-8 pt-4">
          <p className="small-text text-center">© {new Date().getFullYear()} Apli. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
