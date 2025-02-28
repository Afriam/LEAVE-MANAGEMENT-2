import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Users, Filter } from "lucide-react";

interface LeaveEvent {
  id: string;
  employeeName: string;
  department: string;
  startDate: Date;
  endDate: Date;
  leaveType: "vacation" | "sick" | "personal" | "other";
  status: "approved" | "pending" | "rejected";
}

interface DepartmentCalendarProps {
  events?: LeaveEvent[];
  departments?: string[];
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: LeaveEvent) => void;
}

const DepartmentCalendar: React.FC<DepartmentCalendarProps> = ({
  events = [
    {
      id: "1",
      employeeName: "John Doe",
      department: "Computer Science",
      startDate: new Date(2023, 5, 10),
      endDate: new Date(2023, 5, 15),
      leaveType: "vacation",
      status: "approved",
    },
    {
      id: "2",
      employeeName: "Jane Smith",
      department: "Mathematics",
      startDate: new Date(2023, 5, 12),
      endDate: new Date(2023, 5, 14),
      leaveType: "sick",
      status: "approved",
    },
    {
      id: "3",
      employeeName: "Robert Johnson",
      department: "Physics",
      startDate: new Date(2023, 5, 20),
      endDate: new Date(2023, 5, 25),
      leaveType: "personal",
      status: "pending",
    },
    {
      id: "4",
      employeeName: "Emily Davis",
      department: "Computer Science",
      startDate: new Date(2023, 5, 18),
      endDate: new Date(2023, 5, 19),
      leaveType: "other",
      status: "approved",
    },
    {
      id: "5",
      employeeName: "Michael Wilson",
      department: "Mathematics",
      startDate: new Date(2023, 5, 5),
      endDate: new Date(2023, 5, 8),
      leaveType: "vacation",
      status: "rejected",
    },
  ],
  departments = [
    "All Departments",
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
  ],
  onDateSelect = () => {},
  onEventClick = () => {},
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedView, setSelectedView] = useState("month");

  // Filter events based on selected department
  const filteredEvents =
    selectedDepartment === "All Departments"
      ? events
      : events.filter((event) => event.department === selectedDepartment);

  // Get events for the selected date
  const eventsForSelectedDate = selectedDate
    ? filteredEvents.filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        const selected = new Date(selectedDate);

        // Reset time components for date comparison
        selected.setHours(0, 0, 0, 0);
        const start = new Date(eventStart);
        start.setHours(0, 0, 0, 0);
        const end = new Date(eventEnd);
        end.setHours(0, 0, 0, 0);

        return selected >= start && selected <= end;
      })
    : [];

  // Function to get badge color based on leave type
  const getLeaveTypeBadgeColor = (leaveType: string) => {
    switch (leaveType) {
      case "vacation":
        return "bg-blue-500";
      case "sick":
        return "bg-red-500";
      case "personal":
        return "bg-green-500";
      case "other":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  // Function to get badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
          <h2 className="text-2xl font-bold">Department Calendar</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[180px]">
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

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="month"
        className="w-full"
        onValueChange={setSelectedView}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>

        <TabsContent value="month" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <div className="md:col-span-5">
              <Card>
                <CardContent className="pt-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      if (date) onDateSelect(date);
                    }}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedDate ? (
                      <span>
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    ) : (
                      <span>No Date Selected</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {eventsForSelectedDate.length > 0 ? (
                    <div className="space-y-3">
                      {eventsForSelectedDate.map((event) => (
                        <div
                          key={event.id}
                          className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => onEventClick(event)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {event.employeeName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {event.department}
                              </p>
                            </div>
                            <Badge
                              className={getStatusBadgeColor(event.status)}
                            >
                              {event.status.charAt(0).toUpperCase() +
                                event.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={getLeaveTypeBadgeColor(
                                event.leaveType,
                              )}
                            >
                              {event.leaveType.charAt(0).toUpperCase() +
                                event.leaveType.slice(1)}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(event.startDate).toLocaleDateString()} -{" "}
                              {new Date(event.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <Users className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-gray-500">
                        No leave events for this date
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="week">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Week view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="day">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Day view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => onEventClick(event)}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div>
                          <p className="font-medium">{event.employeeName}</p>
                          <p className="text-sm text-gray-500">
                            {event.department}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={getLeaveTypeBadgeColor(event.leaveType)}
                          >
                            {event.leaveType.charAt(0).toUpperCase() +
                              event.leaveType.slice(1)}
                          </Badge>
                          <Badge className={getStatusBadgeColor(event.status)}>
                            {event.status.charAt(0).toUpperCase() +
                              event.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">
                          {new Date(event.startDate).toLocaleDateString()} -{" "}
                          {new Date(event.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">No leave events found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentCalendar;
