import { TableComponent } from "@/components/base/TableComponent";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { testFilesService, TestFile } from '@/services/testfiles';
import { getTestcasesByFileId, Testcase, TestcasePaginationResponse, runTestcase } from '@/services/testcase';
import { TestcaseDetailModal } from './components/TestcaseDetailModal';
import { createColumns } from './components/columns';
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function DetailTestFile() {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedTestcase, setSelectedTestcase] = useState<Testcase | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [isRunTestcaseDialogOpen, setIsRunTestcaseDialogOpen] = useState(false);
  const [reportName, setReportName] = useState("");
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

  // Run testcase mutation
  const runTestcaseMutation = useMutation({
    mutationFn: ({ testcaseId, reportName }: { testcaseId: string; reportName: string }) =>
      runTestcase(testcaseId, reportName),
    onSuccess: (data) => {
      if (!data.isSuccess) {
        toast({
          title: "Error",
          description: data.message || "Failed to run testcase",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Testcase execution started",
        variant: "success",
      });

      // Navigate to the report detail page
      // navigate(`/reports/${data.report_id}`);
    },
    onError: (error: unknown) => {
      console.error("Run testcase error:", error);
      toast({
        title: "Error",
        description: "Failed to run testcase",
        variant: "destructive",
      });
    },
  });

  // Run all testcases mutation
  const runAllMutation = useMutation({
    mutationFn: ({ fileId, reportName }: { fileId: string; reportName: string }) =>
      testFilesService.runAllTestFile(fileId, reportName),
    onSuccess: (data) => {
      if (!data.isSuccess) {
        toast({
          title: "Error",
          description: data.message || "Failed to run all testcases",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Test file execution started",
        variant: "success",
      });

      // Navigate to the report detail page
      // navigate(`/reports/${data.report_id}`);
    },
    onError: (error: unknown) => {
      console.error("Run all testcases error:", error);
      toast({
        title: "Error",
        description: "Failed to run all testcases",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (testcase: Testcase) => {
    setSelectedTestcase(testcase);
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedTestcase: Testcase) => {
    // This will be handled by the mutation in a real application
    console.log('Updated testcase:', updatedTestcase);
  };

  const handleRunTestcase = (testcase: Testcase) => {
    if (testFile?.status !== "success") {
      toast({
        title: "Cannot run testcase",
        description: "The test file must be in success status to run testcases",
        variant: "destructive",
      });
      return;
    }
    setSelectedTestcase(testcase);
    setIsRunTestcaseDialogOpen(true);
  };

  const handleRunTestcaseSubmit = () => {
    if (!reportName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a report name",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTestcase) return;

    runTestcaseMutation.mutate({
      testcaseId: selectedTestcase._id,
      reportName: reportName.trim(),
    });
    
    setIsRunTestcaseDialogOpen(false);
    setReportName("");
    setSelectedTestcase(null);
  };

  const handleRun = () => {
    setIsRunDialogOpen(true);
  };

  const handleRunSubmit = () => {
    if (!reportName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a report name",
        variant: "destructive",
      });
      return;
    }

    if (!id) return;

    runAllMutation.mutate({
      fileId: id,
      reportName: reportName.trim(),
    });
    
    setIsRunDialogOpen(false);
    setReportName("");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage + 1); // Convert from 0-based to 1-based index
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  const columns = createColumns({ 
    onEdit: handleEdit,
    onRun: handleRunTestcase 
  });

  if (isLoadingTestFile) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Test File Details</PageHeaderHeading>
      </PageHeader>

      {/* File Information Card */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>File Information</CardTitle>
          <Button
            variant="outline"
            onClick={handleRun}
            className="flex items-center gap-2"
            disabled={testFile?.status !== "success"}
          >
            <Play className="h-4 w-4" />
            Run Test File
          </Button>
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
              <div className="mt-2">
                <pre className="whitespace-pre-wrap">
                  {testFile?.input_variables || "No input variables"}
                </pre>
              </div>
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

      {/* Run Test File Dialog */}
      <Dialog open={isRunDialogOpen} onOpenChange={setIsRunDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Test File</DialogTitle>
            <DialogDescription>
              Enter a report name to run this test file. The report will contain the results of all testcases.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reportName">Report Name</Label>
              <Input
                id="reportName"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsRunDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRunSubmit}>
                Run
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Run Testcase Dialog */}
      <Dialog open={isRunTestcaseDialogOpen} onOpenChange={setIsRunTestcaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Testcase</DialogTitle>
            <DialogDescription>
              Enter a report name to run this testcase. The report will contain the results of this specific testcase.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="testcaseReportName">Report Name</Label>
              <Input
                id="testcaseReportName"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsRunTestcaseDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRunTestcaseSubmit}>
                Run
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 