const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'careermatch.sqlite');
const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Initialize schema if not exists
const schemaPath = path.join(__dirname, '..', 'models', 'schema.sql');
if (fs.existsSync(schemaPath)) {
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
}

// Helper methods for easy querying
const dbHelper = {
  db,
  all: (sql, params = []) => {
    try {
      const stmt = db.prepare(sql);
      return stmt.all(...params);
    } catch (err) {
      console.error('SQL all error:', err.message, 'Query:', sql, 'Params:', params);
      throw err;
    }
  },
  get: (sql, params = []) => {
    try {
      const stmt = db.prepare(sql);
      return stmt.get(...params);
    } catch (err) {
      console.error('SQL get error:', err.message, 'Query:', sql, 'Params:', params);
      throw err;
    }
  },
  run: (sql, params = []) => {
    try {
      const stmt = db.prepare(sql);
      return stmt.run(...params);
    } catch (err) {
      console.error('SQL run error:', err.message, 'Query:', sql, 'Params:', params);
      throw err;
    }
  },
  exec: (sql) => {
    return db.exec(sql);
  }
};

module.exports = dbHelper;
