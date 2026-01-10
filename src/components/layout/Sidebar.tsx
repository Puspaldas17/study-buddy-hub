import { useState, forwardRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  QrCode, 
  FileText, 
  Target, 
  Settings,
  GraduationCap,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/navigation/UserMenu";
import { CommandPaletteHint } from "@/components/navigation/CommandPalette";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: QrCode, label: "Attendance", path: "/attendance" },
  { icon: FileText, label: "Notes", path: "/notes" },
  { icon: Target, label: "Habits", path: "/habits" },
];

interface SidebarContentProps {
  onNavClick?: () => void;
}

const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ onNavClick }, ref) => {
    const location = useLocation();

    return (
      <div ref={ref} className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">EduPro</span>
          </div>
          <ThemeToggle />
        </div>

        {/* Search Hint */}
        <div className="px-4 pt-4">
          <CommandPaletteHint />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onNavClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                {item.label}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Settings Link */}
        <div className="border-t border-border p-4">
          <NavLink
            to="/settings"
            onClick={onNavClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              location.pathname === "/settings"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </NavLink>
        </div>

        {/* User Menu */}
        <div className="border-t border-border p-4">
          <UserMenu />
        </div>
      </div>
    );
  }
);

SidebarContent.displayName = "SidebarContent";

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur-lg px-4 lg:hidden">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-base font-bold tracking-tight">EduPro</span>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent onNavClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar hidden lg:block">
      <SidebarContent />
    </aside>
  );
}
