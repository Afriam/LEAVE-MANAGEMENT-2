import React, { useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarHeader,
  CalendarHeadCell,
  CalendarMonthHeader,
  CalendarNextButton,
  CalendarPrevButton,
} from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Download,
  Filter,
  Calendar as CalendarIcon,
  FileText,
  Eye,
  ChevronDown,
  Search,
} from "lucide-react";

type LeaveStatus = "approved" | "rejected" | "pending" | "cancelled";

interface LeaveRequest {
  id: string;
  type: string;
  startDate: Date;
  endDate: Date;
  status: LeaveStatus;
  reason: string;
  approvedBy?: string;
  approvedDate?: Date;
  comments?: string;
  attachments?: string[];
}

interface LeaveHistoryViewProps {
  leaveRequests?: LeaveRequest[];
  employeeName?: string;
  employeeId?: string;
  onViewDetails?: (id: string) => void;
  onDownloadHistory?: () => void;
  onFilterChange?: (filters: any) => void;
}

const LeaveHistoryView = ({
  leaveRequests = [
    {
      id: "1",
      type: "Vacation",
      startDate: new Date(2023, 0, 15),
      endDate: new Date(2023, 0, 22),
      status: "approved",
      reason: "Annual family vacation",
      approvedBy: "Jane Smith",
      approvedDate: new Date(2022, 11, 20),
      attachments: ["vacation_plan.pdf"],
    },
    {
      id: "2",
      type: "Sick Leave",
      startDate: new Date(2023, 2, 3),
      endDate: new Date(2023, 2, 5),
      status: "approved",
      reason: "Flu recovery",
      approvedBy: "Jane Smith",
      approvedDate: new Date(2023, 2, 2),
    },
    {
      id: "3",
      type: "Personal Leave",
      startDate: new Date(2023, 4, 10),
      endDate: new Date(2023, 4, 10),
      status: "rejected",
      reason: "Family event",
      approvedBy: "Jane Smith",
      approvedDate: new Date(2023, 4, 5),
      comments: "Insufficient notice period",
    },
    {
      id: "4",
      type: "Bereavement",
      startDate: new Date(2023, 6, 20),
      endDate: new Date(2023, 6, 24),
      status: "approved",
      reason: "Family emergency",
      approvedBy: "Jane Smith",
      approvedDate: new Date(2023, 6, 19),
      attachments: ["documentation.pdf"],
    },
    {
      id: "5",
      type: "Vacation",
      startDate: new Date(2023, 11, 24),
      endDate: new Date(2024, 0, 2),
      status: "pending",
      reason: "Holiday break",
    },
  ],
  employeeName = "John Doe",
  employeeId = "EMP001",
  onViewDetails = (id) => console.log(`View details for ${id}`),
  onDownloadHistory = () => console.log("Download history"),
  onFilterChange = (filters) => console.log("Filters changed", filters),
}: LeaveHistoryViewProps) => {
  const [view, setView] = useState<"table" | "calendar">("table");
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Calculate leave duration in days
  const calculateDuration = (startDate: Date, endDate: Date) => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end dates
  };

  // Filter leave requests based on selected filters
  const filteredRequests = leaveRequests.filter((request) => {
    // Filter by year
    if (
      selectedYear !== "all" &&
      request.startDate.getFullYear().toString() !== selectedYear
    ) {
      return false;
    }

    // Filter by month
    if (
      selectedMonth !== "all" &&
      request.startDate.getMonth().toString() !== selectedMonth
    ) {
      return false;
    }

    // Filter by status
    if (selectedStatus !== "all" && request.status !== selectedStatus) {
      return false;
    }

    // Filter by type
    if (selectedType !== "all" && request.type !== selectedType) {
      return false;
    }

    // Filter by search query (reason)
    if (
      searchQuery &&
      !request.reason.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Get unique leave types for filter dropdown
  const leaveTypes = Array.from(
    new Set(leaveRequests.map((request) => request.type)),
  );

  // Get status badge variant
  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  // Get calendar day class based on leave status
  const getCalendarDayClass = (date: Date) => {
    const matchingRequest = leaveRequests.find((request) => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      const current = new Date(date);
      current.setHours(12, 0, 0, 0);
      return current >= start && current <= end;
    });

    if (!matchingRequest) return "";

    switch (matchingRequest.status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "";
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{employeeName}'s Leave History</h1>
          <p className="text-gray-500">Employee ID: {employeeId}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onDownloadHistory}
          >
            <Download className="h-4 w-4" />
            Export History
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Tabs
          value={view}
          onValueChange={(v) => setView(v as "table" | "calendar")}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <TabsList>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by reason"
                  className="pl-8 w-full sm:w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h3 className="font-medium">Filter Leave History</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Year</label>
                        <Select
                          value={selectedYear}
                          onValueChange={setSelectedYear}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Years</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Month</label>
                        <Select
                          value={selectedMonth}
                          onValueChange={setSelectedMonth}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Months</SelectItem>
                            <SelectItem value="0">January</SelectItem>
                            <SelectItem value="1">February</SelectItem>
                            <SelectItem value="2">March</SelectItem>
                            <SelectItem value="3">April</SelectItem>
                            <SelectItem value="4">May</SelectItem>
                            <SelectItem value="5">June</SelectItem>
                            <SelectItem value="6">July</SelectItem>
                            <SelectItem value="7">August</SelectItem>
                            <SelectItem value="8">September</SelectItem>
                            <SelectItem value="9">October</SelectItem>
                            <SelectItem value="10">November</SelectItem>
                            <SelectItem value="11">December</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select
                          value={selectedStatus}
                          onValueChange={setSelectedStatus}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Leave Type
                        </label>
                        <Select
                          value={selectedType}
                          onValueChange={setSelectedType}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {leaveTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedYear("all");
                          setSelectedMonth("all");
                          setSelectedStatus("all");
                          setSelectedType("all");
                          setSearchQuery("");
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <TabsContent value="table" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableCaption>A list of your leave history.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Date Range</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Approved By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {request.type}
                          </TableCell>
                          <TableCell>
                            {format(request.startDate, "MMM dd, yyyy")}
                            {!request.startDate
                              .toDateString()
                              .includes(request.endDate.toDateString()) && (
                              <> - {format(request.endDate, "MMM dd, yyyy")}</>
                            )}
                          </TableCell>
                          <TableCell>
                            {calculateDuration(
                              request.startDate,
                              request.endDate,
                            )}{" "}
                            days
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(request.status)}
                          </TableCell>
                          <TableCell
                            className="max-w-[200px] truncate"
                            title={request.reason}
                          >
                            {request.reason}
                          </TableCell>
                          <TableCell>
                            {request.approvedBy || "-"}
                            {request.approvedDate && (
                              <div className="text-xs text-gray-500">
                                {format(request.approvedDate, "MMM dd, yyyy")}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onViewDetails(request.id)}
                                title="View details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {request.attachments &&
                                request.attachments.length > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="View attachments"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          No leave requests found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Leave Calendar View</CardTitle>
                <CardDescription>
                  View your leave history in a calendar format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    components={{
                      Day: ({ date, ...props }) => {
                        const dayClass = getCalendarDayClass(date);
                        return (
                          <div
                            {...props}
                            className={`${props.className} ${dayClass}`}
                          >
                            {date.getDate()}
                          </div>
                        );
                      },
                    }}
                  />
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Legend</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <span>Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                      <span>Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      <span>Rejected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                      <span>Cancelled</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LeaveHistoryView;
