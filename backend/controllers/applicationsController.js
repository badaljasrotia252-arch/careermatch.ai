const db = require('../config/db');

exports.getApplications = (req, res) => {
  try {
    const userId = req.user.user_id;

    const applications = db.all(`
      SELECT a.*,
        CASE
          WHEN a.opportunity_type = 'job' THEN j.title
          ELSE i.title
        END as position_title,
        CASE
          WHEN a.opportunity_type = 'job' THEN c1.company_name
          ELSE c2.company_name
        END as company_name,
        CASE
          WHEN a.opportunity_type = 'job' THEN c1.logo
          ELSE c2.logo
        END as company_logo,
        CASE
          WHEN a.opportunity_type = 'job' THEN j.location
          ELSE i.location
        END as location,
        CASE
          WHEN a.opportunity_type = 'job' THEN j.salary
          ELSE i.stipend
        END as compensation
      FROM Applications a
      LEFT JOIN Jobs j ON (a.opportunity_type = 'job' AND a.opportunity_id = j.job_id)
      LEFT JOIN Companies c1 ON j.company_id = c1.company_id
      LEFT JOIN Internships i ON (a.opportunity_type = 'internship' AND a.opportunity_id = i.internship_id)
      LEFT JOIN Companies c2 ON i.company_id = c2.company_id
      WHERE a.user_id = ?
      ORDER BY a.application_id DESC
    `, [userId]);

    // Compute status stats
    const stats = {
      total: applications.length,
      applied: applications.filter(a => a.status === 'Applied').length,
      under_review: applications.filter(a => a.status === 'Under Review').length,
      shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
      interview: applications.filter(a => a.status === 'Interview').length,
      selected: applications.filter(a => a.status === 'Selected').length,
      rejected: applications.filter(a => a.status === 'Rejected').length
    };

    return res.json({ applications, stats });
  } catch (error) {
    console.error('getApplications error:', error);
    return res.status(500).json({ error: 'Failed to retrieve applications.' });
  }
};

exports.addApplication = (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      opportunity_type = 'job',
      opportunity_id,
      status = 'Applied',
      interview_date = null,
      notes = ''
    } = req.body;

    if (!opportunity_id) {
      return res.status(400).json({ error: 'opportunity_id is required.' });
    }

    // Check if already applied
    const existing = db.get(
      'SELECT application_id FROM Applications WHERE user_id = ? AND opportunity_type = ? AND opportunity_id = ?',
      [userId, opportunity_type, opportunity_id]
    );

    if (existing) {
      return res.status(409).json({ error: 'You have already submitted an application for this opportunity.' });
    }

    const result = db.run(`
      INSERT INTO Applications (user_id, opportunity_type, opportunity_id, status, interview_date, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [userId, opportunity_type, opportunity_id, status, interview_date, notes]);

    return res.status(201).json({
      message: 'Application recorded successfully!',
      application_id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('addApplication error:', error);
    return res.status(500).json({ error: 'Failed to submit application.' });
  }
};

exports.updateApplication = (req, res) => {
  try {
    const userId = req.user.user_id;
    const applicationId = req.params.id;
    const { status, interview_date, notes } = req.body;

    const existing = db.get('SELECT application_id FROM Applications WHERE application_id = ? AND user_id = ?', [applicationId, userId]);
    if (!existing) {
      return res.status(404).json({ error: 'Application record not found.' });
    }

    db.run(`
      UPDATE Applications SET
        status = COALESCE(?, status),
        interview_date = ?,
        notes = COALESCE(?, notes)
      WHERE application_id = ? AND user_id = ?
    `, [status || null, interview_date !== undefined ? interview_date : null, notes !== undefined ? notes : null, applicationId, userId]);

    return res.json({ message: 'Application updated successfully!' });
  } catch (error) {
    console.error('updateApplication error:', error);
    return res.status(500).json({ error: 'Failed to update application.' });
  }
};

exports.deleteApplication = (req, res) => {
  try {
    const userId = req.user.user_id;
    const applicationId = req.params.id;

    db.run('DELETE FROM Applications WHERE application_id = ? AND user_id = ?', [applicationId, userId]);
    return res.json({ message: 'Application deleted successfully.' });
  } catch (error) {
    console.error('deleteApplication error:', error);
    return res.status(500).json({ error: 'Failed to delete application.' });
  }
};
