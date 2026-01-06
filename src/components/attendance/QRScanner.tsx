import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

type ScanStatus = "idle" | "scanning" | "processing" | "success" | "error";

// Basic validation schema for QR code format (server will do full validation)
const qrCodeSchema = z.string()
  .min(1, "QR code cannot be empty")
  .max(200, "QR code too long")
  .startsWith("ATTEND-", "Not a valid attendance code");

export function QRScanner() {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string>("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const startScanning = async () => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      setStatus("scanning");
      setScannedData(null);
      setResultMessage("");

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {
          // Ignore scan errors (no QR found in frame)
        }
      );
    } catch (error) {
      console.error("Failed to start scanner:", error);
      setStatus("error");
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }
    setStatus("idle");
  };

  const handleScanSuccess = async (decodedText: string) => {
    // Stop scanning first
    await stopScanning();
    setStatus("processing");
    
    // Basic client-side validation (server does full validation)
    const validationResult = qrCodeSchema.safeParse(decodedText);
    
    if (!validationResult.success) {
      setStatus("error");
      setResultMessage("This is not a valid attendance QR code");
      toast({
        title: "Invalid QR Code",
        description: "This QR code is not a valid attendance code.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      setStatus("error");
      setResultMessage("Please sign in to mark attendance");
      toast({
        title: "Not Authenticated",
        description: "Please sign in to mark attendance.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call the server-side RPC function for validation
      const { data, error } = await supabase.rpc("validate_and_record_attendance", {
        p_attendance_code: decodedText,
      });

      if (error) {
        throw error;
      }

      // Parse the response - it's returned as JSONB from the function
      const result = data as {
        success: boolean;
        class_name?: string;
        already_recorded?: boolean;
        message?: string;
        error?: string;
      } | null;

      // Handle the response from the server
      if (result && result.success) {
        setScannedData(decodedText);
        setResultMessage(result.class_name || "");
        setStatus("success");

        if (result.already_recorded) {
          toast({
            title: "Already Checked In",
            description: `You have already marked attendance for ${result.class_name}`,
          });
        } else {
          toast({
            title: "Attendance Marked!",
            description: `Successfully checked in for ${result.class_name}`,
          });
        }
      } else {
        setStatus("error");
        const errorMessage = result?.error || "Invalid or expired attendance code";
        setResultMessage(errorMessage);
        toast({
          title: "Invalid Code",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to record attendance:", error);
      setStatus("error");
      setResultMessage("Failed to verify attendance code");
      toast({
        title: "Error",
        description: "Failed to record attendance. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop();
      }
    };
  }, []);

  return (
    <Card variant="elevated" className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Scan Attendance QR
        </CardTitle>
        <CardDescription>
          Point your camera at the QR code to mark attendance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scanner Container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-2xl bg-muted/50 border border-border"
        >
          <div
            id="qr-reader"
            className={`w-full aspect-square ${status !== "scanning" ? "hidden" : ""}`}
          />

          {status === "idle" && (
            <div className="aspect-square flex flex-col items-center justify-center gap-4 p-8">
              <div className="rounded-full bg-primary/10 p-6">
                <Camera className="h-12 w-12 text-primary" />
              </div>
              <p className="text-center text-muted-foreground">
                Click the button below to start scanning
              </p>
            </div>
          )}

          {status === "processing" && (
            <div className="aspect-square flex flex-col items-center justify-center gap-4 p-8">
              <div className="rounded-full bg-primary/10 p-6">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
              <p className="text-center text-muted-foreground">
                Verifying attendance code...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="aspect-square flex flex-col items-center justify-center gap-4 p-8 animate-scale-in">
              <div className="rounded-full bg-success/20 p-6">
                <CheckCircle2 className="h-12 w-12 text-success" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Attendance Marked!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {resultMessage}
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="aspect-square flex flex-col items-center justify-center gap-4 p-8">
              <div className="rounded-full bg-destructive/20 p-6">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
              <p className="text-center text-muted-foreground">
                {resultMessage || "Could not access camera or invalid QR code"}
              </p>
            </div>
          )}
        </div>

        {/* Control Button */}
        {status === "scanning" ? (
          <Button onClick={stopScanning} variant="outline" className="w-full">
            <CameraOff className="mr-2 h-4 w-4" />
            Stop Scanning
          </Button>
        ) : status === "processing" ? (
          <Button disabled variant="outline" className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </Button>
        ) : (
          <Button onClick={startScanning} variant="gradient" className="w-full">
            <Camera className="mr-2 h-4 w-4" />
            {status === "success" ? "Scan Another" : "Start Scanning"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
