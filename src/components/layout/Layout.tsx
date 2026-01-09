import { ReactNode } from "react";
import { Sidebar, MobileHeader } from "./Sidebar";
import { MobileNav } from "./MobileNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileHeader />
      <main className="lg:ml-64 min-h-screen pt-14 pb-20 lg:pt-0 lg:pb-0">
        <div className="container px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
