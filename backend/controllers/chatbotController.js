const db = require('../config/db');
const { generateCareerAdvice } = require('../services/aiCareerAssistant');

exports.chatWithCareerMate = (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    let userProfile = {};
    let userSkills = [];

    if (req.user) {
      userProfile = db.get('SELECT * FROM Users WHERE user_id = ?', [req.user.user_id]) || {};
      userSkills = db.all(`
        SELECT s.skill_name, us.skill_level
        FROM UserSkills us
        JOIN Skills s ON us.skill_id = s.skill_id
        WHERE us.user_id = ?
      `, [req.user.user_id]);
    }

    const availableJobs = db.all(`
      SELECT j.title, j.location, j.work_mode, c.company_name
      FROM Jobs j
      JOIN Companies c ON j.company_id = c.company_id
      LIMIT 10
    `);

    const availableInternships = db.all(`
      SELECT i.title, i.location, i.stipend, i.work_mode, c.company_name
      FROM Internships i
      JOIN Companies c ON i.company_id = c.company_id
      LIMIT 10
    `);

    const response = generateCareerAdvice(message, userProfile, userSkills, availableJobs, availableInternships);

    return res.json({
      message: response.reply,
      suggestions: response.suggestions
    });
  } catch (error) {
    console.error('chatWithCareerMate error:', error);
    return res.status(500).json({ error: 'CareerMate AI assistant is momentarily busy.' });
  }
};
