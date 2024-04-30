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

// Route to fetch all ingredients
app.get('/ingredients-home', connectDB, function(req, res) {
  const con = req.con;
  con.query("SELECT * FROM ingredient_info", function(error, result) {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.render(__dirname + "/ingredients-home", { ingredient_info: result });
    }
    con.end(); // Close the connection
  });
});

// Route to search ingredients
app.get('/ingredients-search', connectDB, function(req, res) {
  const con = req.con;
  const { id, ingredient_name, weight, ingredient_type } = req.query;
  const sql = "SELECT * FROM ingredient_info WHERE id LIKE ? AND ingredient_name LIKE ? AND weight LIKE ? AND ingredient_type LIKE ?";
  const values = [`%${id}%`, `%${ingredient_name}%`, `%${weight}%`, `%${ingredient_type}%`];
  con.query(sql, values, function(error, result) {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.render(__dirname + "/ingredients-home", { ingredient_info: result });
    }
    con.end(); // Close the connection
  });
});

// Route to edit ingredients
app.get('/Ingredients-edite', function(req, res) {
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
    const sql = "SELECT * FROM ingredient_info WHERE id=?";
    
    con.query(sql, [id], function(error, result) {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
      } else {
        res.render(__dirname + "/Ingredients-edite", { ingredient_info: result });
      }
      
      con.end(); // Close the connection
    });
  });
});

// Route to update ingredients
app.post('/Ingredients-edite', connectDB, function(req, res) {
  const con = req.con;
  const { ingredient_name, weight, ingredient_type, sub_ingredient_name, product_name, details, photo, id } = req.body;
  const sql = "UPDATE ingredient_info SET ingredient_name=?, weight=?, ingredient_type=?, sub_ingredient_name=?, product_name=?, details=?, photo=? WHERE id=?";
  con.query(sql, [ingredient_name, weight, ingredient_type, sub_ingredient_name, product_name, details, photo, id], function(error, result) {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/ingredients-home'); // Redirect after successful update
    }
    con.end(); // Close the connection
  });
});

app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
});
