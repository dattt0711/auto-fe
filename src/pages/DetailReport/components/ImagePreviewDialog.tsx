import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface ImagePreviewDialogProps {
  imageUrl?: string;
}

export const ImagePreviewDialog = ({ imageUrl }: ImagePreviewDialogProps) => {
  const defaultImage = "https://placehold.co/600x400?text=No+Image+Available";
  const imageSrc = imageUrl || defaultImage;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Evidence Preview</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <img
            src={imageSrc}
            alt="Evidence"
            className="object-contain w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}; 