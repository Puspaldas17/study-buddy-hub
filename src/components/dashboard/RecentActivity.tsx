import { useEffect, useState, forwardRef } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface AttendanceRecord {
  id: string;
  class_name: string;
  checked_in_at: string;
  status: string;
}

export const RecentActivity = forwardRef<HTMLDivElement>((_, ref) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentActivity() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("attendance_records")
          .select("*")
          .eq("user_id", user.id)
          .order("checked_in_at", { ascending: false })
          .limit(5);

        if (error) throw error;
        setActivities(data || []);
      } catch (err) {
        console.error("Error fetching activity:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentActivity();
  }, [user]);

  return (
    <Card ref={ref} variant="glass" className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2 sm:pb-2 lg:pb-2">
        <CardTitle className="text-sm sm:text-base lg:text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6 pt-2">
        {loading ? (
          <div className="flex h-24 sm:h-32 items-center justify-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : activities.length === 0 ? (
          <div className="flex h-24 sm:h-32 items-center justify-center text-sm text-muted-foreground">
            No recent activity
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-start gap-2 sm:gap-3 lg:gap-4 animate-fade-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="mt-0.5 text-success shrink-0">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
                  <p className="text-xs sm:text-sm font-medium">Marked attendance</p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{activity.class_name}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground shrink-0">
                  <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span className="hidden sm:inline">{formatDistanceToNow(new Date(activity.checked_in_at), { addSuffix: true })}</span>
                  <span className="sm:hidden">{formatDistanceToNow(new Date(activity.checked_in_at), { addSuffix: false })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

RecentActivity.displayName = "RecentActivity";
