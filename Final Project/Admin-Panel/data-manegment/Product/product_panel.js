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
app.get('/', connectDB, function(req, res) {
    const con = req.con;
    con.query("SELECT * FROM product_database", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render(__dirname + "/product-panel-home", { product_database: result });
        }
        con.end(); // Close the connection
    });
});


// Route to edit ingredients
app.get('/product-panel_detailes', function(req, res) {
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
        res.render(__dirname + "/product-panel_detailes", { product_database: result });
      }
      
      con.end(); // Close the connection
    });
  });
});

// Route to update ingredients
app.post('/product-panel_detailes', function(req, res) {
    const { productName, ProductCount, productType, ingredients, diseaseName, weight, companyName, age, price, discount, publishedDate, productDetails, photo, id } = req.body;

    // Connect to the database
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "product"
    });

    // Begin the database transaction
    con.beginTransaction(function(err) {
        if (err) {
            console.error('Error beginning transaction:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Insert data into product_panel_database
        const insertSql = "INSERT INTO product_panel_database (productName, ProductCount, productType, ingredients, diseaseName, weight, companyName, age, price, discount, publishedDate, productDetails, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        con.query(insertSql, [productName, ProductCount, productType, ingredients, diseaseName, weight, companyName, age, price, discount, publishedDate, productDetails, photo], function(insertErr, insertResult) {
            if (insertErr) {
                console.error('Error inserting data into product_panel_database:', insertErr);
                con.rollback(function() {
                    res.status(500).send('Internal Server Error');
                });
                return;
            }

            console.log('New panel entry Id:', insertResult.insertId);

            // Delete corresponding data from product_database
            const deleteSql = "DELETE FROM product_database WHERE id=?";

            con.query(deleteSql, [id], function(deleteErr, deleteResult) {
                if (deleteErr) {
                    console.error('Error deleting data from product_database:', deleteErr);
                    con.rollback(function() {
                        res.status(500).send('Internal Server Error');
                    });
                    return;
                }

                console.log('Data deleted from product_database successfully.');

                // Commit the transaction
                con.commit(function(commitErr) {
                    if (commitErr) {
                        console.error('Error committing transaction:', commitErr);
                        con.rollback(function() {
                            res.status(500).send('Internal Server Error');
                        });
                        return;
                    }

                    console.log('Transaction complete.');
                    res.redirect('/product-panel-home'); // Redirect after successful deletion
                });
            });
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









app.get('/product_panel_deleted', connectDB, function(req, res) {
    const con = req.con;
    const id = req.query.id;
    const sql = "DELETE FROM product_database WHERE id=?";
    
    con.query(sql, [id], function(error, result) {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
      } else {
        console.log("Data deleted from product_database table successfully");
        res.redirect('/product-panel-home');
      }
      // No need to close the connection here since it's handled in the middleware
    });
  });
app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
});
