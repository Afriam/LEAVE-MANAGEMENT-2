import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Calendar, Briefcase, Thermometer } from "lucide-react";

interface LeaveType {
  type: string;
  icon: React.ReactNode;
  used: number;
  total: number;
  color: string;
}

interface LeaveBalanceCardProps {
  leaveTypes?: LeaveType[];
  employeeName?: string;
  fiscalYearEnd?: string;
}

const LeaveBalanceCard = ({
  leaveTypes = [
    {
      type: "Vacation",
      icon: <Briefcase className="h-5 w-5 text-blue-500" />,
      used: 8,
      total: 20,
      color: "bg-blue-500",
    },
    {
      type: "Sick Leave",
      icon: <Thermometer className="h-5 w-5 text-red-500" />,
      used: 3,
      total: 12,
      color: "bg-red-500",
    },
    {
      type: "Personal",
      icon: <Clock className="h-5 w-5 text-green-500" />,
      used: 1,
      total: 5,
      color: "bg-green-500",
    },
    {
      type: "Floating Holidays",
      icon: <Calendar className="h-5 w-5 text-purple-500" />,
      used: 0,
      total: 2,
      color: "bg-purple-500",
    },
  ],
  employeeName = "John Doe",
  fiscalYearEnd = "December 31, 2023",
}: LeaveBalanceCardProps) => {
  return (
    <Card className="w-full max-w-md bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Leave Balance</CardTitle>
        <CardDescription>
          Balance for {employeeName} (Fiscal year ending {fiscalYearEnd})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaveTypes.map((leave, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {leave.icon}
                  <span className="font-medium">{leave.type}</span>
                </div>
                <span className="text-sm font-medium">
                  {leave.used} / {leave.total} days
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <Progress
                  value={(leave.used / leave.total) * 100}
                  className={`h-2 ${leave.color}`}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Used: {leave.used} days</span>
                <span>Remaining: {leave.total - leave.used} days</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveBalanceCard;
