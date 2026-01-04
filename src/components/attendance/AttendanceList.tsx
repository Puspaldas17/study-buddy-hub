import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AttendanceRecord {
  id: string;
  studentName: string;
  className: string;
  date: string;
  time: string;
  status: "present" | "absent" | "late";
}

const mockRecords: AttendanceRecord[] = [
  { id: "1", studentName: "Alex Johnson", className: "CS201", date: "2024-01-15", time: "09:02", status: "present" },
  { id: "2", studentName: "Sarah Williams", className: "CS201", date: "2024-01-15", time: "09:05", status: "present" },
  { id: "3", studentName: "Mike Brown", className: "CS201", date: "2024-01-15", time: "09:18", status: "late" },
  { id: "4", studentName: "Emily Davis", className: "CS201", date: "2024-01-15", time: "-", status: "absent" },
  { id: "5", studentName: "James Wilson", className: "CS201", date: "2024-01-15", time: "09:00", status: "present" },
];

const statusConfig = {
  present: { icon: CheckCircle2, color: "bg-success/10 text-success border-success/20", label: "Present" },
  absent: { icon: XCircle, color: "bg-destructive/10 text-destructive border-destructive/20", label: "Absent" },
  late: { icon: Clock, color: "bg-warning/10 text-warning border-warning/20", label: "Late" },
};

export function AttendanceList() {
  return (
    <Card variant="elevated" className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <CardHeader>
        <CardTitle>Attendance Records</CardTitle>
        <CardDescription>Today's attendance for CS201 - Data Structures</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockRecords.map((record, index) => {
            const config = statusConfig[record.status];
            const StatusIcon = config.icon;
            
            return (
              <div
                key={record.id}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-secondary/30 animate-fade-in"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                    {record.studentName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium">{record.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {record.time !== "-" ? `Checked in at ${record.time}` : "Not checked in"}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={config.color}>
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {config.label}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
