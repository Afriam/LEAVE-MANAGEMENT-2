-- College Leave Management System Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS college_leave_management;

USE college_leave_management;

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  department_id INT,
  position VARCHAR(100),
  role ENUM('employee', 'admin') DEFAULT 'employee',
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Leave types table
CREATE TABLE IF NOT EXISTS leave_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  default_days INT NOT NULL DEFAULT 0,
  color VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Leave balances table
CREATE TABLE IF NOT EXISTS leave_balances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(20) NOT NULL,
  leave_type_id INT NOT NULL,
  fiscal_year YEAR NOT NULL,
  total_days INT NOT NULL DEFAULT 0,
  used_days INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
  UNIQUE KEY (employee_id, leave_type_id, fiscal_year)
);

-- Leave requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(20) NOT NULL,
  department_id INT NOT NULL,
  leave_type_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration INT NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'cancelled', 'info-needed') DEFAULT 'pending',
  comments TEXT,
  substitute_employee_id VARCHAR(20),
  contact_info VARCHAR(255),
  approved_by VARCHAR(20),
  approved_date DATETIME,
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
  FOREIGN KEY (substitute_employee_id) REFERENCES employees(id),
  FOREIGN KEY (approved_by) REFERENCES employees(id)
);

-- Attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  leave_request_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size INT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (leave_request_id) REFERENCES leave_requests(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_to VARCHAR(50),
  related_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Insert sample departments
INSERT INTO departments (name, description) VALUES
('Computer Science', 'Department of Computer Science and Engineering'),
('Mathematics', 'Department of Mathematics and Statistics'),
('Physics', 'Department of Physics and Astronomy'),
('Chemistry', 'Department of Chemistry'),
('Biology', 'Department of Biological Sciences');

-- Insert sample leave types
INSERT INTO leave_types (name, description, default_days, color) VALUES
('Vacation', 'Annual vacation leave', 20, 'blue'),
('Sick Leave', 'Medical and health related leave', 12, 'red'),
('Personal Leave', 'Leave for personal matters', 5, 'green'),
('Bereavement', 'Leave due to death of family member', 5, 'purple'),
('Unpaid Leave', 'Leave without pay', 0, 'gray');

-- Insert sample employees (password is 'password' hashed)
INSERT INTO employees (id, name, email, password, department_id, position, role, avatar_url) VALUES
('EMP001', 'John Doe', 'john.doe@college.edu', '$2a$10$xVfzMKP8.V.Ew.DzWp/YW.UVH0Vp/X3Xy6Mxj5nLc.vQwDOTUOFm2', 1, 'Associate Professor', 'employee', 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'),
('EMP042', 'Jane Smith', 'jane.smith@college.edu', '$2a$10$xVfzMKP8.V.Ew.DzWp/YW.UVH0Vp/X3Xy6Mxj5nLc.vQwDOTUOFm2', 2, 'Associate Professor', 'employee', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'),
('EMP078', 'Michael Johnson', 'michael.johnson@college.edu', '$2a$10$xVfzMKP8.V.Ew.DzWp/YW.UVH0Vp/X3Xy6Mxj5nLc.vQwDOTUOFm2', 3, 'Assistant Professor', 'employee', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'),
('EMP103', 'Robert Chen', 'robert.chen@college.edu', '$2a$10$xVfzMKP8.V.Ew.DzWp/YW.UVH0Vp/X3Xy6Mxj5nLc.vQwDOTUOFm2', 4, 'Professor', 'employee', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert'),
('EMP056', 'Emily Wilson', 'emily.wilson@college.edu', '$2a$10$xVfzMKP8.V.Ew.DzWp/YW.UVH0Vp/X3Xy6Mxj5nLc.vQwDOTUOFm2', 5, 'Assistant Professor', 'employee', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'),
('ADMIN001', 'Admin User', 'admin@college.edu', '$2a$10$xVfzMKP8.V.Ew.DzWp/YW.UVH0Vp/X3Xy6Mxj5nLc.vQwDOTUOFm2', 1, 'Department Head', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin');

-- Insert sample leave balances for current year
INSERT INTO leave_balances (employee_id, leave_type_id, fiscal_year, total_days, used_days) VALUES
('EMP001', 1, YEAR(CURDATE()), 20, 8),
('EMP001', 2, YEAR(CURDATE()), 12, 3),
('EMP001', 3, YEAR(CURDATE()), 5, 1),
('EMP001', 4, YEAR(CURDATE()), 5, 0),
('EMP042', 1, YEAR(CURDATE()), 20, 5),
('EMP042', 2, YEAR(CURDATE()), 12, 2),
('EMP078', 1, YEAR(CURDATE()), 20, 10),
('EMP078', 3, YEAR(CURDATE()), 5, 2);

-- Insert sample leave requests
INSERT INTO leave_requests (employee_id, department_id, leave_type_id, start_date, end_date, duration, reason, status, approved_by, approved_date, request_date) VALUES
('EMP001', 1, 1, '2023-06-15', '2023-06-22', 8, 'Annual family vacation', 'approved', 'ADMIN001', '2023-06-01', '2023-05-25'),
('EMP042', 2, 2, '2023-07-03', '2023-07-05', 3, 'Flu recovery', 'approved', 'ADMIN001', '2023-06-28', '2023-06-25'),
('EMP078', 3, 3, '2023-07-10', '2023-07-10', 1, 'Family event', 'pending', NULL, NULL, '2023-07-01'),
('EMP103', 4, 4, '2023-08-20', '2023-08-24', 5, 'Family emergency', 'approved', 'ADMIN001', '2023-08-15', '2023-08-14'),
('EMP056', 5, 1, '2023-12-24', '2024-01-02', 10, 'Holiday break', 'pending', NULL, NULL, '2023-11-15');
