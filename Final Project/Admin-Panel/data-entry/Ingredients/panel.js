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
app.get('/Ingredients-panel-detailes', connectDB, function(req, res) {
  const con = req.con;
  con.query("SELECT * FROM panel_info", function(error, result) {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.render(__dirname + "/Ingredients-panel-detailes", { panel_info: result });
    }
    con.end(); // Close the connection
  });
});

// Route to delete an ingredient
app.get('/Ingredients_deleted', connectDB, function(req, res) {
  const con = req.con;
  const id = req.query.id;
  const sql = "DELETE FROM panel_info WHERE id=?";
  
  con.query(sql, [id], function(error, result) {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log("Data deleted from panel_info table successfully");
      res.redirect('/Ingredients-panel-detailes');
    }
    // No need to close the connection here since it's handled in the middleware
  });
});






app.post('/ingredients_accept', function(req, res){
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "product"
    });

    const { ingredient_name, weight, ingredient_type, sub_ingredient_name, product_name, details, photo } = req.body;

    const values = [
        [ingredient_name, weight, ingredient_type, sub_ingredient_name, product_name, details, photo]
    ];

    con.connect(function(err) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const sql = "INSERT INTO ingredient_info (ingredient_name, weight, ingredient_type, sub_ingredient_name, product_name, details, photo) VALUES ?";
        
        con.query(sql, [values], function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                console.log('New ingredient entry Id:', result.insertId);

                const id = req.body.id;
                const deleteSql = "DELETE FROM panel_info WHERE id=?";
                con.query(deleteSql, [id], function(error, result) {
                    if (error) {
                        console.log(error);
                        res.status(500).send('Internal Server Error');
                    } else {
                        console.log("Data deleted from panel_info table successfully");
                        res.redirect('/Ingredients-panel-detailes'); // Redirect after successful deletion
                    }
                });
            }
        });
    });
});

// Route to search ingredients


// Route to edit ingredients
app.get('/Ingredients-panel-entry', function(req, res) {
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "product"
    });

    const id = req.query.id;
    const sql = "SELECT * FROM panel_info WHERE id=?";

    con.connect(function(error) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
            return;
        }

        con.query(sql, [id], function(error, result) {
            if (error) {
                console.log(error);
                res.status(500).send('Internal Server Error');
            } else {
                res.render(__dirname + "/Ingredients-panel-entry", { panel_info: result });
            }

            con.end(); // Close the connection
        });
    });
});

app.post('/Ingredients-panel-entry', function(req, res){
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "product"
    });

    const { ingredient_name, weight, ingredient_type, sub_ingredient_name, product_name, details, photo } = req.body;

    const values = [
        [ingredient_name, weight, ingredient_type, sub_ingredient_name, product_name, details, photo]
    ];

    con.connect(function(err) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const sql = "INSERT INTO ingredient_info (ingredient_name, weight, ingredient_type, sub_ingredient_name, product_name, details, photo) VALUES ?";
        
        con.query(sql, [values], function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                console.log('New panel entry Id:', result.insertId);
                const { id } = req.body;
                const deleteSql = "DELETE FROM panel_info WHERE id=?";
                con.query(deleteSql, [id], function(error, result) {
                    if (error) {
                        console.log(error);
                        res.status(500).send('Internal Server Error');
                    } else {
                        console.log("Data deleted from panel_info table successfully");
                        res.redirect('/Ingredients-panel-detailes'); // Redirect after successful deletion
                    }
                });
            }
        });
    });
});


app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
});
