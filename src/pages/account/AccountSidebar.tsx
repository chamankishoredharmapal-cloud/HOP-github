import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  MapPin,
  Package,
  Heart,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { to: "/account", label: "Dashboard", icon: LayoutDashboard },
  { to: "/account/profile", label: "Profile", icon: User },
  { to: "/account/addresses", label: "Addresses", icon: MapPin },
  { to: "/account/orders", label: "Orders", icon: Package },
  { to: "/account/wishlist", label: "Wishlist", icon: Heart },
];

export default function AccountSidebar() {
  const { pathname } = useLocation();
  const { signOut } = useAuth();

  return (
    <aside className="w-full lg:w-56 shrink-0">
      <nav className="flex lg:flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.to === "/account"
              ? pathname === "/account"
              : pathname.startsWith(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-deep/10 text-teal-deep"
                  : "text-ink-soft hover:text-ink hover:bg-ink/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-ink-soft hover:text-red-600 hover:bg-red-50 transition-colors mt-2 lg:mt-4"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </nav>
    </aside>
  );
}
