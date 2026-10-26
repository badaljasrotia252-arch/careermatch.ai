const db = require('../config/db');
const { computeOpportunityMatch } = require('../services/recommendationEngine');

exports.getRecommendations = (req, res) => {
  try {
    const userId = req.user.user_id;
    const user = db.get('SELECT * FROM Users WHERE user_id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const userSkills = db.all(`
      SELECT s.skill_name, us.skill_level
      FROM UserSkills us
      JOIN Skills s ON us.skill_id = s.skill_id
      WHERE us.user_id = ?
    `, [userId]);

    // Saved and applied sets
    const savedJobIds = new Set(
      db.all('SELECT opportunity_id FROM SavedJobs WHERE user_id = ? AND opportunity_type = "job"', [userId]).map(s => s.opportunity_id)
    );
    const savedInternshipIds = new Set(
      db.all('SELECT opportunity_id FROM SavedJobs WHERE user_id = ? AND opportunity_type = "internship"', [userId]).map(s => s.opportunity_id)
    );
    const appliedJobIds = new Set(
      db.all('SELECT opportunity_id FROM Applications WHERE user_id = ? AND opportunity_type = "job"', [userId]).map(a => a.opportunity_id)
    );
    const appliedInternshipIds = new Set(
      db.all('SELECT opportunity_id FROM Applications WHERE user_id = ? AND opportunity_type = "internship"', [userId]).map(a => a.opportunity_id)
    );

    // Fetch all jobs with company info
    const allJobs = db.all(`
      SELECT j.*, c.company_name, c.logo, c.website, c.size, c.rating as company_rating
      FROM Jobs j
      JOIN Companies c ON j.company_id = c.company_id
    `);

    // Fetch all internships with company info
    const allInternships = db.all(`
      SELECT i.*, c.company_name, c.logo, c.website, c.size, c.rating as company_rating
      FROM Internships i
      JOIN Companies c ON i.company_id = c.company_id
    `);

    // Score jobs
    const scoredJobs = allJobs.map(job => {
      let requiredSkills = [];
      try {
        requiredSkills = JSON.parse(job.required_skills || '[]');
      } catch {
        requiredSkills = (job.required_skills || '').split(',').map(s => s.trim());
      }

      const match = computeOpportunityMatch(user, userSkills, job);
      return {
        ...job,
        opportunity_type: 'job',
        required_skills: requiredSkills,
        match_score: match.match_score,
        breakdown: match.breakdown,
        matching_skills: match.matching_skills,
        missing_skills: match.missing_skills,
        recommendation_reason: match.recommendation_reason,
        is_saved: savedJobIds.has(job.job_id),
        is_applied: appliedJobIds.has(job.job_id)
      };
    });

    // Score internships
    const scoredInternships = allInternships.map(internship => {
      let requiredSkills = [];
      try {
        requiredSkills = JSON.parse(internship.required_skills || '[]');
      } catch {
        requiredSkills = (internship.required_skills || '').split(',').map(s => s.trim());
      }

      const match = computeOpportunityMatch(user, userSkills, internship);
      return {
        ...internship,
        opportunity_type: 'internship',
        required_skills: requiredSkills,
        match_score: match.match_score,
        breakdown: match.breakdown,
        matching_skills: match.matching_skills,
        missing_skills: match.missing_skills,
        recommendation_reason: match.recommendation_reason,
        is_saved: savedInternshipIds.has(internship.internship_id),
        is_applied: appliedInternshipIds.has(internship.internship_id)
      };
    });

    // Sort descending by match_score
    scoredJobs.sort((a, b) => b.match_score - a.match_score);
    scoredInternships.sort((a, b) => b.match_score - a.match_score);

    // Save top recommendations into Recommendations table for caching/auditing
    const insertRec = db.db.prepare(`
      INSERT OR REPLACE INTO Recommendations (
        user_id, opportunity_type, opportunity_id, match_score, recommendation_reason, breakdown
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    // Cache top 5 jobs
    scoredJobs.slice(0, 5).forEach(j => {
      try {
        insertRec.run(userId, 'job', j.job_id, j.match_score, j.recommendation_reason, JSON.stringify(j.breakdown));
      } catch (e) {
        // ignore
      }
    });

    // Cache top 5 internships
    scoredInternships.slice(0, 5).forEach(i => {
      try {
        insertRec.run(userId, 'internship', i.internship_id, i.match_score, i.recommendation_reason, JSON.stringify(i.breakdown));
      } catch (e) {
        // ignore
      }
    });

    return res.json({
      recommended_jobs: scoredJobs.slice(0, 10),
      recommended_internships: scoredInternships.slice(0, 10),
      top_overall_matches: [...scoredJobs.slice(0, 5), ...scoredInternships.slice(0, 5)].sort((a, b) => b.match_score - a.match_score).slice(0, 6),
      user_summary: {
        total_user_skills: userSkills.length,
        target_role: user.desired_job_role || user.desired_internship_role || 'Tech & Engineering',
        preferred_location: user.preferred_location || user.location || 'Anywhere',
        work_mode: user.work_mode || 'Remote'
      }
    });
  } catch (error) {
    console.error('getRecommendations error:', error);
    return res.status(500).json({ error: 'Failed to compute recommendations.' });
  }
};
