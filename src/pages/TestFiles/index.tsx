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

const TestFiles = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [socket, setSocket] = useState<Socket | null>(null);

  // Fetch test files
  const { data: testFilesResponse } = useQuery<ListTestFilesResponse>({
    queryKey: ["testFiles"],
    queryFn: testFilesService.getTestFiles,
  });

  const testFiles = testFilesResponse?.data?.data || [];

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
          queryClient.setQueryData<ListTestFilesResponse>(["testFiles"], (old) => {
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

      // Update cache optimistically
      queryClient.setQueryData<ListTestFilesResponse>(["testFiles"], (old) => {
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

  const columns = createColumns(navigate, uploadProgress);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Test Files Management</CardTitle>
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
            pagination={{
              pageCount: Math.ceil((testFilesResponse?.data?.total || 0) / pageSize),
              pageIndex,
              pageSize,
              onPageChange: setPageIndex,
              onPageSizeChange: setPageSize,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TestFiles; 