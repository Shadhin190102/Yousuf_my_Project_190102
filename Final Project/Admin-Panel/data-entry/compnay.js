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






app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
  });







  