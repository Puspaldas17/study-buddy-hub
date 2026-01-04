import { CheckCircle2, FileText, Target, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    id: 1,
    type: "attendance",
    title: "Marked attendance",
    description: "CS201 - Data Structures",
    time: "10 minutes ago",
    icon: CheckCircle2,
    color: "text-success",
  },
  {
    id: 2,
    type: "note",
    title: "Uploaded new notes",
    description: "Chapter 5 - Algorithms",
    time: "2 hours ago",
    icon: FileText,
    color: "text-primary",
  },
  {
    id: 3,
    type: "habit",
    title: "Completed habit",
    description: "Study for 2 hours",
    time: "5 hours ago",
    icon: Target,
    color: "text-streak",
  },
  {
    id: 4,
    type: "attendance",
    title: "Marked attendance",
    description: "MATH301 - Calculus III",
    time: "Yesterday",
    icon: CheckCircle2,
    color: "text-success",
  },
];

export function RecentActivity() {
  return (
    <Card variant="glass" className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 animate-fade-in"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className={`mt-0.5 ${activity.color}`}>
                <activity.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
