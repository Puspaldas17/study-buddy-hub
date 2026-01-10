import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  Target,
  Settings,
  Moon,
  Sun,
  LogOut,
  QrCode,
  Upload,
  Search,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";

const navigationItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard, shortcut: "⌘1" },
  { name: "Attendance", path: "/attendance", icon: CalendarCheck, shortcut: "⌘2" },
  { name: "Notes", path: "/notes", icon: FileText, shortcut: "⌘3" },
  { name: "Habits", path: "/habits", icon: Target, shortcut: "⌘4" },
  { name: "Settings", path: "/settings", icon: Settings, shortcut: "⌘5" },
];

const quickActions = [
  { name: "Scan QR Code", path: "/attendance", icon: QrCode },
  { name: "Upload Notes", path: "/notes", icon: Upload },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open palette
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }

      // Navigation shortcuts (Cmd+1-5 or Ctrl+1-5)
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 5) {
          e.preventDefault();
          const item = navigationItems[num - 1];
          if (item) {
            navigate(item.path);
            setOpen(false);
          }
        }
      }

      // Cmd+T or Ctrl+T to toggle theme
      if (e.key === "t" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [navigate, theme, setTheme]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    setOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.path}
              onSelect={() => handleNavigation(item.path)}
              className="cursor-pointer"
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.name}</span>
              <CommandShortcut>{item.shortcut}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          {quickActions.map((action) => (
            <CommandItem
              key={action.name}
              onSelect={() => handleNavigation(action.path)}
              className="cursor-pointer"
            >
              <action.icon className="mr-2 h-4 w-4" />
              <span>{action.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem onSelect={handleToggleTheme} className="cursor-pointer">
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Toggle Theme</span>
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={handleSignOut} className="cursor-pointer text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function CommandPaletteHint() {
  return (
    <button
      onClick={() => {
        const event = new KeyboardEvent("keydown", {
          key: "k",
          metaKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      }}
      className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground bg-muted/50 rounded-md border border-border/50 hover:bg-muted transition-colors"
    >
      <Search className="h-3 w-3" />
      <span>Search</span>
      <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-background rounded border">⌘K</kbd>
    </button>
  );
}
