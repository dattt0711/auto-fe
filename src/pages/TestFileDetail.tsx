import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TestCase {
  id: string;
  name: string;
  description: string;
  status: "passed" | "failed" | "pending";
  execution_time: string;
  last_run: string;
}

interface TestFile {
  id: string;
  test_file_name: string;
  url: string;
  status: "active" | "inactive" | "pending";
  input_variables: string[];
  test_cases: TestCase[];
}

const TestFileDetail = () => {
  const { id } = useParams();
  const [testFile, setTestFile] = useState<TestFile | null>(null);

  useEffect(() => {
    // In a real application, this would be an API call
    setTestFile({
      id: id || "1",
      test_file_name: "API Tests",
      url: "/api/tests/1",
      status: "active",
      input_variables: ["username", "password"],
      test_cases: [
        {
          id: "1",
          name: "Login Test",
          description: "Test user login functionality",
          status: "passed",
          execution_time: "1.2s",
          last_run: "2024-03-20 10:30:00",
        },
        {
          id: "2",
          name: "Registration Test",
          description: "Test user registration flow",
          status: "failed",
          execution_time: "2.5s",
          last_run: "2024-03-20 10:35:00",
        },
      ],
    });
  }, [id]);

  const getStatusColor = (status: TestCase["status"]) => {
    switch (status) {
      case "passed":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!testFile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test File Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">File Name</h3>
              <p>{testFile.test_file_name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <Badge className={getStatusColor(testFile.status as any)}>
                {testFile.status}
              </Badge>
            </div>
            <div>
              <h3 className="font-semibold">URL</h3>
              <p>{testFile.url}</p>
            </div>
            <div>
              <h3 className="font-semibold">Input Variables</h3>
              <p>{testFile.input_variables.join(", ")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Execution Time</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testFile.test_cases.map((testCase) => (
                <TableRow key={testCase.id}>
                  <TableCell>{testCase.name}</TableCell>
                  <TableCell>{testCase.description}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(testCase.status)}>
                      {testCase.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{testCase.execution_time}</TableCell>
                  <TableCell>{testCase.last_run}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Run Test
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestFileDetail; 