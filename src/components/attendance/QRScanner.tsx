import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type ScanStatus = "idle" | "scanning" | "success" | "error";

export function QRScanner() {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [scannedData, setScannedData] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanning = async () => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      setStatus("scanning");
      setScannedData(null);

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
    // Validate the QR code format
    if (decodedText.startsWith("ATTEND-")) {
      await stopScanning();
      setScannedData(decodedText);
      setStatus("success");

      // Parse the attendance code
      const parts = decodedText.split("-");
      const className = parts.slice(1, -1).join(" ");

      toast({
        title: "Attendance Marked!",
        description: `Successfully checked in for ${className}`,
      });
    } else {
      setStatus("error");
      toast({
        title: "Invalid QR Code",
        description: "This QR code is not a valid attendance code.",
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

          {status === "success" && (
            <div className="aspect-square flex flex-col items-center justify-center gap-4 p-8 animate-scale-in">
              <div className="rounded-full bg-success/20 p-6">
                <CheckCircle2 className="h-12 w-12 text-success" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Attendance Marked!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {scannedData?.split("-").slice(1, -1).join(" ")}
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
                Could not access camera or invalid QR code
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
