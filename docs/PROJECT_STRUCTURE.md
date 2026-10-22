# Job4You Project Structure & Codebase Architecture Guide

## 1. Architectural Philosophy

Job4You is structured following **Clean Layered Architecture (Domain-Driven Design)** principles on the backend and **Modular Component-Driven Architecture** on the frontend.

### Core Objectives of this Structure:
1. **High Human Readability**: Any software engineer, technical interviewer, or code reviewer can locate business logic in seconds without navigating nested spaghetti code.
2. **Decoupled Concerns**: Database models, request/response validation schemas, domain services (business logic), and HTTP route controllers are strictly separated.
3. **Effortless Modification & Extensibility**: Adding a new feature, modifying a validation rule, or updating search filters requires editing isolated, single-responsibility files without collateral side-effects.
4. **100% Testable & Type-Safe**: Backed by Pydantic V2 schemas, SQLAlchemy ORM models, and a 25-test automated Pytest suite.

---

## 2. Directory Structure Map

```text
Job4You/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI test & build pipeline for GitHub Actions
├── backend/
│   ├── app/
│   │   ├── core/                # Core foundation & application configuration
│   │   │   ├── __init__.py
│   │   │   ├── config.py        # Central Pydantic settings (.env loading, CORS, ports)
│   │   │   ├── constants.py     # Strongly typed enums (UserRole, JobType, ApplicationStatus)
│   │   │   ├── database.py      # SQLAlchemy 2.0 engine, SessionLocal & get_db generator
│   │   │   ├── exceptions.py    # Custom domain exceptions (NotFound, Unauthorized, Forbidden)
│   │   │   └── security.py      # Cryptographic PBKDF2 password hashing & JWT token services
│   │   ├── models/              # SQLAlchemy ORM relational database models
│   │   │   ├── __init__.py
│   │   │   ├── user.py          # Users table (Candidate, Employer, Admin attributes)
│   │   │   ├── job.py           # Jobs table (Vacancies, salary ranges, requirements)
│   │   │   ├── application.py   # JobApplications & SavedJobs relational tables
│   │   │   └── otp.py           # OTP authentication & expiry table
│   │   ├── schemas/             # Pydantic V2 Data Transfer Objects (DTOs) & input validation
│   │   │   ├── auth.py          # OTP requests, JWT token responses, login & signup schemas
│   │   │   ├── user.py          # User profile responses & update schemas
│   │   │   ├── job.py           # JobCreate, JobUpdate, JobResponse & JobListResponse
│   │   │   └── application.py   # ApplyRequest, StatusUpdateRequest & ApplicationResponse
│   │   ├── services/            # Pure Business Logic Layer (Domain Services)
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py  # User authentication, RBAC dependency guards
│   │   │   ├── otp_service.py   # OTP generation, storage & Demo Bypass engine
│   │   │   ├── job_service.py   # Job listings, search filtering & CRUD business operations
│   │   │   ├── application_service.py # Applications submission, duplicate checks & ATS updates
│   │   │   └── user_service.py  # User profile lookups, candidate search & dashboard metrics
│   │   ├── routers/             # HTTP API Controllers (Thin endpoints delegating to services)
│   │   │   ├── auth.py          # /api/auth routes
│   │   │   ├── jobs.py          # /api/jobs routes
│   │   │   ├── applications.py  # /api/applications routes
│   │   │   ├── employer.py      # /api/employer management routes
│   │   │   ├── employee.py      # /api/employee candidate profile routes
│   │   │   └── reference.py     # /api/reference master data routes
│   │   ├── seed.py              # Automatic database seeder for initial demo data
│   │   └── main.py              # Application entrypoint, CORS configuration & OpenAPI docs
│   ├── tests/                   # Comprehensive Automated Test Suite (25 Tests)
│   │   ├── conftest.py          # Test fixtures (SQLite in-memory test DB, TestClient)
│   │   ├── test_auth.py         # Auth, OTP generation, demo bypass & signup tests
│   │   ├── test_jobs.py         # Job creation, keyword search, filters & CRUD tests
│   │   ├── test_applications.py # Candidate applications, duplicate blocking & ATS stages
│   │   ├── test_security.py     # RBAC permission boundaries & token tamper defense
│   │   └── test_reference.py    # Health check, root & lookup reference tests
│   ├── Dockerfile               # Production container image configuration
│   ├── pytest.ini               # Pytest test runner options
│   ├── requirements.txt         # Python dependencies
│   └── run_tests.sh             # Executable shell runner for test suite
├── frontend/
│   ├── src/
│   │   ├── constants/           # Central constants & options registry
│   │   │   ├── routes.js        # Named route paths (prevents string typo bugs)
│   │   │   ├── roles.js         # User role identifiers (job_seeker, employer, admin)
│   │   │   ├── jobConstants.js  # Categories, workplace types, employment types & status badges
│   │   │   └── index.js
│   │   ├── hooks/               # Custom React Hooks
│   │   │   ├── useAuth.js       # Fast access to AuthContext
│   │   │   └── useDebounce.js   # Input debouncing for high-performance search
│   │   ├── utils/               # Formatting & helper utilities
│   │   │   ├── formatters.js    # Currency salary formatting, dates, time-ago
│   │   │   └── statusHelpers.js # ATS status badge colors and labels
│   │   ├── services/            # Modular API Network Layer
│   │   │   ├── apiClient.js     # Axios instance with JWT interceptors & error handlers
│   │   │   ├── authService.js   # Auth & OTP network calls
│   │   │   ├── jobsService.js   # Jobs listing, search & CRUD calls
│   │   │   ├── applicationService.js # Candidate applications & bookmarking calls
│   │   │   ├── employerService.js # Employer dashboard & candidate search calls
│   │   │   ├── employeeService.js # Candidate dashboard & profile update calls
│   │   │   ├── referenceService.js # Industry categories & cities calls
│   │   │   └── api.js           # Backward-compatibility facade
│   │   ├── components/
│   │   │   ├── common/          # Atomic, reusable UI elements
│   │   │   │   ├── Button.jsx   # Variant-based button with loading spinner
│   │   │   │   ├── Badge.jsx    # Status and category badges
│   │   │   │   ├── LoadingSpinner.jsx # Pure SVG loading spinner
│   │   │   │   ├── EmptyState.jsx # Visual empty state illustrations
│   │   │   │   ├── Alert.jsx    # Alert notification banners
│   │   │   │   └── index.js
│   │   │   ├── layout/          # Layout wrappers
│   │   │   │   ├── Navbar.jsx   # Header with role-aware buttons & demo badge
│   │   │   │   ├── Footer.jsx   # Global footer
│   │   │   │   └── index.js
│   │   │   ├── jobs/            # Job-specific UI components
│   │   │   │   ├── JobCard.jsx  # Card displaying job details, tags, and bookmark toggle
│   │   │   │   ├── FilterSidebar.jsx # Sidebar with category, type, and location filters
│   │   │   │   └── index.js
│   │   │   └── auth/            # Authentication UI components
│   │   │       ├── OtpModal.jsx # Dual-mode Phone/Email OTP modal with 1-click bypass
│   │   │       ├── ProtectedRoute.jsx # RBAC route guard
│   │   │       └── index.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state, persistent JWT token hydration
│   │   ├── pages/               # Top-level Page Views
│   │   │   ├── Home.jsx         # Hero section, stats, featured jobs, and call-to-actions
│   │   │   ├── Jobs.jsx         # Full job board with sidebar filters and pagination
│   │   │   ├── JobDetails.jsx   # Detailed vacancy description, apply modal & salary info
│   │   │   ├── Login.jsx        # Dual-mode authentication (OTP + Email/Password)
│   │   │   ├── Register.jsx     # Candidate & Employer registration
│   │   │   ├── JobSeekerDashboard.jsx # Candidate applied jobs & saved bookmarks
│   │   │   ├── EmployerDashboard.jsx # Recruiter ATS pipeline & job posting management
│   │   │   └── AdminDashboard.jsx # System-wide platform metrics
│   │   ├── App.jsx              # Application router & protected routes declaration
│   │   ├── main.jsx             # React DOM mounting entrypoint
│   │   └── index.css            # Enterprise responsive CSS design system
│   ├── Dockerfile               # Multi-stage production Docker build
│   ├── nginx.conf               # Nginx reverse proxy configuration for SPA
│   ├── package.json             # NPM package manifest
│   └── vite.config.js           # Vite development server & proxy configuration
├── database/
│   ├── mysql_schema.sql         # Production MySQL 8.0 DDL script with foreign keys
│   └── seed_data.sql            # Initial master records for production MySQL
├── docs/
│   ├── ARCHITECTURE.md          # System architecture, data flow & Mermaid diagrams
│   ├── API_DOCUMENTATION.md     # Complete REST API specification
│   ├── DEPLOYMENT_GUIDE.md      # Docker, Linux VPS, Nginx, Systemd & SSL setup
│   ├── TESTING_REPORT.md        # 25-test automated testing report
│   └── PROJECT_STRUCTURE.md     # This comprehensive architectural guide
├── docker-compose.yml           # Single-command stack (MySQL 8 + FastAPI + React on Nginx)
├── LICENSE                      # MIT Open Source License
└── README.md                    # Portfolio-grade README with badges & interview talking points
```

---

## 3. How to Modify or Extend the Project (Developer Guide)

### 3.1 How to Add a New API Endpoint
1. **Define Schema** in `backend/app/schemas/`:
   Create the request payload model and response model using Pydantic V2.
2. **Add Business Logic** in `backend/app/services/`:
   Add a method to the relevant service class (e.g. `job_service.py` or `application_service.py`).
3. **Expose Endpoint** in `backend/app/routers/`:
   Add the route handler method in the respective router file and annotate with `@router.get`, `@router.post`, etc.
4. **Write Automated Test** in `backend/tests/`:
   Add a test function verifying status code, payload, and unauthorized access rejections.
5. **Run Test Runner**:
   Execute `./run_tests.sh` to confirm the test passes.

### 3.2 How to Switch between SQLite (Local) and MySQL (Production)
In `backend/.env`:
- For SQLite local zero-setup dev:
  ```ini
  DATABASE_URL=sqlite:///./job4you.db
  ```
- For Production MySQL 8.0:
  ```ini
  DATABASE_URL=mysql+pymysql://db_user:db_password@localhost:3306/job4you
  ```

### 3.3 How to Switch between Demo OTP Bypass and Production SMS
In `backend/.env`:
- For Demo / Portfolio Review mode (accepts `123456` or `1111` with 1-click button):
  ```ini
  BYPASS_OTP=True
  DEMO_OTP=123456
  ```
- For Live Production SMS dispatch:
  ```ini
  BYPASS_OTP=False
  ```

---

## 4. Coding Standards & Naming Conventions

| Layer | Convention | Example |
|---|---|---|
| **Pydantic Schemas** | PascalCase ending with purpose | `JobCreate`, `JobResponse`, `ApplyRequest` |
| **SQLAlchemy Models** | Singular PascalCase | `User`, `Job`, `JobApplication`, `SavedJob` |
| **Service Classes** | PascalCase ending with Service | `JobService`, `ApplicationService`, `UserService` |
| **Route Controllers** | snake_case descriptive verbs | `list_jobs`, `apply_to_job`, `get_current_user` |
| **React Components** | PascalCase `.jsx` files | `JobCard.jsx`, `FilterSidebar.jsx`, `Button.jsx` |
| **Custom React Hooks** | camelCase starting with `use` | `useAuth.js`, `useDebounce.js` |
| **Constants** | UPPER_SNAKE_CASE | `ROUTES.HOME`, `USER_ROLES.JOB_SEEKER` |
