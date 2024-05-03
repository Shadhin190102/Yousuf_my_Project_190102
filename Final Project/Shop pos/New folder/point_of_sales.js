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
app.get('/Point_of-sales', connectDB, function(req, res) {
    const con = req.con;
    con.query("SELECT * FROM product_database", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render(__dirname + "/Point_of-sales", { product_database: result });
        }
        con.end(); // Close the connection
    });
});

// Route to search products
app.get('/Sales-product-search', connectDB, function(req, res) {
    const con = req.con;
    const { id, productName, companyName, productType } = req.query;
    const sql = "SELECT * FROM product_database WHERE id LIKE ? AND productName LIKE ? AND companyName LIKE ?";
    const values = [`%${id}%`, `%${productName}%`, `%${companyName}%`];

    con.query(sql, values, function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render(__dirname + "/Point_of-sales", { product_database: result });
        }

        // Close the connection after query completes
        con.end();
    });
});

// Route to edit ingredients


// Route to update ingredients



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


















app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
});
