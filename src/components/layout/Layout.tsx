import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar, MobileHeader } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar />
      <MobileHeader />
      <main className="lg:ml-64 flex-1 pt-14 pb-20 lg:pt-0 lg:pb-0">
        <div className="container px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
          <Breadcrumbs />
          <div key={location.pathname} className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
      <div className="lg:ml-64">
        <Footer />
      </div>
      <MobileNav />
    </div>
  );
}
