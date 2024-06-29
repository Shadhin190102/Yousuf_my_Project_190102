const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();

// Set up MySQL connection
const connection55 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'product'
});

connection55.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB limit
});

// Routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection55.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Database query error');
    }
    if (results.length > 0) {
      req.session.user = results[0];
      res.redirect('/email-panel');
    } else {
      res.send('Invalid username or password');
    }
  });
});

app.get('/email-panel', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const username = req.session.user.username;
  connection55.query('SELECT * FROM all_emails_data WHERE sender = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).send('Database query error');
    }
    res.render('email-panel', { all_emails_data: results, user: req.session.user });
  });
});

app.get('/compose', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    res.render('compose', { user: req.session.user });
  });

app.post('/send-email', upload.single('attachment'), (req, res) => {
  const { from, to, subject, body } = req.body;
  const attachment = req.file ? req.file.path : null;

  const query = 'INSERT INTO all_emails_data (sender, recipient, subject, body, attachment) VALUES (?, ?, ?, ?, ?)';
  connection55.query(query, [from, to, subject, body, attachment], (err, result) => {
    if (err) {
      console.error('Error inserting email into database:', err);
      return res.status(500).send('Database insert error');
    }
    res.redirect('/compose');
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
