import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Tag, 
  Mail, 
  Settings, 
  LogOut,
  ChevronRight,
  Send,
  MessageSquare
} from 'lucide-react';
import { Logo } from '../ui/Logo';

export const AdminSidebar = () => {
  // État pour gérer l'ouverture/fermeture du menu
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'DASHBOARD', path: '/admin/dashboard' },
    { icon: Tag, label: 'OFFRES', path: '/admin/offres' },
    { icon: FileText, label: 'BLOG', path: '/admin/blog' },
    { icon: Mail, label: 'CONTACTS', path: '/admin/contacts' },
    { icon: Send, label: 'NEWSLETTER', path: '/admin/newsletter' },
    { icon: MessageSquare, label: 'AVIS', path: '/admin/avis' },
    { icon: Users, label: 'CLIENTS', path: '/admin/users' },
  ];

  return (
    <aside 
      className={`sticky top-0 h-screen shrink-0 ${isCollapsed ? 'w-16' : 'w-20 md:w-28'} bg-primary flex flex-col py-6 relative transition-all duration-300 ease-in-out rounded-r-[2rem] shadow-2xl z-50`}
    >
      
      {/* Bouton Toggle interactif */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-primary rounded-full p-1 shadow-md border-2 border-creamy cursor-pointer hover:bg-primary/90 transition-colors z-50"
      >
        <ChevronRight 
          size={14} 
          className={`text-white transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} 
        />
      </div>

      {/* Conteneur interne pour cacher la scrollbar sans couper le bouton Toggle */}
      <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-6 shrink-0">
          <div className="bg-creamy p-1.5 rounded-full mb-1 shadow-inner">
             <Logo className="w-6 h-6" />
          </div>
          <span className={`text-white text-[9px] font-bold tracking-[0.15em] transition-all duration-300 overflow-hidden ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto'}`}>
            AMC
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 w-full flex flex-col gap-1 items-center mt-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.label : undefined} // Infobulle visible uniquement si réduit
              className={({ isActive }) =>
                `flex flex-col items-center justify-center group w-full py-2.5 transition-all ${
                  isActive ? 'bg-white/15 opacity-100' : 'opacity-60 hover:opacity-100 hover:bg-white/5'
                }`
              }
            >
              <item.icon size={18} className="text-creamy shrink-0" strokeWidth={1.5} />
              <span 
                className={`text-[8px] md:text-[9px] text-creamy font-bold text-center px-1 tracking-wider uppercase transition-all duration-300 overflow-hidden whitespace-nowrap ${
                  isCollapsed ? 'max-h-0 opacity-0 m-0' : 'max-h-6 opacity-100 mt-1'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-4 items-center border-t border-white/10 w-full pt-4 shrink-0">
          <button 
            className="opacity-60 hover:opacity-100 transition-opacity"
            title={isCollapsed ? 'Paramètres' : undefined}
          >
            <Settings size={18} className="text-creamy shrink-0" />
          </button>
          <button 
            className="bg-white/10 p-2.5 rounded-xl hover:bg-white/20 transition-all group"
            title={isCollapsed ? 'Déconnexion' : undefined}
          >
            <LogOut size={16} className="text-creamy group-hover:scale-110 transition-transform shrink-0" />
          </button>
        </div>

      </div>
    </aside>
  );
};