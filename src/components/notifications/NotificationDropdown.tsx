import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "success" | "error" | "info" | "warning";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Test Run Completed",
    message: "Test file 'login_test.json' has completed running",
    time: "2 minutes ago",
    isRead: false,
    type: "success"
  },
  {
    id: "2",
    title: "Test Run Failed",
    message: "Test file 'payment_test.json' failed with 3 errors",
    time: "15 minutes ago",
    isRead: false,
    type: "error"
  },
  {
    id: "3",
    title: "New Test File Uploaded",
    message: "User 'john.doe' uploaded a new test file",
    time: "1 hour ago",
    isRead: true,
    type: "info"
  },
  {
    id: "4",
    title: "System Update",
    message: "System will be updated to version 2.0.0",
    time: "2 hours ago",
    isRead: true,
    type: "warning"
  },
  {
    id: "5",
    title: "Test Run Completed",
    message: "Test file 'api_test.json' has completed running",
    time: "3 hours ago",
    isRead: true,
    type: "success"
  }
];

const getNotificationColor = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return "bg-green-500";
    case "error":
      return "bg-red-500";
    case "warning":
      return "bg-yellow-500";
    case "info":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

export const NotificationDropdown = () => {
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-primary text-primary-foreground shadow-sm animate-in fade-in-0 zoom-in-95"
              variant="default"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h4 className="font-medium">Notifications</h4>
          <Button variant="ghost" size="sm" className="h-8">
            Mark all as read
          </Button>
        </div>
        <ScrollArea className="h-[300px]">
          {mockNotifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={cn(
                "flex flex-col items-start gap-1 p-4 cursor-pointer",
                !notification.isRead && "bg-muted/50"
              )}
            >
              <div className="flex items-center gap-2 w-full">
                <div className={cn("w-2 h-2 rounded-full", getNotificationColor(notification.type))} />
                <span className="font-medium flex-1">{notification.title}</span>
                <span className="text-xs text-muted-foreground">{notification.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
        <div className="p-2 border-t">
          <Button variant="ghost" className="w-full" size="sm">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 