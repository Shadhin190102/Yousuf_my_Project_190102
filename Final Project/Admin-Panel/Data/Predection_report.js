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
    con.query("SELECT * FROM production_prediction_database", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render(__dirname + "/Predection-report", { production_prediction_database_backup: result });
        }
        con.end(); // Close the connection
    });
});

// Route to search products
// app.get('/product-search', connectDB, function(req, res) {
//     const con = req.con;
//     const { id, productName, companyName, productType } = req.query;
//     const sql = "SELECT * FROM production_prediction_database_backup WHERE id LIKE ? AND productName LIKE ? AND companyName LIKE ? AND productType LIKE ?";
//     const values = [`%${id}%`, `%${productName}%`, `%${companyName}%`, `%${productType}%`];

//     con.query(sql, values, function(error, result) {
//         if (error) {
//             console.log(error);
//             res.status(500).send('Internal Server Error');
//         } else {
//             res.render(__dirname + "/product-home", { production_prediction_database_backup: result });
//         }

//         // Close the connection after query completes
//         con.end();
//     });
// });

// Route to edit ingredients
// app.get('/product-edite', function(req, res) {
//   const con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "product"
//   });

//   con.connect(function(error) {
//     if (error) {
//       console.log(error);
//       res.status(500).send('Internal Server Error');
//       return;
//     }
    
//     const id = req.query.id;
//     const sql = "SELECT * FROM production_prediction_database_backup WHERE id=?";
    
//     con.query(sql, [id], function(error, result) {
//       if (error) {
//         console.log(error);
//         res.status(500).send('Internal Server Error');
//       } else {
//         res.render(__dirname + "/Predection-report", { production_prediction_database_backup: result });
//       }
      
//       con.end(); // Close the connection
//     });
//   });
// });

// Route to update ingredients
// app.post('/product-edite', function(req, res) {
//     const con = mysql.createConnection({
//         host: "localhost",
//         user: "root",
//         password: "",
//         database: "product"
//     });

//     // Extract form data
//     const { id, productName, ProductCount, productType, ingredients, diseaseName, weight, companyName, age, price, discount, productDetails } = req.body;

//     // Connect to the database
//     con.connect(function(err) {
//         if (err) {
//             console.error('Error connecting to the database:', err);
//             return res.status(500).send('Internal Server Error');
//         }

//         // Update query
//         const sql = "UPDATE production_prediction_database_backup SET productName=?, ProductCount=?, productType=?, ingredients=?, diseaseName=?, weight=?, companyName=?, age=?, price=?, discount=?, productDetails=? WHERE id=?";

//         // Execute the query
//         con.query(sql, [productName, ProductCount, productType, ingredients, diseaseName, weight, companyName, age, price, discount, productDetails, id], function(err, result) {
//             if (err) {
//                 console.error('Error updating product:', err);
//                 return res.status(500).send('Internal Server Error');
//             }

//             console.log('Product updated successfully.');
//             res.redirect('/product-home'); // Redirect to product home on success
//         });
//     });
// });



app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
});
