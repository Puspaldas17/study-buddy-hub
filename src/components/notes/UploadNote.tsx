import { useState } from "react";
import { Upload, FileText, X, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { UploadProgress } from "@/components/loading/UploadProgress";
import { useUploadProgress } from "@/hooks/useUploadProgress";

export function UploadNote() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const upload = useUploadProgress();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !subject) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select a file",
        variant: "destructive",
      });
      return;
    }

    // Simulate upload with progress
    upload.startUpload();
    
    // Simulate progress updates
    const totalDuration = 2500;
    const steps = [10, 25, 45, 65, 80, 95, 100];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, totalDuration / steps.length));
      upload.updateProgress(steps[i]);
    }
    
    upload.completeUpload();

    toast({
      title: "Note uploaded successfully!",
      description: "Your notes are now available for other students",
    });

    // Reset after showing success
    setTimeout(() => {
      setFile(null);
      setTitle("");
      setSubject("");
      upload.resetUpload();
    }, 2000);
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  return (
    <Card variant="elevated" className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Notes
        </CardTitle>
        <CardDescription>Share your study materials with classmates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {upload.status !== "idle" ? (
          <UploadProgress
            progress={upload.progress}
            status={upload.status}
            fileName={file?.name}
            fileSize={file ? formatFileSize(file.size) : undefined}
            onCancel={upload.cancelUpload}
          />
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200 ${
              isDragging 
                ? "border-primary bg-primary/5 scale-[1.02]" 
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFile(null)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop your file here, or{" "}
                  <label className="cursor-pointer text-primary hover:underline">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                    />
                  </label>
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOC, DOCX, PPT up to 10MB
                </p>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Note Title</Label>
            <Input
              id="title"
              placeholder="e.g., Chapter 5 Summary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={upload.status === "uploading"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g., Data Structures"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={upload.status === "uploading"}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleUpload} 
            className="flex-1" 
            variant="gradient"
            disabled={upload.status === "uploading" || upload.status === "success"}
          >
            {upload.status === "uploading" ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-pulse" />
                Uploading...
              </>
            ) : upload.status === "success" ? (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Uploaded!
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Notes
              </>
            )}
          </Button>
          <Button variant="outline" className="gap-2" disabled={upload.status === "uploading"}>
            <Sparkles className="h-4 w-4" />
            AI Summarize
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
