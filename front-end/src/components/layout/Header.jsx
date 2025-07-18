import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { FaBox, FaUser, FaHome, FaSignInAlt, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { estaLogado, fazerLogout } from "../../api/auth";

export default function Header() {
  const navigate = useNavigate();
  const usuarioLogado = estaLogado();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    fazerLogout();
    setShowProfileMenu(false);
    navigate('/home');
  };

  return (
    <header className="bg-blue-400 shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between h-12 ml-8 mr-17">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
            <img src={logo} alt="Logo" className="h-12 w-auto" />
            <h1 className="text-white text-2xl font-bold font-standard tracking-wide">
              Decola Tour
            </h1>
          </div>
          <div className="flex items-center justify-between gap-16">
            <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/home")}>
              <FaHome size={20} color="white" />
              <p className="text-sm text-white mt-1">Início</p>
            </div>
            <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/packages")}>
              <FaBox size={20} color="white" />
              <p className="text-sm text-white mt-1">Pacotes</p>
            </div>
            
            {/* Condicional: Perfil se logado, Login se não logado */}
            {usuarioLogado ? (
              <div className="relative">
                <div 
                  className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity" 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <FaUser size={20} color="white" />
                  <p className="text-sm text-white mt-1">Perfil</p>
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
              <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/login")}>
                <FaSignInAlt size={20} color="white" />
                <p className="text-sm text-white mt-1">Entrar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
