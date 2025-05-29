import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TestFile } from "@/services/testfiles";
import { Download } from "lucide-react";
import { API_CONFIG } from "@/config/env";

export const getStatusColor = (status: TestFile["status"]) => {
  switch (status) {
    case "success":
      return "bg-green-500";
    case "failed":
      return "bg-red-500";
    case "pending":
      return "bg-yellow-500";
    case "processing":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

const getProgressColor = (progress: number) => {
  if (progress <= 10) return "bg-rose-400";
  if (progress <= 30) return "bg-orange-400";
  if (progress <= 50) return "bg-amber-400";
  if (progress <= 70) return "bg-sky-400";
  return "bg-emerald-400";
};

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const createColumns = (
  navigate: (path: string) => void,
  uploadProgress: Record<string, number>
): ColumnDef<TestFile>[] => [
  {
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "test_file_name",
    header: "Test File Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="space-y-2">
        <Badge className={getStatusColor(row.original.status)}>
          {capitalizeFirstLetter(row.original.status)}
        </Badge>
        {row.original.status === "processing" && uploadProgress[row.original._id] !== undefined && (
          <Progress 
            value={uploadProgress[row.original._id]} 
            className="w-full bg-gray-200"
            indicatorClassName={`transition-colors duration-300 ${getProgressColor(uploadProgress[row.original._id])}`}
          />
        )}
      </div>
    ),
  },
  // {
  //   accessorKey: "input_variables",
  //   header: "Input Variables",
  //   cell: ({ row }) => <p>{row.original.input_variables}</p>,
  // },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        variant="outline"
        onClick={() => navigate(`/test-files/${row.original._id}`)}
      >
        View Details
      </Button>
    ),
  },
  {
    accessorKey: "url",
    header: "File",
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => window.open(`${API_CONFIG.BASE_URL}${row.original.url}`, '_blank')}
      >
        <Download className="h-4 w-4" />
        Download
      </Button>
    ),
  },
]; 