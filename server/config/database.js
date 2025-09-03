const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Donec@123+/',   // <- your actual password here
  database: 'school_management', // make sure this DB exists
  port: 3306,                  // default MySQL port
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected successfully!');
  }
});

module.exports = db;
