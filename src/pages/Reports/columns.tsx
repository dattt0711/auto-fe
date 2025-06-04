import { ColumnDef } from '@tanstack/react-table';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface Report {
  _id: string;
  report_name: string;
  progress: number;
  status:  "running" | "success" | "failed";
}

const getStatusColor = (status: Report["status"]) => {
  switch (status) {
    case "success":
      return "bg-green-500";
    case "running":
      return "bg-yellow-500";
    case "failed":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getProgressColor = (progress: number) => {
  if (progress <= 25) return "bg-rose-400";
  if (progress <= 50) return "bg-orange-400";
  if (progress <= 75) return "bg-amber-400";
  return "bg-emerald-400";
};

export const createColumns = (navigate: (path: string) => void): ColumnDef<Report>[] => [
  {
    accessorKey: "name",
    header: "Report Name",
    cell: ({ row }: { row: { original: Report } }) => (
      <div 
        className="w-[150px] truncate cursor-pointer hover:underline"
        onClick={() => navigate(`/reports/${row.original._id}`)}
      >
        {row.original.report_name}
      </div>
    ),
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }: { row: { original: Report } }) => (
      <div className="relative w-[300px]">
        <Progress 
          value={row.original.progress} 
          className="w-full bg-gray-200 h-4"
          indicatorClassName={`transition-colors duration-300 ${getProgressColor(row.original.progress)}`}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
          {row.original.progress}%
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: { original: Report } }) => (
      <div className="w-[200px]">
        <Badge className={getStatusColor(row.original.status)}>
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </Badge>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: { original: Report } }) => (
      <div className="w-[100px]">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/reports/${row.original._id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]; 