const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const { format, addYears } = require('date-fns');
const session = require('express-session');
const bcrypt = require('bcrypt'); // For password hashing

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key', // Change this to a random string
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');

// MySQL connections
const connection66 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'yousufdbs'
});

const connection55 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'product'
});

connection66.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL (admin_others_id):', err);
        return;
    }
    console.log('Connected to MySQL (admin_others_id) database');
});

connection55.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL (product):', err);
        return;
    }
    console.log('Connected to MySQL (product) database');
});

// Route to render the login page
app.get('/login-ill_report', (req, res) => {
    // Example retrieval of user and photos data from database
    const user11 = { name: 'John Doe' }; // Replace with actual user data

    // Query to fetch photos from database
    connection66.query('SELECT mime_type, photo FROM admin_others_id', (err, results) => {
        if (err) {
            console.error('Error fetching photos from database:', err);
            res.render('error', { message: 'Error fetching photos from database' });
            return;
        }
        
        // Convert binary photo data to base64
        const photos = results.map(photo => ({
            mime_type: photo.mime_type,
            photo: Buffer.from(photo.photo).toString('base64')
        }));

        // Rendering login page and passing data to EJS template
        res.render('login-ill_report', { user11: user11, photos: photos, error: null });
    });
});

// Route to handle login submission
app.post('/login-ill_report', (req, res) => {
    const { username, password } = req.body;
    connection66.query('SELECT * FROM admin_others_id WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error executing login query:', err);
            return res.status(500).send('Database query error');
        }
        if (results.length > 0) {
            req.session.user11 = results[0]; // Set session for user11
            res.redirect('/ill_report-profile');
        } else {
            res.render('login-ill_report', { error: 'Invalid username or password' });
        }
    });
});

// Route to render the ill_report-profile page
app.get('/ill_report-profile', (req, res) => {
    if (req.session.user11) {
        const query = `
            SELECT plan, created_at, plan_end_date 
            FROM payments 
            WHERE user_name = ? AND plan_end_date >= CURRENT_DATE
        `;
        connection55.query(query, [req.session.user11.username], (err, results) => {
            if (err) {
                console.error('Error fetching data from MySQL:', err);
                res.status(500).send('Error fetching data from database');
                return;
            }

            const plans = results.map(plan => ({
                ...plan,
                created_at: format(new Date(plan.created_at), 'dd MMM yyyy'),
                plan_end_date: format(new Date(plan.plan_end_date), 'dd MMM yyyy')
            }));

            const message = req.query.message || null;
            res.render('ill_report-profile', { user11: req.session.user11, plans, message });
        });
    } else {
        res.redirect('/login-ill_report');
    }
});

// Middleware to check subscription status
function checkSubscription(req, res, next) {
    if (!req.session.user12) {
        return res.redirect('/login-ill_report');
    }

    const query = `
        SELECT plan_end_date 
        FROM payments 
        WHERE user_name = ? 
        ORDER BY plan_end_date DESC 
        LIMIT 1
    `;
    connection55.query(query, [req.session.user12.username], (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            res.status(500).send('Error fetching data from database');
            return;
        }

        if (results.length === 0) {
            // No active plans found, redirect to purchase page or show an error
            return res.redirect('/ill_report-profile?message=No%20active%20subscription%20found.%20Please%20purchase%20a%20plan.');
        }

        const planEndDate = new Date(results[0].plan_end_date);
        const currentDate = new Date();

        if (planEndDate >= currentDate) {
            next(); // User has an active subscription, proceed to the next middleware/route handler
        } else {
            res.redirect('/ill_report-profile?message=Your%20subscription%20has%20expired.%20Please%20renew%20your%20plan.');
        }
    });
}

// Route to handle the incoming JSON data (payment processing)
app.post('/payment-ill_report', (req, res) => {
    const data = req.body;

    // Log the incoming JSON data
    console.log('Received JSON data:', data);

    const { plan, amount, card_type, card_number, cardholder_name, expiration_date, cvv, userName } = data;

    // Get the current date
    const currentDate = new Date();
    const formattedCurrentDate = format(currentDate, 'yyyy-MM-dd');

    // Calculate the plan end date (assuming plan is in years)
    const years_count = parseInt(plan.match(/\d+/)[0]); // Extract years_count from plan (assuming format like '2nd Year')
    const planEndDate = addYears(currentDate, years_count);
    const formattedPlanEndDate = format(planEndDate, 'yyyy-MM-dd');

    const query = `INSERT INTO payments (plan, amount, card_type, card_number, cardholder_name, expiration_date, cvv, user_name, created_at, plan_end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [plan, amount, card_type, card_number, cardholder_name, expiration_date, cvv, userName, formattedCurrentDate, formattedPlanEndDate];

    console.log('Executing query:', query);
    console.log('Query values:', values);

    connection55.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).json({ success: false, message: 'Error inserting data into database' });
            return;
        }
        console.log('Inserted successfully:', results);
        res.json({ success: true, message: 'Payment data saved successfully' });
    });
});

// Route to company panel with subscription check
app.get('/Ill-report', checkSubscription, (req, res) => {
    res.render('Ill-report', { user12: req.session.user12 });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});










