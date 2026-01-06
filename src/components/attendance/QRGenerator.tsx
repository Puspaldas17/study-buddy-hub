import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { RefreshCw, Copy, Check, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function QRGenerator() {
  const [className, setClassName] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [expiresIn, setExpiresIn] = useState(300); // 5 minutes
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  // Countdown timer
  useEffect(() => {
    if (qrValue && expiresIn > 0) {
      const timer = setInterval(() => {
        setExpiresIn((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setQrValue("");
            toast({
              title: "QR Code Expired",
              description: "Generate a new QR code for attendance",
              variant: "destructive",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [qrValue]);

  const generateQR = async () => {
    // Basic client-side check (server does full validation)
    if (!className.trim()) {
      toast({
        title: "Class name required",
        description: "Please enter a class name to generate QR code",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please sign in to generate attendance codes",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Call the secure server-side RPC function
      const { data, error } = await supabase.rpc("create_attendance_session", {
        p_class_name: className.trim(),
        p_duration_minutes: 5,
      });

      if (error) {
        throw error;
      }

      // Parse the response
      const result = data as {
        success: boolean;
        session_code?: string;
        class_name?: string;
        expires_at?: string;
        duration_minutes?: number;
        error?: string;
      } | null;

      if (result && result.success) {
        setQrValue(result.session_code || "");
        setExpiresIn(300); // 5 minutes
        
        toast({
          title: "QR Code Generated",
          description: "Students can now scan to mark attendance. Valid for 5 minutes.",
        });
      } else {
        const errorMessage = result?.error || "Failed to generate attendance code";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      toast({
        title: "Error",
        description: "Failed to generate attendance code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
            maxLength={100}
            disabled={isGenerating}
          />
          <p className="text-xs text-muted-foreground">
            Letters, numbers, spaces, hyphens and underscores only
          </p>
        </div>

        <Button 
          onClick={generateQR} 
          className="w-full" 
          variant="gradient"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {isGenerating ? "Generating..." : "Generate QR Code"}
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
