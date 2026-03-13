import { Link } from 'react-router-dom';
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'Acerca de', to: '/about' },
      { label: 'Contacto', to: '/contact' },
      { label: 'Blog', to: '/blog' },
    ],
    help: [
      { label: 'Cómo publicar', to: '/help/publish' },
      { label: 'Preguntas frecuentes', to: '/faq' },
      { label: 'Términos y condiciones', to: '/terms' },
      { label: 'Privacidad', to: '/privacy' },
    ],
    explore: [
      { label: 'Todos los vehículos', to: '/vehicles' },
      { label: 'Marcas populares', to: '/vehicles?brands=popular' },
      { label: 'Últimas publicaciones', to: '/vehicles?sort=recent' },
    ],
  };

  return (
    <footer className="bg-dark-950 text-gray-300 border-t-2 border-warning-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img
                src="/logo_movile.png"
                alt="Autico"
                className="h-14 w-auto md:hidden"
              />
              <img
                src="/logo_web.png"
                alt="Autico"
                className="hidden md:block h-16 w-auto"
              />
            </div>
            <p className="text-sm text-gray-400 mb-4">
              La plataforma profesional para comprar y vender vehículos de forma segura y confiable.
            </p>
            <div className="flex space-x-3">
              <a href="https://www.linkedin.com/in/robert-quesada-b7a375215/" target="_blank" rel="noopener noreferrer" 
                className="w-9 h-9 bg-dark-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-4">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm hover:text-warning-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white font-bold mb-4">Ayuda</h3>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm hover:text-warning-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm">
                <Mail className="w-4 h-4 mt-0.5 text-warning-400" />
                <span>rquesadaqq@outlook.com</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <Phone className="w-4 h-4 mt-0.5 text-warning-400" />
                <span>+506 6043 7458</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-warning-400" />
                <span>Quesada, Alajuela, Costa Rica</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-dark-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {currentYear} Autico. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-warning-400 transition-colors">
              Privacidad
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-warning-400 transition-colors">
              Términos
            </Link>
            <Link to="/cookies" className="text-sm text-gray-500 hover:text-warning-400 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
