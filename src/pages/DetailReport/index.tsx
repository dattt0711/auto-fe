import { TableComponent } from "@/components/base/TableComponent";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { reportsService, Report, ReportDetailsResponse } from '@/services/reports';
import { createColumns } from './columns';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { io } from "socket.io-client";
import { API_CONFIG } from "@/config/env";

export default function DetailReport() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();

  // Initialize socket connection
  useEffect(() => {
    const socket = io(API_CONFIG.SOCKET.URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      // Join the report progress room
      // if (id) {
      //   socket.emit("joinRoom", `report-progress:${id}`);
      // }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Listen for progress updates
    socket.on(`report-progress:${id}`, (progressData: { progress: number; status: string }) => {
      console.log("Progress update:", progressData);
      
      // Update the report data in the cache
      queryClient.setQueryData<Report>(['detail-report', id], (old) => {
        if (!old) return old;
        return {
          ...old,
          progress: progressData.progress,
          status: progressData.status as Report['status']
        };
      });
    });

    return () => {
      if (id) {
        socket.emit("leaveRoom", `report-progress:${id}`);
      }
      socket.close();
    };
  }, [id, queryClient]);

  const { data: report, isLoading: isLoadingReport } = useQuery<Report>({
    queryKey: ['detail-report', id],
    queryFn: () => reportsService.getReportById(id as string),
  });

  const { data: reportDetails, isLoading: isLoadingDetails } = useQuery<ReportDetailsResponse>({
    queryKey: ['report-details', id, page, pageSize],
    queryFn: () => reportsService.getReportDetails(id as string, page, pageSize),
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
              <div className="relative w-full max-w-md">
                <Progress 
                  value={report?.progress} 
                  className="w-full bg-gray-200 h-4 mt-2"
                  indicatorClassName={`transition-colors duration-300 ${getStatusColor(report?.status || "")}`}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
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
            <div className="flex gap-4 text-sm text-muted-foreground">
              <div>Total Results: {reportDetails?.data.total.total ?? 0}</div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Passed: {reportDetails?.data.total.passed ?? 0}
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Failed: {reportDetails?.data.total.failed ?? 0}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TableComponent 
            columns={columns} 
            data={reportDetails?.data.data ?? []}
            isLoading={isLoadingDetails}
            pagination={{
              pageCount: reportDetails ? Math.ceil(reportDetails.data.total.total / reportDetails.data.limit) : 0,
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