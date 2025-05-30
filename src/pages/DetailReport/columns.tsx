import { ColumnDef } from '@tanstack/react-table';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StepDetails } from './components/StepDetails';

interface ReportDetail {
  id: string;
  testcase_name: string;
  result: "passed" | "failed" | "skipped";
  error_message?: string;
  evidence_path?: string;
  detail_result: {
    step: string;
    status: "passed" | "failed" | "skipped";
    message?: string;
    sub_steps?: { step: string; status: "passed" | "failed" | "skipped"; message?: string }[];
  }[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "passed":
      return "bg-green-500";
    case "failed":
      return "bg-red-500";
    case "skipped":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

export const createColumns = (): ColumnDef<ReportDetail>[] => [
  {
    accessorKey: "testcase_name",
    header: "Testcase Name",
    cell: ({ row }) => (
      <div className="w-[200px] truncate">
        {row.original.testcase_name}
      </div>
    ),
  },
  {
    accessorKey: "result",
    header: "Result",
    cell: ({ row }) => (
      <div className="w-[100px]">
        <Badge className={getStatusColor(row.original.result)}>
          {row.original.result}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "error_message",
    header: "Error Message",
    cell: ({ row }) => (
      <div className="w-[300px] truncate text-red-500">
        {row.original.error_message || "-"}
      </div>
    ),
  },
  {
    accessorKey: "evidence_path",
    header: "Evidence",
    cell: ({ row }) => (
      <div className="w-[100px]">
        {row.original.evidence_path ? (
          <Button variant="ghost" size="icon" asChild>
            <a href={row.original.evidence_path} target="_blank" rel="noopener noreferrer">
              <Eye className="h-4 w-4" />
            </a>
          </Button>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    id: "details",
    header: "Details",
    cell: ({ row }) => (
      <div className="w-[100px]">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Testcase Details: {row.original.testcase_name}</DialogTitle>
            </DialogHeader>
            <StepDetails steps={row.original.detail_result} />
          </DialogContent>
        </Dialog>
      </div>
    ),
  },
]; 