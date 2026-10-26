const db = require('../config/db');

exports.getSavedOpportunities = (req, res) => {
  try {
    const userId = req.user.user_id;

    const savedItems = db.all(`
      SELECT s.id as saved_id, s.opportunity_type, s.opportunity_id, s.saved_date,
        CASE
          WHEN s.opportunity_type = 'job' THEN j.title
          ELSE i.title
        END as title,
        CASE
          WHEN s.opportunity_type = 'job' THEN c1.company_name
          ELSE c2.company_name
        END as company_name,
        CASE
          WHEN s.opportunity_type = 'job' THEN c1.logo
          ELSE c2.logo
        END as company_logo,
        CASE
          WHEN s.opportunity_type = 'job' THEN j.location
          ELSE i.location
        END as location,
        CASE
          WHEN s.opportunity_type = 'job' THEN j.salary
          ELSE i.stipend
        END as compensation,
        CASE
          WHEN s.opportunity_type = 'job' THEN j.work_mode
          ELSE i.work_mode
        END as work_mode,
        CASE
          WHEN s.opportunity_type = 'job' THEN j.required_skills
          ELSE i.required_skills
        END as required_skills
      FROM SavedJobs s
      LEFT JOIN Jobs j ON (s.opportunity_type = 'job' AND s.opportunity_id = j.job_id)
      LEFT JOIN Companies c1 ON j.company_id = c1.company_id
      LEFT JOIN Internships i ON (s.opportunity_type = 'internship' AND s.opportunity_id = i.internship_id)
      LEFT JOIN Companies c2 ON i.company_id = c2.company_id
      WHERE s.user_id = ?
      ORDER BY s.id DESC
    `, [userId]);

    const enriched = savedItems.map(item => {
      let skills = [];
      try {
        skills = JSON.parse(item.required_skills || '[]');
      } catch {
        skills = (item.required_skills || '').split(',').map(s => s.trim());
      }
      return {
        ...item,
        required_skills: skills
      };
    });

    return res.json({ saved: enriched });
  } catch (error) {
    console.error('getSavedOpportunities error:', error);
    return res.status(500).json({ error: 'Failed to retrieve saved opportunities.' });
  }
};

exports.toggleSaveOpportunity = (req, res) => {
  try {
    const userId = req.user.user_id;
    const { opportunity_type = 'job', opportunity_id } = req.body;

    if (!opportunity_id) {
      return res.status(400).json({ error: 'opportunity_id is required.' });
    }

    const existing = db.get(
      'SELECT id FROM SavedJobs WHERE user_id = ? AND opportunity_type = ? AND opportunity_id = ?',
      [userId, opportunity_type, opportunity_id]
    );

    if (existing) {
      db.run('DELETE FROM SavedJobs WHERE id = ?', [existing.id]);
      return res.json({ message: 'Opportunity removed from saved items.', is_saved: false });
    } else {
      db.run(
        'INSERT INTO SavedJobs (user_id, opportunity_type, opportunity_id) VALUES (?, ?, ?)',
        [userId, opportunity_type, opportunity_id]
      );
      return res.json({ message: 'Opportunity saved successfully!', is_saved: true });
    }
  } catch (error) {
    console.error('toggleSaveOpportunity error:', error);
    return res.status(500).json({ error: 'Failed to toggle saved status.' });
  }
};
