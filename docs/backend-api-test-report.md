# PEC Repair Complaint Management System

## Backend API Documentation & Test Verification Report

**Document Type:** Documentation-only\
**Testing Tool:** Postman\
**Base URL:** `http://localhost:5000/api`\
**Content-Type:** `application/json`\
**Authentication:** JWT Bearer Token

> **Security note:** All passwords, JWT tokens, database connection
> strings, and other secrets are intentionally redacted from this
> document.

------------------------------------------------------------------------

# 1. API Documentation

## 1.1 Authentication

### POST `/auth/login`

**Purpose:** Authenticates a registered user and generates a JWT access
token.

**Access:** Public

**Request Body:**

``` json
{
  "username": "<USERNAME>",
  "password": "<REDACTED_PASSWORD>"
}
```

**Success Response:** `200 OK`

``` json
{
  "message": "Login successful",
  "token": "<REDACTED_JWT_TOKEN>",
  "user": {
    "id": "<USER_ID>",
    "employeeId": "<EMPLOYEE_ID>",
    "username": "<USERNAME>",
    "fullName": "<FULL_NAME>",
    "email": "<REDACTED_EMAIL>",
    "role": "<ROLE>",
    "department": null
  }
}
```

**Authentication Error:** `401 Unauthorized`

``` json
{
  "message": "Invalid username/Employee ID or password"
}
```

------------------------------------------------------------------------

## 1.2 Complaint Management

### POST `/complaints`

**Purpose:** Registers a new repair complaint.

**Access:** `SUPERVISOR`

**Authorization:** Bearer JWT token required.

**Request Body:**

``` json
{
  "title": "Lab 3 AC Repair",
  "description": "Split AC in IT Lab 3 is not cooling properly.",
  "category": "ELECTRICAL",
  "slaDueAt": "<SLA_DATE_TIME>"
}
```

**Success Response:** `201 Created`

The response contains the complaint ID, ticket number, title,
description, category, priority, current status, reporter, HOD approval
status, SLA due time, and creation time.

**Initial Status:** `COMPLAINT_REGISTERED`

------------------------------------------------------------------------

## 1.3 HOD Approval

### PATCH `/approvals/:complaintId`

**Purpose:** Approves or rejects a registered complaint.

**Access:** `HOD`

**Authorization:** Bearer JWT token required.

**Request Body:**

``` json
{
  "status": "APPROVED",
  "remarks": "Approved by HOD for repair"
}
```

**Success Response:** `200 OK`

The response confirms the approval and returns the updated complaint
details.

------------------------------------------------------------------------

## 1.4 Job Assignment

### POST `/jobs/assign`

**Purpose:** Assigns an approved complaint to an electrician for repair.

**Access:** `ELECTRICIAN_HEAD`, `ELECTRICIAN_INCHARGE`

**Authorization:** Bearer JWT token required.

**Request Body:**

``` json
{
  "complaintId": "<COMPLAINT_ID>",
  "technicianId": "<ELECTRICIAN_ID>",
  "notes": "Inspect AC capacitor in Lab 3"
}
```

**Success Response:** `201 Created`

The response confirms that the job was assigned and returns the
assignment details, including complaint ID, technician ID, assigning
user, notes, and assignment time.

------------------------------------------------------------------------

## 1.5 Electrician Job Queue

### GET `/jobs`

**Purpose:** Retrieves the jobs assigned to the authenticated
electrician.

**Access:** `ELECTRICIAN`

**Authorization:** Bearer JWT token required.

**Request Body:** None.

**Success Response:** `200 OK`

``` json
{
  "success": true,
  "count": 1,
  "jobs": [
    {
      "id": "<ASSIGNMENT_ID>",
      "complaintId": "<COMPLAINT_ID>",
      "technicianId": "<ELECTRICIAN_ID>",
      "assignedById": "<ASSIGNED_BY_ID>",
      "assignedAt": "<DATE_TIME>",
      "complaint": {
        "id": "<COMPLAINT_ID>",
        "ticketNumber": "<TICKET_NUMBER>",
        "title": "Lab 3 AC Repair",
        "description": "Split AC in IT Lab 3 is not cooling properly.",
        "category": "ELECTRICAL",
        "priority": "MEDIUM",
        "status": "REPAIR_ASSIGNED",
        "slaDueAt": "<SLA_DATE_TIME>",
        "registeredAt": "<DATE_TIME>"
      }
    }
  ]
}
```

------------------------------------------------------------------------

## 1.6 Complaint Status Updates

### PATCH `/complaints/:complaintId/status`

**Purpose:** Updates the complaint through its repair lifecycle.

**Access:** `ELECTRICIAN_INCHARGE`, `ELECTRICIAN_HEAD`, `ELECTRICIAN`

**Authorization:** Bearer JWT token required.

### Action Taken

**Request Body:**

``` json
{
  "status": "ACTION_TAKEN",
  "remarks": "Repair work completed successfully"
}
```

**Expected Response:** `200 OK`

### Verification

**Request Body:**

``` json
{
  "status": "VERIFICATION",
  "remarks": "Repair work verified successfully"
}
```

**Expected Response:** `200 OK`

### Closure

**Request Body:**

``` json
{
  "status": "CLOSED",
  "remarks": "Complaint resolved and closed"
}
```

**Expected Response:** `200 OK`

------------------------------------------------------------------------

# 2. Standard API Error Responses

### 400 Bad Request

``` json
{
  "status": "error",
  "message": "<VALIDATION_ERROR>"
}
```

### 401 Unauthorized

``` json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden

``` json
{
  "success": false,
  "message": "Forbidden: Access restricted to roles: <ALLOWED_ROLE>"
}
```

### 404 Not Found

``` json
{
  "status": "error",
  "message": "Complaint not found"
}
```

------------------------------------------------------------------------

# 3. API Test Verification Report

## 3.1 Testing Environment

  Item             Details
  ---------------- -----------------------------
  API Base URL     `http://localhost:5000/api`
  Testing Tool     Postman
  Database         Neon PostgreSQL
  Authentication   JWT Bearer Token
  Content Type     `application/json`

------------------------------------------------------------------------

## 3.2 Test Summary

  -------------------------------------------------------------------------------------------------------------------------
  Test Case  Endpoint                            Method     Role                   Expected Result  Actual       Status
                                                                                                    Result
  ---------- ----------------------------------- ---------- ---------------------- ---------------- ------------ ----------
  TC-01      `/auth/login`                       POST       SUPERVISOR / HOD /     Authenticate     Login        PASS
                                                            ELECTRICIAN            user and         successful
                                                                                   generate JWT

  TC-02      `/complaints`                       POST       SUPERVISOR             Create complaint Complaint    PASS
                                                                                                    created

  TC-03      `/approvals/:complaintId`           PATCH      HOD                    Approve          Complaint    PASS
                                                                                   complaint        approved

  TC-04      `/jobs/assign`                      POST       ELECTRICIAN_HEAD       Assign complaint Job assigned PASS
                                                                                   to electrician

  TC-05      `/jobs`                             GET        ELECTRICIAN            Retrieve         Job queue    PASS
                                                                                   assigned job     retrieved
                                                                                   queue

  TC-06      `/complaints/:complaintId/status`   PATCH      ELECTRICIAN            Set status to    Status       PASS
                                                                                   `ACTION_TAKEN`   updated

  TC-07      `/complaints/:complaintId/status`   PATCH      ELECTRICIAN_INCHARGE   Set status to    Status       PASS
                                                                                   `VERIFICATION`   updated

  TC-08      `/complaints/:complaintId/status`   PATCH      Authorized User        Set status to    Complaint    PASS
                                                                                   `CLOSED`         closed
  -------------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 4. Detailed Test Cases

## TC-01 --- User Login

**Endpoint:** `POST /api/auth/login`

**Test Objective:** Verify user authentication and JWT token generation.

**Test Data:** Valid registered username and password.

**Expected Result:** `200 OK` with a JWT token and user information.

**Actual Result:** Login successful and JWT token generated.

**Status:** **PASS**

------------------------------------------------------------------------

## TC-02 --- Complaint Registration

**Endpoint:** `POST /api/complaints`

**Test Objective:** Verify that a supervisor can register a repair
complaint.

**Expected Result:** `201 Created` with complaint details and generated
ticket number.

**Actual Result:** Complaint created successfully.

**Status:** **PASS**

------------------------------------------------------------------------

## TC-03 --- HOD Approval

**Endpoint:** `PATCH /api/approvals/:complaintId`

**Test Objective:** Verify that an HOD can approve a registered
complaint.

**Expected Result:** `200 OK` and complaint approval status updated to
`APPROVED`.

**Actual Result:** Complaint approved successfully.

**Status:** **PASS**

------------------------------------------------------------------------

## TC-04 --- Job Assignment

**Endpoint:** `POST /api/jobs/assign`

**Test Objective:** Verify that an authorized electrician head can
assign an approved complaint to an electrician.

**Expected Result:** `201 Created` with assignment details.

**Actual Result:** Job assigned successfully.

**Status:** **PASS**

**Evidence:** Postman job assignment response screenshot.

------------------------------------------------------------------------

## TC-05 --- Electrician Job Queue

**Endpoint:** `GET /api/jobs`

**Test Objective:** Verify that an electrician can retrieve their
assigned jobs.

**Expected Result:** `200 OK` with the electrician's assigned job queue.

**Actual Result:** Assigned jobs retrieved successfully.

**Status:** **PASS**

**Evidence:** Postman job queue response screenshot.

------------------------------------------------------------------------

## TC-06 --- Action Taken Status

**Endpoint:** `PATCH /api/complaints/:complaintId/status`

**Test Objective:** Verify that repair action can be recorded.

**Request Status:** `ACTION_TAKEN`

**Expected Result:** `200 OK` and complaint status updated to
`ACTION_TAKEN`.

**Actual Result:** Complaint status updated successfully.

**Status:** **PASS**

**Evidence:** Action Taken Postman screenshot.

------------------------------------------------------------------------

## TC-07 --- Incharge Verification

**Endpoint:** `PATCH /api/complaints/:complaintId/status`

**Test Objective:** Verify that the repair work can be moved to the
verification stage.

**Request Status:** `VERIFICATION`

**Expected Result:** `200 OK` and complaint status updated to
`VERIFICATION`.

**Actual Result:** Complaint verification status updated successfully.

**Status:** **PASS**

**Evidence:** Incharge Verification Postman screenshot.

------------------------------------------------------------------------

## TC-08 --- Complaint Closure

**Endpoint:** `PATCH /api/complaints/:complaintId/status`

**Test Objective:** Verify that a successfully verified complaint can be
closed.

**Request Status:** `CLOSED`

**Expected Result:** `200 OK` and complaint status updated to `CLOSED`.

**Actual Result:** Complaint closed successfully.

**Status:** **PASS**

**Evidence:** Closed Complaint Postman screenshot.

------------------------------------------------------------------------

# 5. End-to-End Workflow Verification

``` text
User Login
    ↓
Complaint Registration
    ↓
HOD Approval
    ↓
Job Assignment
    ↓
Electrician Job Queue
    ↓
Action Taken
    ↓
Incharge Verification
    ↓
Complaint Closed
```

The complete complaint lifecycle was tested through the backend APIs
using Postman.

------------------------------------------------------------------------

# 6. Final Test Result

**Total Test Cases:** 8\
**Passed:** 8\
**Failed:** 0

## FINAL RESULT: ALL TEST CASES PASSED

------------------------------------------------------------------------

# 7. Security and Repository Compliance

The documentation is intended for a documentation-only Git branch/PR.

The following must not be committed:

-   JWT access tokens
-   User passwords
-   Neon PostgreSQL connection strings
-   Database passwords
-   JWT secrets
-   `.env` files
-   Other private credentials

Use placeholders such as `<REDACTED_JWT_TOKEN>`, `<REDACTED_PASSWORD>`,
and `<REDACTED_DATABASE_URL>` in documentation.
