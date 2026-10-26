const db = require('../config/db');
const { computeOpportunityMatch } = require('../services/recommendationEngine');

exports.getJobs = (req, res) => {
  try {
    const {
      search = '',
      role = '',
      skill = '',
      location = '',
      experience = '',
      industry = '',
      work_mode = '',
      job_type = '',
      min_salary = '',
      sort = 'newest'
    } = req.query;

    let query = `
      SELECT j.*, c.company_name, c.logo, c.website, c.size, c.rating as company_rating
      FROM Jobs j
      JOIN Companies c ON j.company_id = c.company_id
      WHERE 1=1
    `;
    const params = [];

    if (search.trim()) {
      query += ` AND (
        LOWER(j.title) LIKE ? OR
        LOWER(c.company_name) LIKE ? OR
        LOWER(j.description) LIKE ? OR
        LOWER(j.required_skills) LIKE ?
      )`;
      const pattern = `%${search.toLowerCase().trim()}%`;
      params.push(pattern, pattern, pattern, pattern);
    }

    if (role.trim()) {
      query += ` AND LOWER(j.title) LIKE ?`;
      params.push(`%${role.toLowerCase().trim()}%`);
    }

    if (skill.trim()) {
      query += ` AND LOWER(j.required_skills) LIKE ?`;
      params.push(`%${skill.toLowerCase().trim()}%`);
    }

    if (location.trim()) {
      query += ` AND LOWER(j.location) LIKE ?`;
      params.push(`%${location.toLowerCase().trim()}%`);
    }

    if (experience.trim()) {
      query += ` AND LOWER(j.experience) LIKE ?`;
      params.push(`%${experience.toLowerCase().trim()}%`);
    }

    if (industry.trim()) {
      query += ` AND LOWER(j.industry) LIKE ?`;
      params.push(`%${industry.toLowerCase().trim()}%`);
    }

    if (work_mode.trim()) {
      query += ` AND LOWER(j.work_mode) = ?`;
      params.push(work_mode.toLowerCase().trim());
    }

    if (job_type.trim()) {
      query += ` AND LOWER(j.job_type) = ?`;
      params.push(job_type.toLowerCase().trim());
    }

    if (min_salary.trim()) {
      query += ` AND j.min_salary >= ?`;
      params.push(parseFloat(min_salary));
    }

    if (sort === 'salary_high') {
      query += ` ORDER BY j.min_salary DESC`;
    } else {
      query += ` ORDER BY j.job_id DESC`;
    }

    const jobs = db.all(query, params);

    // If user is authenticated, compute personalized match score for each job
    let currentUser = null;
    let userSkills = [];
    let savedJobIds = new Set();
    let appliedJobIds = new Set();

    if (req.user) {
      currentUser = db.get('SELECT * FROM Users WHERE user_id = ?', [req.user.user_id]);
      userSkills = db.all(`
        SELECT s.skill_name, us.skill_level
        FROM UserSkills us
        JOIN Skills s ON us.skill_id = s.skill_id
        WHERE us.user_id = ?
      `, [req.user.user_id]);

      const saved = db.all('SELECT opportunity_id FROM SavedJobs WHERE user_id = ? AND opportunity_type = "job"', [req.user.user_id]);
      saved.forEach(s => savedJobIds.add(s.opportunity_id));

      const applied = db.all('SELECT opportunity_id FROM Applications WHERE user_id = ? AND opportunity_type = "job"', [req.user.user_id]);
      applied.forEach(a => appliedJobIds.add(a.opportunity_id));
    }

    const enrichedJobs = jobs.map(job => {
      let requiredSkills = [];
      try {
        requiredSkills = JSON.parse(job.required_skills || '[]');
      } catch {
        requiredSkills = (job.required_skills || '').split(',').map(s => s.trim());
      }

      let matchData = {
        match_score: 82, // sensible default if guest
        breakdown: { skills_match: 80, education_match: 85, location_match: 80 },
        matching_skills: requiredSkills.slice(0, 2),
        missing_skills: requiredSkills.slice(2),
        recommendation_reason: 'Matches general software and tech requirements.'
      };

      if (currentUser) {
        matchData = computeOpportunityMatch(currentUser, userSkills, job);
      }

      return {
        ...job,
        required_skills: requiredSkills,
        match_score: matchData.match_score,
        breakdown: matchData.breakdown,
        matching_skills: matchData.matching_skills,
        missing_skills: matchData.missing_skills,
        recommendation_reason: matchData.recommendation_reason,
        is_saved: savedJobIds.has(job.job_id),
        is_applied: appliedJobIds.has(job.job_id)
      };
    });

    if (sort === 'match') {
      enrichedJobs.sort((a, b) => b.match_score - a.match_score);
    }

    return res.json({
      jobs: enrichedJobs,
      total: enrichedJobs.length
    });
  } catch (error) {
    console.error('getJobs error:', error);
    return res.status(500).json({ error: 'Failed to retrieve jobs.' });
  }
};

exports.getJobDetails = (req, res) => {
  try {
    const jobId = req.params.id;
    const job = db.get(`
      SELECT j.*, c.company_name, c.logo, c.website, c.description as company_description, c.size, c.rating as company_rating
      FROM Jobs j
      JOIN Companies c ON j.company_id = c.company_id
      WHERE j.job_id = ?
    `, [jobId]);

    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    let requiredSkills = [];
    try {
      requiredSkills = JSON.parse(job.required_skills || '[]');
    } catch {
      requiredSkills = (job.required_skills || '').split(',').map(s => s.trim());
    }

    let matchData = {
      match_score: 85,
      breakdown: { skills_match: 85, education_match: 85, location_match: 85 },
      matching_skills: requiredSkills.slice(0, 2),
      missing_skills: requiredSkills.slice(2),
      recommendation_reason: 'Matches industry standards and roles.'
    };

    let isSaved = false;
    let isApplied = false;

    if (req.user) {
      const currentUser = db.get('SELECT * FROM Users WHERE user_id = ?', [req.user.user_id]);
      const userSkills = db.all(`
        SELECT s.skill_name, us.skill_level
        FROM UserSkills us
        JOIN Skills s ON us.skill_id = s.skill_id
        WHERE us.user_id = ?
      `, [req.user.user_id]);

      matchData = computeOpportunityMatch(currentUser, userSkills, job);

      const saved = db.get('SELECT id FROM SavedJobs WHERE user_id = ? AND opportunity_type = "job" AND opportunity_id = ?', [req.user.user_id, jobId]);
      isSaved = !!saved;

      const applied = db.get('SELECT application_id FROM Applications WHERE user_id = ? AND opportunity_type = "job" AND opportunity_id = ?', [req.user.user_id, jobId]);
      isApplied = !!applied;
    }

    return res.json({
      job: {
        ...job,
        required_skills: requiredSkills,
        match_score: matchData.match_score,
        breakdown: matchData.breakdown,
        matching_skills: matchData.matching_skills,
        missing_skills: matchData.missing_skills,
        recommendation_reason: matchData.recommendation_reason,
        is_saved: isSaved,
        is_applied: isApplied
      }
    });
  } catch (error) {
    console.error('getJobDetails error:', error);
    return res.status(500).json({ error: 'Failed to retrieve job details.' });
  }
};
