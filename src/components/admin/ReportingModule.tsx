import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Download,
  FileText,
  Filter,
  Calendar,
  Users,
  Search,
  Printer,
  RefreshCw,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: "approved" | "pending" | "rejected" | "cancelled";
  reason: string;
  requestDate: string;
}

interface ReportingModuleProps {
  departments?: string[];
  leaveTypes?: string[];
  requests?: LeaveRequest[];
}

const ReportingModule = ({
  departments = [
    "All Departments",
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
  ],
  leaveTypes = [
    "All Types",
    "Vacation",
    "Sick Leave",
    "Personal Leave",
    "Bereavement",
    "Unpaid Leave",
  ],
  requests = [
    {
      id: "1",
      employeeName: "John Doe",
      employeeId: "EMP001",
      department: "Computer Science",
      leaveType: "Vacation",
      startDate: "2023-06-15",
      endDate: "2023-06-22",
      status: "approved",
      reason: "Annual family vacation",
      requestDate: "2023-06-01",
    },
    {
      id: "2",
      employeeName: "Jane Smith",
      employeeId: "EMP042",
      department: "Mathematics",
      leaveType: "Sick Leave",
      startDate: "2023-07-03",
      endDate: "2023-07-05",
      status: "approved",
      reason: "Flu recovery",
      requestDate: "2023-06-28",
    },
    {
      id: "3",
      employeeName: "Michael Johnson",
      employeeId: "EMP078",
      department: "Physics",
      leaveType: "Personal Leave",
      startDate: "2023-07-10",
      endDate: "2023-07-10",
      status: "pending",
      reason: "Family event",
      requestDate: "2023-07-01",
    },
    {
      id: "4",
      employeeName: "Robert Chen",
      employeeId: "EMP103",
      department: "Chemistry",
      leaveType: "Bereavement",
      startDate: "2023-08-20",
      endDate: "2023-08-24",
      status: "approved",
      reason: "Family emergency",
      requestDate: "2023-08-15",
    },
    {
      id: "5",
      employeeName: "Emily Wilson",
      employeeId: "EMP056",
      department: "Biology",
      leaveType: "Vacation",
      startDate: "2023-12-24",
      endDate: "2024-01-02",
      status: "pending",
      reason: "Holiday break",
      requestDate: "2023-11-15",
    },
    {
      id: "6",
      employeeName: "David Martinez",
      employeeId: "EMP091",
      department: "Computer Science",
      leaveType: "Sick Leave",
      startDate: "2023-09-05",
      endDate: "2023-09-07",
      status: "rejected",
      reason: "Medical appointment",
      requestDate: "2023-09-01",
    },
    {
      id: "7",
      employeeName: "Sarah Johnson",
      employeeId: "EMP112",
      department: "Mathematics",
      leaveType: "Unpaid Leave",
      startDate: "2023-10-10",
      endDate: "2023-10-20",
      status: "approved",
      reason: "Personal travel",
      requestDate: "2023-09-15",
    },
  ],
}: ReportingModuleProps) => {
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedLeaveType, setSelectedLeaveType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("table");

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
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return null;
    }
  };

  // Filter requests based on selected filters and search query
  const filteredRequests = requests.filter((request) => {
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      request.department === selectedDepartment;
    const matchesLeaveType =
      selectedLeaveType === "All Types" ||
      request.leaveType === selectedLeaveType;
    const matchesStatus =
      selectedStatus === "All Statuses" ||
      request.status === selectedStatus.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesDepartment && matchesLeaveType && matchesStatus && matchesSearch
    );
  });

  // Calculate statistics for summary cards
  const totalRequests = filteredRequests.length;
  const approvedRequests = filteredRequests.filter(
    (request) => request.status === "approved",
  ).length;
  const pendingRequests = filteredRequests.filter(
    (request) => request.status === "pending",
  ).length;
  const rejectedRequests = filteredRequests.filter(
    (request) => request.status === "rejected",
  ).length;

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <BarChart className="mr-2 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Leave Reports</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => console.log("Refresh data")}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => console.log("Print report")}
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => console.log("Export data")}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-bold">{totalRequests}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold">{approvedRequests}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Badge className="bg-green-500">
                {Math.round((approvedRequests / totalRequests) * 100) || 0}%
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pendingRequests}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Badge variant="secondary">
                {Math.round((pendingRequests / totalRequests) * 100) || 0}%
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold">{rejectedRequests}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <Badge variant="destructive">
                {Math.round((rejectedRequests / totalRequests) * 100) || 0}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>
            Filter leave requests by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Leave Type</label>
              <Select
                value={selectedLeaveType}
                onValueChange={setSelectedLeaveType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Leave Type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Statuses">All Statuses</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <DatePickerWithRange className="w-full" />
            </div>

            <div className="lg:col-span-4">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search by employee name or ID"
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedDepartment("All Departments");
                    setSelectedLeaveType("All Types");
                    setSelectedStatus("All Statuses");
                    setSearchQuery("");
                  }}
                >
                  Reset Filters
                </Button>
                <Button
                  variant="default"
                  className="flex items-center gap-1"
                  onClick={() => console.log("Apply filters")}
                >
                  <Filter className="h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Selector */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Results ({filteredRequests.length} requests)
        </h2>
        <div className="w-auto">
          <Tabs value={currentView} onValueChange={setCurrentView}>
            <TabsList>
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Results */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={currentView} onValueChange={setCurrentView}>
            <TabsContent value="table" className="m-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>
                    List of leave requests based on applied filters
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">
                        <div className="flex items-center gap-1">
                          Employee
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Date Range
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Request Date
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            <div>
                              {request.employeeName}
                              <div className="text-xs text-muted-foreground">
                                {request.employeeId}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{request.department}</TableCell>
                          <TableCell>{request.leaveType}</TableCell>
                          <TableCell>
                            {formatDate(request.startDate)} -{" "}
                            {formatDate(request.endDate)}
                          </TableCell>
                          <TableCell>
                            {calculateDuration(
                              request.startDate,
                              request.endDate,
                            )}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(request.status)}
                          </TableCell>
                          <TableCell>
                            {formatDate(request.requestDate)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                console.log(`View request ${request.id}`)
                              }
                            >
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          No leave requests found matching the current filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="m-0">
              <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
                <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Calendar View</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Calendar view will display leave requests in a monthly
                  calendar format, allowing you to visualize time off patterns
                  across the department.
                </p>
                <Button className="mt-4" variant="outline">
                  Coming Soon
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="chart" className="m-0">
              <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
                <BarChart className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Chart View</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Chart view will provide visual analytics of leave patterns,
                  including distribution by department, leave type, and time
                  periods.
                </p>
                <Button className="mt-4" variant="outline">
                  Coming Soon
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="mt-6 flex justify-end">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => console.log("Export as CSV")}
          >
            <Download className="h-4 w-4" />
            <span>CSV</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => console.log("Export as Excel")}
          >
            <Download className="h-4 w-4" />
            <span>Excel</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => console.log("Export as PDF")}
          >
            <Download className="h-4 w-4" />
            <span>PDF</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => console.log("More export options")}
          >
            <span>More Options</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportingModule;
