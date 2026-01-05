import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRGenerator } from "@/components/attendance/QRGenerator";
import { QRScanner } from "@/components/attendance/QRScanner";
import { AttendanceList } from "@/components/attendance/AttendanceList";

export default function Attendance() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">
          Generate or scan QR codes to track class attendance
        </p>
      </div>

      {/* Tabs for Teacher/Student views */}
      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="student">I'm a Student</TabsTrigger>
          <TabsTrigger value="teacher">I'm a Teacher</TabsTrigger>
        </TabsList>

        <TabsContent value="student" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <QRScanner />
            <AttendanceList />
          </div>
        </TabsContent>

        <TabsContent value="teacher" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <QRGenerator />
            <AttendanceList />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
