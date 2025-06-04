import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { TableComponent } from "@/components/base/TableComponent";
import { io, Socket } from "socket.io-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { testFilesService, TestFile, ListTestFilesResponse } from "@/services/testfiles";
import { UploadDialog } from "./components/UploadDialog";
import { createColumns } from "./columns";
import { API_CONFIG } from "@/config/env";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const TestFiles = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<TestFile | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [socket, setSocket] = useState<Socket | null>(null);

  // Fetch test files with pagination
  const { data: testFilesResponse, isLoading } = useQuery<ListTestFilesResponse>({
    queryKey: ["test-files", page, pageSize],
    queryFn: () => testFilesService.getTestFiles({ page, limit: pageSize }),
  });

  const testFiles = testFilesResponse?.data?.data || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEST_FILES.DETAIL(fileId)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete test file');
      }
      return response.json();
    },
    onSuccess: (_, fileId) => {
      // Update cache optimistically
      queryClient.setQueryData<ListTestFilesResponse>(["test-files", page, pageSize], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.filter((file) => file._id !== fileId),
            total: old.data.total - 1,
          },
        };
      });

      setIsDeleteDialogOpen(false);
      setSelectedFile(null);

      toast({
        title: "Success",
        description: "Test file deleted successfully",
        variant: "success",
      });
    },
    onError: (error: unknown) => {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete test file",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Initialize socket connection with WebSocket transport
    const newSocket = io(API_CONFIG.SOCKET.URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: ({ file, testFileName }: { file: File; testFileName: string }) =>
      testFilesService.uploadTestFile(file, testFileName),
    onSuccess: (data, variables) => {
      if (!data.isSuccess) {
        toast({
          title: "Error",
          description: "Failed to upload test file",
          variant: "destructive",
        });
        return;
      }

      // Join socket room for this file
      socket?.emit("joinRoom", data.file_id);
      console.log(socket, "socket");
      // Set up progress listener for this specific file
      socket?.on("progress", (progressData: { fileId: string; progress: number }) => {
        console.log("Progress update:", progressData);
        setUploadProgress((prev) => ({
          ...prev,
          [data.file_id]: progressData.progress,
        }));

        // Update status when progress reaches 100%
        if (progressData.progress === 100) {
          queryClient.setQueryData<ListTestFilesResponse>(["test-files", 1, pageSize], (old) => {
            if (!old) return old;
            return {
              ...old,
              data: {
                ...old.data,
                data: old.data.data.map((file) =>
                  file._id === data.file_id
                    ? { ...file, status: "success" as const }
                    : file
                ),
              },
            };
          });
        }
      });

      const newTestFile: TestFile = {
        _id: data.file_id,
        test_file_name: variables.testFileName,
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEST_FILES.DETAIL(data.file_id)}`,
        status: "processing",
        input_variables: "",
      };

      // Update cache optimistically - use the same query key as the query
      queryClient.setQueryData<ListTestFilesResponse>(["test-files", 1, pageSize], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: [newTestFile, ...old.data.data],
            total: old.data.total + 1,
          },
        };
      });

      // Also invalidate the query to ensure we get fresh data
      queryClient.invalidateQueries({ queryKey: ["test-files"] });

      setIsDialogOpen(false);

      toast({
        title: "Success",
        description: "Test file upload started",
        variant: "success",
      });
    },
    onError: (error: unknown) => {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload test file",
        variant: "destructive",
      });
    },
  });

  const handleUpload = (file: File, testFileName: string) => {
    uploadMutation.mutate({ file, testFileName });
  };

  const handleDelete = (file: TestFile) => {
    setSelectedFile(file);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedFile) {
      deleteMutation.mutate(selectedFile._id);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage + 1); // Convert from 0-based to 1-based index
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  const columns = createColumns(navigate, uploadProgress, handleDelete);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Test Files Management</CardTitle>
            <div className="text-sm text-muted-foreground">
              Total Documents: {testFilesResponse?.data?.total ?? 0}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UploadDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onUpload={handleUpload}
              isUploading={uploadMutation.isPending}
            />
          </div>
        </CardHeader>
        <CardContent>
          <TableComponent
            columns={columns}
            data={testFiles}
            isLoading={isLoading}
            pagination={{
              pageCount: Math.ceil((testFilesResponse?.data?.total || 0) / pageSize),
              pageIndex: page - 1,
              pageSize,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Test File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedFile?.test_file_name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestFiles; 