import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import React from "react";

interface UploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, testFileName: string) => void;
  isUploading: boolean;
  uploadProgress?: number;
}

export function UploadDialog({
  isOpen,
  onOpenChange,
  onUpload,
  isUploading,
  uploadProgress,
}: UploadDialogProps) {
  const { toast } = useToast();
  const [testFileName, setTestFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Reset form when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      setTestFileName("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (
        file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        file.type !== "application/vnd.ms-excel"
      ) {
        toast({
          title: "Invalid file type",
          description: "Please upload an Excel file (.xlsx or .xls)",
          variant: "destructive",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!testFileName.trim() || !selectedFile) {
      toast({
        title: "Missing information",
        description: "Please enter a test file name and select a file",
        variant: "warning",
      });
      return;
    }

    onUpload(selectedFile, testFileName);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <Upload className="mr-2 h-4 w-4" />
          Upload Test File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Test File</DialogTitle>
          <DialogDescription>
            Upload an Excel file (.xlsx or .xls) to create a new test file.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="test-file-name">Test File Name</Label>
            <Input
              id="test-file-name"
              value={testFileName}
              onChange={(e) => setTestFileName(e.target.value)}
              placeholder="Enter test file name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="file-upload">Select Excel File</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              id="file-upload"
            />
          </div>
          {selectedFile && (
            <div className="text-sm text-muted-foreground">
              Selected file: {selectedFile.name}
            </div>
          )}
          {uploadProgress !== undefined && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Uploading file... {uploadProgress}%
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button className="cursor-pointer" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="cursor-pointer" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 