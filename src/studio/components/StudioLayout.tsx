import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StudioSidebar } from "./Sidebar";
import { StudioHeader } from "./StudioHeader";
import { Breadcrumbs } from "./Breadcrumbs";
import type { BreadcrumbItem } from "./Breadcrumbs";
import { useAuth } from "../hooks/useAuth";

interface StudioLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function StudioLayout({ children, title, breadcrumbs }: StudioLayoutProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate("/studio/login", { replace: true });
  }, [signOut, navigate]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <StudioSidebar onSignOut={handleSignOut} />
        <SidebarInset>
          <StudioHeader title={title} />
          <main className="flex-1 p-6">
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
