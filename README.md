# Job4You — Cloud-Native Job Portal & Recruitment Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![Tests](https://img.shields.io/badge/Tests-25%20Passed%20(100%25)-brightgreen?style=for-the-badge&logo=pytest&logoColor=white)](docs/TESTING_REPORT.md)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

> **Job4You** is a modern, high-performance recruitment and career portal engineered with **Python (FastAPI)**, **React 18 (Vite)**, and **MySQL 8.0 / SQLite**. It features an enterprise-grade REST API, dual-mode authentication (Phone OTP + Email/Password), an intelligent **Demo OTP Bypass engine**, role-based dashboards (Job Seeker, Employer, Administrator), and an end-to-end **production test suite with 25 passing test cases**.

---

## 📌 Architectural Transformation (Legacy Monolith ➔ Modern Cloud-Native)

This platform was re-architected from a legacy monolithic codebase into a decoupled, distributed SPA + REST API micro-architecture:

| Dimension | Legacy System | Modern Job4You Architecture |
|---|---|---|
| **Architecture** | Server-side monolithic rendering | Decoupled SPA + Asynchronous REST API |
| **Backend Engine** | Legacy PHP Monolith | **Python 3 FastAPI** (Asynchronous, High-Concurrency) |
| **Frontend UI** | Fragmented mobile apps & server templates | **React 18 SPA (Vite)** with dynamic client-side routing |
| **Data Layer** | Tightly coupled relational DB | **SQLAlchemy 2.0 ORM** with MySQL 8.0 & SQLite dual-support |
| **Authentication** | Basic session / standard passwords | **JWT HS256 + Phone OTP** with configurable demo bypass |
| **Security & Passwords** | Legacy hashing | **PBKDF2-HMAC-SHA256** with dynamic cryptographic salting |
| **Testing & QA** | Minimal / manual verification | **Automated test suite (25/25 production tests passing)** |
| **Deployment** | Manual script execution | **Docker, Docker Compose, Nginx & Systemd ready** |

---

## 🚀 Key Features

### 1. Dual-Mode Authentication & Demo OTP Bypass
- **Phone OTP Login & Registration**: Zero-friction sign-in using mobile number.
- **Intelligent Demo OTP Bypass**:
  - In demo/interview mode (`BYPASS_OTP=True`), reviewers can enter `123456` or click the **"⚡ Fill Demo OTP (123456)"** button in the modal. No third-party SMS billing or SIM card required.
  - In production mode (`BYPASS_OTP=False`), seamlessly routes to SMS gateways (Twilio, Fast2SMS, AWS SNS) with 5-minute cryptographic expiry and rate-limiting.
- **Email + Password Login**: Enterprise login for recruiters and system administrators.

### 2. Candidate (Job Seeker) Experience
- Real-time job search with keyword matching, location filtering, salary range filters, and category tags.
- Detailed job descriptions with company profile, salary ranges, benefits, and requirements.
- 1-Click job application submission with custom cover letters and resume links.
- Candidate Dashboard tracking application statuses in real-time (`Applied`, `Reviewing`, `Shortlisted`, `Interview`, `Hired`, `Rejected`).
- Bookmark and manage saved jobs.

### 3. Employer (Recruiter) Experience
- Recruiter portal to publish, edit, deactivate, or delete job vacancies.
- Applicant tracking system (ATS) to review candidate applications, inspect resumes, and transition candidate statuses with recruiter feedback notes.
- Employer analytics dashboard displaying total postings, active applicants, and placement conversion rates.
- Searchable talent directory to source candidates by skills and location.

### 4. Administrator Governance & Monitoring
- System metrics overview: total users, active job listings, total applications, and platform activity.
- RBAC permission guards preventing privilege escalation.

### 5. Production Reliability & 25-Test Automated Suite
- 25 automated tests covering unit, integration, RBAC, application lifecycle, and edge scenarios with 100% pass rate in <1 second.

---

## 🛠️ Tech Stack & Libraries

### Frontend
- **Framework**: React 18 (Vite SPA)
- **Routing**: React Router DOM 6
- **State & Auth**: React Context API (`AuthContext`) with persistent localStorage sync
- **HTTP Client**: Axios with automated Bearer JWT request/response interceptors
- **Icons**: Lucide React
- **Design System**: Modern responsive CSS3 with CSS variables & flexbox/grid

### Backend
- **Framework**: Python 3.9+ / FastAPI
- **Data Validation & Schemas**: Pydantic V2
- **ORM**: SQLAlchemy 2.0
- **Database Drivers**: PyMySQL (MySQL 8.0) and SQLite3
- **Security & Passwords**: Passlib (`pbkdf2_sha256`), Python-Jose (`jwt`), Cryptography
- **Test Framework**: Pytest 8.4+, FastAPI TestClient, HTTPX

---

## ⚡ Quick Start Guide (Run Locally in 2 Minutes)

### Prerequisites
- Python 3.9 or higher
- Node.js 18+ and npm
- (Optional) MySQL 8.0 or Docker

### Step 1: Clone the Repository
```bash
git clone https://github.com/aditya-life/Job4You.git
cd Job4You
```

### Step 2: Start the Python FastAPI Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env

# Run automated tests to verify setup
./run_tests.sh

# Start backend server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
> The database (`job4you.db`) will be automatically created and populated with demo employers, candidates, and job postings!
> Interactive API Documentation: **http://localhost:8000/docs**

### Step 3: Start the React Frontend
In a new terminal:
```bash
cd Job4You/frontend
npm install
npm run dev
```
> Open your browser at **http://localhost:5173**

---

## 🔑 Demo Login Credentials

For quick evaluation and review:

| Role | Email / Phone | Password / OTP | Purpose |
|---|---|---|---|
| **Candidate (Job Seeker)** | `9876543210` *(Phone)* | **`123456`** *(Demo OTP)* | Test phone OTP login & applying to jobs |
| **Employer (Recruiter)** | `employer@job4you.com` | `Password123!` | Test posting jobs, managing applicants, ATS |
| **Administrator** | `admin@job4you.com` | `Password123!` | Test platform analytics & management |

*(You can also use any random 10-digit phone number with demo OTP `123456` to auto-create and test a brand-new candidate profile!)*

---

## 🗄️ Database Architecture (MySQL 8.0 & SQLite)

Job4You is database-agnostic through SQLAlchemy:
- **Development Default**: SQLite (`sqlite:///./job4you.db`) for instant zero-dependency setup.
- **Production Relational DB**: **MySQL 8.0+** (`mysql+pymysql://user:pass@host:3306/job4you`).

### Using MySQL in Local or Production:
1. Create a MySQL database named `job4you`:
   ```sql
   CREATE DATABASE job4you CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Import schema and seed records:
   ```bash
   mysql -u root -p job4you < database/mysql_schema.sql
   mysql -u root -p job4you < database/seed_data.sql
   ```
3. Update `backend/.env`:
   ```ini
   DATABASE_URL=mysql+pymysql://root:your_mysql_password@localhost:3306/job4you
   ```

---

## 🧪 Production Testing & Quality Assurance

Prior to release, every workflow is validated by our 25 automated tests:

```bash
cd backend
./run_tests.sh
```

### Test Suite Summary:
```text
============================= test session starts ==============================
collected 25 items

tests/test_auth.py .........                                             [ 36%]
tests/test_jobs.py ........                                              [ 68%]
tests/test_applications.py ......                                        [ 92%]
tests/test_security.py ..                                                [100%]

============================== 25 passed in 0.75s ==============================
```

Detailed test scenario descriptions and assertions are documented in [`docs/TESTING_REPORT.md`](docs/TESTING_REPORT.md).

---

## 🐳 Docker Deployment (Single Command)

To run the entire platform (MySQL 8.0 + FastAPI + React SPA on Nginx) with a single command:

```bash
docker compose up -d --build
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API & Docs**: `http://localhost:8000/docs`
- **MySQL Database**: `localhost:3306`

---

## 📚 Technical Documentation Directory

For deep-dive technical reviews:
- 📐 [**System Architecture & Flow Diagrams**](docs/ARCHITECTURE.md)
- 🔌 [**REST API Endpoint Reference**](docs/API_DOCUMENTATION.md)
- 🚀 [**Production Deployment Guide (Linux, Nginx, Systemd, SSL)**](docs/DEPLOYMENT_GUIDE.md)
- 🧪 [**Quality Assurance & Test Suite Report**](docs/TESTING_REPORT.md)

---

## 💼 Interview Talking Points & Deep-Dive FAQ

When presenting this project to interviewers or hiring managers, here are the key technical concepts and architectural decisions to discuss:

### 1. Why FastAPI instead of Flask or Django?
> *"FastAPI offers asynchronous I/O out of the box based on Starlette and Pydantic. It provides type safety, automatic OpenAPI/Swagger documentation generation, and high throughput comparable to NodeJS and Go. For a decoupled REST API backend, FastAPI delivers minimal boilerplate with maximum performance and strict data validation."*

### 2. How did you handle the OTP verification for demo vs production?
> *"In production environments, sending SMS via external providers incurs costs and latency. To ensure evaluators can experience the complete user journey without carrier delays, I built an environment-driven OTP verification strategy (`BYPASS_OTP=True`). When enabled, the service accepts pre-configured test codes (`123456`) and the React UI dynamically renders an auto-fill button. When switched to `False`, the backend seamlessly enforces live cryptographic OTPs sent through SMS provider adapters with rate-limiting and a 5-minute TTL."*

### 3. How is Role-Based Access Control (RBAC) enforced?
> *"Permissions are enforced at the API gateway layer using FastAPI's dependency injection system (`Depends`). We have modular guards (`require_role`, `require_employer_or_admin`) that unpack and verify the signed JWT token claims before any route logic executes. If a candidate attempts to post a job or modify another user's application, a 403 Forbidden is raised deterministically."*

### 4. What was your strategy for database portability?
> *"We utilized SQLAlchemy 2.0 ORM with connection pooling. The data models define typed columns, composite unique indexes, and foreign keys that translate cleanly to both MySQL 8.0 in production and SQLite for local development and CI/CD pipelines. We also provide standalone SQL DDL scripts (`mysql_schema.sql` and `seed_data.sql`) for DBAs."*

### 5. How do you prevent duplicate job applications?
> *"We implement a dual-layer defense: at the database layer, a composite unique constraint `(job_id, candidate_id)` prevents race conditions. At the business logic layer, the application service checks existing records and returns a clean `400 Bad Request` with an informative message if the applicant has already applied."*

---

## 👨‍💻 Author & Contribution

Developed with passion by **Aditya** ([@aditya-life](https://github.com/aditya-life))

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
