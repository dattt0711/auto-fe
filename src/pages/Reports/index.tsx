import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableComponent } from "@/components/base/TableComponent";
import { createColumns } from "./columns";
import { reportsService, ListReportsResponse } from "@/services/reports";
import { useQuery } from "@tanstack/react-query";

export default function Reports() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: reportsResponse, isLoading } = useQuery<ListReportsResponse>({
    queryKey: ["reports", page, pageSize],
    queryFn: () => reportsService.getReports({ page, limit: pageSize }),
  });

  const reports = reportsResponse?.data?.data || [];
  const totalReports = reportsResponse?.data?.total || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage + 1);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const columns = createColumns(navigate);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Reports</CardTitle>
            <div className="text-sm text-muted-foreground">
              Total Reports: {totalReports}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TableComponent
            columns={columns}
            data={reports}
            isLoading={isLoading}
            pagination={{
              pageCount: Math.ceil(totalReports / pageSize),
              pageIndex: page - 1,
              pageSize,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
} 