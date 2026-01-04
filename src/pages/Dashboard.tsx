import { QrCode, FileText, Target, Flame } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function Dashboard() {
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
          value="94%"
          subtitle="This semester"
          icon={QrCode}
          variant="primary"
          trend={{ value: 2.5, isPositive: true }}
        />
        <StatsCard
          title="Notes Shared"
          value="23"
          subtitle="12 downloads this week"
          icon={FileText}
          variant="success"
        />
        <StatsCard
          title="Active Habits"
          value="5"
          subtitle="3 completed today"
          icon={Target}
          variant="default"
        />
        <StatsCard
          title="Current Streak"
          value="7 days"
          subtitle="Keep it going!"
          icon={Flame}
          variant="streak"
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
