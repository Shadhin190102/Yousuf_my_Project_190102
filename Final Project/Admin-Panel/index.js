var mysql = require('mysql');
var con = require('./connection')
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 8081;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Dash_Board_panel.html');
});


// all id create server 
app.use(express.static(path.join(__dirname, 'data-entry')));

app.get('/create_id_home.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'data-entry', 'create_id_home.html'));
});
app.use(bodyParser.urlencoded({ extended: true }));

// Admin-id create server 

app.get('/admin-id', (req, res) => {
        res.sendFile(path.join(__dirname, '/data-entry/id-create', 'admin-id.html'));
      });
  app.post('/admin-id', function(req, res){
    if (con.state === 'disconnected') {
        con.connect(function(err) {
            if (err) {
                console.error('Error connecting to database: ' + err.stack);
                return;
            }
            console.log('Connected to database with id ' + con.threadId);
            insertData(req, res);
        });
    } else {
        insertData(req, res);
    }
});

function insertData(req, res) {
    var formData = req.body;
    var names = formData.names;
    var address = formData.address;
    var mobileNumber = formData.mobileNumber;
    var email = formData.email;
    var type = formData.type;
    var nidNumber = formData.nidNumber;
    var bankAccountName = formData.bankAccountName;
    var bankAccountNumber = formData.bankAccountNumber;
    var bankBranchName = formData.bankBranchName;
    var password = formData.password;
    var confirmPassword = formData.confirmPassword;
    var photo = formData.photo;

    var sql = "INSERT INTO admin_information (names, address, mobileNumber, email, type, nidNumber, bankAccountName, bankAccountNumber, bankBranchName, password, confirmPassword, photo) VALUES ?";
    var values = [
        [names, address, mobileNumber, email, type, nidNumber, bankAccountName, bankAccountNumber, bankBranchName, password, confirmPassword, photo]
    ];

    con.query(sql, [values], function(err, result) {
        if (err) {
            console.error('Error inserting data: ' + err.stack);
            res.status(500).send('Error inserting data');
            return;
        }
        console.log('New Admin Id : ' + result.insertId);
        res.send('New Admin Id : ' + result.insertId);
    });
}

app.get('/compnay-id', (req, res) => {
    res.sendFile(path.join(__dirname, '/data-entry/id-create', 'compnay-id.html'));
  });
  app.post('/compnay-id', function(req, res){
  if (con.state === 'disconnected') {
    con.connect(function(err) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }
        console.log('Connected to database with id ' + con.threadId);
        insertData(req, res);
    });
  } else {
    insertData(req, res);
  }
  });
  
  function insertData(req, res) {
    var name = req.body.names;
    var person = req.body.person;
    var mobileNumber = req.body.mobileNumber;
    var email = req.body.email;
    var address = req.body.address;
    var type = req.body.type;
    var nidNumber = req.body.nidNumber;
    var tradeLicense = req.body.tradeLicense;
    var tinNumber = req.body.tinNumber;
    var bankAccountName = req.body.bankAccountName;
    var bankAccountNumber = req.body.bankAccountNumber;
    var bankBranchName = req.body.bankBranchName;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var photo = req.body.photo;
  
  
    var sql = "INSERT INTO admin_compnay (name, person, mobileNumber, email, address, type, nidNumber, tradeLicense, tinNumber, bankAccountName, bankAccountNumber, bankBranchName, password, confirmPassword, photo) VALUES ?";
    var values = [
      [name, person, mobileNumber, email, address, type, nidNumber, tradeLicense, tinNumber, bankAccountName, bankAccountNumber, bankBranchName, password, confirmPassword, photo ]
    ];
  con.query(sql, [values], function(err, result) {
    if (err) {
        console.error('Error inserting data: ' + err.stack);
        res.status(500).send('Error inserting data');
        return;
    }
    console.log('New Admin Id : ' + result.insertId);
    res.send('New Admin Id : ' + result.insertId);
  });
  }

  app.get('/E-Commerce-id', (req, res) => {
    res.sendFile(path.join(__dirname, '/data-entry/id-create', 'E-Commerce-id.html'));
  });
  app.post('/E-Commerce-id', function(req, res){
  if (con.state === 'disconnected') {
    con.connect(function(err) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }
        console.log('Connected to database with id ' + con.threadId);
        insertData(req, res);
    });
  } else {
    insertData(req, res);
  }
  });
  
  function insertData(req, res) {
    var name = req.body.names;
      var person = req.body.person;
      var mobileNumber = req.body.mobileNumber;
      var email = req.body.email;
      var address = req.body.address;
      var nidNumber = req.body.nidNumber;
      var tradeLicense = req.body.tradeLicense;
      var tinNumber = req.body.tinNumber;
      var bankAccountName = req.body.bankAccountName;
      var bankAccountNumber = req.body.bankAccountNumber;
      var bankBranchName = req.body.bankBranchName;
      var password = req.body.password;
      var confirmPassword = req.body.confirmPassword;
      var photo = req.body.photo;
  
  
    var sql = "INSERT INTO admin_e_commerce (name, person, mobileNumber, email, address, nidNumber, tradeLicense, tinNumber, bankAccountName, bankAccountNumber, bankBranchName, password, confirmPassword, photo) VALUES ?";
    var values = [
      [name, person, mobileNumber, email, address, nidNumber, tradeLicense, tinNumber, bankAccountName, bankAccountNumber, bankBranchName, password, confirmPassword, photo ]
    ];
  con.query(sql, [values], function(err, result) {
    if (err) {
        console.error('Error inserting data: ' + err.stack);
        res.status(500).send('Error inserting data');
        return;
    }
    console.log('New Admin Id : ' + result.insertId);
    res.send('New Admin Id : ' + result.insertId);
  });
  }

  app.get('/Others-id', (req, res) => {
    res.sendFile(path.join(__dirname, '/data-entry/id-create', 'Others-id.html'));
  });
  app.post('/Others-id', function(req, res){
  if (con.state === 'disconnected') {
    con.connect(function(err) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }
        console.log('Connected to database with id ' + con.threadId);
        insertData(req, res);
    });
  } else {
    insertData(req, res);
  }
  });
  
  function insertData(req, res) {
    var name = req.body.names;
    var person = req.body.person;
    var mobileNumber = req.body.mobileNumber;
    var email = req.body.email;
    var address = req.body.address;
    var nidNumber = req.body.nidNumber;
    var tradeLicense = req.body.tradeLicense;
    var tinNumber = req.body.tinNumber;
    var type = req.body.type;
    var bankAccountName = req.body.bankAccountName;
    var bankAccountNumber = req.body.bankAccountNumber;
    var bankBranchName = req.body.bankBranchName;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var photo = req.body.photo;
  
  
  
    var sql = "INSERT INTO admin_others_id (name, person, mobileNumber, email, address, nidNumber, tradeLicense, tinNumber, type, bankAccountName, bankAccountNumber, bankBranchName, password, confirmPassword, photo) VALUES ?";
    var values = [
      [name, person, mobileNumber, email, address, nidNumber, tradeLicense, tinNumber, type, bankAccountName, bankAccountNumber, bankBranchName, password, confirmPassword, photo ]
    ];
  con.query(sql, [values], function(err, result) {
    if (err) {
        console.error('Error inserting data: ' + err.stack);
        res.status(500).send('Error inserting data');
        return;
    }
    console.log('New Admin Id : ' + result.insertId);
    res.send('New Admin Id : ' + result.insertId);
  });
  }

  app.get('/Shop-id-create', (req, res) => {
    res.sendFile(path.join(__dirname, '/data-entry/id-create', 'Shop-id-create.html'));
  });
  app.post('/Shop-id-create', function(req, res){
  if (con.state === 'disconnected') {
    con.connect(function(err) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }
        console.log('Connected to database with id ' + con.threadId);
        insertData(req, res);
    });
  } else {
    insertData(req, res);
  }
  });
  
  function insertData(req, res) {
    var name = req.body.names;
      var person = req.body.person;
      var mobileNumber = req.body.mobileNumber;
      var email = req.body.email;
      var address = req.body.address;
      var area = req.body.area;
      var nidNumber = req.body.nidNumber;
      var tradeLicense = req.body.tradeLicense;
      var tinNumber = req.body.tinNumber;
      var type = req.body.type;
      var bankAccountName = req.body.bankAccountName;
      var bankAccountNumber = req.body.bankAccountNumber;
      var bankBranchName = req.body.bankBranchName;
      var password = req.body.password;
      var confirmPassword = req.body.confirmPassword;
      var photo = req.body.photo;
  
  
    var sql = "INSERT INTO admin_shop_id (name, person, mobileNumber, email, address, area, nidNumber, tradeLicense, tinNumber, type, bankAccountName, bankAccountNumber, bankBranchName, password, confirmPassword, photo) VALUES ?";
    var values = [
      [name, person, mobileNumber, email, address, area, nidNumber, tradeLicense, tinNumber, type, bankAccountName, bankAccountNumber, bankBranchName, password, confirmPassword, photo ]
    ];
  con.query(sql, [values], function(err, result) {
    if (err) {
        console.error('Error inserting data: ' + err.stack);
        res.status(500).send('Error inserting data');
        return;
    }
    console.log('New Admin Id : ' + result.insertId);
    res.send('New Admin Id : ' + result.insertId);
  });
  }










  app.set('view engine', 'ejs');

// Route to fetch all ingredients
app.get('/ingredients-home', function(req, res) {
  var sql = "SELECT * FROM ingredient_info";
  con.query(sql, function(error, result) {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.render(__dirname + "/data-entry/Ingredients/ingredients-home", { ingredient_info: result });
    }
  });
});

// Route to search ingredients
app.get('/Ingredients-search', function(req, res) {
  var id = req.query.id;
  var ingredient_name = req.query.ingredient_name;
  var weight = req.query.weight;
  var ingredient_type = req.query.ingredient_type;

  var sql = "SELECT * FROM ingredient_info WHERE id LIKE ? AND ingredient_name LIKE ? AND weight LIKE ? AND ingredient_type LIKE ?";
  var values = [`%${id}%`, `%${ingredient_name}%`, `%${weight}%`, `%${ingredient_type}%`];

  con.query(sql, values, function(error, result) {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.render(__dirname + "/data-entry/Ingredients/ingredients-home", { ingredient_info: result });
    }
  });
});



app.post('/Ingredients-edite', function(req, res) {
  const con = req.con;
  const { ingredient_name, weight, ingredient_type, sub_ingredient_name, product_name, details, photo, id } = req.body;
  const sql = "UPDATE ingredient_info SET ingredient_name=?, weight=?, ingredient_type=?, sub_ingredient_name=?, product_name=?, details=?, photo=? WHERE id=?";
  con.query(sql, [ingredient_name, weight, ingredient_type, sub_ingredient_name, product_name, details, photo, id], function(error, result) {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/data-entry/Ingredients/ingredients-home'); // Redirect after successful update
    }
    con.end(); // Close the connection
  });
});




app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
  });
