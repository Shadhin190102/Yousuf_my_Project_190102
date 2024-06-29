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
        console.error('Error connecting to MySQL (admins_info):', err);
        return;
    }
    console.log('Connected to MySQL (admins_info) database');
});

connection55.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL (product):', err);
        return;
    }
    console.log('Connected to MySQL (product) database');
});

// Routes
app.get('/', (req, res) => {
    // Example retrieval of user and photos data from database
    const user9 = { name: 'John Doe' }; // Replace with actual user data

    // Query to fetch photos from database
    connection66.query('SELECT mime_type, photo FROM admins_info', (err, results) => {
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
        res.render('login', { user9: user9, photos: photos, error: null });
    });
});


// Route to handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    connection66.query('SELECT * FROM admins_info WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error executing login query:', err);
            return res.status(500).send('Database query error');
        }
        if (results.length > 0) {
            req.session.user9 = results[0];
            res.redirect('/index');
        } else {
            res.render('login', { error: 'Invalid username or password' });
        }
    });
});

// Route to render the index page
app.post('/login', (req, res) => {
    const { username } = req.body;
    // Validate user credentials (this is a simple example)
    req.session.user9 = { username: username };
    res.redirect('/index');
});

// Index route with user authentication
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Set view engine to EJS

// Middleware to check subscription status
function checkSubscription(req, res, next) {
    if (!req.session.user10) {
        return res.redirect('/');
    }

    const query = `
        SELECT plan_end_date 
        FROM payments 
        WHERE user_name = ? 
        ORDER BY plan_end_date DESC 
        LIMIT 1
    `;
    connection55.query(query, [req.session.user10.username], (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            res.status(500).send('Error fetching data from database');
            return;
        }

        if (results.length === 0) {
            // No active plans found, redirect to purchase page or show an error
            return res.redirect('/index?message=No%20active%20subscription%20found.%20Please%20purchase%20a%20plan.');
        }

        const planEndDate = new Date(results[0].plan_end_date);
        const currentDate = new Date();

        if (planEndDate >= currentDate) {
            next(); // User has an active subscription, proceed to the next middleware/route handler
        } else {
            res.redirect('/index?message=Your%20subscription%20has%20expired.%20Please%20renew%20your%20plan.');
        }
    });
}

// Route to index page
app.get('/index', (req, res) => {
    if (req.session.user9) {
        const query = `
            SELECT plan, created_at, plan_end_date 
            FROM payments 
            WHERE user_name = ? AND plan_end_date >= CURRENT_DATE
        `;
        connection55.query(query, [req.session.user10.username], (err, results) => {
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
            res.render('index', { user10: req.session.user10, plans, message });
        });
    } else {
        res.redirect('/');
    }
});

// Route to company panel with subscription check
app.get('/Dash_Board_panel', checkSubscription, (req, res) => {
    res.render('Dash_Board_panel', { user10: req.session.user10 });
});

// Route to handle the incoming JSON data (payment processing)
app.post('/payment', (req, res) => {
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

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
