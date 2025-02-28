import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Calendar as CalendarIcon, FileText } from "lucide-react";

import LeaveBalanceCard from "./LeaveBalanceCard";
import RecentRequestsTable from "./RecentRequestsTable";
import LeaveCalendar from "./LeaveCalendar";

interface EmployeeDashboardProps {
  employeeName?: string;
  employeeId?: string;
  department?: string;
  onCreateLeaveRequest?: () => void;
  onViewLeaveHistory?: () => void;
}

const EmployeeDashboard = ({
  employeeName = "John Doe",
  employeeId = "EMP001",
  department = "Computer Science",
  onCreateLeaveRequest = () => console.log("Create leave request"),
  onViewLeaveHistory = () => console.log("View leave history"),
}: EmployeeDashboardProps) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Employee Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {employeeName} | {employeeId} | {department}
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            onClick={onCreateLeaveRequest}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            New Leave Request
          </Button>
          <Button
            variant="outline"
            onClick={onViewLeaveHistory}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            View History
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>Calendar</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <LeaveBalanceCard
              employeeName={employeeName}
              fiscalYearEnd="December 31, 2023"
            />
            <div className="lg:col-span-2">
              <Card className="bg-white shadow-sm h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Leave Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-700">
                        Upcoming
                      </h3>
                      <p className="text-2xl font-bold mt-1">2</p>
                      <p className="text-sm text-blue-600 mt-1">
                        Approved leaves
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-yellow-700">
                        Pending
                      </h3>
                      <p className="text-2xl font-bold mt-1">1</p>
                      <p className="text-sm text-yellow-600 mt-1">
                        Awaiting approval
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-green-700">
                        Available
                      </h3>
                      <p className="text-2xl font-bold mt-1">25</p>
                      <p className="text-sm text-green-600 mt-1">
                        Days remaining
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <RecentRequestsTable />
        </TabsContent>

        <TabsContent value="calendar">
          <LeaveCalendar showDepartmentEvents={true} />
        </TabsContent>

        <TabsContent value="requests">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                My Leave Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentRequestsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;
