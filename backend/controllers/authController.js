const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

exports.register = (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone = '',
      location = '',
      education_level = '',
      college = '',
      graduation_year = null,
      user_type = 'Student'
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = db.get('SELECT user_id FROM Users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const result = db.run(`
      INSERT INTO Users (
        name, email, password, phone, location, education_level, college, graduation_year, user_type, role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name.trim(),
      email.toLowerCase().trim(),
      hashedPassword,
      phone,
      location,
      education_level,
      college,
      graduation_year ? parseInt(graduation_year, 10) : null,
      user_type,
      'user'
    ]);

    const userId = result.lastInsertRowid;

    // Create initial education record if provided
    if (education_level || college) {
      db.run(`
        INSERT INTO Education (user_id, degree, specialization, college, graduation_year)
        VALUES (?, ?, ?, ?, ?)
      `, [userId, education_level, '', college, graduation_year ? parseInt(graduation_year, 10) : null]);
    }

    const token = jwt.sign(
      { user_id: userId, email: email.toLowerCase().trim(), role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const user = db.get(`
      SELECT user_id, name, email, phone, location, education_level, college, graduation_year, user_type, role,
             desired_job_role, desired_internship_role, preferred_industry, preferred_location, work_mode, expected_salary,
             internship_duration, work_type, interests, resume_score
      FROM Users WHERE user_id = ?
    `, [userId]);

    return res.status(201).json({
      message: 'Registration successful! Welcome to CareerMatch AI.',
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Server error during registration.' });
  }
};

exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.get('SELECT * FROM Users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Fetch user skills
    const userSkills = db.all(`
      SELECT s.skill_id, s.skill_name, s.category, us.skill_level
      FROM UserSkills us
      JOIN Skills s ON us.skill_id = s.skill_id
      WHERE us.user_id = ?
    `, [user.user_id]);

    // Fetch education
    const education = db.all('SELECT * FROM Education WHERE user_id = ?', [user.user_id]);

    // Don't send back password
    const { password: _, ...userData } = user;

    return res.json({
      message: 'Signed in successfully.',
      token,
      user: {
        ...userData,
        skills: userSkills,
        education
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login.' });
  }
};

exports.getMe = (req, res) => {
  try {
    const user = db.get(`
      SELECT user_id, name, email, phone, location, education_level, college, graduation_year, user_type, role,
             profile_photo, desired_job_role, desired_internship_role, preferred_industry, preferred_location,
             work_mode, expected_salary, internship_duration, work_type, interests, resume_score, resume_data
      FROM Users WHERE user_id = ?
    `, [req.user.user_id]);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const userSkills = db.all(`
      SELECT s.skill_id, s.skill_name, s.category, us.skill_level
      FROM UserSkills us
      JOIN Skills s ON us.skill_id = s.skill_id
      WHERE us.user_id = ?
    `, [user.user_id]);

    const education = db.all('SELECT * FROM Education WHERE user_id = ?', [user.user_id]);

    return res.json({
      user: {
        ...user,
        skills: userSkills,
        education
      }
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({ error: 'Server error fetching user profile.' });
  }
};
