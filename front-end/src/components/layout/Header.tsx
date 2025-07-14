import React, { useState } from "react";
import logo from "../../assets/logo.png";
import PackageIcon from "../common/icons/PackageIcon";
import OffersIcon from "../common/icons/OffersIcon";
import ProfileIcon from "../common/icons/ProfileIcon";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="bg-[#6A4C93] shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-3 pb-4">
        <div className="flex items-center justify-between h-15 ml-8 mr-17">
          <div>
            <img src={logo} alt="Logo" sizes="200px" />
          </div>
          <div className="flex items-center justify-between gap-28">
            <div className="flex flex-col items-center">
              <PackageIcon width={25} height={25} />
              <p className="font-medium">Pacotes</p>
            </div>
            <div className="flex flex-col items-center">
              <OffersIcon />
             <p className="font-medium"> Promoções </p>
            </div>
            <div className="flex flex-col items-center relative">
              <ProfileIcon />
              <p className="font-medium"> Perfil </p>
            </div>
            {/* <button className="bg-white text-[#6A4C93] w-32 h-8 rounded-lg hover:bg-#5a3f7b transition-colors duration-300">
              <span className="text-sm font-semibold">Get started</span>
            </button> */}
          </div>
        </div>
      </div>
    </header>
  );
}