import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { RefreshCw, Copy, Check, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export function QRGenerator() {
  const [className, setClassName] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [expiresIn, setExpiresIn] = useState(300); // 5 minutes

  const generateQR = () => {
    if (!className.trim()) {
      toast({
        title: "Class name required",
        description: "Please enter a class name to generate QR code",
        variant: "destructive",
      });
      return;
    }

    const timestamp = Date.now();
    const code = `ATTEND-${className.replace(/\s+/g, "-")}-${timestamp}`;
    setQrValue(code);
    setExpiresIn(300);
    
    toast({
      title: "QR Code Generated",
      description: "Students can now scan to mark attendance",
    });
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Code copied!",
      description: "Attendance code copied to clipboard",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card variant="elevated" className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Generate Attendance QR
        </CardTitle>
        <CardDescription>
          Create a unique QR code for your class session
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="className">Class Name</Label>
          <Input
            id="className"
            placeholder="e.g., CS201 - Data Structures"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
        </div>

        <Button onClick={generateQR} className="w-full" variant="gradient">
          <RefreshCw className="mr-2 h-4 w-4" />
          Generate QR Code
        </Button>

        {qrValue && (
          <div className="space-y-4 animate-scale-in">
            <div className="flex justify-center">
              <div className="rounded-2xl bg-card p-6 shadow-lg border border-border">
                <QRCodeSVG
                  value={qrValue}
                  size={200}
                  bgColor="transparent"
                  fgColor="hsl(210, 40%, 98%)"
                  level="H"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Expires in: <span className="font-mono font-medium text-foreground">{formatTime(expiresIn)}</span>
            </div>

            <div className="flex gap-2">
              <Input value={qrValue} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={copyCode}>
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
