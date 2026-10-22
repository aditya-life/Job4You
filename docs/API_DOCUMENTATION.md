# Job4You REST API Specification

Interactive Swagger UI documentation is available locally at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc UI**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

Base Path: `/api`

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Request OTP
Generate and send an OTP to a mobile phone number or email.
- **URL**: `POST /api/auth/send-otp`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "identifier": "9876543210",
    "purpose": "login"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "message": "OTP generated and sent successfully",
    "identifier": "9876543210",
    "demo_bypass": true,
    "demo_code": "123456"
  }
  ```

### 1.2 Verify OTP & Login / Auto-Register
Verify the submitted OTP code. If the user does not exist, an account is automatically provisioned.
- **URL**: `POST /api/auth/verify-otp`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "identifier": "9876543210",
    "otp": "123456",
    "name": "Aditya Verma",
    "role": "job_seeker"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "id": 3,
      "email": "user_9876543210@job4you.local",
      "phone": "9876543210",
      "full_name": "Aditya Verma",
      "role": "job_seeker",
      "is_active": true
    }
  }
  ```

### 1.3 Email & Password Login
- **URL**: `POST /api/auth/login`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "employer@job4you.com",
    "password": "Password123!"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "id": 2,
      "email": "employer@job4you.com",
      "full_name": "Tech Corp HR",
      "role": "employer",
      "company_name": "TechCorp Innovations"
    }
  }
  ```

### 1.4 User Registration
- **URL**: `POST /api/auth/signup`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "full_name": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "9811223344",
    "password": "SecurePassword123!",
    "role": "job_seeker",
    "city": "Bengaluru",
    "skills": "Python, FastAPI, React, MySQL"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "access_token": "...",
    "token_type": "bearer",
    "user": { ... }
  }
  ```

### 1.5 Get Current Profile
- **URL**: `GET /api/auth/me`
- **Auth Required**: Bearer JWT
- **Response `200 OK`**: Returns current authenticated user object.

---

## 2. Jobs Endpoints (`/api/jobs`)

### 2.1 List / Filter Jobs
- **URL**: `GET /api/jobs`
- **Auth Required**: No
- **Query Parameters**:
  - `keyword` (string): Search title, company, description, or skills
  - `category` (string): e.g. "Software Development", "Marketing"
  - `job_type` (string): "full_time" | "part_time" | "remote" | "internship" | "contract"
  - `location` (string): City or "Remote"
  - `experience_level` (string): "Entry Level" | "Mid Level" | "Senior Level" | "Lead"
  - `min_salary` (float): Minimum salary filter
  - `max_salary` (float): Maximum salary filter
  - `skip` (int, default: 0): Pagination offset
  - `limit` (int, default: 20): Page size limit
- **Response `200 OK`**:
  ```json
  [
    {
      "id": 1,
      "title": "Senior Python Backend Engineer",
      "company_name": "TechCorp Innovations",
      "category": "Software Development",
      "job_type": "remote",
      "location": "Bengaluru",
      "experience_level": "Senior Level",
      "salary_min": 1500000.0,
      "salary_max": 2500000.0,
      "currency": "INR",
      "description": "...",
      "status": "active",
      "created_at": "2026-10-22T21:49:00"
    }
  ]
  ```

### 2.2 Get Job Details
- **URL**: `GET /api/jobs/{id}`
- **Auth Required**: No
- **Response `200 OK`**: Detailed job object including employer profile metadata.

### 2.3 Post New Job
- **URL**: `POST /api/jobs`
- **Auth Required**: Bearer JWT (Role: `employer` or `admin`)
- **Request Body**:
  ```json
  {
    "title": "Full Stack React & Python Developer",
    "company_name": "NextGen AI",
    "category": "Software Development",
    "job_type": "full_time",
    "location": "Hyderabad",
    "experience_level": "Mid Level",
    "salary_min": 1200000.0,
    "salary_max": 1800000.0,
    "currency": "INR",
    "description": "We are seeking a talented full stack engineer...",
    "requirements": "Proficiency in FastAPI, React 18, and MySQL",
    "benefits": "Health insurance, flexible hours, annual bonus",
    "vacancies": 2
  }
  ```
- **Response `201 Created`**: Returns the newly created job record.

### 2.4 Update Job
- **URL**: `PUT /api/jobs/{id}`
- **Auth Required**: Bearer JWT (Must be job creator employer or admin)
- **Response `200 OK`**: Updated job record.

### 2.5 Delete Job
- **URL**: `DELETE /api/jobs/{id}`
- **Auth Required**: Bearer JWT (Must be job creator employer or admin)
- **Response `200 OK`**:
  ```json
  {
    "message": "Job deleted successfully"
  }
  ```

---

## 3. Applications Endpoints (`/api/applications`)

### 3.1 Apply to a Job
- **URL**: `POST /api/applications/apply`
- **Auth Required**: Bearer JWT (Role: `job_seeker`)
- **Request Body**:
  ```json
  {
    "job_id": 1,
    "cover_letter": "I am excited to apply with 4+ years of Python & React experience.",
    "resume_url": "https://example.com/resumes/aditya_verma.pdf"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "id": 1,
    "job_id": 1,
    "candidate_id": 3,
    "status": "applied",
    "applied_at": "2026-10-22T21:49:00"
  }
  ```
- **Error `400 Bad Request`**: If the user has already applied to this job.

### 3.2 List My Applications
- **URL**: `GET /api/applications/my-applications`
- **Auth Required**: Bearer JWT (Role: `job_seeker`)
- **Response `200 OK`**: Array of applications joined with Job details and status.

### 3.3 List Applicants for a Job
- **URL**: `GET /api/applications/job/{job_id}`
- **Auth Required**: Bearer JWT (Must be the job's employer or admin)
- **Response `200 OK`**: Array of applicant profiles, resumes, and status.

### 3.4 Update Application Status
- **URL**: `PUT /api/applications/{id}/status`
- **Auth Required**: Bearer JWT (Employer or admin)
- **Request Body**:
  ```json
  {
    "status": "shortlisted",
    "employer_notes": "Great candidate, scheduled for technical interview round."
  }
  ```
- **Response `200 OK`**: Updated application record.

### 3.5 Bookmark / Save Job
- **URL**: `POST /api/applications/save-job/{job_id}`
- **Auth Required**: Bearer JWT (Role: `job_seeker`)
- **Response `200 OK`**:
  ```json
  {
    "saved": true,
    "message": "Job saved successfully"
  }
  ```

---

## 4. Employer Management Endpoints (`/api/employer`)

- `GET /api/employer/dashboard`: Aggregate KPI metrics (total jobs posted, total applicants received, pending reviews, hired count).
- `GET /api/employer/my-jobs`: List of jobs posted by the logged-in employer with application counts.
- `GET /api/employer/candidates`: Searchable database of registered talent by skill, city, and experience level.

---

## 5. Candidate Profile Endpoints (`/api/employee`)

- `GET /api/employee/dashboard`: Candidate dashboard metrics (applied jobs, shortlisted status, saved jobs).
- `PUT /api/employee/profile`: Update candidate profile information (resume URL, bio, skills, experience, designation).

---

## 6. Reference Data Endpoints (`/api/reference`)

- `GET /api/reference/categories`: Pre-populated industry job categories.
- `GET /api/reference/cities`: Major metropolitan and tech hub cities.
- `GET /api/reference/stats`: Platform-wide summary stats (total active jobs, registered companies, successful placements).
