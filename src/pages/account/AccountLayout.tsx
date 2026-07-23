import { Outlet, NavLink } from "react-router-dom";
import { User, MapPin, Package, Heart, LogOut, LayoutDashboard } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/account", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/account/profile", icon: User, label: "Profile" },
  { to: "/account/addresses", icon: MapPin, label: "Addresses" },
  { to: "/account/orders", icon: Package, label: "Orders" },
  { to: "/account/wishlist", icon: Heart, label: "Wishlist" },
];

export default function AccountLayout() {
  const { signOut } = useAuth();

  return (
    <PageLayout>
      <div className="container py-8 md:py-12">
        <h1 className="font-serif text-2xl md:text-3xl text-ink mb-8">My Account</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <nav className="md:col-span-1 space-y-1" aria-label="Account navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors duration-200 ${
                    isActive
                      ? "bg-teal-deep/10 text-teal-deep font-medium"
                      : "text-ink-soft hover:text-ink hover:bg-ink/5"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={signOut}
              className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-ink-soft hover:text-ink hover:bg-ink/5 transition-colors duration-200 w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </nav>
          <main className="md:col-span-3 min-h-[50vh]">
            <Outlet />
          </main>
        </div>
      </div>
    </PageLayout>
  );
}
