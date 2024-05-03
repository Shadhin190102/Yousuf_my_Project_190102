const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const port = 8081;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');

// Middleware for database connection
function connectDB(req, res, next) {
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "product"
    });
    con.connect(function(error) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            req.con = con;
            next();
        }
    });
}

app.get('/', connectDB, function(req, res) {
    const con = req.con;
    con.query("SELECT * FROM copmay_medicine_stock", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render(__dirname + "/product-company-storing", { copmay_medicine_stock: result });
        }
        con.end(); // Close the connection
    });
});

  

app.get('/product-company-storing-search', connectDB, function(req, res) {
    const con = req.con;
    const { id, productName, companyName, productType } = req.query;
    const sql = "SELECT * FROM copmay_medicine_stock WHERE id LIKE ? AND productName LIKE ? AND companyName LIKE ?";
    const values = [`%${id}%`, `%${productName}%`, `%${companyName}%`];

    con.query(sql, values, function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render(__dirname + "/product-company-storing", { copmay_medicine_stock: result });
        }

        // Close the connection after query completes
        con.end();
    });
});



  // Handle form submission to update stock
  app.post('/updateStock', connectDB, (req, res) => {
    const { id, newStock } = req.body;
    req.con.query('SELECT * FROM copmay_medicine_stock WHERE id = ?', [id], (err, rows) => {
      if (err) {
        console.error('Error querying database:', err);
        res.status(500).send('Server Error');
        return;
      }
      if (rows.length === 0) {
        res.status(404).send('Product not found');
        return;
      }
      const updatedStock = parseInt(rows[0].updateStock) + parseInt(newStock);
      req.con.query('UPDATE copmay_medicine_stock SET updateStock = ? WHERE id = ?', [updatedStock, id], (err, result) => {
        if (err) {
          console.error('Error updating stock:', err);
          res.status(500).send('Server Error');
          return;
        }
        res.redirect('/product-company-storing');
      });
    });
  });

app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
});
