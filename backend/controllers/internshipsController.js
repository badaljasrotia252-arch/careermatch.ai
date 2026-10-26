const db = require('../config/db');
const { computeOpportunityMatch } = require('../services/recommendationEngine');

exports.getInternships = (req, res) => {
  try {
    const {
      search = '',
      domain = '',
      skill = '',
      location = '',
      duration = '',
      internship_type = '',
      work_mode = '',
      sort = 'newest'
    } = req.query;

    let query = `
      SELECT i.*, c.company_name, c.logo, c.website, c.size, c.rating as company_rating
      FROM Internships i
      JOIN Companies c ON i.company_id = c.company_id
      WHERE 1=1
    `;
    const params = [];

    if (search.trim()) {
      query += ` AND (
        LOWER(i.title) LIKE ? OR
        LOWER(c.company_name) LIKE ? OR
        LOWER(i.description) LIKE ? OR
        LOWER(i.domain) LIKE ? OR
        LOWER(i.required_skills) LIKE ?
      )`;
      const pattern = `%${search.toLowerCase().trim()}%`;
      params.push(pattern, pattern, pattern, pattern, pattern);
    }

    if (domain.trim()) {
      query += ` AND LOWER(i.domain) LIKE ?`;
      params.push(`%${domain.toLowerCase().trim()}%`);
    }

    if (skill.trim()) {
      query += ` AND LOWER(i.required_skills) LIKE ?`;
      params.push(`%${skill.toLowerCase().trim()}%`);
    }

    if (location.trim()) {
      query += ` AND LOWER(i.location) LIKE ?`;
      params.push(`%${location.toLowerCase().trim()}%`);
    }

    if (duration.trim()) {
      query += ` AND LOWER(i.duration) LIKE ?`;
      params.push(`%${duration.toLowerCase().trim()}%`);
    }

    if (internship_type.trim()) {
      query += ` AND LOWER(i.internship_type) = ?`;
      params.push(internship_type.toLowerCase().trim());
    }

    if (work_mode.trim()) {
      query += ` AND LOWER(i.work_mode) = ?`;
      params.push(work_mode.toLowerCase().trim());
    }

    query += ` ORDER BY i.internship_id DESC`;

    const internships = db.all(query, params);

    let currentUser = null;
    let userSkills = [];
    let savedIds = new Set();
    let appliedIds = new Set();

    if (req.user) {
      currentUser = db.get('SELECT * FROM Users WHERE user_id = ?', [req.user.user_id]);
      userSkills = db.all(`
        SELECT s.skill_name, us.skill_level
        FROM UserSkills us
        JOIN Skills s ON us.skill_id = s.skill_id
        WHERE us.user_id = ?
      `, [req.user.user_id]);

      const saved = db.all('SELECT opportunity_id FROM SavedJobs WHERE user_id = ? AND opportunity_type = "internship"', [req.user.user_id]);
      saved.forEach(s => savedIds.add(s.opportunity_id));

      const applied = db.all('SELECT opportunity_id FROM Applications WHERE user_id = ? AND opportunity_type = "internship"', [req.user.user_id]);
      applied.forEach(a => appliedIds.add(a.opportunity_id));
    }

    const enrichedInternships = internships.map(internship => {
      let requiredSkills = [];
      try {
        requiredSkills = JSON.parse(internship.required_skills || '[]');
      } catch {
        requiredSkills = (internship.required_skills || '').split(',').map(s => s.trim());
      }

      let matchData = {
        match_score: 85,
        breakdown: { skills_match: 85, education_match: 90, location_match: 85 },
        matching_skills: requiredSkills.slice(0, 2),
        missing_skills: requiredSkills.slice(2),
        recommendation_reason: 'Matches student and technical profile.'
      };

      if (currentUser) {
        matchData = computeOpportunityMatch(currentUser, userSkills, internship);
      }

      return {
        ...internship,
        required_skills: requiredSkills,
        match_score: matchData.match_score,
        breakdown: matchData.breakdown,
        matching_skills: matchData.matching_skills,
        missing_skills: matchData.missing_skills,
        recommendation_reason: matchData.recommendation_reason,
        is_saved: savedIds.has(internship.internship_id),
        is_applied: appliedIds.has(internship.internship_id)
      };
    });

    if (sort === 'match') {
      enrichedInternships.sort((a, b) => b.match_score - a.match_score);
    }

    return res.json({
      internships: enrichedInternships,
      total: enrichedInternships.length
    });
  } catch (error) {
    console.error('getInternships error:', error);
    return res.status(500).json({ error: 'Failed to retrieve internships.' });
  }
};

exports.getInternshipDetails = (req, res) => {
  try {
    const internshipId = req.params.id;
    const internship = db.get(`
      SELECT i.*, c.company_name, c.logo, c.website, c.description as company_description, c.size, c.rating as company_rating
      FROM Internships i
      JOIN Companies c ON i.company_id = c.company_id
      WHERE i.internship_id = ?
    `, [internshipId]);

    if (!internship) {
      return res.status(404).json({ error: 'Internship not found.' });
    }

    let requiredSkills = [];
    try {
      requiredSkills = JSON.parse(internship.required_skills || '[]');
    } catch {
      requiredSkills = (internship.required_skills || '').split(',').map(s => s.trim());
    }

    let matchData = {
      match_score: 88,
      breakdown: { skills_match: 85, education_match: 95, location_match: 90 },
      matching_skills: requiredSkills.slice(0, 2),
      missing_skills: requiredSkills.slice(2),
      recommendation_reason: 'High suitability for student growth.'
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

      matchData = computeOpportunityMatch(currentUser, userSkills, internship);

      const saved = db.get('SELECT id FROM SavedJobs WHERE user_id = ? AND opportunity_type = "internship" AND opportunity_id = ?', [req.user.user_id, internshipId]);
      isSaved = !!saved;

      const applied = db.get('SELECT application_id FROM Applications WHERE user_id = ? AND opportunity_type = "internship" AND opportunity_id = ?', [req.user.user_id, internshipId]);
      isApplied = !!applied;
    }

    return res.json({
      internship: {
        ...internship,
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
    console.error('getInternshipDetails error:', error);
    return res.status(500).json({ error: 'Failed to retrieve internship details.' });
  }
};
