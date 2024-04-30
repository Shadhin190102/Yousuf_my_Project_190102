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

// Route to fetch all products
app.get('/product-home', connectDB, function(req, res) {
    const con = req.con;
    con.query("SELECT * FROM product_database", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render(__dirname + "/product-home", { product_database: result });
        }
        con.end(); // Close the connection
    });
});

// Route to search products
app.get('/product-search', connectDB, function(req, res) {
    const con = req.con;
    const { id, productName, companyName, productType } = req.query;
    const sql = "SELECT * FROM product_database WHERE id LIKE ? AND productName LIKE ? AND companyName LIKE ? AND productType LIKE ?";
    const values = [`%${id}%`, `%${productName}%`, `%${companyName}%`, `%${productType}%`];

    con.query(sql, values, function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render(__dirname + "/product-home", { product_database: result });
        }

        // Close the connection after query completes
        con.end();
    });
});

// Route to edit ingredients
app.get('/product-edite', function(req, res) {
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
      return;
    }
    
    const id = req.query.id;
    const sql = "SELECT * FROM product_database WHERE id=?";
    
    con.query(sql, [id], function(error, result) {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
      } else {
        res.render(__dirname + "/product-edite", { product_database: result });
      }
      
      con.end(); // Close the connection
    });
  });
});

// Route to update ingredients
app.post('/product-edite', function(req, res) {
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "product"
    });

    // Extract form data
    const { id, productName, ProductCount, productType, ingredients, diseaseName, weight, companyName, age, price, discount, productDetails } = req.body;

    // Connect to the database
    con.connect(function(err) {
        if (err) {
            console.error('Error connecting to the database:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Update query
        const sql = "UPDATE product_database SET productName=?, ProductCount=?, productType=?, ingredients=?, diseaseName=?, weight=?, companyName=?, age=?, price=?, discount=?, productDetails=? WHERE id=?";

        // Execute the query
        con.query(sql, [productName, ProductCount, productType, ingredients, diseaseName, weight, companyName, age, price, discount, productDetails, id], function(err, result) {
            if (err) {
                console.error('Error updating product:', err);
                return res.status(500).send('Internal Server Error');
            }

            console.log('Product updated successfully.');
            res.redirect('/product-home'); // Redirect to product home on success
        });
    });
});


app.get('/ingredients', connectDB, (req, res) => {
    const con = req.con;
    const sql = 'SELECT ingredient_name FROM ingredient_info';
    con.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching ingredients:', err);
            res.status(500).json({ error: 'Error fetching ingredients' });
        } else {
            res.json(results);
        }
        con.end(); // Close the connection
    });
});



















app.get('/product_deleted', connectDB, function(req, res) {
    const con = req.con;
    const id = req.query.id;
    const sql = "DELETE FROM product_database WHERE id=?";
    
    con.query(sql, [id], function(error, result) {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
      } else {
        console.log("Data deleted from product_database table successfully");
        res.redirect('/product-home');
      }
      // No need to close the connection here since it's handled in the middleware
    });
  });
app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
});
