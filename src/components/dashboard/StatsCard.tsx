import { useState } from "react";
import { LucideIcon, Pencil, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "streak";
  editable?: boolean;
  onValueChange?: (newValue: string) => void;
  onSubtitleChange?: (newSubtitle: string) => void;
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = "default",
  editable = false,
  onValueChange,
  onSubtitleChange,
}: StatsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const [editSubtitle, setEditSubtitle] = useState(subtitle || "");

  const variantStyles = {
    default: "border-border",
    primary: "border-primary/30 bg-primary/5",
    success: "border-success/30 bg-success/5",
    streak: "border-streak/30 bg-streak/5",
  };

  const iconStyles = {
    default: "bg-secondary text-muted-foreground",
    primary: "bg-primary/20 text-primary",
    success: "bg-success/20 text-success",
    streak: "bg-streak/20 text-streak",
  };

  const handleSave = () => {
    onValueChange?.(editValue);
    onSubtitleChange?.(editSubtitle);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(String(value));
    setEditSubtitle(subtitle || "");
    setIsEditing(false);
  };

  return (
    <Card className={cn("animate-fade-in relative group", variantStyles[variant])}>
      <CardContent className="p-6">
        {editable && !isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}

        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1 pr-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="text-2xl font-bold h-12"
                  placeholder="Value"
                />
                <Input
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  className="text-sm"
                  placeholder="Subtitle"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} className="h-8">
                    <Check className="h-4 w-4 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel} className="h-8">
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-3xl font-bold tracking-tight">{value}</p>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
                {trend && (
                  <div className="flex items-center gap-1">
                    <span className={cn(
                      "text-sm font-medium",
                      trend.isPositive ? "text-success" : "text-destructive"
                    )}>
                      {trend.isPositive ? "+" : ""}{trend.value}%
                    </span>
                    <span className="text-xs text-muted-foreground">vs last week</span>
                  </div>
                )}
              </>
            )}
          </div>
          <div className={cn("rounded-xl p-3", iconStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
