const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Set up EJS as the template engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "product"
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

// Route to display the search form and results
app.get('/', (req, res) => {
    res.render('doctor');
  });
  
  // Route to handle the initial search and display results
  app.post('/search', (req, res) => {
    const searchTerm = req.body.problem;
    const query = `SELECT diseaseName, physicals_condition FROM disease_info WHERE JSON_CONTAINS(problem, JSON_QUOTE(?))`;
  
    db.query(query, [searchTerm], (err, results) => {
      if (err) throw err;
      res.render('doctor', { results });
    });
  });
  
  // Route to handle filtering based on user selections
  app.post('/process', (req, res) => {
    const conditions = req.body;
    console.log("Received conditions:", conditions);
    
    let allTrue = true;
    for (const key in conditions) {
      if (conditions[key] === 'false') {
        allTrue = false;
        break;
      }
    }
    console.log("All conditions true:", allTrue);
    
    if (allTrue) {
      // Query database to retrieve diseaseName when all conditions are true
      const query = `SELECT diseaseName FROM disease_info`;
      db.query(query, (err, results) => {
        if (err) {
          console.error("Error retrieving disease names:", err);
          res.send("An error occurred.");
        } else {
          // Extract diseaseName values from the query results
          const diseaseNames = results.map(row => row.diseaseName);
          console.log("Disease names:", diseaseNames);
          // Render the doctor.ejs template with diseaseNames
          res.render('doctor', { diseaseNames });
        }
      });
    } else {
      // Don't show anything if some conditions are false
      console.log("Some conditions are false.");
      res.send('Some conditions are false.');
    }
  });
  
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
