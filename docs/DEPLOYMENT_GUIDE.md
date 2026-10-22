# Job4You Production Deployment Guide

This guide covers deployment instructions for **Job4You** across local development, Dockerized container platforms, and bare-metal/cloud Linux VPS environments (Ubuntu/Debian, AWS EC2, DigitalOcean, Linode).

---

## 1. Quick Local Development Setup

### Backend (Python FastAPI)
1. **Navigate to the backend directory**:
   ```bash
   cd /path/to/Job4You/backend
   ```
2. **Create and activate a Python virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
5. **Run tests**:
   ```bash
   ./run_tests.sh
   ```
6. **Start the FastAPI backend**:
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   Backend will be accessible at `http://localhost:8000`. Automatic database tables and seed data are initialized automatically on startup.

---

### Frontend (React 18 + Vite)
1. **Navigate to the frontend directory**:
   ```bash
   cd /path/to/Job4You/frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
4. **Start Vite development server**:
   ```bash
   npm run dev
   ```
   Frontend will run at `http://localhost:5173` with requests to `/api/*` proxied to port 8000.

---

## 2. Production Database Setup (MySQL 8.0)

Job4You is architected to run seamlessly on **MySQL 8.0+** in production.

### Step 1: Install and Secure MySQL
On Ubuntu / Debian:
```bash
sudo apt update
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

### Step 2: Create Database and User
Log into MySQL as root:
```sql
CREATE DATABASE job4you CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'job4you_user'@'localhost' IDENTIFIED BY 'StrongProductionPassword2026!';
GRANT ALL PRIVILEGES ON job4you.* TO 'job4you_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Import Schema & Seed Data
```bash
mysql -u job4you_user -p job4you < database/mysql_schema.sql
mysql -u job4you_user -p job4you < database/seed_data.sql
```

### Step 4: Configure Backend Connection
In `backend/.env`:
```ini
DATABASE_URL=mysql+pymysql://job4you_user:StrongProductionPassword2026!@localhost:3306/job4you
```

---

## 3. Production Deployment with Docker Compose

A production-ready `docker-compose.yml` orchestrates the FastAPI application, built React SPA behind Nginx, and a MySQL 8 container.

### Step 1: Launch Stack
```bash
docker compose up -d --build
```

### Step 2: Verify Status
```bash
docker compose ps
docker compose logs -f backend
```

---

## 4. Production Deployment on Linux VPS (Systemd + Nginx + SSL)

### Step 1: Backend Systemd Service
Create `/etc/systemd/system/job4you-backend.service`:
```ini
[Unit]
Description=Job4You FastAPI Production Service
After=network.target mysql.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/Job4You/backend
Environment="PATH=/var/www/Job4You/backend/venv/bin"
EnvironmentFile=/var/www/Job4You/backend/.env
ExecStart=/var/www/Job4You/backend/venv/bin/gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000

Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable job4you-backend
sudo systemctl start job4you-backend
sudo systemctl status job4you-backend
```

### Step 2: Build Frontend Static Bundle
```bash
cd /var/www/Job4You/frontend
npm run build
# Output will be located in /var/www/Job4You/frontend/dist
```

### Step 3: Nginx Reverse Proxy Configuration
Create `/etc/nginx/sites-available/job4you.conf`:
```nginx
server {
    listen 80;
    server_name job4you.yourdomain.com;

    # Root frontend build
    root /var/www/Job4You/frontend/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    # Frontend SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Swagger Documentation Proxy
    location /docs {
        proxy_pass http://127.0.0.1:8000/docs;
    }
    location /openapi.json {
        proxy_pass http://127.0.0.1:8000/openapi.json;
    }
}
```

Enable site & reload:
```bash
sudo ln -s /etc/nginx/sites-available/job4you.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: Free Automated SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d job4you.yourdomain.com
```

---

## 5. Transitioning from Demo OTP to Production SMS

To switch from the **Demo OTP Bypass** to a live SMS provider:

1. Update `backend/.env`:
   ```ini
   # Disable demo bypass
   BYPASS_OTP=False
   
   # Twilio Credentials (Example)
   TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   
   # Or Fast2SMS API Key (for Indian phone numbers)
   FAST2SMS_API_KEY=your_fast2sms_api_key
   ```

2. When `BYPASS_OTP=False`:
   - The backend generates a random cryptographically secure 6-digit OTP.
   - Saves it in the `otps` table with a 5-minute expiration timestamp.
   - The demo auto-fill button in the frontend is automatically hidden.
   - Only the valid code sent to the recipient's phone will be accepted.
