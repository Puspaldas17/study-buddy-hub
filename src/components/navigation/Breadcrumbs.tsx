import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

const routeNames: Record<string, string> = {
  "/": "Dashboard",
  "/attendance": "Attendance",
  "/notes": "Notes",
  "/habits": "Habits",
  "/settings": "Settings",
};

export function Breadcrumbs() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Don't show breadcrumbs on dashboard
  if (currentPath === "/") {
    return null;
  }

  const currentPageName = routeNames[currentPath] || "Page";

  return (
    <Breadcrumb className="mb-4 animate-fade-in">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPageName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
