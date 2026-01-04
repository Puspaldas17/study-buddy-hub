import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadNote } from "@/components/notes/UploadNote";
import { NoteCard, Note } from "@/components/notes/NoteCard";

const mockNotes: Note[] = [
  {
    id: "1",
    title: "Data Structures - Complete Guide",
    subject: "Computer Science",
    author: "Alex Johnson",
    uploadDate: "Jan 14, 2024",
    rating: 4.8,
    downloads: 156,
    fileSize: "2.4 MB",
    tags: ["Arrays", "Trees", "Graphs"],
  },
  {
    id: "2",
    title: "Calculus III - Integration Techniques",
    subject: "Mathematics",
    author: "Sarah Williams",
    uploadDate: "Jan 12, 2024",
    rating: 4.6,
    downloads: 89,
    fileSize: "1.8 MB",
    tags: ["Integration", "Multivariable"],
  },
  {
    id: "3",
    title: "Machine Learning Fundamentals",
    subject: "AI & ML",
    author: "Mike Chen",
    uploadDate: "Jan 10, 2024",
    rating: 4.9,
    downloads: 234,
    fileSize: "5.2 MB",
    tags: ["Neural Networks", "Supervised Learning"],
  },
  {
    id: "4",
    title: "Database Design Principles",
    subject: "Computer Science",
    author: "Emily Davis",
    uploadDate: "Jan 8, 2024",
    rating: 4.5,
    downloads: 67,
    fileSize: "1.5 MB",
    tags: ["SQL", "Normalization", "ER Diagrams"],
  },
];

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = mockNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
        <p className="text-muted-foreground">
          Share and discover study materials from your peers
        </p>
      </div>

      {/* Upload Section */}
      <UploadNote />

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes by title, subject, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Notes Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredNotes.map((note, index) => (
          <div key={note.id} style={{ animationDelay: `${0.05 * index}s` }}>
            <NoteCard note={note} />
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No notes found matching your search.</p>
        </div>
      )}
    </div>
  );
}
