# Job4You Architecture & System Design Documentation

## 1. System Overview

**Job4You** is a modern, high-performance recruitment and job search platform re-engineered from a monolithic PHP/Laravel legacy application into a decoupled, scalable, cloud-native architecture using **FastAPI (Python 3)**, **React 18 (Vite)**, and **MySQL 8.0 / SQLite**.

The platform is designed around clean architecture principles, separating concerns across:
- **Presentation Layer**: Responsive React 18 Single Page Application with dynamic state and role-based views.
- **API Gateway & Business Logic Layer**: High-speed asynchronous Python FastAPI application with Pydantic V2 validation and JWT/RBAC security.
- **Data Persistence Layer**: SQLAlchemy 2.0 ORM with connection pooling, supporting production MySQL and zero-configuration SQLite for development.

```mermaid
flowchart TD
    subgraph Client["Presentation Layer (Client)"]
        UI["React 18 Single Page Application (Vite)"]
        AC["AuthContext & State Management"]
        AX["Axios Client (JWT Interceptor)"]
        UI --> AC
        AC --> AX
    end

    subgraph Gateway["API & Application Layer (FastAPI)"]
        CORS["CORS & Security Middleware"]
        Router["FastAPI APIRouter Routing"]
        AuthSvc["Auth & RBAC Service (JWT + PBKDF2)"]
        OtpSvc["OTP Service (Demo Bypass / SMS Provider)"]
        JobSvc["Job Management Service"]
        AppSvc["Application Lifecycle Engine"]
        
        AX -->|HTTP/REST /api/*| CORS
        CORS --> Router
        Router --> AuthSvc
        Router --> OtpSvc
        Router --> JobSvc
        Router --> AppSvc
    end

    subgraph Data["Data Persistence Layer"]
        ORM["SQLAlchemy 2.0 ORM Engine"]
        Pool["Connection Pooling"]
        DB[(MySQL 8.0 Production / SQLite Local)]
        
        AuthSvc --> ORM
        OtpSvc --> ORM
        JobSvc --> ORM
        AppSvc --> ORM
        ORM --> Pool
        Pool --> DB
    end
```

---

## 2. Authentication & Demo OTP Bypass Architecture

Job4You supports dual-mode enterprise authentication:
1. **Phone Number + OTP Verification** (Modern, friction-free login for mobile and web).
2. **Email + Secure Password** (Enterprise & administrator authentication).

### Demo OTP Bypass Architecture
For developer evaluation, investor demos, and portfolio review, SMS gateways (like Twilio, AWS SNS, or Fast2SMS) can incur recurring costs or fail due to carrier filtering. Job4You features an intelligent, configurable **Demo OTP Bypass engine**:

- **Configuration Key**: `BYPASS_OTP=True` in `.env`
- **Pre-configured Codes**: Accepts `123456` or `1111` for any mobile number.
- **Frontend Integration**: An **Instant Demo Auto-Fill button** appears in the OTP modal during demo mode, allowing 1-click verification.
- **Production Transition**: Setting `BYPASS_OTP=False` automatically routes OTP requests to the SMS gateway adapter with rate limiting and 5-minute cryptographic expiration.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Reviewer
    participant React as React UI (OtpModal)
    participant API as FastAPI (/api/auth)
    participant OTP as OTP Engine
    participant DB as Relational DB

    User->>React: Enters Phone Number (e.g. 9876543210)
    React->>API: POST /api/auth/send-otp {identifier: "9876543210"}
    API->>OTP: generate_otp(identifier)
    alt BYPASS_OTP is True (Demo Mode)
        OTP-->>API: Store OTP (Expires in 5 min, Code: 123456)
        API-->>React: 200 OK {message: "OTP sent. Demo bypass active", demo_code: "123456"}
        React-->>User: Display OTP Modal with 1-Click "Fill Demo OTP (123456)" button
    else BYPASS_OTP is False (Production Mode)
        OTP->>OTP: Send SMS via Twilio / Fast2SMS
        API-->>React: 200 OK {message: "OTP sent to your registered phone"}
    end

    User->>React: Submits OTP (123456)
    React->>API: POST /api/auth/verify-otp {identifier, otp: "123456"}
    API->>OTP: verify_otp(identifier, "123456")
    OTP->>DB: Validate OTP expiration and match
    DB-->>OTP: Valid
    API->>DB: Find or create User record
    API->>API: Generate Signed JWT Token (HS256)
    API-->>React: 200 OK {access_token, token_type: "bearer", user: {...}}
    React->>React: Store token in localStorage & update AuthContext
    React-->>User: Redirect to Role-specific Dashboard
```

---

## 3. Role-Based Access Control (RBAC) Matrix

Job4You strictly enforces permission boundaries via FastAPI dependency injection guards (`get_current_user`, `require_role`, `require_employer_or_admin`).

| Endpoint Route | Unauthenticated | Job Seeker (`job_seeker`) | Employer (`employer`) | Administrator (`admin`) |
|---|:---:|:---:|:---:|:---:|
| `GET /api/jobs` | Read-only | Read-only | Read-only | Read-only |
| `GET /api/jobs/{id}` | Read-only | Read-only | Read-only | Read-only |
| `POST /api/jobs` | Denied (401) | Denied (403) | Granted | Granted |
| `PUT /api/jobs/{id}` | Denied (401) | Denied (403) | Own jobs only | All jobs |
| `DELETE /api/jobs/{id}` | Denied (401) | Denied (403) | Own jobs only | All jobs |
| `POST /api/applications/apply` | Denied (401) | Granted | Denied (403) | Denied (403) |
| `GET /api/applications/my-applications` | Denied (401) | Own applications | Denied (403) | Denied (403) |
| `GET /api/applications/job/{id}` | Denied (401) | Denied (403) | Own job applicants | All applicants |
| `PUT /api/applications/{id}/status` | Denied (401) | Denied (403) | Own job applicants | Granted |
| `GET /api/employer/dashboard` | Denied (401) | Denied (403) | Granted | Granted |
| `GET /api/employee/dashboard` | Denied (401) | Granted | Denied (403) | Granted |

---

## 4. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ JOBS : "posts"
    USERS ||--o{ JOB_APPLICATIONS : "submits"
    USERS ||--o{ SAVED_JOBS : "bookmarks"
    JOBS ||--o{ JOB_APPLICATIONS : "receives"
    JOBS ||--o{ SAVED_JOBS : "bookmarked_in"
    USERS ||--o{ OTPS : "requests"

    USERS {
        int id PK
        string full_name
        string email UK
        string phone UK
        string hashed_password
        string role "admin | employer | job_seeker"
        string company_name
        string designation
        string city
        string resume_url
        string skills
        int experience_years
        boolean is_active
        boolean is_verified
        datetime created_at
        datetime updated_at
    }

    JOBS {
        int id PK
        int employer_id FK
        string title
        string company_name
        string category
        string job_type "full_time | part_time | remote | internship | contract"
        string location
        string experience_level
        decimal salary_min
        decimal salary_max
        string currency
        text description
        text requirements
        text benefits
        string status "active | closed | draft"
        int vacancies
        datetime deadline
        datetime created_at
    }

    JOB_APPLICATIONS {
        int id PK
        int job_id FK
        int candidate_id FK
        string status "applied | reviewing | shortlisted | interview | rejected | hired"
        text cover_letter
        string resume_url
        text employer_notes
        datetime applied_at
        datetime updated_at
    }

    SAVED_JOBS {
        int id PK
        int user_id FK
        int job_id FK
        datetime created_at
    }

    OTPS {
        int id PK
        string identifier
        string otp_code
        string purpose "login | register | verify_phone"
        boolean is_used
        datetime expires_at
        datetime created_at
    }
```

---

## 5. Security & Reliability Highlights

1. **Password Security**: Uses NIST/FIPS-compliant `PBKDF2-HMAC-SHA256` hashing with dynamic salting, preventing rainbow table attacks while eliminating native binary compilation dependencies on different host OS architectures.
2. **Stateless JWT Tokens**: Signed with HMAC-SHA256 with user claims, roles, and automated token revocation handling on client logout.
3. **Pydantic V2 Type Enforcement**: All incoming payloads are strictly sanitized and validated against typed schemas, preventing SQL injection, field pollution, and memory leaks.
4. **Relational Constraints**: Cascading foreign keys, composite unique constraints (`user_id` + `job_id` preventing duplicate applications/bookmarks), and indexed lookup columns.
5. **Connection Pooling**: Handled via SQLAlchemy `pool_pre_ping=True` and `pool_recycle=3600` to prevent stale database sockets in long-lived production processes.
