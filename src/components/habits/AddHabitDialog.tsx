import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const colors = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#84cc16", // Lime
];

const categories = [
  "Health & Fitness",
  "Learning",
  "Productivity",
  "Mindfulness",
  "Social",
  "Creative",
];

interface AddHabitDialogProps {
  onAdd: (habit: { name: string; category: string; color: string }) => void;
}

export function AddHabitDialog({ onAdd }: AddHabitDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleSubmit = () => {
    if (!name.trim() || !category) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    onAdd({ name, category, color: selectedColor });
    setOpen(false);
    setName("");
    setCategory("");
    setSelectedColor(colors[0]);

    toast({
      title: "Habit created!",
      description: "Start building your streak today",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Add New Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
          <DialogDescription>
            Set up a new habit to track. Consistency is key!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="habitName">Habit Name</Label>
            <Input
              id="habitName"
              placeholder="e.g., Read for 30 minutes"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  type="button"
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat)}
                  className="text-xs"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`h-8 w-8 rounded-full transition-transform ${
                    selectedColor === color ? "scale-110 ring-2 ring-offset-2 ring-offset-background ring-primary" : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full" variant="gradient">
            Create Habit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
