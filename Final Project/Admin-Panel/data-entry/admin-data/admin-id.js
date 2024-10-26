const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views-admin-data')); // Ensure views directory is correctly set

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "yousufdbs"
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Middleware to connect to MySQL database
const connectDB = (req, res, next) => {
    req.con = db;
    next();
};

// Route to display the admin home page with list of admins
app.get('/admin-home', connectDB, function(req, res) {
    const con = req.con;
    con.query("SELECT * FROM admins_info", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("admin-home", { admins_info: result });
        }
    });
});

// Route to search admins
app.get('/admin-search', connectDB, function(req, res) {
    const con = req.con;
    const { id, name, mobileNumber, email } = req.query;
    const sql = "SELECT * FROM admins_info WHERE id LIKE ? AND name LIKE ? AND mobileNumber LIKE ? AND email LIKE ?";
    const values = [`%${id}%`, `%${name}%`, `%${mobileNumber}%`, `%${email}%`];

    con.query(sql, values, function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("admin-home", { admins_info: result });
        }
    });
});

// Route to display admin details
app.get('/admin-detalies/:id', (req, res) => {
    const adminId = req.params.id;
    db.query('SELECT * FROM admins_info WHERE id = ?', [adminId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('admin-detalies', { admin: results[0] });
        } else {
            res.send('Admin not found');
        }
    });
});

// Route to handle admin update form submission
app.post('/admin-update', upload.single('photo'), (req, res) => {
    const { id, name, username, address, mobileNumber, email, type, nidNumber, password } = req.body;
    const photo = req.file;

    if (photo) {
        const mimeType = photo.mimetype;
        const photoData = photo.buffer;
        db.query('UPDATE admins_info SET name = ?, username = ?, address = ?, mobileNumber = ?, email = ?, type = ?, nidNumber = ?, password = ?, mime_type = ?, photo = ? WHERE id = ?', 
            [name, username, address, mobileNumber, email, type, nidNumber, password, mimeType, photoData, id], (err, result) => {
            if (err) throw err;
            res.redirect('/admin-home'); // Redirect to admin list after update
        });
    } else {
        db.query('UPDATE admins_info SET name = ?, username = ?, address = ?, mobileNumber = ?, email = ?, type = ?, nidNumber = ?, password = ? WHERE id = ?', 
            [name, username, address, mobileNumber, email, type, nidNumber, password, id], (err, result) => {
            if (err) throw err;
            res.redirect('/admin-home'); // Redirect to admin list after update
        });
    }
});

// Route to delete admin
app.post('/admin-delete/:id', (req, res) => {
    const adminId = req.params.id;
    db.query('DELETE FROM admins_info WHERE id = ?', [adminId], (err, result) => {
        if (err) throw err;
        res.redirect('/admin-home'); // Redirect to home page after deletion
    });
});

// Route to render the admin registration form
app.get('/admin-form', (req, res) => {
    res.render('admin-form', { error: null });
});

// Route to handle admin registration form submission
app.post('/admin-id', upload.single('photo'), (req, res) => {
    const { names, username, address, mobileNumber, email, type, nidNumber, password } = req.body;
    const photo = req.file;

    // Check if username, email, or mobileNumber already exist
    db.query('SELECT * FROM admins_info WHERE username = ? OR email = ? OR mobileNumber = ?', [username, email, mobileNumber], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // If any of the fields already exist, render the form with an error message
            return res.render('admin-form', { error: 'Username, Email, or Mobile Number already exists' });
        }

        if (photo) {
            const mimeType = photo.mimetype;
            const photoData = photo.buffer;

            db.query('INSERT INTO admins_info (name, username, address, mobileNumber, email, type, nidNumber, password, mime_type, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [names, username, address, mobileNumber, email, type, nidNumber, password, mimeType, photoData], (err, result) => {
                if (err) throw err;
                res.redirect('/admin-home');
            });
        } else {
            res.send('No photo uploaded');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
