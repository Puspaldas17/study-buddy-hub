import { useEffect, useState } from "react";
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

export function RecentActivity() {
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
    <Card variant="glass" className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            Loading...
          </div>
        ) : activities.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            No recent activity
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 animate-fade-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="mt-0.5 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Marked attendance</p>
                  <p className="text-sm text-muted-foreground">{activity.class_name}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(activity.checked_in_at), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
