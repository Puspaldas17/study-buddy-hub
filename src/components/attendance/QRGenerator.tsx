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
import { z } from "zod";

// Validation schema
const classNameSchema = z.string()
  .min(1, "Class name is required")
  .max(100, "Class name must be 100 characters or less")
  .regex(/^[a-zA-Z0-9\s\-_]+$/, "Class name can only contain letters, numbers, spaces, hyphens and underscores");

export function QRGenerator() {
  const [className, setClassName] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [expiresIn, setExpiresIn] = useState(300); // 5 minutes
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { user } = useAuth();

  // Countdown timer
  useEffect(() => {
    if (qrValue && expiresIn > 0) {
      const timer = setInterval(() => {
        setExpiresIn((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setQrValue("");
            setSessionId(null);
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
    // Validate input
    const validationResult = classNameSchema.safeParse(className.trim());
    if (!validationResult.success) {
      toast({
        title: "Invalid class name",
        description: validationResult.error.errors[0].message,
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
      // Generate a unique session code
      const timestamp = Date.now();
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      const sessionCode = `ATTEND-${validationResult.data.replace(/\s+/g, "-")}-${randomPart}-${timestamp}`;
      
      // Calculate expiration time (5 minutes from now)
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

      // Create attendance session in database
      const { data, error } = await supabase
        .from("attendance_sessions")
        .insert({
          creator_id: user.id,
          class_name: validationResult.data,
          session_code: sessionCode,
          expires_at: expiresAt,
          is_active: true,
        })
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      setSessionId(data.id);
      setQrValue(sessionCode);
      setExpiresIn(300);
      
      toast({
        title: "QR Code Generated",
        description: "Students can now scan to mark attendance. Valid for 5 minutes.",
      });
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
