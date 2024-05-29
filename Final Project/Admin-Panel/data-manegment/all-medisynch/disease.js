const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MySQL database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'product'
});

connection.connect();

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle form submission
app.post('/submitForm', (req, res) => {
    const { diseaseName, season, problem, confirmTest, resistance } = req.body;

    // Insert data into MySQL database
    const sql = `INSERT INTO your_table_name (disease_name, season, problem, confirm_test, resistance) VALUES (?, ?, ?, ?, ?)`;
    connection.query(sql, [diseaseName, season, problem, confirmTest, resistance], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data into database');
            return;
        }
        console.log('Data inserted successfully');
        res.status(200).send('Data inserted successfully');
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
