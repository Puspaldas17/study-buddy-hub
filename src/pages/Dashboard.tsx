import { useEffect, useState } from "react";
import { QrCode, FileText, Target, Flame, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { ClassBreakdownChart } from "@/components/dashboard/ClassBreakdownChart";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AttendanceRecord {
  id: string;
  class_name: string;
  checked_in_at: string;
  status: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttendanceData() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("attendance_records")
          .select("*")
          .eq("user_id", user.id)
          .order("checked_in_at", { ascending: false });

        if (error) throw error;
        setAttendanceRecords(data || []);
      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAttendanceData();
  }, [user]);

  // Calculate stats
  const totalCheckIns = attendanceRecords.length;
  const uniqueClasses = new Set(attendanceRecords.map((r) => r.class_name)).size;
  
  // Calculate streak (consecutive days with attendance)
  const calculateStreak = () => {
    if (attendanceRecords.length === 0) return 0;
    
    const dates = [...new Set(
      attendanceRecords.map((r) => new Date(r.checked_in_at).toISOString().split("T")[0])
    )].sort().reverse();
    
    if (dates.length === 0) return 0;
    
    let streak = 0;
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    
    // Check if the most recent attendance is today or yesterday
    if (dates[0] !== today && dates[0] !== yesterday) return 0;
    
    let expectedDate = new Date(dates[0]);
    for (const dateStr of dates) {
      const date = new Date(dateStr);
      const diff = Math.abs(expectedDate.getTime() - date.getTime()) / 86400000;
      
      if (diff <= 1) {
        streak++;
        expectedDate = new Date(date.getTime() - 86400000);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();

  // Get this week's attendance count
  const thisWeekCount = attendanceRecords.filter((r) => {
    const recordDate = new Date(r.checked_in_at);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return recordDate >= weekAgo;
  }).length;

  const userName = user?.user_metadata?.full_name || "Student";
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, <span className="gradient-text">{userName}</span>
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your learning progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Check-ins"
          value={loading ? "..." : totalCheckIns}
          subtitle="All time attendance"
          icon={QrCode}
          variant="primary"
        />
        <StatsCard
          title="This Week"
          value={loading ? "..." : thisWeekCount}
          subtitle="Classes attended"
          icon={TrendingUp}
          variant="success"
        />
        <StatsCard
          title="Unique Classes"
          value={loading ? "..." : uniqueClasses}
          subtitle="Different courses"
          icon={FileText}
          variant="default"
        />
        <StatsCard
          title="Current Streak"
          value={loading ? "..." : `${streak} day${streak !== 1 ? "s" : ""}`}
          subtitle={streak > 0 ? "Keep it going!" : "Start attending!"}
          icon={Flame}
          variant="streak"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AttendanceChart records={attendanceRecords} />
        <ClassBreakdownChart records={attendanceRecords} />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActions />
        <RecentActivity />
      </div>
    </div>
  );
}
