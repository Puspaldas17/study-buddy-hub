import { FileText, Star, Download, User, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Note {
  id: string;
  title: string;
  subject: string;
  author: string;
  uploadDate: string;
  rating: number;
  downloads: number;
  fileSize: string;
  tags: string[];
}

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Card variant="interactive" className="group animate-fade-in">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {note.title}
              </h3>
              <p className="text-sm text-muted-foreground">{note.subject}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {note.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {note.uploadDate}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-streak text-streak" />
                  <span className="text-sm font-medium">{note.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {note.downloads} downloads
                </span>
              </div>
              <Button size="sm" variant="ghost">
                <Download className="mr-2 h-4 w-4" />
                {note.fileSize}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
