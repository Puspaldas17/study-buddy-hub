import { useState } from "react";
import { HabitCard, Habit } from "@/components/habits/HabitCard";
import { AddHabitDialog } from "@/components/habits/AddHabitDialog";
import { HabitStats } from "@/components/habits/HabitStats";
import { toast } from "@/hooks/use-toast";

const initialHabits: Habit[] = [
  {
    id: "1",
    name: "Study for 2 hours",
    category: "Learning",
    streak: 7,
    completedToday: false,
    weekProgress: [true, true, true, true, true, true, false],
    color: "#6366f1",
  },
  {
    id: "2",
    name: "Exercise 30 minutes",
    category: "Health & Fitness",
    streak: 12,
    completedToday: true,
    weekProgress: [true, true, true, true, true, true, true],
    color: "#10b981",
  },
  {
    id: "3",
    name: "Read 20 pages",
    category: "Learning",
    streak: 5,
    completedToday: false,
    weekProgress: [true, true, false, true, true, true, false],
    color: "#f59e0b",
  },
  {
    id: "4",
    name: "Meditate 10 minutes",
    category: "Mindfulness",
    streak: 3,
    completedToday: false,
    weekProgress: [false, true, true, false, true, true, false],
    color: "#8b5cf6",
  },
];

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id) {
          const newCompleted = !habit.completedToday;
          if (newCompleted) {
            toast({
              title: "🎉 Great job!",
              description: `You completed "${habit.name}"`,
            });
          }
          return {
            ...habit,
            completedToday: newCompleted,
            streak: newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1),
          };
        }
        return habit;
      })
    );
  };

  const addHabit = (newHabit: { name: string; category: string; color: string }) => {
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      category: newHabit.category,
      color: newHabit.color,
      streak: 0,
      completedToday: false,
      weekProgress: [false, false, false, false, false, false, false],
    };
    setHabits((prev) => [...prev, habit]);
  };

  const completedToday = habits.filter((h) => h.completedToday).length;
  const totalHabits = habits.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Habit Tracker</h1>
          <p className="text-muted-foreground">
            {completedToday} of {totalHabits} habits completed today
          </p>
        </div>
        <AddHabitDialog onAdd={addHabit} />
      </div>

      {/* Progress Bar */}
      <div className="rounded-xl bg-secondary p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Today's Progress</span>
          <span className="text-sm text-muted-foreground">
            {Math.round((completedToday / totalHabits) * 100)}%
          </span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-500"
            style={{ width: `${(completedToday / totalHabits) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {habits.map((habit, index) => (
            <div key={habit.id} style={{ animationDelay: `${0.05 * index}s` }}>
              <HabitCard habit={habit} onToggle={toggleHabit} />
            </div>
          ))}
        </div>
        <div>
          <HabitStats />
        </div>
      </div>
    </div>
  );
}
