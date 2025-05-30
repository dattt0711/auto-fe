import { TableComponent } from "@/components/base/TableComponent";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { testFilesService, TestFile } from '@/services/testfiles';
import { getTestcasesByFileId, Testcase, TestcasePaginationResponse } from '@/services/testcase';
import { TestcaseDetailModal } from './components/TestcaseDetailModal';
import { createColumns } from './components/columns';

export default function DetailTestFile() {
  const { id } = useParams();
  const [selectedTestcase, setSelectedTestcase] = useState<Testcase | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: testFile, isLoading: isLoadingTestFile } = useQuery<TestFile>({
    queryKey: ['detail-test-file', id],
    queryFn: () => testFilesService.getTestFileById(id as string),
  });

  const { data: testcases, isLoading: isLoadingTestcases } = useQuery<TestcasePaginationResponse>({
    queryKey: ['testcases', id, page, pageSize],
    queryFn: () => getTestcasesByFileId(id as string, page, pageSize),
  });

  const handleEdit = (testcase: Testcase) => {
    setSelectedTestcase(testcase);
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedTestcase: Testcase) => {
    // This will be handled by the mutation in a real application
    console.log('Updated testcase:', updatedTestcase);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage + 1); // Convert from 0-based to 1-based index
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  const columns = createColumns({ onEdit: handleEdit });

  if (isLoadingTestFile) {
    return <div>Loading...</div>;
  }
  console.log(testFile, "testFile")
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Test File Details</PageHeaderHeading>
      </PageHeader>

      {/* File Information Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>File Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Name:</label>
              <div>{testFile?.test_file_name}</div>
            </div>
            <div>
              <label className="font-medium">Status:</label>
              <div>{testFile?.status}</div>
            </div>
            <div>
              <label className="font-medium">URL:</label>
              <div>{testFile?.url}</div>
            </div>
            <div>
              <label className="font-medium">Input Variables:</label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testcases Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Testcases</CardTitle>
            <div className="text-sm text-muted-foreground">
              Total Documents: {testcases?.total ?? 0}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TableComponent 
            columns={columns} 
            data={testcases?.data ?? []}
            isLoading={isLoadingTestcases}
            pagination={{
              pageCount: testcases ? Math.ceil(testcases.total / testcases.limit) : 0,
              pageIndex: page - 1, // Convert to 0-based index for the table
              pageSize,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
          />
        </CardContent>
      </Card>

      <TestcaseDetailModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        testcase={selectedTestcase}
        onSave={handleSave}
      />
    </>
  );
} 