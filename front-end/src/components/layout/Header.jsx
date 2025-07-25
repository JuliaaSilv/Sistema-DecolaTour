import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { FaBox, FaUser, FaHome, FaSignInAlt, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { estaLogado, fazerLogout } from "../../api/auth";

export default function Header() {
  const navigate = useNavigate();
  const usuarioLogado = estaLogado();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);

  const handleLogout = () => {
    fazerLogout();
    setShowProfileMenu(false);
    navigate('/home');
  };

  // Fechar menus quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-menu')) {
        setShowProfileMenu(false);
        setShowLoginMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-blue-400 shadow-lg">
      <div className="w-full px-2 sm:px-4 md:px-8 py-2">
        <div className="flex flex-col md:flex-row items-center justify-between h-auto md:h-16 gap-2 md:gap-0">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer mb-2 md:mb-0" onClick={() => navigate("/home")}> 
            <img src={logo} alt="Logo" className="h-10 sm:h-12 w-auto" />
            <h1 className="text-white text-lg sm:text-2xl font-bold font-standard tracking-wide">
              Decola Tour
            </h1>
          </div>
          <div className="flex items-center justify-between gap-6 sm:gap-10 md:gap-16 w-full md:w-auto">
            <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/home")}> 
              <FaHome size={18} className="sm:w-5 sm:h-5" color="white" />
              <p className="text-xs sm:text-sm text-white mt-1">Início</p>
            </div>
            <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/packages")}> 
              <FaBox size={18} className="sm:w-5 sm:h-5" color="white" />
              <p className="text-xs sm:text-sm text-white mt-1">Pacotes</p>
            </div>
            {/* Condicional: Perfil se logado, Login se não logado */}
            {usuarioLogado ? (
              <div className="relative dropdown-menu">
                <div 
                  className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity" 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <FaUser size={18} className="sm:w-5 sm:h-5" color="white" />
                  <p className="text-xs sm:text-sm text-white mt-1">Perfil</p>
                </div>
                {/* Menu dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-12 bg-white shadow-lg rounded-md py-2 w-40 z-50">
                    <button 
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                      onClick={() => {
                        navigate('/perfil');
                        setShowProfileMenu(false);
                      }}
                    >
                      <FaUser className="mr-2" size={14} />
                      Ver Perfil
                    </button>
                    <button 
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="mr-2" size={14} />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative dropdown-menu">
                <div 
                  className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity" 
                  onClick={() => setShowLoginMenu(!showLoginMenu)}
                > 
                  <FaSignInAlt size={18} className="sm:w-5 sm:h-5" color="white" />
                  <p className="text-xs sm:text-sm text-white mt-1">Entrar</p>
                </div>
                {/* Menu dropdown para login */}
                {showLoginMenu && (
                  <div className="absolute right-0 top-12 bg-white shadow-lg rounded-md py-2 w-48 z-50">
                    <button 
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                      onClick={() => {
                        navigate('/login');
                        setShowLoginMenu(false);
                      }}
                    >
                      <FaUser className="mr-2" size={14} />
                      Entrar como Cliente
                    </button>
                    <button 
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                      onClick={() => {
                        navigate('/admin-login');
                        setShowLoginMenu(false);
                      }}
                    >
                      <FaSignInAlt className="mr-2" size={14} />
                      Entrar como Administrador
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
