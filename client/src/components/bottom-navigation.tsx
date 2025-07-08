import { useLocation } from "wouter";
import { Home, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: "/main", icon: Home, label: "Inicio" },
    { path: "/wallet", icon: Wallet, label: "Billetera" },
    { path: "/profile", icon: User, label: "Perfil" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => setLocation(path)}
            className={cn(
              "flex flex-col items-center p-2 transition-colors",
              isActive(path) ? "text-primary" : "text-neutral-400 hover:text-neutral-600"
            )}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
