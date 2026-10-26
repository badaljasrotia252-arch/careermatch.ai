-- CareerMatch AI - Relational Database Schema
-- Compatible with SQLite, MySQL, and PostgreSQL

CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    education_level TEXT,
    college TEXT,
    graduation_year INTEGER,
    user_type TEXT DEFAULT 'Student', -- Student, Fresher, Experienced Professional
    role TEXT DEFAULT 'user',          -- user, admin
    profile_photo TEXT,
    desired_job_role TEXT,
    desired_internship_role TEXT,
    preferred_industry TEXT,
    preferred_location TEXT,
    work_mode TEXT DEFAULT 'Remote',   -- Remote, Hybrid, On-site
    expected_salary TEXT,
    internship_duration TEXT,
    work_type TEXT DEFAULT 'Full-time', -- Full-time, Part-time
    interests TEXT,                    -- JSON array of strings
    resume_score INTEGER DEFAULT 0,
    resume_data TEXT,                  -- JSON string of parsed resume details
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Education (
    education_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    degree TEXT,
    specialization TEXT,
    college TEXT,
    cgpa REAL,
    graduation_year INTEGER,
    FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Skills (
    skill_id INTEGER PRIMARY KEY AUTOINCREMENT,
    skill_name TEXT UNIQUE NOT NULL,
    category TEXT
);

CREATE TABLE IF NOT EXISTS UserSkills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    skill_level TEXT DEFAULT 'Intermediate', -- Beginner, Intermediate, Advanced, Expert
    FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(skill_id) REFERENCES Skills(skill_id) ON DELETE CASCADE,
    UNIQUE(user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS Companies (
    company_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT NOT NULL,
    logo TEXT,
    description TEXT,
    website TEXT,
    location TEXT,
    industry TEXT,
    rating REAL DEFAULT 4.5,
    size TEXT DEFAULT '1,000+ employees',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Jobs (
    job_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    responsibilities TEXT,
    qualifications TEXT,
    benefits TEXT,
    location TEXT,
    salary TEXT,
    min_salary REAL,
    max_salary REAL,
    experience TEXT,
    experience_years REAL DEFAULT 0,
    job_type TEXT DEFAULT 'Full-time', -- Full-time, Part-time, Contract
    work_mode TEXT DEFAULT 'Hybrid',    -- Remote, Hybrid, On-site
    industry TEXT,
    required_skills TEXT,               -- JSON array string
    preferred_education TEXT,
    deadline TEXT,
    posted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(company_id) REFERENCES Companies(company_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Internships (
    internship_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    domain TEXT,
    description TEXT,
    responsibilities TEXT,
    qualifications TEXT,
    benefits TEXT,
    location TEXT,
    stipend TEXT,
    duration TEXT,
    internship_type TEXT DEFAULT 'Summer', -- Summer, Winter, Regular, Virtual
    work_mode TEXT DEFAULT 'Remote',       -- Remote, Hybrid, On-site
    required_skills TEXT,                  -- JSON array string
    start_date TEXT,
    deadline TEXT,
    posted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(company_id) REFERENCES Companies(company_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Applications (
    application_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    opportunity_type TEXT NOT NULL, -- 'job' or 'internship'
    opportunity_id INTEGER NOT NULL,
    applied_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'Applied',   -- Applied, Under Review, Shortlisted, Interview, Selected, Rejected
    interview_date TEXT,
    notes TEXT,
    FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS SavedJobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    opportunity_type TEXT NOT NULL, -- 'job' or 'internship'
    opportunity_id INTEGER NOT NULL,
    saved_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id, opportunity_type, opportunity_id)
);

CREATE TABLE IF NOT EXISTS Recommendations (
    recommendation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    opportunity_type TEXT NOT NULL, -- 'job' or 'internship'
    opportunity_id INTEGER NOT NULL,
    match_score REAL NOT NULL,
    recommendation_reason TEXT NOT NULL,
    breakdown TEXT,                 -- JSON string with skills_match, edu_match, etc.
    calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_jobs_company ON Jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_internships_company ON Internships(company_id);
CREATE INDEX IF NOT EXISTS idx_userskills_user ON UserSkills(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON Applications(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_user ON SavedJobs(user_id);
