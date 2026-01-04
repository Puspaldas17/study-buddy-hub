import { Link } from "react-router-dom";
import { QrCode, Upload, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export function QuickActions() {
  return (
    <Card variant="glass" className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Link key={action.title} to={action.href}>
            <div className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-all duration-200 hover:border-primary/50 hover:bg-secondary/50">
              <div className={`rounded-lg p-2.5 ${
                action.color === "primary" ? "bg-primary/10 text-primary" :
                action.color === "success" ? "bg-success/10 text-success" :
                "bg-streak/10 text-streak"
              }`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
