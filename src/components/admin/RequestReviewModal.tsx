import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Briefcase,
  MessageSquare,
  Clock,
} from "lucide-react";

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  position: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: "pending" | "approved" | "rejected" | "info-needed";
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  requestDate: string;
  avatar?: string;
}

interface RequestReviewModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onApprove?: (id: string, comments: string) => void;
  onReject?: (id: string, reason: string) => void;
  onRequestInfo?: (id: string, questions: string) => void;
  request?: LeaveRequest;
}

const RequestReviewModal = ({
  isOpen = true,
  onClose = () => {},
  onApprove = () => {},
  onReject = () => {},
  onRequestInfo = () => {},
  request = {
    id: "1",
    employeeName: "Jane Smith",
    employeeId: "EMP001",
    department: "Computer Science",
    position: "Associate Professor",
    leaveType: "Sick Leave",
    startDate: "2023-06-15",
    endDate: "2023-06-18",
    duration: 4,
    reason:
      "Medical appointment and recovery following a minor procedure. Will be working remotely for part of this time but need official leave for the procedure day.",
    status: "pending",
    attachments: [
      {
        name: "medical_certificate.pdf",
        url: "#",
        type: "application/pdf",
      },
    ],
    requestDate: "2023-06-10",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  },
}: RequestReviewModalProps) => {
  const [activeTab, setActiveTab] = useState<
    "review" | "approve" | "reject" | "request-info"
  >("review");
  const [comments, setComments] = useState("");

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle form submission based on active tab
  const handleSubmit = () => {
    switch (activeTab) {
      case "approve":
        onApprove(request.id, comments);
        break;
      case "reject":
        onReject(request.id, comments);
        break;
      case "request-info":
        onRequestInfo(request.id, comments);
        break;
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Review Leave Request
          </DialogTitle>
          <DialogDescription>
            Review and take action on this leave request.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {/* Left column - Request details */}
          <div className="md:col-span-2 space-y-6">
            {/* Employee info */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200">
                {request.avatar ? (
                  <img
                    src={request.avatar}
                    alt={request.employeeName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground font-bold text-xl">
                    {request.employeeName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {request.employeeName}
                </h3>
                <div className="text-sm text-gray-500 flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    <span>
                      {request.position} • {request.employeeId}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>{request.department}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Request details */}
            <div className="grid grid-cols-2 gap-4 border rounded-lg p-4 bg-gray-50">
              <div>
                <p className="text-sm text-gray-500">Leave Type</p>
                <p className="font-medium">{request.leaveType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">
                  {request.duration} day{request.duration !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Date Range</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatDate(request.startDate)} -{" "}
                  {formatDate(request.endDate)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Request Date</p>
                <p className="font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  {formatDate(request.requestDate)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Status</p>
                <div>
                  {request.status === "pending" && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 w-fit"
                    >
                      <Clock size={12} /> Pending Review
                    </Badge>
                  )}
                  {request.status === "approved" && (
                    <Badge className="bg-green-500 flex items-center gap-1 w-fit">
                      <CheckCircle size={12} /> Approved
                    </Badge>
                  )}
                  {request.status === "rejected" && (
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1 w-fit"
                    >
                      <XCircle size={12} /> Rejected
                    </Badge>
                  )}
                  {request.status === "info-needed" && (
                    <Badge
                      variant="outline"
                      className="border-amber-500 text-amber-500 flex items-center gap-1 w-fit"
                    >
                      <AlertCircle size={12} /> Information Needed
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                <MessageSquare className="h-4 w-4" /> Reason for Leave
              </p>
              <div className="border rounded-lg p-3 bg-white">
                <p className="text-sm">{request.reason}</p>
              </div>
            </div>

            {/* Attachments */}
            {request.attachments && request.attachments.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <FileText className="h-4 w-4" /> Attachments
                </p>
                <div className="space-y-2">
                  {request.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 border rounded-lg p-2 bg-white"
                    >
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span className="text-sm flex-1">{attachment.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-500"
                        onClick={() => window.open(attachment.url, "_blank")}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column - Actions */}
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 divide-x">
                <button
                  className={`p-2 text-center text-sm font-medium ${activeTab === "approve" ? "bg-green-50 text-green-600" : "bg-white hover:bg-gray-50"}`}
                  onClick={() => setActiveTab("approve")}
                >
                  Approve
                </button>
                <button
                  className={`p-2 text-center text-sm font-medium ${activeTab === "reject" ? "bg-red-50 text-red-600" : "bg-white hover:bg-gray-50"}`}
                  onClick={() => setActiveTab("reject")}
                >
                  Reject
                </button>
                <button
                  className={`p-2 text-center text-sm font-medium ${activeTab === "request-info" ? "bg-amber-50 text-amber-600" : "bg-white hover:bg-gray-50"}`}
                  onClick={() => setActiveTab("request-info")}
                >
                  Request Info
                </button>
              </div>

              <div className="p-4">
                {activeTab === "review" && (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">
                      Select an action to proceed with this request.
                    </p>
                  </div>
                )}

                {activeTab === "approve" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <h4 className="font-medium">Approve Request</h4>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="approve-comments">
                        Comments (Optional)
                      </Label>
                      <Textarea
                        id="approve-comments"
                        placeholder="Add any comments about this approval..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="min-h-24"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "reject" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-5 w-5" />
                      <h4 className="font-medium">Reject Request</h4>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reject-reason" className="text-red-600">
                        Reason for Rejection{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="reject-reason"
                        placeholder="Provide a reason for rejecting this request..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="min-h-24 border-red-200 focus-visible:ring-red-500"
                        required
                      />
                    </div>
                  </div>
                )}

                {activeTab === "request-info" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-amber-600">
                      <AlertCircle className="h-5 w-5" />
                      <h4 className="font-medium">Request More Information</h4>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="info-questions"
                        className="text-amber-600"
                      >
                        Questions <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="info-questions"
                        placeholder="What additional information do you need from the employee?"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="min-h-24 border-amber-200 focus-visible:ring-amber-500"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {activeTab !== "review" && (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveTab("review");
                    setComments("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={activeTab !== "approve" && !comments.trim()}
                  className={`${activeTab === "approve" ? "bg-green-600 hover:bg-green-700" : activeTab === "reject" ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"}`}
                >
                  {activeTab === "approve"
                    ? "Approve"
                    : activeTab === "reject"
                      ? "Reject"
                      : "Send Request"}
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestReviewModal;
