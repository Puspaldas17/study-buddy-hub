import { QRGenerator } from "@/components/attendance/QRGenerator";
import { AttendanceList } from "@/components/attendance/AttendanceList";

export default function Attendance() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">
          Generate QR codes and track class attendance
        </p>
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <QRGenerator />
        <AttendanceList />
      </div>
    </div>
  );
}
