const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const app = express();
const port = 8081;

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "", // Avoid hardcoding credentials
  database: "product"
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({ storage: storage });

// Route to serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/product-entry.html');
});

// Route to handle form submission
app.post('/product-entry', upload.single('photo'), (req, res) => {
  const { productName, productCount, productType, ingredients, diseaseName, weight, companyName, age, single_price, box_price, discount, a_d_b_price, publishedDate, productDetails } = req.body;
  const photo = req.file ? req.file.filename : null;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error acquiring MySQL connection:', err);
      return res.status(500).send('Error acquiring MySQL connection');
    }

    const sql = "INSERT INTO product_database (productName, productCount, productType, ingredients, diseaseName, weight, companyName, age, single_price, box_price, discount, a_d_b_price, publishedDate, productDetails, photo) VALUES ?";
    const values = [[productName, productCount, productType, ingredients, diseaseName, weight, companyName, age, single_price, box_price, discount, a_d_b_price, publishedDate, productDetails, photo]];

    connection.query(sql, [values], (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error inserting data into MySQL:', err);
        return res.status(500).send('Error inserting data into MySQL');
      }

      console.log('New Product Id:', result.insertId);
      res.send('New Product Id: ' + result.insertId);
    });
  });
});

// Route to fetch ingredients from the database
// app.get('/ingredients', (req, res) => {
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Error acquiring MySQL connection:', err);
//       return res.status(500).json({ error: 'Error acquiring MySQL connection' });
//     }

//     const sql = 'SELECT ingredient_name FROM ingredient_info';
//     connection.query(sql, (err, results) => {
//       connection.release(); // Release the connection back to the pool

//       if (err) {
//         console.error('Error fetching ingredients:', err);
//         return res.status(500).json({ error: 'Error fetching ingredients' });
//       }
      
//       res.json(results);
//     });
//   });
// });

// Start the server
app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
});
