const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views-compnay-data')); // Ensure views directory is correctly set

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
app.get('/compnay-home', function(req, res) {
    const con = req.con;
    con.query("SELECT * FROM admin_compnay", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("compnay-home", { admin_compnay: result });
        }
    });
});

// Route to search admins
app.get('/compnay-search', function(req, res) {
    const con = req.con;
    const { id, name, mobileNumber, email } = req.query;
    const sql = "SELECT * FROM admin_compnay WHERE id LIKE ? AND name LIKE ? AND mobileNumber LIKE ? AND email LIKE ?";
    const values = [`%${id}%`, `%${name}%`, `%${mobileNumber}%`, `%${email}%`];

    con.query(sql, values, function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("compnay-home", { admin_compnay: result });
        }
    });
});

// Route to display admin details
app.get('/compnay-detalies/:id', (req, res) => {
    const adminId = req.params.id;
    db.query('SELECT * FROM admin_compnay WHERE id = ?', [adminId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('compnay-detalies', { admin: results[0] });
        } else {
            res.send('Admin not found');
        }
    });
});

// Route to handle admin update form submission
app.post('/compnay-update', upload.single('photo'), (req, res) => {
    const { id, name, username, address, mobileNumber, email, type, nidNumber, password } = req.body;
    const photo = req.file;

    if (photo) {
        const mimeType = photo.mimetype;
        const photoData = photo.buffer;
        db.query('UPDATE admin_compnay SET name = ?, username = ?, address = ?, mobileNumber = ?, email = ?, type = ?, nidNumber = ?, password = ?, mime_type = ?, photo = ? WHERE id = ?', 
            [name, username, address, mobileNumber, email, type, nidNumber, password, mimeType, photoData, id], (err, result) => {
            if (err) throw err;
            res.redirect('/'); // Redirect to admin list after update
        });
    } else {
        db.query('UPDATE admin_compnay SET name = ?, username = ?, address = ?, mobileNumber = ?, email = ?, type = ?, nidNumber = ?, password = ? WHERE id = ?', 
            [name, username, address, mobileNumber, email, type, nidNumber, password, id], (err, result) => {
            if (err) throw err;
            res.redirect('/compnay-home'); // Redirect to admin list after update
        });
    }
});

// Route to delete admin
app.post('/compnay-delete/:id', (req, res) => {
    const adminId = req.params.id;
    db.query('DELETE FROM admin_compnay WHERE id = ?', [adminId], (err, result) => {
        if (err) throw err;
        res.redirect('/compnay-home'); // Redirect to home page after deletion
    });
});

// Route to render the admin registration form
app.get('/compnay-form', (req, res) => {
    res.render('compnay-form', { error: null });
});

// Route to handle admin registration form submission
app.post('/compnay-id', upload.single('photo'), (req, res) => {
    const { name, username, person, mobileNumber, email, address, type, nidNumber, tradeLicense, tinNumber, bankAccountName, bankAccountNumber, bankBranchName, password } = req.body;
    const photo = req.file;

    // Check if username, email, or mobileNumber already exist
    db.query('SELECT * FROM admin_compnay WHERE username = ? OR email = ? OR mobileNumber = ?', [username, email, mobileNumber], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // If any of the fields already exist, render the form with an error message
            return res.render('compnay-form', { error: 'Username, Email, or Mobile Number already exists' });
        }

        if (photo) {
            const mimeType = photo.mimetype;
            const photoData = photo.buffer;

            db.query('INSERT INTO admin_compnay (name, username, person, mobileNumber, email, address, type, nidNumber, tradeLicense, tinNumber, bankAccountName, bankAccountNumber, bankBranchName, password, mime_type, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [name, username, person, mobileNumber, email, address, type, nidNumber, tradeLicense, tinNumber, bankAccountName, bankAccountNumber, bankBranchName, password, mimeType, photoData], (err, result) => {
                if (err) throw err;
                res.redirect('/compnay-home');
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
