const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 8081;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Create a MySQL connection
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "product"
});

// Connect to MySQL
con.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/new-entry', (req, res) => {
  res.sendFile(__dirname + '/new-entry.html');
});

app.get('/new_data', (req, res) => {
  const query = `SELECT * FROM new_ingredient_n`;

  con.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL:', err);
      res.status(500).json({ error: 'Failed to fetch data' });
      return;
    }
    res.render('new_data', { data: results });
  });
});

app.post('/search', (req, res) => {
  const { problem_name, age } = req.body;

  // Determine the age category based on the provided age
  const ageCategory = age => {
    if (age >= 0 && age <= 12) return 'child';
    if (age >= 13 && age <= 17) return 'teen';
    if (age >= 18 && age <= 32) return 'adult';
    if (age >= 33) return 'old';
  };

  const category = ageCategory(parseInt(age));
  const query = `SELECT * FROM new_ingredient_n WHERE JSON_EXTRACT(data, '$.problem_name') LIKE ?`;

  con.query(query, [`%${problem_name}%`], (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL:', err);
      res.status(500).json({ error: 'Failed to fetch data' });
      return;
    }

    const filteredResults = results.filter(item => {
      const parsedData = JSON.parse(item.data);
      return parsedData[`${category}_condition[]`] || parsedData.problem_name.includes(problem_name);
    });

    res.render('new_data', { data: filteredResults });
  });
});

app.post('/your-server-endpoint', (req, res) => {
  const data = req.body;

  console.log('Received JSON data:', data);  // Log the received data

  const query = `INSERT INTO new_ingredient_n (data) VALUES (?)`;

  const values = [JSON.stringify(data)];

  console.log('Values to be inserted:', values);  // Log the values to be inserted

  con.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      res.status(500).json({ error: 'Failed to save data' });
      return;
    }
    res.json({ message: 'Data received and saved successfully' });
  });
});

// Endpoint to fetch and display data





app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
});
