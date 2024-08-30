const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./combo.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS formData 
    (
      id INTEGER PRIMARY KEY, 
      month INTEGER,
      suppliers INTEGER,
      multiplier DECIMAL
    )`);
  db.run(`
    CREATE TABLE IF NOT EXISTS divideBy 
    (
      id INTEGER PRIMARY KEY, 
      divideBy DECIMAL
    )`);
})

db.close();

