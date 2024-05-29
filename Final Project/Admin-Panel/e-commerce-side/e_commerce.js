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
app.get('/e-commerce', connectDB, function(req, res) {
    const con = req.con;
    con.query("SELECT * FROM all_shop_stock", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render(__dirname + "/e-commerce", { all_shop_stock: result });
        }
        con.end(); // Close the connection
    });
});



// Route to search products
app.get('/e-commerce-search', connectDB, function(req, res) {
    const con = req.con;
    const { product_code, product_name, company_name, shop_area } = req.query;
    const sql = "SELECT * FROM all_shop_stock WHERE product_code LIKE ? AND product_name LIKE ? AND company_name LIKE ? AND shop_area LIKE ?";
    const values = [`%${product_code}%`, `%${product_name}%`, `%${company_name}%`, `%${shop_area}%`];

    con.query(sql, values, function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render(__dirname + "/e-commerce", { all_shop_stock: result });
        }

        // Close the connection after query completes
        con.end();
    });
});






app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
});
