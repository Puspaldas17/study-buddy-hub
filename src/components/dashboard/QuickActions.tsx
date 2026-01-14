import * as React from "react";
import { Link } from "react-router-dom";
import { QrCode, Upload, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const actions = [
  {
    title: "Generate QR Code",
    description: "Create attendance QR for your class",
    icon: QrCode,
    href: "/attendance",
    color: "primary",
  },
  {
    title: "Upload Notes",
    description: "Share your study materials",
    icon: Upload,
    href: "/notes",
    color: "success",
  },
  {
    title: "Add New Habit",
    description: "Start tracking a new goal",
    icon: Plus,
    href: "/habits",
    color: "streak",
  },
];

const QuickActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    return (
      <Card ref={ref} variant="glass" className="animate-fade-in" style={{ animationDelay: "0.1s" }} {...props}>
        <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2 sm:pb-2 lg:pb-2">
          <CardTitle className="text-sm sm:text-base lg:text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6 pt-2 space-y-2 sm:space-y-3">
          {actions.map((action) => (
            <Link key={action.title} to={action.href}>
              <div className="group flex items-center gap-2 sm:gap-3 lg:gap-4 rounded-lg border border-border p-2 sm:p-3 lg:p-4 transition-all duration-200 hover:border-primary/50 hover:bg-secondary/50">
                <div className={`rounded-lg p-1.5 sm:p-2 lg:p-2.5 shrink-0 ${
                  action.color === "primary" ? "bg-primary/10 text-primary" :
                  action.color === "success" ? "bg-success/10 text-success" :
                  "bg-streak/10 text-streak"
                }`}>
                  <action.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-medium truncate">{action.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground transition-transform group-hover:translate-x-1 shrink-0" />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    );
  }
);

QuickActions.displayName = "QuickActions";

export { QuickActions };
