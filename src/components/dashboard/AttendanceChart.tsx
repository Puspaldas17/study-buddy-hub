import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface AttendanceRecord {
  class_name: string;
  checked_in_at: string;
}

interface AttendanceChartProps {
  records: AttendanceRecord[];
}

export function AttendanceChart({ records }: AttendanceChartProps) {
  const chartData = useMemo(() => {
    const last7Days: { date: string; count: number; label: string }[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
      
      const count = records.filter((r) => {
        const recordDate = new Date(r.checked_in_at).toISOString().split("T")[0];
        return recordDate === dateStr;
      }).length;
      
      last7Days.push({ date: dateStr, count, label: dayLabel });
    }
    
    return last7Days;
  }, [records]);

  const chartConfig = {
    count: {
      label: "Check-ins",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <Card className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
      <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2 sm:pb-2 lg:pb-2">
        <CardTitle className="text-sm sm:text-base lg:text-lg">Attendance This Week</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
        {records.length === 0 ? (
          <div className="flex h-[150px] sm:h-[180px] lg:h-[200px] items-center justify-center text-sm text-muted-foreground">
            No attendance records yet
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[150px] sm:h-[180px] lg:h-[200px] w-full">
            <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <XAxis 
                dataKey="label" 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                width={30}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                name="Check-ins"
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
