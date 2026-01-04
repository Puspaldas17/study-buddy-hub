import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        <div className="container py-6 lg:py-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
