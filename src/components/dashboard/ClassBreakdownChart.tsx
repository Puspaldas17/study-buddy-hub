import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface AttendanceRecord {
  class_name: string;
  checked_in_at: string;
}

interface ClassBreakdownChartProps {
  records: AttendanceRecord[];
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(var(--streak))",
  "hsl(142, 76%, 36%)",
  "hsl(262, 83%, 58%)",
  "hsl(24, 100%, 50%)",
];

export function ClassBreakdownChart({ records }: ClassBreakdownChartProps) {
  const chartData = useMemo(() => {
    const classCount: Record<string, number> = {};
    
    records.forEach((r) => {
      const className = r.class_name || "Unknown";
      classCount[className] = (classCount[className] || 0) + 1;
    });
    
    return Object.entries(classCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [records]);

  const chartConfig = chartData.reduce((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: COLORS[index % COLORS.length],
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <Card className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <CardHeader>
        <CardTitle className="text-lg">Attendance by Class</CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            No attendance records yet
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        )}
        {chartData.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {chartData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-medium">({item.value})</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
