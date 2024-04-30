var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password:"",
  database: "yousufdbs"
});
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
const axios = require('axios');
const port = 8081;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


  app.get('/admin-id', function(req, res){
    res.sendFile(__dirname+'/admin-id.html');
});

app.post('/admin-id', function(req, res){
    
    var names = req.body.names;
    var address = req.body.address;
    var mobileNumber = req.body.mobileNumber;
    var email = req.body.email;
    var type = req.body.type;
    var nidNumber = req.body.nidNumber;
    var bankAccountName = req.body.bankAccountName;
    var bankAccountNumber = req.body.bankAccountNumber;
    var bankBranchName = req.body.bankBranchName;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var photo = req.body.photo;


    con.connect(function(err) {
        if (err) throw err;
        var sql = "INSERT INTO admin_database (names, address, mobileNumber, email, type, nidNumber, bankAccountName, bankAccountNumber, bankBranchName, password, confirmPassword, photo) VALUES ?";
        var values = [
    
        [names, address, mobileNumber, email, type, nidNumber, bankAccountName, bankAccountNumber, bankBranchName, password, confirmPassword, photo ]
    
        ];
    
        
        con.query(sql,[values], function(err,result){
            if (err) throw err;
            res.send('New Admin Id : '+result.insertId);
        });
    
      });
  
    
});






app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
  });







  