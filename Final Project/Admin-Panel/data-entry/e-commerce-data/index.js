const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const port = 8081;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');

function connectDB(req, res, next) {
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "yousufdbs"
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
    con.query("SELECT * FROM admins_info", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render(__dirname + "/admin-home", { admins_info: result });
        }
        con.end(); // Close the connection
    });
});

// Route to search products
app.get('/admin-search', connectDB, function(req, res) {
    const con = req.con;
    const { id, name, mobileNumber, email } = req.query;
    const sql = "SELECT * FROM admins_info WHERE id LIKE ? AND name LIKE ? AND mobileNumber LIKE ? AND email LIKE ?";
    const values = [`%${id}%`, `%${name}%`, `%${mobileNumber}%`, `%${email}%`];

    con.query(sql, values, function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render(__dirname + "/admin-home", { admins_info: result });
        }

        // Close the connection after query completes
        con.end();
    });
});

// Route to edit ingredients


// Route to update ingredients
app.get('/admin-detalies/:id', (req, res) => {
    const adminId = req.params.id;
    db.query('SELECT * FROM admins_info WHERE id = ?', [adminId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('admin-detalies', { admin: results[0] });
        } else {
            res.send('Admin not found');
        }
    });
});

// Route to handle admin update form submission
app.post('/admin-update', (req, res) => {
    const { id, name, username, address, mobileNumber, email, type, nidNumber, password } = req.body;
    db.query('UPDATE admins_info SET name = ?, username = ?, address = ?, mobileNumber = ?, email = ?, type = ?, nidNumber = ?, password = ? WHERE id = ?', 
        [name, username, address, mobileNumber, email, type, nidNumber, password, id], (err, result) => {
        if (err) throw err;
        res.redirect('/admin-home'); // Redirect to admin list after update
    });
});



app.get('/admin_deleted', connectDB, function(req, res) {
    const con = req.con;
    const id = req.query.id;
    const sql = "DELETE FROM admins_info WHERE id=?";
    
    con.query(sql, [id], function(error, result) {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
      } else {
        console.log("Data deleted from admins_info table successfully");
        res.redirect('/product-home');
      }
      // No need to close the connection here since it's handled in the middleware
    });
  });



app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
});
