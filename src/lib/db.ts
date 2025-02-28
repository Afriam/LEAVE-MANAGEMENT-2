import mysql from "mysql2/promise";

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "college_leave_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Helper function to execute SQL queries
export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Example functions for leave management system

// Get all leave requests
export async function getAllLeaveRequests() {
  return query(`
    SELECT * FROM leave_requests 
    ORDER BY request_date DESC
  `);
}

// Get leave requests by employee ID
export async function getLeaveRequestsByEmployee(employeeId: string) {
  return query(
    `SELECT * FROM leave_requests WHERE employee_id = ? ORDER BY request_date DESC`,
    [employeeId],
  );
}

// Create a new leave request
export async function createLeaveRequest(leaveData: any) {
  const {
    employee_id,
    leave_type,
    start_date,
    end_date,
    reason,
    status = "pending",
  } = leaveData;

  return query(
    `INSERT INTO leave_requests 
     (employee_id, leave_type, start_date, end_date, reason, status, request_date) 
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [employee_id, leave_type, start_date, end_date, reason, status],
  );
}

// Update leave request status
export async function updateLeaveRequestStatus(
  requestId: string,
  status: string,
  comments: string = "",
) {
  return query(
    `UPDATE leave_requests 
     SET status = ?, comments = ?, updated_at = NOW() 
     WHERE id = ?`,
    [status, comments, requestId],
  );
}

// Get department statistics
export async function getDepartmentStats(departmentId: string) {
  return query(
    `SELECT 
      COUNT(*) as total_requests,
      SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_requests,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_requests,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_requests
     FROM leave_requests
     WHERE department_id = ?`,
    [departmentId],
  );
}

export default {
  query,
  getAllLeaveRequests,
  getLeaveRequestsByEmployee,
  createLeaveRequest,
  updateLeaveRequestStatus,
  getDepartmentStats,
};
