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
import { ImagePreviewDialog } from './components/ImagePreviewDialog';
import { API_CONFIG } from '@/config/env';

interface ReportDetail {
  id: string;
  test_case_id: {
    data: {
      item_no: string;
      step_confirm: string;
    }
  };
  status: "success" | "failed";
  error_message?: string;
  evidence_path?: string;
  detail_result: {
    step: string;
    isSuccess: boolean;
    description: string;
    errorMessage?: string;
  }[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "success":
    case "passed":
      return "bg-green-500";
    case "failed":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const createColumns = (): ColumnDef<ReportDetail>[] => [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => (
      <div className="w-[100px] font-medium">
        {row.original.test_case_id.data.item_no}
      </div>
    ),
  },
  {
    accessorKey: "test_case_id",
    header: "Step Confirm",
    cell: ({ row }) => {
      const steps = row.original.test_case_id.data.step_confirm;
      return (
        <div className="w-[250px]">
          <div className="whitespace-pre-line text-sm space-y-1">
            {steps.split('\n').map((step, index) => (
              <div key={index} className="flex items-start gap-2">
                {/* <span className="font-medium text-muted-foreground min-w-[20px]">
                  {index + 1}.
                </span> */}
                <span>{step.trim()}</span>
              </div>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="w-[100px]">
        <Badge className={getStatusColor(row.original.status)}>
          {row.original.status === "success" ? "passed" : row.original.status}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "evidence_path",
    header: "Evidence",
    cell: ({ row }) => (
      <div className="w-[100px]">
        <ImagePreviewDialog imageUrl={`${API_CONFIG.BASE_URL}${row.original.evidence_path}`} />
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
              <DialogTitle>Testcase Details: {row.original.test_case_id.data.step_confirm}</DialogTitle>
            </DialogHeader>
            <StepDetails steps={row.original.detail_result} />
          </DialogContent>
        </Dialog>
      </div>
    ),
  },
]; 