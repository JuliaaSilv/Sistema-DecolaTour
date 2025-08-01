import { Plane, LogOut, Bell, User } from "lucide-react";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import DropdownMenu from "./ui/DropdownMenu";
import DropdownMenuContent from "./ui/DropdownMenuContent";
import DropdownMenuItem from "./ui/DropdownMenuItem";
import DropdownMenuSeparator from "./ui/DropdownMenuSeparator";
import DropdownMenuTrigger from "./ui/DropdownMenuTrigger";
import { cn } from "../../lib/utils";

export default function AdminHeader() {
  return (
    <header className="bg-blue-500/95 backdrop-blur-sm border-b border-blue-400/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 md:space-x-3 ml-12 md:ml-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Plane className="w-4 h-4 md:w-6 md:h-6 text-blue-500" />
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <h1 className="text-lg md:text-2xl font-bold text-white">Decola Tour</h1>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 font-medium text-xs md:text-sm">
                Admin Panel
              </Badge>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 relative p-2">
              <Bell className="w-4 h-4 md:w-5 md:h-5" />
              <Badge className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 p-0 bg-orange-500 text-white text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/20 flex items-center space-x-1 md:space-x-2 p-2">
                  <User className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline text-sm md:text-base">Admin Silva</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 md:w-56">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}