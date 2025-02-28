import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Filter,
} from "lucide-react";

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected" | "info-needed";
  reason: string;
  requestDate: string;
  avatar?: string;
}

interface PendingRequestsCardProps {
  requests?: LeaveRequest[];
  onReviewRequest?: (requestId: string) => void;
  onFilterRequests?: () => void;
}

const PendingRequestsCard = ({
  requests = [
    {
      id: "1",
      employeeName: "Jane Smith",
      employeeId: "EMP001",
      department: "Computer Science",
      leaveType: "Sick Leave",
      startDate: "2023-06-15",
      endDate: "2023-06-18",
      status: "pending",
      reason: "Medical appointment and recovery",
      requestDate: "2023-06-10",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    },
    {
      id: "2",
      employeeName: "Michael Johnson",
      employeeId: "EMP042",
      department: "Mathematics",
      leaveType: "Vacation",
      startDate: "2023-07-01",
      endDate: "2023-07-10",
      status: "pending",
      reason: "Family vacation",
      requestDate: "2023-06-12",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    {
      id: "3",
      employeeName: "Robert Chen",
      employeeId: "EMP078",
      department: "Physics",
      leaveType: "Personal Leave",
      startDate: "2023-06-20",
      endDate: "2023-06-21",
      status: "info-needed",
      reason: "Personal matters",
      requestDate: "2023-06-11",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    },
  ],
  onReviewRequest = (id) => console.log(`Review request ${id}`),
  onFilterRequests = () => console.log("Filter requests"),
}: PendingRequestsCardProps) => {
  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Helper function to calculate duration
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + (diffDays === 1 ? " day" : " days");
  };

  // Helper function to get status badge
  const getStatusBadge = (status: LeaveRequest["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock size={12} /> Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="default"
            className="flex items-center gap-1 bg-green-500"
          >
            <CheckCircle size={12} /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle size={12} /> Rejected
          </Badge>
        );
      case "info-needed":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 border-amber-500 text-amber-500"
          >
            <AlertCircle size={12} /> Info Needed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full h-full bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">
            Pending Leave Requests
          </CardTitle>
          <CardDescription>
            Review and manage employee leave requests
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={onFilterRequests}
        >
          <Filter size={14} />
          Filter
        </Button>
      </CardHeader>
      <CardContent className="px-6">
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No pending requests at this time.</p>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                      {request.avatar ? (
                        <img
                          src={request.avatar}
                          alt={request.employeeName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground font-bold">
                          {request.employeeName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{request.employeeName}</h4>
                      <p className="text-sm text-gray-500">
                        {request.department} • {request.employeeId}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {getStatusBadge(request.status)}
                    <span className="text-xs text-gray-500 mt-1">
                      Requested on {formatDate(request.requestDate)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Leave Type</p>
                    <p className="font-medium">{request.leaveType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-medium">
                      {calculateDuration(request.startDate, request.endDate)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Date Range</p>
                    <p className="font-medium">
                      {formatDate(request.startDate)} -{" "}
                      {formatDate(request.endDate)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Reason</p>
                    <p className="text-sm">{request.reason}</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => onReviewRequest(request.id)}
                  >
                    Review Request
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-gray-500">
          {requests.length} pending request{requests.length !== 1 ? "s" : ""}
        </div>
        <Button
          variant="link"
          size="sm"
          onClick={() => console.log("View all requests")}
        >
          View all requests
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PendingRequestsCard;
