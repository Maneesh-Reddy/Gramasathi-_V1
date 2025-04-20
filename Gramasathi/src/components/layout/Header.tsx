import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Heart, BookOpen, Leaf, Tractor, FileText, Briefcase, HeartHandshake, User, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/AuthContext';
import { useVoiceContext } from '../../hooks/VoiceContext';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { speak } = useVoiceContext();

  // Toggle language between English (en) and Telugu (te)
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'te' : 'en';
    i18n.changeLanguage(newLang); // Change language
  };

  // Toggle mobile menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    closeMenu();
    speak(t('common.loggedOut'));
  };

  // Navigation items with dynamic translation
  const navigationItems = [
    { name: t('nav.health'), path: '/health', icon: <Heart size={20} /> },
    { name: t('nav.edu'), path: '/edu', icon: <BookOpen size={20} /> },
    { name: t('nav.krishi'), path: '/krishi', icon: <Tractor size={20} /> },
    { name: t('nav.grievance'), path: '/grievance', icon: <FileText size={20} /> },
    { name: t('nav.eco'), path: '/eco', icon: <Leaf size={20} /> },
    { name: t('nav.rozgar'), path: '/rozgar', icon: <Briefcase size={20} /> },
    { name: t('nav.charity'), path: '/charity', icon: <HeartHandshake size={20} /> },
  ];

  return (
    <header className="bg-primary-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <Home className="h-8 w-8 mr-2" />
              <span className="font-heading font-bold text-xl">GramaSathi</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-primary-700 transition-colors
                  ${pathname === item.path ? 'bg-primary-700' : ''}`}
              >
                {item.icon}
                <span className="ml-1">{item.name}</span>
              </Link>
            ))}

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="flex items-center ml-4 relative group">
                <Link
                  to="/profile"
                  className="px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-primary-700 transition-colors"
                >
                  <User size={20} className="mr-1" />
                  <span className="hidden sm:inline ml-1">{user?.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-primary-700 hover:bg-primary-800 transition-colors ml-2"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center ml-4">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-primary-700 transition-colors"
                >
                  <LogIn size={20} className="mr-1" />
                  <span>{t('nav.login')}</span>
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-primary-700 hover:bg-primary-800 transition-colors ml-2"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Language Switch Button */}
            <button
              onClick={toggleLanguage}
              className="ml-4 px-3 py-2 rounded-md text-sm font-medium bg-primary-500 hover:bg-primary-400 transition-colors"
            >
              {t('common.languageSwitch')}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-700 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center hover:bg-primary-700 transition-colors
                  ${pathname === item.path ? 'bg-primary-700' : ''}`}
                onClick={closeMenu}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}

            {/* Auth buttons */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium flex items-center hover:bg-primary-700 transition-colors"
                  onClick={closeMenu}
                >
                  <User size={20} className="mr-2" />
                  <span>{t('nav.profile')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-primary-700 hover:bg-primary-800 transition-colors flex items-center"
                >
                  <LogIn size={20} className="mr-2" />
                  <span>{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium flex items-center hover:bg-primary-700 transition-colors"
                  onClick={closeMenu}
                >
                  <LogIn size={20} className="mr-2" />
                  <span>{t('nav.login')}</span>
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium flex items-center bg-primary-700 hover:bg-primary-800 transition-colors"
                  onClick={closeMenu}
                >
                  <User size={20} className="mr-2" />
                  <span>{t('nav.register')}</span>
                </Link>
              </>
            )}

            {/* Language Switch Button (Mobile) */}
            <button
              onClick={() => {
                toggleLanguage();
                closeMenu();
              }}
              className="w-full text-left mt-4 px-3 py-2 rounded-md text-base font-medium bg-primary-500 hover:bg-primary-400 transition-colors"
            >
              {t('common.languageSwitch')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
