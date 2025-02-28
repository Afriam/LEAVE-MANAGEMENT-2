import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BarChart, Activity, Users, Clock } from "lucide-react";

interface DepartmentStatsCardProps {
  departmentName?: string;
  totalEmployees?: number;
  onLeaveToday?: number;
  upcomingLeaves?: number;
  leaveUtilization?: number;
  averageLeaveDuration?: number;
}

const DepartmentStatsCard = ({
  departmentName = "Engineering",
  totalEmployees = 42,
  onLeaveToday = 3,
  upcomingLeaves = 5,
  leaveUtilization = 68,
  averageLeaveDuration = 3.2,
}: DepartmentStatsCardProps) => {
  return (
    <Card className="w-full max-w-md bg-white overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary" />
          {departmentName} Department Stats
        </CardTitle>
        <CardDescription>
          Overview of leave statistics for the department
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Total Employees</span>
          </div>
          <p className="text-2xl font-bold">{totalEmployees}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">On Leave Today</span>
          </div>
          <p className="text-2xl font-bold">{onLeaveToday}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Upcoming Leaves</span>
          </div>
          <p className="text-2xl font-bold">{upcomingLeaves}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <BarChart className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Leave Utilization</span>
          </div>
          <div className="flex items-end gap-1">
            <p className="text-2xl font-bold">{leaveUtilization}%</p>
            <p className="text-sm text-muted-foreground mb-1">
              of annual quota
            </p>
          </div>
        </div>

        <div className="col-span-2 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Average Leave Duration</span>
          </div>
          <div className="flex items-end gap-1">
            <p className="text-2xl font-bold">{averageLeaveDuration}</p>
            <p className="text-sm text-muted-foreground mb-1">
              days per request
            </p>
          </div>
        </div>

        <div className="col-span-2 mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              Leave Distribution by Type
            </span>
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Sick Leave</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-red-400 h-full w-[45%]"></div>
                </div>
                <span className="text-xs">45%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Vacation</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full w-[30%]"></div>
                </div>
                <span className="text-xs">30%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Personal</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-green-400 h-full w-[25%]"></div>
                </div>
                <span className="text-xs">25%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentStatsCard;
