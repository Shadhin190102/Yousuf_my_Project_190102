const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// Middleware to parse POST request body
app.use(bodyParser.urlencoded({ extended: true }));

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Replace with your MySQL password
    database: 'yousuf'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database');
});

// Route to serve the login form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Route to handle login form submission
app.post('/login', (req, res) => {
    const id = req.body.id;
    const password = req.body.password;

    // Query the database to check if the id and password match
    const query = `SELECT * FROM admin_info WHERE id = ? AND password = ?`;
    connection.query(query, [id, password], (error, results) => {
        if (error) {
            console.error('Error querying database: ' + error.stack);
            res.status(500).send('Internal Server Error');
            return;
        }

        // If the query returned a result, the credentials are valid
        if (results.length > 0) {
            // Redirect to the dashboard page
            res.redirect('/dashboard');
        } else {
            res.send('Invalid id or password');
        }
    });
});

// Route to serve the dashboard page
app.get('/Dash_Board_panel', (req, res) => {
    res.sendFile(__dirname + '/Dash_Board_panel.html');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
