import React from "react";
import { Eye, MoreHorizontal, FileText, Download } from "lucide-react";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type LeaveRequestStatus = "approved" | "pending" | "rejected" | "cancelled";

interface LeaveRequest {
  id: string;
  type: string;
  startDate: Date;
  endDate: Date;
  status: LeaveRequestStatus;
  reason: string;
  hasAttachments: boolean;
}

interface RecentRequestsTableProps {
  requests?: LeaveRequest[];
  onViewRequest?: (id: string) => void;
  onDownloadAttachment?: (id: string) => void;
}

const getStatusBadgeVariant = (status: LeaveRequestStatus) => {
  switch (status) {
    case "approved":
      return "default";
    case "pending":
      return "secondary";
    case "rejected":
      return "destructive";
    case "cancelled":
      return "outline";
    default:
      return "secondary";
  }
};

const RecentRequestsTable = ({
  requests = [
    {
      id: "1",
      type: "Vacation",
      startDate: new Date(2023, 5, 15),
      endDate: new Date(2023, 5, 22),
      status: "approved",
      reason: "Annual family vacation",
      hasAttachments: true,
    },
    {
      id: "2",
      type: "Sick Leave",
      startDate: new Date(2023, 6, 3),
      endDate: new Date(2023, 6, 5),
      status: "approved",
      reason: "Flu recovery",
      hasAttachments: false,
    },
    {
      id: "3",
      type: "Personal Leave",
      startDate: new Date(2023, 7, 10),
      endDate: new Date(2023, 7, 10),
      status: "pending",
      reason: "Family event",
      hasAttachments: false,
    },
    {
      id: "4",
      type: "Bereavement",
      startDate: new Date(2023, 8, 20),
      endDate: new Date(2023, 8, 24),
      status: "rejected",
      reason: "Family emergency",
      hasAttachments: true,
    },
    {
      id: "5",
      type: "Vacation",
      startDate: new Date(2023, 11, 24),
      endDate: new Date(2024, 0, 2),
      status: "pending",
      reason: "Holiday break",
      hasAttachments: false,
    },
  ],
  onViewRequest = () => {},
  onDownloadAttachment = () => {},
}: RecentRequestsTableProps) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-xl font-semibold mb-4">Recent Leave Requests</h2>
      <Table>
        <TableCaption>A list of your recent leave requests.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Date Range</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.type}</TableCell>
              <TableCell>
                {format(request.startDate, "MMM dd, yyyy")}
                {!request.startDate
                  .toDateString()
                  .includes(request.endDate.toDateString()) && (
                  <> - {format(request.endDate, "MMM dd, yyyy")}</>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(request.status)}>
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell
                className="max-w-[200px] truncate"
                title={request.reason}
              >
                {request.reason}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewRequest(request.id)}
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {request.hasAttachments && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDownloadAttachment(request.id)}
                      title="Download attachments"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" title="More options">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end mt-4">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export History
        </Button>
      </div>
    </div>
  );
};

export default RecentRequestsTable;
