-- ============================================================
-- Job4You Demo & Master Seed Data (MySQL)
-- ============================================================

USE `job4you`;

-- Super Admin User (Password: Admin@123)
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password_hash`, `role`, `is_active`, `is_verified`)
VALUES (
    1, 
    'Super Admin', 
    'admin@job4you.com', 
    '+919999999999', 
    '$pbkdf2-sha256$29000$PjU3bnhYTEZ5YnBVM3FjZw$Pq.Z0a2RkS9K3F5Q7P8W9e0sV3x2l8A5v8F5J2f3lYk', 
    'admin', 
    1, 
    1
) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Demo Employer (TechCorp Solutions)
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `role`, `company_name`, `company_website`, `company_size`, `city`, `is_active`, `is_verified`)
VALUES (
    2, 
    'Priya Sharma (HR Lead)', 
    'hr@techcorp.com', 
    '+919876543210', 
    'employer', 
    'TechCorp Solutions', 
    'https://techcorp.example.com', 
    '100-500 employees', 
    'Bengaluru', 
    1, 
    1
) ON DUPLICATE KEY UPDATE `company_name`=VALUES(`company_name`);

-- Demo Candidate (Rahul Verma)
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `role`, `headline`, `bio`, `skills`, `experience_years`, `city`, `is_active`, `is_verified`)
VALUES (
    3, 
    'Rahul Verma', 
    'rahul.verma@example.com', 
    '+919812345678', 
    'job_seeker', 
    'Full Stack Python & React Engineer', 
    'Passionate engineer skilled in building resilient RESTful APIs with FastAPI and dynamic UI with React.', 
    'Python, FastAPI, React, MySQL, Docker, Git', 
    3, 
    'Delhi NCR', 
    1, 
    1
) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Demo Jobs
INSERT INTO `jobs` (`id`, `employer_id`, `title`, `company_name`, `category`, `designation`, `location`, `workplace_type`, `job_type`, `experience_level`, `min_salary`, `max_salary`, `description`, `skills_required`, `vacancies`, `is_active`)
VALUES
(1, 2, 'Senior Full Stack Python Developer', 'TechCorp Solutions', 'Software & Technology', 'Full Stack Engineer', 'Bengaluru', 'Hybrid', 'Full-time', 'Senior', 1800000, 2800000, 'Build mission-critical cloud native microservices using FastAPI, MySQL and React.', 'Python, FastAPI, React, MySQL, Docker', 3, 1),
(2, 2, 'React 19 Frontend Specialist', 'TechCorp Solutions', 'Software & Technology', 'Frontend Developer', 'Remote', 'Remote', 'Full-time', 'Mid-Level', 1200000, 1800000, 'Develop responsive client portals, stateful dashboards, and mobile-friendly layouts.', 'React, JavaScript, Tailwind CSS, REST APIs', 2, 1),
(3, 2, 'Data Analyst & BI Specialist', 'TechCorp Solutions', 'Finance & Banking', 'Data Analyst', 'Mumbai', 'On-Site', 'Full-time', 'Junior', 600000, 950000, 'Extract business intelligence metrics and maintain automated MySQL reporting queries.', 'SQL, Python, Excel, PowerBI', 1, 1);
