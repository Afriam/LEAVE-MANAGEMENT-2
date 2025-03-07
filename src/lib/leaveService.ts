import db from "./db";

// Interface for leave request data
export interface LeaveRequest {
  id?: string;
  employee_id: string;
  employee_name?: string;
  department?: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status?: "pending" | "approved" | "rejected" | "cancelled";
  comments?: string;
  attachments?: string[];
  request_date?: string;
}

// Get all leave requests
export const getAllLeaveRequests = async () => {
  try {
    return await db.getAllLeaveRequests();
  } catch (error) {
    console.error("Error fetching all leave requests:", error);
    throw error;
  }
};

// Get leave requests for a specific employee
export const getEmployeeLeaveRequests = async (employeeId: string) => {
  try {
    return await db.getLeaveRequestsByEmployee(employeeId);
  } catch (error) {
    console.error(
      `Error fetching leave requests for employee ${employeeId}:`,
      error,
    );
    throw error;
  }
};

// Submit a new leave request
export const submitLeaveRequest = async (leaveData: LeaveRequest) => {
  try {
    // In a real app with a database, you would save this to the database
    const result = await db.createLeaveRequest(leaveData);

    // For now, also store in localStorage for demo purposes
    const storedRequests = localStorage.getItem("leaveRequests");
    const requests = storedRequests ? JSON.parse(storedRequests) : [];

    const newRequest = {
      ...leaveData,
      id: result.insertId || `request-${Date.now()}`,
      status: "pending",
      request_date: new Date().toISOString(),
    };

    requests.push(newRequest);
    localStorage.setItem("leaveRequests", JSON.stringify(requests));

    return newRequest;
  } catch (error) {
    console.error("Error submitting leave request:", error);
    throw error;
  }
};

// Update a leave request status
export const updateLeaveRequestStatus = async (
  requestId: string,
  status: "approved" | "rejected" | "cancelled",
  comments?: string,
) => {
  try {
    // In a real app, you would update the database
    await db.updateLeaveRequestStatus(requestId, status, comments);

    // For demo purposes, also update in localStorage
    const storedRequests = localStorage.getItem("leaveRequests");
    if (storedRequests) {
      const requests = JSON.parse(storedRequests);
      const updatedRequests = requests.map((req: LeaveRequest) => {
        if (req.id === requestId) {
          return { ...req, status, comments };
        }
        return req;
      });
      localStorage.setItem("leaveRequests", JSON.stringify(updatedRequests));
    }

    return { requestId, status, comments };
  } catch (error) {
    console.error(`Error updating leave request ${requestId}:`, error);
    throw error;
  }
};

// Get leave statistics for an employee
export const getEmployeeLeaveStatistics = async (employeeId: string) => {
  try {
    // In a real app, you would query the database for this information
    // For demo purposes, we'll calculate from localStorage
    const storedRequests = localStorage.getItem("leaveRequests");
    if (!storedRequests)
      return { total: 0, approved: 0, pending: 0, rejected: 0 };

    const requests = JSON.parse(storedRequests);
    const employeeRequests = requests.filter(
      (req: LeaveRequest) => req.employee_id === employeeId,
    );

    return {
      total: employeeRequests.length,
      approved: employeeRequests.filter(
        (req: LeaveRequest) => req.status === "approved",
      ).length,
      pending: employeeRequests.filter(
        (req: LeaveRequest) => req.status === "pending",
      ).length,
      rejected: employeeRequests.filter(
        (req: LeaveRequest) => req.status === "rejected",
      ).length,
    };
  } catch (error) {
    console.error(
      `Error getting leave statistics for employee ${employeeId}:`,
      error,
    );
    throw error;
  }
};

export default {
  getAllLeaveRequests,
  getEmployeeLeaveRequests,
  submitLeaveRequest,
  updateLeaveRequestStatus,
  getEmployeeLeaveStatistics,
};
