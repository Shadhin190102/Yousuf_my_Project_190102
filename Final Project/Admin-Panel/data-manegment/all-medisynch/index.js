const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// Create MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "product"
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/disease-entry.html');
});

app.post('/submit', (req, res) => {
  const { test_name, reference_value, unit, normal_value } = req.body;

  // Insert data into MySQL
  const sql = 'INSERT INTO diseases_tests (test_name, reference_value, unit, normal_value) VALUES (?, ?, ?, ?)';
  db.query(sql, [test_name, reference_value, unit, normal_value], (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Data inserted successfully');
    res.redirect('/');
  });
});







app.get('/diseases_tests', (req, res) => {
  const query = 'SELECT testName FROM diseases_tests';

  db.query(query, (error, results) => {
      if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      res.json(results);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
