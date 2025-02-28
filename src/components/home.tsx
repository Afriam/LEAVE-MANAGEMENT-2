import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import EmployeeDashboard from "./dashboard/EmployeeDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";
import LeaveRequestForm from "./leave/LeaveRequestForm";
import RequestReviewModal from "./admin/RequestReviewModal";

interface HomeProps {
  userRole?: "employee" | "admin";
  userName?: string;
  userAvatar?: string;
  department?: string;
  employeeId?: string;
}

const Home = ({
  userRole = "employee",
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  department = "Computer Science",
  employeeId = "EMP001",
}: HomeProps) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLeaveRequestForm, setShowLeaveRequestForm] = useState(false);
  const [showRequestReviewModal, setShowRequestReviewModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleCreateLeaveRequest = () => {
    setShowLeaveRequestForm(true);
  };

  const handleViewLeaveHistory = () => {
    navigate("/leave-history");
  };

  const handleReviewRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
    setShowRequestReviewModal(true);
  };

  const handleCloseLeaveRequestForm = () => {
    setShowLeaveRequestForm(false);
  };

  const handleCloseRequestReviewModal = () => {
    setShowRequestReviewModal(false);
    setSelectedRequestId(null);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header userRole={userRole} userName={userName} userAvatar={userAvatar} />

      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar
          userRole={userRole}
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />

        <main className="flex-1 overflow-auto">
          {showLeaveRequestForm ? (
            <LeaveRequestForm onSubmit={handleCloseLeaveRequestForm} />
          ) : userRole === "employee" ? (
            <EmployeeDashboard
              employeeName={userName}
              employeeId={employeeId}
              department={department}
              onCreateLeaveRequest={handleCreateLeaveRequest}
              onViewLeaveHistory={handleViewLeaveHistory}
            />
          ) : (
            <AdminDashboard
              userName={userName}
              department={department}
              onReviewRequest={handleReviewRequest}
            />
          )}
        </main>
      </div>

      {showRequestReviewModal && (
        <RequestReviewModal
          isOpen={showRequestReviewModal}
          onClose={handleCloseRequestReviewModal}
          request={{
            id: selectedRequestId || "1",
            employeeName: "Jane Smith",
            employeeId: "EMP042",
            department: "Mathematics",
            position: "Associate Professor",
            leaveType: "Sick Leave",
            startDate: "2023-06-15",
            endDate: "2023-06-18",
            duration: 4,
            reason: "Medical appointment and recovery",
            status: "pending",
            requestDate: "2023-06-10",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
          }}
        />
      )}
    </div>
  );
};

export default Home;
