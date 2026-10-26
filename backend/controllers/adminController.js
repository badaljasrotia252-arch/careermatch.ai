const db = require('../config/db');

// Analytics Dashboard Endpoint
exports.getAnalytics = (req, res) => {
  try {
    const totalUsers = db.get('SELECT COUNT(*) as count FROM Users').count;
    const totalJobs = db.get('SELECT COUNT(*) as count FROM Jobs').count;
    const totalInternships = db.get('SELECT COUNT(*) as count FROM Internships').count;
    const totalApplications = db.get('SELECT COUNT(*) as count FROM Applications').count;
    const totalCompanies = db.get('SELECT COUNT(*) as count FROM Companies').count;

    // Application Status breakdown
    const appStatusBreakdown = db.all(`
      SELECT status, COUNT(*) as count
      FROM Applications
      GROUP BY status
    `);

    // Most popular skills in user profiles
    const popularSkills = db.all(`
      SELECT s.skill_name, COUNT(us.id) as user_count
      FROM Skills s
      JOIN UserSkills us ON s.skill_id = us.skill_id
      GROUP BY s.skill_id
      ORDER BY user_count DESC
      LIMIT 8
    `);

    // Top job roles
    const popularRoles = db.all(`
      SELECT industry, COUNT(*) as count
      FROM Jobs
      GROUP BY industry
      ORDER BY count DESC
      LIMIT 6
    `);

    // Work Mode distribution
    const workModeDist = db.all(`
      SELECT work_mode, COUNT(*) as count
      FROM Jobs
      GROUP BY work_mode
    `);

    // Recent applications activity
    const recentApplications = db.all(`
      SELECT a.application_id, a.applied_date, a.status, u.name as user_name, u.email as user_email,
        CASE WHEN a.opportunity_type = 'job' THEN j.title ELSE i.title END as title,
        CASE WHEN a.opportunity_type = 'job' THEN c1.company_name ELSE c2.company_name END as company_name
      FROM Applications a
      JOIN Users u ON a.user_id = u.user_id
      LEFT JOIN Jobs j ON (a.opportunity_type = 'job' AND a.opportunity_id = j.job_id)
      LEFT JOIN Companies c1 ON j.company_id = c1.company_id
      LEFT JOIN Internships i ON (a.opportunity_type = 'internship' AND a.opportunity_id = i.internship_id)
      LEFT JOIN Companies c2 ON i.company_id = c2.company_id
      ORDER BY a.application_id DESC
      LIMIT 8
    `);

    return res.json({
      counts: {
        total_users: totalUsers,
        total_jobs: totalJobs,
        total_internships: totalInternships,
        total_applications: totalApplications,
        total_companies: totalCompanies
      },
      app_status_breakdown: appStatusBreakdown,
      popular_skills: popularSkills,
      popular_roles: popularRoles,
      work_mode_distribution: workModeDist,
      recent_applications: recentApplications
    });
  } catch (error) {
    console.error('getAnalytics error:', error);
    return res.status(500).json({ error: 'Failed to fetch admin analytics.' });
  }
};

// Users Management
exports.getUsers = (req, res) => {
  try {
    const users = db.all(`
      SELECT user_id, name, email, phone, location, education_level, college, graduation_year, user_type, role, desired_job_role, resume_score, created_at
      FROM Users
      ORDER BY user_id DESC
    `);
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

exports.updateUser = (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role, user_type, location, desired_job_role } = req.body;

    db.run(`
      UPDATE Users SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        role = COALESCE(?, role),
        user_type = COALESCE(?, user_type),
        location = COALESCE(?, location),
        desired_job_role = COALESCE(?, desired_job_role)
      WHERE user_id = ?
    `, [name, email, role, user_type, location, desired_job_role, userId]);

    return res.json({ message: 'User updated successfully!' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update user.' });
  }
};

exports.deleteUser = (req, res) => {
  try {
    const userId = req.params.id;
    db.run('DELETE FROM Users WHERE user_id = ?', [userId]);
    return res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete user.' });
  }
};

// Jobs Management
exports.createJob = (req, res) => {
  try {
    const {
      company_id,
      title,
      description,
      responsibilities,
      qualifications,
      benefits,
      location,
      salary,
      min_salary,
      experience,
      job_type,
      work_mode,
      industry,
      required_skills,
      deadline
    } = req.body;

    const skillsJson = typeof required_skills === 'string' ? required_skills : JSON.stringify(required_skills || []);

    const result = db.run(`
      INSERT INTO Jobs (
        company_id, title, description, responsibilities, qualifications, benefits,
        location, salary, min_salary, experience, job_type, work_mode, industry, required_skills, deadline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      company_id || 1,
      title,
      description || '',
      responsibilities || '',
      qualifications || '',
      benefits || '',
      location || 'Remote',
      salary || '$100,000 / yr',
      min_salary ? parseFloat(min_salary) : 80000,
      experience || '0-2 years',
      job_type || 'Full-time',
      work_mode || 'Remote',
      industry || 'Software Development',
      skillsJson,
      deadline || '2026-12-31'
    ]);

    return res.status(201).json({ message: 'Job created successfully!', job_id: result.lastInsertRowid });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create job.' });
  }
};

exports.updateJob = (req, res) => {
  try {
    const jobId = req.params.id;
    const {
      company_id, title, description, location, salary, experience, job_type, work_mode, industry, required_skills
    } = req.body;

    const skillsJson = required_skills ? (typeof required_skills === 'string' ? required_skills : JSON.stringify(required_skills)) : null;

    db.run(`
      UPDATE Jobs SET
        company_id = COALESCE(?, company_id),
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        location = COALESCE(?, location),
        salary = COALESCE(?, salary),
        experience = COALESCE(?, experience),
        job_type = COALESCE(?, job_type),
        work_mode = COALESCE(?, work_mode),
        industry = COALESCE(?, industry),
        required_skills = COALESCE(?, required_skills)
      WHERE job_id = ?
    `, [company_id, title, description, location, salary, experience, job_type, work_mode, industry, skillsJson, jobId]);

    return res.json({ message: 'Job updated successfully!' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update job.' });
  }
};

exports.deleteJob = (req, res) => {
  try {
    const jobId = req.params.id;
    db.run('DELETE FROM Jobs WHERE job_id = ?', [jobId]);
    return res.json({ message: 'Job deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete job.' });
  }
};

// Internships Management
exports.createInternship = (req, res) => {
  try {
    const {
      company_id,
      title,
      domain,
      description,
      responsibilities,
      qualifications,
      benefits,
      location,
      stipend,
      duration,
      internship_type,
      work_mode,
      required_skills,
      deadline
    } = req.body;

    const skillsJson = typeof required_skills === 'string' ? required_skills : JSON.stringify(required_skills || []);

    const result = db.run(`
      INSERT INTO Internships (
        company_id, title, domain, description, responsibilities, qualifications, benefits,
        location, stipend, duration, internship_type, work_mode, required_skills, deadline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      company_id || 1,
      title,
      domain || 'Software Development',
      description || '',
      responsibilities || '',
      qualifications || '',
      benefits || '',
      location || 'Remote',
      stipend || '$5,000 / month',
      duration || '3 Months',
      internship_type || 'Summer',
      work_mode || 'Remote',
      skillsJson,
      deadline || '2026-12-31'
    ]);

    return res.status(201).json({ message: 'Internship created successfully!', internship_id: result.lastInsertRowid });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create internship.' });
  }
};

exports.updateInternship = (req, res) => {
  try {
    const internshipId = req.params.id;
    const {
      company_id, title, domain, description, location, stipend, duration, internship_type, work_mode, required_skills
    } = req.body;

    const skillsJson = required_skills ? (typeof required_skills === 'string' ? required_skills : JSON.stringify(required_skills)) : null;

    db.run(`
      UPDATE Internships SET
        company_id = COALESCE(?, company_id),
        title = COALESCE(?, title),
        domain = COALESCE(?, domain),
        description = COALESCE(?, description),
        location = COALESCE(?, location),
        stipend = COALESCE(?, stipend),
        duration = COALESCE(?, duration),
        internship_type = COALESCE(?, internship_type),
        work_mode = COALESCE(?, work_mode),
        required_skills = COALESCE(?, required_skills)
      WHERE internship_id = ?
    `, [company_id, title, domain, description, location, stipend, duration, internship_type, work_mode, skillsJson, internshipId]);

    return res.json({ message: 'Internship updated successfully!' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update internship.' });
  }
};

exports.deleteInternship = (req, res) => {
  try {
    const internshipId = req.params.id;
    db.run('DELETE FROM Internships WHERE internship_id = ?', [internshipId]);
    return res.json({ message: 'Internship deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete internship.' });
  }
};

// Companies Management
exports.getCompanies = (req, res) => {
  try {
    const companies = db.all('SELECT * FROM Companies ORDER BY company_id DESC');
    return res.json({ companies });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch companies.' });
  }
};

exports.createCompany = (req, res) => {
  try {
    const { company_name, logo, description, website, location, industry, size } = req.body;
    if (!company_name) {
      return res.status(400).json({ error: 'company_name is required.' });
    }

    const result = db.run(`
      INSERT INTO Companies (company_name, logo, description, website, location, industry, size)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      company_name,
      logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150',
      description || '',
      website || '',
      location || 'San Francisco, CA',
      industry || 'Technology',
      size || '1,000+ employees'
    ]);

    return res.status(201).json({ message: 'Company added successfully!', company_id: result.lastInsertRowid });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create company.' });
  }
};

exports.updateCompany = (req, res) => {
  try {
    const companyId = req.params.id;
    const { company_name, logo, description, website, location, industry, size } = req.body;

    db.run(`
      UPDATE Companies SET
        company_name = COALESCE(?, company_name),
        logo = COALESCE(?, logo),
        description = COALESCE(?, description),
        website = COALESCE(?, website),
        location = COALESCE(?, location),
        industry = COALESCE(?, industry),
        size = COALESCE(?, size)
      WHERE company_id = ?
    `, [company_name, logo, description, website, location, industry, size, companyId]);

    return res.json({ message: 'Company updated successfully!' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update company.' });
  }
};

exports.deleteCompany = (req, res) => {
  try {
    const companyId = req.params.id;
    db.run('DELETE FROM Companies WHERE company_id = ?', [companyId]);
    return res.json({ message: 'Company deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete company.' });
  }
};
