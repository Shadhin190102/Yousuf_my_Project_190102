var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password:"",
  database: "product"
});
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
const axios = require('axios');
const port = 8081;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// app.get('/Shop-id-create', (req, res) => {
//   res.sendFile(path.join(__dirname, '/data-entry/id-create', 'Shop-id-create.html'));
// });
app.get('/Ingredients-entry', function(req, res){
  res.sendFile(__dirname+'/Ingredients-entry.html');
});
app.post('/Ingredients-entry', function(req, res){
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
  const { ingredient_name, weight, ingredient_type, sub_ingredient_name, product_name, details, photo } = req.body;

  const subIngredientName = sub_ingredient_name ? sub_ingredient_name : "N/A";

  var sql = "INSERT INTO panel_info (ingredient_name, weight, ingredient_type, sub_ingredient_name, product_name, details, photo ) VALUES ?";
  var values = [
    [ingredient_name, weight, ingredient_type, subIngredientName, product_name, details, photo ]
  ];
  con.query(sql, [values], function(err, result) {
    if (err) {
      console.error('Error inserting data: ' + err.stack);
      res.status(500).send('Error inserting data');
      return;
    }
    console.log('New ingredient Id : ' + result.insertId);
    res.send('New ingredient Id : ' + result.insertId);
  });
}




app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
  });







  