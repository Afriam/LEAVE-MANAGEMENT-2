import React from "react";
import PendingRequestsCard from "./PendingRequestsCard";
import DepartmentStatsCard from "./DepartmentStatsCard";
import DepartmentCalendar from "./DepartmentCalendar";

interface AdminDashboardProps {
  userName?: string;
  department?: string;
  onReviewRequest?: (requestId: string) => void;
  onFilterRequests?: () => void;
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: any) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userName = "Admin User",
  department = "Computer Science",
  onReviewRequest = (id) => console.log(`Review request ${id}`),
  onFilterRequests = () => console.log("Filter requests"),
  onDateSelect = (date) => console.log(`Selected date: ${date}`),
  onEventClick = (event) => console.log("Event clicked", event),
}) => {
  return (
    <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {userName}
          </h1>
          <p className="text-gray-600">
            Here's what's happening in your department today
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <PendingRequestsCard
              onReviewRequest={onReviewRequest}
              onFilterRequests={onFilterRequests}
            />
          </div>
          <div>
            <DepartmentStatsCard departmentName={department} />
          </div>
        </div>

        <div className="mb-6">
          <DepartmentCalendar
            onDateSelect={onDateSelect}
            onEventClick={onEventClick}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
