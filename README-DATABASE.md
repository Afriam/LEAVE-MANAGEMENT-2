# College Leave Management System - Database Setup Guide

## Database Setup Instructions

This document provides instructions for setting up the database for the College Leave Management System.

### Prerequisites

- MySQL Server 5.7+ or MariaDB 10.2+
- Node.js 16+ and npm

### Database Setup Steps

1. **Create the database and tables**

   Run the SQL script in `database/schema.sql` to create the database schema and sample data:

   ```bash
   mysql -u your_username -p < database/schema.sql
   ```

   This script will:
   - Create the `college_leave_management` database
   - Create all necessary tables
   - Insert sample data for testing

2. **Configure environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=college_leave_management
   ```

3. **Install MySQL package**

   If not already installed, add the MySQL package to your project:

   ```bash
   npm install mysql2
   ```

## Database Schema

The database consists of the following tables:

- **departments** - Stores department information
- **employees** - Stores employee information and credentials
- **leave_types** - Defines different types of leave available
- **leave_balances** - Tracks leave balances for each employee by type and fiscal year
- **leave_requests** - Stores all leave requests with their status
- **attachments** - Stores files attached to leave requests
- **notifications** - Stores system notifications for employees

## Using the Database Connection

The application uses a connection pool to efficiently manage database connections. The database utility functions are available in `src/lib/db.ts`.

Example usage:

```typescript
import db from '@/lib/db';

// Get all leave requests
async function fetchLeaveRequests() {
  try {
    const requests = await db.getAllLeaveRequests();
    return requests;
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    throw error;
  }
}

// Create a new leave request
async function submitLeaveRequest(leaveData) {
  try {
    const result = await db.createLeaveRequest(leaveData);
    return result;
  } catch (error) {
    console.error('Error submitting leave request:', error);
    throw error;
  }
}
```

## Sample Data

The schema includes sample data for testing:

- 5 departments
- 6 employees (5 regular employees, 1 admin)
- 5 leave types
- Sample leave balances
- Sample leave requests

## Default Login Credentials

For testing purposes, all sample users have the password: `password`

- Regular Employee: john.doe@college.edu
- Admin User: admin@college.edu
