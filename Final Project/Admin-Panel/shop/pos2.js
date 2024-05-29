const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const port = 8081;

const app = express();
app.use(express.json());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "product"
});

// Middleware for database connection
app.use(function(req, res, next) {
  req.pool = pool;
  next();
});




app.set('view engine', 'ejs');


pool.query('SELECT json_column FROM your_table', (error, results, fields) => {
    if (error) throw error;
  
    // Pass the JSON data to EJS template
    const jsonData = results.map(result => JSON.parse(result.json_column));
  
    // Render EJS template with the JSON data
    app.get('/sales_report', (req, res) => {
      res.render('sales_report', { jsonData });
    });
  });
  
  // Close MySQL connection
  pool.end();


  app.get('/sales_report', (req, res) => {
    res.render('sales_report', { jsonData: [] }); // Provide an empty array initially
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
