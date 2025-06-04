import { ColumnDef } from '@tanstack/react-table'
import { Button } from "@/components/ui/button";
import { Testcase } from "@/services/testcase";
import { Play } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColumnsProps {
  onEdit: (testcase: Testcase) => void;
  onRun: (testcase: Testcase) => void;
}

export const createColumns = ({ onEdit, onRun }: ColumnsProps): ColumnDef<Testcase>[] => [
  {
    accessorKey: 'row_index',
    header: 'Row Index',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'data',
    header: 'Step confirm',
    cell: info => {
      const stepConfirm = (info.getValue() as { step_confirm: string }).step_confirm;
      return (
        <div className="whitespace-pre-line text-sm">
          {stepConfirm.split('\n').map((step, index) => (
            <div key={index} className="mb-1">
              {step}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'is_processed',
    header: 'Processed',
    cell: info => info.getValue() ? "Yes" : "No",
  },
  // {
  //   accessorKey: 'automation_code',
  //   header: 'Automation Code',
  //   cell: info => (
  //     <div className="whitespace-pre-line text-sm">
  //       {JSON.stringify(info.getValue(), null, 2)}
  //     </div>
  //   ),
  // },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const testcase = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRun(testcase)}
            className="flex items-center gap-1"
          >
            <Play className="h-3 w-3" />
            Run
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(testcase)}>
                Edit Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
]; 