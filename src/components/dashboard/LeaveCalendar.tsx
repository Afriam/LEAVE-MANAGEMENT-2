import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Users } from "lucide-react";

interface LeaveEvent {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: "sick" | "vacation" | "personal" | "other";
  startDate: Date;
  endDate: Date;
  status: "pending" | "approved" | "rejected";
}

interface LeaveCalendarProps {
  events?: LeaveEvent[];
  departmentEvents?: LeaveEvent[];
  showDepartmentEvents?: boolean;
}

const LeaveCalendar = ({
  events = [
    {
      id: "1",
      employeeId: "emp-001",
      employeeName: "John Doe",
      leaveType: "vacation",
      startDate: new Date(2023, 5, 10),
      endDate: new Date(2023, 5, 15),
      status: "approved",
    },
    {
      id: "2",
      employeeId: "emp-001",
      employeeName: "John Doe",
      leaveType: "sick",
      startDate: new Date(2023, 5, 25),
      endDate: new Date(2023, 5, 26),
      status: "approved",
    },
    {
      id: "3",
      employeeId: "emp-001",
      employeeName: "John Doe",
      leaveType: "personal",
      startDate: new Date(2023, 6, 5),
      endDate: new Date(2023, 6, 5),
      status: "pending",
    },
  ],
  departmentEvents = [
    {
      id: "4",
      employeeId: "emp-002",
      employeeName: "Jane Smith",
      leaveType: "vacation",
      startDate: new Date(2023, 5, 12),
      endDate: new Date(2023, 5, 16),
      status: "approved",
    },
    {
      id: "5",
      employeeId: "emp-003",
      employeeName: "Mike Johnson",
      leaveType: "sick",
      startDate: new Date(2023, 5, 20),
      endDate: new Date(2023, 5, 22),
      status: "approved",
    },
  ],
  showDepartmentEvents = true,
}: LeaveCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [view, setView] = useState<"personal" | "department">("personal");

  // Function to determine if a date has events
  const hasEvents = (date: Date, eventsList: LeaveEvent[]) => {
    return eventsList.some((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);

      return (
        date >= new Date(eventStart.setHours(0, 0, 0, 0)) &&
        date <= new Date(eventEnd.setHours(23, 59, 59, 999))
      );
    });
  };

  // Function to get events for a specific date
  const getEventsForDate = (date: Date, eventsList: LeaveEvent[]) => {
    return eventsList.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);

      return (
        date >= new Date(eventStart.setHours(0, 0, 0, 0)) &&
        date <= new Date(eventEnd.setHours(23, 59, 59, 999))
      );
    });
  };

  // Get events for the selected date
  const selectedDateEvents = selectedDate
    ? view === "personal"
      ? getEventsForDate(selectedDate, events)
      : getEventsForDate(selectedDate, [...events, ...departmentEvents])
    : [];

  // Custom day renderer to show indicators for dates with events
  const renderDay = (day: Date) => {
    const personalEvents = hasEvents(day, events);
    const deptEvents = hasEvents(day, departmentEvents);

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {day.getDate()}
        <div className="absolute bottom-1 flex gap-1">
          {personalEvents && (
            <div className="h-1 w-1 rounded-full bg-blue-500"></div>
          )}
          {view === "department" && deptEvents && (
            <div className="h-1 w-1 rounded-full bg-green-500"></div>
          )}
        </div>
      </div>
    );
  };

  // Get the color for leave type badge
  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "vacation":
        return "bg-blue-100 text-blue-800";
      case "sick":
        return "bg-red-100 text-red-800";
      case "personal":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get the color for status badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full h-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Leave Calendar
          </CardTitle>
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "personal" | "department")}
          >
            <TabsList>
              <TabsTrigger value="personal">My Leaves</TabsTrigger>
              {showDepartmentEvents && (
                <TabsTrigger value="department">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>Department</span>
                  </div>
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              components={{
                Day: ({ date, ...props }) => {
                  return <div {...props}>{renderDay(date)}</div>;
                },
              }}
            />
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>Your leaves</span>
              </div>
              {view === "department" && (
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Department leaves</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="border rounded-md p-4 h-full">
              <h3 className="font-medium flex items-center gap-2">
                {selectedDate ? (
                  <span>
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                ) : (
                  <span>Select a date</span>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={16} className="text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Leave details for the selected date</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h3>

              {selectedDateEvents.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{event.employeeName}</p>
                          <p className="text-sm text-gray-500">
                            {event.startDate.toLocaleDateString()} -{" "}
                            {event.endDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getLeaveTypeColor(event.leaveType)}>
                            {event.leaveType.charAt(0).toUpperCase() +
                              event.leaveType.slice(1)}
                          </Badge>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status.charAt(0).toUpperCase() +
                              event.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[calc(100%-2rem)] text-gray-500">
                  No leave events for this date
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveCalendar;
