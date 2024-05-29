// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
app.use(bodyParser.json());
// Create a MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "product"
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/disease-entry.html');
  });

// Route to get the "Confirm to test" options
app.get('/api/confirm-test-options', (req, res) => {
    const query = 'SELECT testName FROM diseases_tests';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


app.get('/api/physical_condition-options', (req, res) => {
    const query = 'SELECT physicals_condition FROM patient_physical_condition';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


app.get('/api/problemSelect-options', (req, res) => {
    const query = 'SELECT problem_name FROM disease_problems';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
  });

  app.get('/api/ingredient_nameSelect-options', (req, res) => {
    const query = 'SELECT ingredient_name FROM new_ingredient_final';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
  });

  app.post('/api/submit-data', (req, res) => {
    const jsonData = req.body;
    console.log('Received JSON Data:', jsonData);

    // Insert the JSON data into the database
    const sql = 'INSERT INTO disease_info (diseaseName, season, problem, physicals_condition, confirmTest,  ingredient_name, resistance) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [jsonData.diseaseName, jsonData.season, JSON.stringify(jsonData.problem), JSON.stringify(jsonData.physicals_condition), JSON.stringify(jsonData.confirmTest), JSON.stringify(jsonData.ingredient_name), jsonData.resistance];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            res.status(500).json({ error: 'Error inserting data into the database' });
            return;
        }
        console.log('Data inserted into the database successfully');
        res.status(200).json({ message: 'Data inserted into the database successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
