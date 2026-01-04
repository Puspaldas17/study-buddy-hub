import { Check, Flame, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Habit {
  id: string;
  name: string;
  category: string;
  streak: number;
  completedToday: boolean;
  weekProgress: boolean[];
  color: string;
}

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
}

const days = ["M", "T", "W", "T", "F", "S", "S"];

export function HabitCard({ habit, onToggle }: HabitCardProps) {
  return (
    <Card 
      variant="interactive" 
      className={cn(
        "animate-fade-in transition-all duration-300",
        habit.completedToday && "border-success/30 bg-success/5"
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: habit.color }}
              />
              <div>
                <h3 className="font-semibold">{habit.name}</h3>
                <p className="text-sm text-muted-foreground">{habit.category}</p>
              </div>
            </div>

            {/* Week progress */}
            <div className="flex gap-1.5">
              {habit.weekProgress.map((completed, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-all",
                    completed
                      ? "bg-success/20 text-success"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {completed ? <Check className="h-4 w-4" /> : days[index]}
                </div>
              ))}
            </div>

            {/* Streak */}
            {habit.streak > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-streak/10 px-2.5 py-1 text-streak">
                  <Flame className="h-4 w-4" />
                  <span className="text-sm font-semibold">{habit.streak} day streak</span>
                </div>
                {habit.streak >= 7 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    Personal best!
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            size="icon"
            variant={habit.completedToday ? "success" : "outline"}
            className={cn(
              "h-12 w-12 rounded-xl transition-all",
              habit.completedToday && "shadow-lg shadow-success/30"
            )}
            onClick={() => onToggle(habit.id)}
          >
            <Check className={cn("h-5 w-5", habit.completedToday && "animate-bounce-subtle")} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
