const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

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

// Route to serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/sales_entry.html');
});

// Route to handle form submission
app.post('/sales_entry', (req, res) => {
  const { productName, ProductCount, productType, weight, companyName, price, discount, total_price } = req.body;
  const sales_date = new Date().toISOString().slice(0, 19).replace('T', ' ');


  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error acquiring MySQL connection:', err);
      return res.status(500).send('Error acquiring MySQL connection');
    }

    const sql = "INSERT INTO product_sales_database (productName, ProductCount, productType, weight, companyName, price, discount, total_price, sales_date) VALUES ?";
    const values = [[productName, ProductCount, productType, weight, companyName, price, discount, total_price, sales_date]];

    connection.query(sql, [values], (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error inserting data into MySQL:', err);
        return res.status(500).send('Error inserting data into MySQL');
      }

      console.log('New Sales Id:', result.insertId);
      res.send('New Sales Id: ' + result.insertId);
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
});
