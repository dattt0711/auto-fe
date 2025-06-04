import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Download } from "lucide-react";
import { TestFile } from "@/services/testfiles";
import { API_CONFIG } from "@/config/env";

export const createColumns = (
  navigate: (path: string) => void,
  uploadProgress: Record<string, number>,
  onDelete: (file: TestFile) => void
): ColumnDef<TestFile>[] => [
  {
    accessorKey: "test_file_name",
    header: "Name",
    cell: ({ row }) => (
      <div
        className="cursor-pointer hover:underline"
        onClick={() => navigate(`/test-files/${row.original._id}`)}
      >
        {row.original.test_file_name}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="w-[150px]">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      const progress = uploadProgress[row.original._id];
      if (status === "processing" && progress !== undefined) {
        return (
          <div className="flex items-center gap-2 w-[150px]">
            <Badge variant="outline">Processing</Badge>
            <div className="text-sm text-muted-foreground">{progress}%</div>
          </div>
        );
      }

      return (
        <div className="w-[150px]">
          <Badge
            className={
              status === "success"
                ? "bg-green-500"
                : status === "failed"
                ? "bg-red-500"
                : "bg-yellow-500"
            }
          >
            <span className="capitalize">{status}</span>
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.open(`${API_CONFIG.BASE_URL}/${row.original.url}`, '_blank')}
          title="Download"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/test-files/${row.original._id}`)}
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.original)}
          title="Delete"
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]; 