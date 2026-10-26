const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const { extractTextFromFile, analyzeResumeText, generateImprovedResume } = require('../services/resumeAnalyzer');

exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a resume file (PDF, DOC, DOCX, or TXT).' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype;

    const extractedText = await extractTextFromFile(filePath, mimeType, originalName);

    let userProfile = {};
    let userId = null;
    if (req.user) {
      userId = req.user.user_id;
      userProfile = db.get('SELECT * FROM Users WHERE user_id = ?', [userId]) || {};
    }

    const analysis = analyzeResumeText(extractedText, userProfile);

    // Save resume score and analysis into user record if logged in
    if (userId) {
      db.run(`
        UPDATE Users SET
          resume_score = ?,
          resume_data = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [analysis.resume_score, JSON.stringify(analysis), userId]);
    }

    // Clean up uploaded file from server disk to save space
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      // ignore unlink error
    }

    return res.json({
      message: 'Resume analyzed successfully!',
      filename: originalName,
      analysis
    });
  } catch (error) {
    console.error('analyzeResume error:', error);
    return res.status(500).json({ error: 'Failed to analyze resume file.' });
  }
};

exports.downloadImprovedResume = (req, res) => {
  try {
    let userProfile = {};
    let analysis = null;

    if (req.user) {
      const user = db.get('SELECT * FROM Users WHERE user_id = ?', [req.user.user_id]);
      if (user) {
        userProfile = user;
        if (user.resume_data) {
          try {
            analysis = JSON.parse(user.resume_data);
          } catch {
            analysis = null;
          }
        }
      }
    }

    // If no previous analysis saved, generate a comprehensive default
    if (!analysis) {
      analysis = {
        resume_score: 88,
        skills_detected: ['Python', 'SQL', 'React', 'JavaScript', 'Git', 'Data Structures', 'Machine Learning'],
        education_detected: [userProfile.education_level || 'B.Tech in Computer Science & Engineering'],
        missing_skills: ['Docker', 'AWS', 'Power BI'],
        experience_detected: ['Software Development Internship'],
        projects_detected: ['CareerMatch AI Full-Stack Platform', 'Real-Time Prediction Pipeline']
      };
    }

    const improvedContent = generateImprovedResume(analysis, userProfile);

    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="Improved_Resume_${(userProfile.name || 'Candidate').replace(/\s+/g, '_')}.md"`);
    return res.send(improvedContent);
  } catch (error) {
    console.error('downloadImprovedResume error:', error);
    return res.status(500).json({ error: 'Failed to generate improved resume download.' });
  }
};
