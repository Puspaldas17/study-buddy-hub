import { Trophy, Flame, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const badges = [
  { name: "First Streak", icon: Flame, color: "text-streak", earned: true },
  { name: "Week Warrior", icon: Target, color: "text-success", earned: true },
  { name: "Consistency King", icon: Trophy, color: "text-badge-gold", earned: false },
  { name: "Habit Master", icon: TrendingUp, color: "text-primary", earned: false },
];

export function HabitStats() {
  return (
    <Card variant="glass" className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-badge-gold" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
                badge.earned
                  ? "border-badge-gold/30 bg-badge-gold/5"
                  : "border-border opacity-50"
              }`}
            >
              <badge.icon className={`h-6 w-6 ${badge.earned ? badge.color : "text-muted-foreground"}`} />
              <div>
                <p className={`text-sm font-medium ${badge.earned ? "" : "text-muted-foreground"}`}>
                  {badge.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {badge.earned ? "Earned!" : "Locked"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg bg-secondary p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall completion rate</p>
              <p className="text-2xl font-bold">78%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Best streak</p>
              <p className="text-2xl font-bold text-streak">12 days</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
