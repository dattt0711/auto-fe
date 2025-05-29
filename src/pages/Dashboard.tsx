import { TableComponent } from "@/components/base/TableComponent";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { ColumnDef } from '@tanstack/react-table'
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EditTestcaseModal } from "@/components/testcase/EditTestcaseModal";
import { useQuery } from '@tanstack/react-query';
import { Testcase, getTestcases } from '@/services/testcase';

export default function Dashboard() {
  const [selectedTestcase, setSelectedTestcase] = useState<Testcase | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ['testcases', page, pageSize],
    queryFn: () => getTestcases(page, pageSize),
  });

  const handleEdit = (testcase: Testcase) => {
    setSelectedTestcase(testcase);
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedTestcase: Testcase) => {
    // This will be handled by the mutation in a real application
    console.log('Updated testcase:', updatedTestcase);
  };

  const columns: ColumnDef<Testcase>[] = [
    {
      accessorKey: 'item_no',
      header: 'Item No',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'step_confirm',
      header: 'Step Confirm',
      cell: info => (
        <div className="whitespace-pre-line text-sm">
          {info.getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: 'expectation_result',
      header: 'Expectation Result',
      cell: info => info.getValue(),
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            Edit
          </Button>
          <Button variant="outline" size="sm">Update</Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Dashboard</PageHeaderHeading>
      </PageHeader>
      <Card>
        <CardHeader>
          <TableComponent 
            columns={columns} 
            data={[]} 
            // data={data?.data?.map((item: any) => item.data) ?? []} 
            isLoading={isLoading}
            pagination={{
              pageCount: data ? Math.ceil(data.total / data.limit) : 0,
              pageIndex: page - 1,
              pageSize,
              onPageChange: (newPage) => setPage(newPage + 1),
              onPageSizeChange: setPageSize,
            }}
          />
        </CardHeader>
      </Card>
      <EditTestcaseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        testcase={selectedTestcase}
        onSave={handleSave}
      />
    </>
  );
}
