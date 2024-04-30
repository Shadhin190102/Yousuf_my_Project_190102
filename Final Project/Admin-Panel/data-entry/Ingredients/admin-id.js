var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password:"",
  database: "yousufdbs"
});
var express = require('express');
const path = require('path'); 
var app = express();
var bodyParser = require('body-parser')
const axios = require('axios');
const port = 8081;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


  app.get('/admin-id', function(req, res){
    res.sendFile(__dirname+'/admin-id.html');
});

app.post('/panel-entry', function(req, res){
    
  const { ingredient_name, weight, ingredient_type, sub_ingredient_name, product_name, details, photo } = req.body;


    con.connect(function(err) {
        if (err) throw err;
        var sql = "INSERT INTO panel_info (ingredient_name, weight, ingredient_type, sub_ingredient_name, product_name, details, photo) VALUES ?";
        var values = [
    
        [ingredient_name, weight, ingredient_type, sub_ingredient_name, product_name, details, photo]
    
        ];
    
        
        con.query(sql,[values], function(err,result){
            if (err) throw err;
            res.send('New panel entry Id : '+result.insertId);
        });
    
      });
  
    
});






app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
  });







  