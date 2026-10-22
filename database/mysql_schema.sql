-- ============================================================
-- Job4You Enterprise Database Schema (MySQL 8.0+)
-- Generated for Job4You Platform
-- ============================================================

CREATE DATABASE IF NOT EXISTS `job4you` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `job4you`;

SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- Table: users
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) UNIQUE NULL,
    `phone` VARCHAR(30) UNIQUE NULL,
    `password_hash` VARCHAR(255) NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'job_seeker', -- 'job_seeker', 'employer', 'admin'
    `is_active` TINYINT(1) DEFAULT 1,
    `is_verified` TINYINT(1) DEFAULT 0,
    
    -- Candidate Fields
    `headline` VARCHAR(255) NULL,
    `bio` TEXT NULL,
    `resume_url` VARCHAR(500) NULL,
    `skills` TEXT NULL,
    `experience_years` INT DEFAULT 0,
    `current_salary` VARCHAR(50) NULL,
    `expected_salary` VARCHAR(50) NULL,
    
    -- Employer Fields
    `company_name` VARCHAR(200) NULL,
    `company_website` VARCHAR(255) NULL,
    `company_size` VARCHAR(50) NULL,
    `company_logo` VARCHAR(500) NULL,
    `company_address` TEXT NULL,
    
    -- Demographics & Location
    `city` VARCHAR(100) NULL,
    `state` VARCHAR(100) NULL,
    `country` VARCHAR(100) DEFAULT 'India',
    
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX `idx_users_role` (`role`),
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_phone` (`phone`),
    INDEX `idx_users_city` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: jobs
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `employer_id` INT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `company_name` VARCHAR(200) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `designation` VARCHAR(100) NULL,
    `location` VARCHAR(150) NOT NULL,
    
    `workplace_type` VARCHAR(50) DEFAULT 'Remote', -- 'Remote', 'On-Site', 'Hybrid'
    `job_type` VARCHAR(50) DEFAULT 'Full-time',     -- 'Full-time', 'Part-time', 'Contract', 'Internship'
    `experience_level` VARCHAR(50) DEFAULT 'Mid-Level',
    
    `min_salary` DECIMAL(12, 2) NULL,
    `max_salary` DECIMAL(12, 2) NULL,
    `salary_currency` VARCHAR(10) DEFAULT 'INR',
    `salary_period` VARCHAR(20) DEFAULT 'Per Annum',
    
    `description` LONGTEXT NOT NULL,
    `requirements` TEXT NULL,
    `benefits` TEXT NULL,
    `skills_required` VARCHAR(500) NULL,
    `vacancies` INT DEFAULT 1,
    `is_active` TINYINT(1) DEFAULT 1,
    `views_count` INT DEFAULT 0,
    
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT `fk_jobs_employer` FOREIGN KEY (`employer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_jobs_category` (`category`),
    INDEX `idx_jobs_location` (`location`),
    INDEX `idx_jobs_type` (`job_type`),
    INDEX `idx_jobs_workplace` (`workplace_type`),
    INDEX `idx_jobs_active_created` (`is_active`, `created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: job_applications
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `job_applications`;
CREATE TABLE `job_applications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `job_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `cover_letter` TEXT NULL,
    `resume_url` VARCHAR(500) NULL,
    `status` VARCHAR(50) DEFAULT 'Applied', -- 'Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired'
    `employer_notes` TEXT NULL,
    
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT `fk_applications_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_applications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uq_job_user_application` (`job_id`, `user_id`),
    INDEX `idx_applications_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: saved_jobs
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `saved_jobs`;
CREATE TABLE `saved_jobs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `job_id` INT NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT `fk_saved_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_saved_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uq_user_saved_job` (`user_id`, `job_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: otps
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `otps`;
CREATE TABLE `otps` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `identifier` VARCHAR(150) NOT NULL,
    `code` VARCHAR(10) NOT NULL,
    `expires_at` DATETIME NOT NULL,
    `is_used` TINYINT(1) DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX `idx_otps_lookup` (`identifier`, `is_used`, `expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
