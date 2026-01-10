import { GraduationCap, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hidden lg:block border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container max-w-7xl px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          {/* Left - Brand */}
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>© {currentYear} EduPro. All rights reserved.</span>
          </div>

          {/* Center - Links */}
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Help Center
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>

          {/* Right - Shortcut hint */}
          <div className="flex items-center gap-2">
            <span className="hidden xl:flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-destructive fill-destructive" /> •
            </span>
            <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border border-border">⌘K</kbd>
            <span>to search</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
