import { useLocation } from "wouter";
import { Home, Wallet, User, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: "/main", icon: Home, label: "Home" },
    { path: "/wallet", icon: Wallet, label: "Wallet" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/support", icon: HelpCircle, label: "Support" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => setLocation(path)}
            className={cn(
              "flex flex-col items-center p-2 transition-colors min-w-0 flex-1",
              isActive(path) ? "text-primary" : "text-neutral-400 hover:text-neutral-600"
            )}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs truncate">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
