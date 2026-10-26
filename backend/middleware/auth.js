const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in the backend environment.');
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required. Please sign in.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Session expired or invalid token.' });
    }

    try {
      const user = db.get('SELECT user_id, name, email, role, user_type, location, desired_job_role FROM Users WHERE user_id = ?', [decoded.user_id]);
      if (!user) {
        return res.status(404).json({ error: 'User account not found.' });
      }
      req.user = user;
      next();
    } catch (dbErr) {
      return res.status(500).json({ error: 'Database authentication error.' });
    }
  });
}

// Optional auth: attaches req.user if token present, but doesn't reject if not
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (!err && decoded && decoded.user_id) {
      try {
        const user = db.get('SELECT user_id, name, email, role, user_type, location, desired_job_role FROM Users WHERE user_id = ?', [decoded.user_id]);
        req.user = user || null;
      } catch {
        req.user = null;
      }
    } else {
      req.user = null;
    }
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrative privileges required.' });
  }
  next();
}

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  JWT_SECRET
};
