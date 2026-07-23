import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Warehouse,
  Users,
  BookOpen,
  Image,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { StudioNavItem } from "../types";

const navItems: StudioNavItem[] = [
  { label: "Dashboard", path: "/studio", icon: LayoutDashboard },
  { label: "Orders", path: "/studio/orders", icon: ShoppingBag },
  { label: "Products", path: "/studio/products", icon: Package },
  { label: "Collections", path: "/studio/collections", icon: Layers },
  { label: "Inventory", path: "/studio/inventory", icon: Warehouse },
  { label: "Customers", path: "/studio/customers", icon: Users },
  { label: "Journal", path: "/studio/journal", icon: BookOpen },
  { label: "Media Library", path: "/studio/media", icon: Image },
  { label: "Settings", path: "/studio/settings", icon: Settings },
];

interface StudioSidebarProps {
  onSignOut: () => void;
}

export function StudioSidebar({ onSignOut }: StudioSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-serif text-lg tracking-[0.15em] uppercase px-4 py-6">
            Studio
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      end={item.path === "/studio"}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground",
                        )
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={onSignOut}>
              <button className="flex items-center gap-3 px-4 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full">
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
