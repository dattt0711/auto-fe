import { ColumnDef } from '@tanstack/react-table'
import { Button } from "@/components/ui/button";
import { Testcase } from "@/services/testcase";

interface ColumnsProps {
  onEdit: (testcase: Testcase) => void;
}

export const createColumns = ({ onEdit }: ColumnsProps): ColumnDef<Testcase>[] => [
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
    cell: info => info.getValue() ? 'Yes' : 'No',
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
    header: 'Action',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(row.original)}
        >
          Edit
        </Button>
        <Button variant="outline" size="sm">Update</Button>
      </div>
    ),
  },
]; 