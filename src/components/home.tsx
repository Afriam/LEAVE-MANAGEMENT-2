import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import EmployeeDashboard from "./dashboard/EmployeeDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";
import LeaveRequestForm from "./leave/LeaveRequestForm";
import RequestReviewModal from "./admin/RequestReviewModal";
import LeaveHistoryView from "./leave/LeaveHistoryView";
import ReportingModule from "./admin/ReportingModule";

interface HomeProps {
  userRole?: "employee" | "admin";
  userName?: string;
  userAvatar?: string;
  department?: string;
  employeeId?: string;
  onSignOut?: () => void;
}

const Home = ({
  userRole = "employee",
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  department = "Computer Science",
  employeeId = "EMP001",
  onSignOut = () => {},
}: HomeProps) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLeaveRequestForm, setShowLeaveRequestForm] = useState(false);
  const [showRequestReviewModal, setShowRequestReviewModal] = useState(false);
  const [showLeaveHistory, setShowLeaveHistory] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    // Clear authentication tokens and call the parent component's onSignOut function
    onSignOut();
  };

  const handleCreateLeaveRequest = () => {
    setActiveView("leaveRequest");
    setShowLeaveRequestForm(true);
    setShowLeaveHistory(false);
    setShowReports(false);
  };

  const handleViewLeaveHistory = () => {
    setActiveView("leaveHistory");
    setShowLeaveHistory(true);
    setShowLeaveRequestForm(false);
    setShowReports(false);
  };

  const handleViewReports = () => {
    setActiveView("reports");
    setShowReports(true);
    setShowLeaveRequestForm(false);
    setShowLeaveHistory(false);
  };

  const handleViewDashboard = () => {
    setActiveView("dashboard");
    setShowLeaveRequestForm(false);
    setShowLeaveHistory(false);
    setShowReports(false);
  };

  const handleReviewRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
    setShowRequestReviewModal(true);
  };

  const handleCloseLeaveRequestForm = () => {
    setShowLeaveRequestForm(false);
    setActiveView("dashboard");
  };

  const handleCloseRequestReviewModal = () => {
    setShowRequestReviewModal(false);
    setSelectedRequestId(null);
  };

  // Handle navigation from header or sidebar
  const handleNavigation = (path: string) => {
    switch (path) {
      case "/":
        handleViewDashboard();
        break;
      case "/request-leave":
        handleCreateLeaveRequest();
        break;
      case "/leave-history":
        handleViewLeaveHistory();
        break;
      case "/admin/reports":
        handleViewReports();
        break;
      case "/profile":
        alert("Profile page would open here");
        break;
      case "/settings":
        alert("Settings page would open here");
        break;
      case "/help":
        alert("Help & Support page would open here");
        break;
      case "/logout":
        handleLogout();
        break;
      default:
        handleViewDashboard();
    }
  };

  const renderContent = () => {
    if (showLeaveRequestForm) {
      return <LeaveRequestForm onSubmit={handleCloseLeaveRequestForm} />;
    }

    if (showLeaveHistory) {
      return (
        <LeaveHistoryView employeeName={userName} employeeId={employeeId} />
      );
    }

    if (showReports) {
      return <ReportingModule />;
    }

    if (userRole === "employee") {
      return (
        <EmployeeDashboard
          employeeName={userName}
          employeeId={employeeId}
          department={department}
          onCreateLeaveRequest={handleCreateLeaveRequest}
          onViewLeaveHistory={handleViewLeaveHistory}
        />
      );
    }

    return (
      <AdminDashboard
        userName={userName}
        department={department}
        onReviewRequest={handleReviewRequest}
      />
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header
        userRole={userRole}
        userName={userName}
        userAvatar={userAvatar}
        onNavigation={handleNavigation}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar
          userRole={userRole}
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          onNavigation={handleNavigation}
        />

        <main className="flex-1 overflow-auto">{renderContent()}</main>
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
