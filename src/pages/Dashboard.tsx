import { useState } from "react";
import { QrCode, FileText, Target, Flame } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

interface StatsData {
  attendance: { value: string; subtitle: string };
  notes: { value: string; subtitle: string };
  habits: { value: string; subtitle: string };
  streak: { value: string; subtitle: string };
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatsData>({
    attendance: { value: "94%", subtitle: "This semester" },
    notes: { value: "23", subtitle: "12 downloads this week" },
    habits: { value: "5", subtitle: "3 completed today" },
    streak: { value: "7 days", subtitle: "Keep it going!" },
  });

  const updateStat = (key: keyof StatsData, field: "value" | "subtitle", newValue: string) => {
    setStats(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: newValue }
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, <span className="gradient-text">Student</span>
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your learning progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Attendance Rate"
          value={stats.attendance.value}
          subtitle={stats.attendance.subtitle}
          icon={QrCode}
          variant="primary"
          trend={{ value: 2.5, isPositive: true }}
          editable
          onValueChange={(v) => updateStat("attendance", "value", v)}
          onSubtitleChange={(s) => updateStat("attendance", "subtitle", s)}
        />
        <StatsCard
          title="Notes Shared"
          value={stats.notes.value}
          subtitle={stats.notes.subtitle}
          icon={FileText}
          variant="success"
          editable
          onValueChange={(v) => updateStat("notes", "value", v)}
          onSubtitleChange={(s) => updateStat("notes", "subtitle", s)}
        />
        <StatsCard
          title="Active Habits"
          value={stats.habits.value}
          subtitle={stats.habits.subtitle}
          icon={Target}
          variant="default"
          editable
          onValueChange={(v) => updateStat("habits", "value", v)}
          onSubtitleChange={(s) => updateStat("habits", "subtitle", s)}
        />
        <StatsCard
          title="Current Streak"
          value={stats.streak.value}
          subtitle={stats.streak.subtitle}
          icon={Flame}
          variant="streak"
          editable
          onValueChange={(v) => updateStat("streak", "value", v)}
          onSubtitleChange={(s) => updateStat("streak", "subtitle", s)}
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActions />
        <RecentActivity />
      </div>
    </div>
  );
}
