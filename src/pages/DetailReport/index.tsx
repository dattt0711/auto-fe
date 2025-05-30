import { TableComponent } from "@/components/base/TableComponent";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { reportsService, Report } from '@/services/reports';
import { createColumns } from './columns';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

// Dummy data for UI review
const mockReportDetails: ReportDetail[] = [
  {
    id: "1",
    testcase_name: "Login Test",
    result: "passed",
    evidence_path: "/evidence/login_test.png",
    detail_result: [
      {
        step: "Initialize Test Environment",
        status: "passed",
        sub_steps: [
          { step: "Load test configuration", status: "passed" },
          { step: "Setup test data", status: "passed" }
        ]
      },
      {
        step: "Login Process",
        status: "passed",
        sub_steps: [
          { step: "Navigate to login page", status: "passed" },
          { step: "Enter credentials", status: "passed" },
          { step: "Click login button", status: "passed" }
        ]
      },
      {
        step: "Verify Dashboard",
        status: "passed",
        sub_steps: [
          { step: "Check user profile", status: "passed" },
          { step: "Verify navigation menu", status: "passed" },
          { step: "Validate welcome message", status: "passed" }
        ]
      }
    ]
  },
  {
    id: "2",
    testcase_name: "Payment Process",
    result: "failed",
    error_message: "Payment gateway timeout",
    evidence_path: "/evidence/payment_error.png",
    detail_result: [
      {
        step: "Setup Payment",
        status: "passed",
        sub_steps: [
          { step: "Select payment method", status: "passed" },
          { step: "Enter card details", status: "passed" }
        ]
      },
      {
        step: "Process Payment",
        status: "failed",
        message: "Gateway timeout after 30s",
        sub_steps: [
          { step: "Validate card details", status: "passed" },
          { step: "Initiate payment", status: "failed", message: "Gateway timeout after 30s" },
          { step: "Verify transaction", status: "skipped" }
        ]
      }
    ]
  },
  {
    id: "3",
    testcase_name: "User Registration",
    result: "skipped",
    detail_result: [
      {
        step: "Registration Form",
        status: "skipped",
        sub_steps: [
          { step: "Fill personal information", status: "skipped" },
          { step: "Enter contact details", status: "skipped" }
        ]
      },
      {
        step: "Account Setup",
        status: "skipped",
        sub_steps: [
          { step: "Create username", status: "skipped" },
          { step: "Set password", status: "skipped" }
        ]
      },
      {
        step: "Verification",
        status: "skipped",
        sub_steps: [
          { step: "Email verification", status: "skipped" },
          { step: "Phone verification", status: "skipped" }
        ]
      }
    ]
  }
];

export default function DetailReport() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: report, isLoading: isLoadingReport } = useQuery<Report>({
    queryKey: ['detail-report', id],
    queryFn: () => reportsService.getReportById(id as string),
  });

  // In a real app, this would be an API call
  const { data: reportDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['report-details', id, page, pageSize],
    queryFn: () => Promise.resolve({
      data: mockReportDetails,
      total: mockReportDetails.length,
      page,
      limit: pageSize
    }),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage + 1);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
      case "passed":
        return "bg-green-500";
      case "running":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      case "skipped":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const columns = createColumns();

  if (isLoadingReport) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Report Details</PageHeaderHeading>
      </PageHeader>

      {/* Report Information Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Name:</label>
              <div>{report?.report_name}</div>
            </div>
            <div>
              <label className="font-medium">Status:</label>
              <div>
                <Badge className={getStatusColor(report?.status || "")}>
                  {report?.status}
                </Badge>
              </div>
            </div>
            <div className="col-span-2">
              <label className="font-medium">Progress:</label>
              <div className="w-full max-w-md">
                <Progress 
                  value={report?.progress} 
                  className="w-full bg-gray-200 h-4"
                  indicatorClassName={`transition-colors duration-300 ${getStatusColor(report?.status || "")}`}
                />
                <span className="text-sm text-muted-foreground mt-1">
                  {report?.progress}% Complete
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testcase Results Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Testcase Results</CardTitle>
            <div className="text-sm text-muted-foreground">
              Total Results: {reportDetails?.total ?? 0}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TableComponent 
            columns={columns} 
            data={reportDetails?.data ?? []}
            isLoading={isLoadingDetails}
            pagination={{
              pageCount: reportDetails ? Math.ceil(reportDetails.total / reportDetails.limit) : 0,
              pageIndex: page - 1,
              pageSize,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
          />
        </CardContent>
      </Card>
    </>
  );
} 