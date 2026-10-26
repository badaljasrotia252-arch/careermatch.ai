const db = require('../config/db');

exports.getProfile = (req, res) => {
  try {
    const userId = req.user.user_id;
    const user = db.get(`
      SELECT user_id, name, email, phone, location, education_level, college, graduation_year, user_type, role,
             profile_photo, desired_job_role, desired_internship_role, preferred_industry, preferred_location,
             work_mode, expected_salary, internship_duration, work_type, interests, resume_score, resume_data
      FROM Users WHERE user_id = ?
    `, [userId]);

    const userSkills = db.all(`
      SELECT s.skill_id, s.skill_name, s.category, us.skill_level
      FROM UserSkills us
      JOIN Skills s ON us.skill_id = s.skill_id
      WHERE us.user_id = ?
    `, [userId]);

    const education = db.all('SELECT * FROM Education WHERE user_id = ?', [userId]);

    let parsedInterests = [];
    if (user.interests) {
      try {
        parsedInterests = JSON.parse(user.interests);
      } catch {
        parsedInterests = user.interests.split(',').map(s => s.trim());
      }
    }

    let parsedResumeData = null;
    if (user.resume_data) {
      try {
        parsedResumeData = JSON.parse(user.resume_data);
      } catch {
        parsedResumeData = null;
      }
    }

    return res.json({
      profile: {
        ...user,
        interests: parsedInterests,
        resume_data: parsedResumeData,
        skills: userSkills,
        education: education[0] || null
      }
    });
  } catch (error) {
    console.error('getProfile error:', error);
    return res.status(500).json({ error: 'Failed to retrieve profile data.' });
  }
};

exports.updateProfile = (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      name,
      phone,
      location,
      profile_photo,
      user_type,
      // Education
      degree,
      specialization,
      college,
      cgpa,
      graduation_year,
      // Career Preferences
      desired_job_role,
      desired_internship_role,
      preferred_industry,
      preferred_location,
      work_mode,
      expected_salary,
      internship_duration,
      work_type,
      // Interests
      interests = [],
      // Skills
      skills = []
    } = req.body;

    // 1. Update Users table
    db.run(`
      UPDATE Users SET
        name = COALESCE(?, name),
        phone = COALESCE(?, phone),
        location = COALESCE(?, location),
        profile_photo = COALESCE(?, profile_photo),
        user_type = COALESCE(?, user_type),
        education_level = COALESCE(?, education_level),
        college = COALESCE(?, college),
        graduation_year = COALESCE(?, graduation_year),
        desired_job_role = COALESCE(?, desired_job_role),
        desired_internship_role = COALESCE(?, desired_internship_role),
        preferred_industry = COALESCE(?, preferred_industry),
        preferred_location = COALESCE(?, preferred_location),
        work_mode = COALESCE(?, work_mode),
        expected_salary = COALESCE(?, expected_salary),
        internship_duration = COALESCE(?, internship_duration),
        work_type = COALESCE(?, work_type),
        interests = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `, [
      name || null,
      phone || null,
      location || null,
      profile_photo || null,
      user_type || null,
      degree || null,
      college || null,
      graduation_year ? parseInt(graduation_year, 10) : null,
      desired_job_role || null,
      desired_internship_role || null,
      preferred_industry || null,
      preferred_location || null,
      work_mode || null,
      expected_salary || null,
      internship_duration || null,
      work_type || null,
      JSON.stringify(Array.isArray(interests) ? interests : []),
      userId
    ]);

    // 2. Update Education
    const existingEdu = db.get('SELECT education_id FROM Education WHERE user_id = ?', [userId]);
    if (existingEdu) {
      db.run(`
        UPDATE Education SET
          degree = ?,
          specialization = ?,
          college = ?,
          cgpa = ?,
          graduation_year = ?
        WHERE user_id = ?
      `, [
        degree || '',
        specialization || '',
        college || '',
        cgpa ? parseFloat(cgpa) : null,
        graduation_year ? parseInt(graduation_year, 10) : null,
        userId
      ]);
    } else if (degree || college) {
      db.run(`
        INSERT INTO Education (user_id, degree, specialization, college, cgpa, graduation_year)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        userId,
        degree || '',
        specialization || '',
        college || '',
        cgpa ? parseFloat(cgpa) : null,
        graduation_year ? parseInt(graduation_year, 10) : null
      ]);
    }

    // 3. Update Skills
    if (Array.isArray(skills)) {
      // Clear existing skills
      db.run('DELETE FROM UserSkills WHERE user_id = ?', [userId]);

      const insertSkill = db.db.prepare('INSERT OR IGNORE INTO Skills (skill_name, category) VALUES (?, ?)');
      const insertUserSkill = db.db.prepare(`
        INSERT INTO UserSkills (user_id, skill_id, skill_level)
        VALUES (?, (SELECT skill_id FROM Skills WHERE LOWER(skill_name) = LOWER(?)), ?)
      `);

      for (const item of skills) {
        const skillName = (typeof item === 'string' ? item : item.skill_name || '').trim();
        const skillLevel = (typeof item === 'object' && item.skill_level ? item.skill_level : 'Intermediate');
        if (!skillName) continue;

        // Ensure skill is registered in Skills table
        insertSkill.run(skillName, 'General');
        // Insert into UserSkills
        try {
          insertUserSkill.run(userId, skillName, skillLevel);
        } catch (e) {
          // ignore duplicate
        }
      }
    }

    return res.json({
      message: 'Profile updated successfully!',
      status: 'success'
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
};

exports.getAllSkillsTaxonomy = (req, res) => {
  try {
    const skills = db.all('SELECT skill_id, skill_name, category FROM Skills ORDER BY category, skill_name ASC');
    return res.json({ skills });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch skills taxonomy.' });
  }
};
