const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'your_database_name'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});

app.get('/', (req, res) => {
  res.render('index');
});

// Handle searching problem names
app.post('/search', (req, res) => {
  const problemName = req.body.problem;
  db.query('SELECT * FROM diseaseName WHERE JSON_CONTAINS(problem, ?)', [JSON.stringify(problemName)], (err, results) => {
    if (err) throw err;
    res.render('index', { diseases: results });
  });
});

// Handle updating test result
app.post('/update_test_result', (req, res) => {
  const { diseaseId, testIndex, isPositive } = req.body;
  db.query('SELECT confirmTest FROM diseaseName WHERE id = ?', [diseaseId], (err, results) => {
    if (err) throw err;
    let confirmTestName = JSON.parse(results[0].confirmTest);
    confirmTestName[testIndex] = isPositive ? 'positive' : 'negative';
    db.query('UPDATE diseaseName SET confirmTest = ? WHERE id = ?', [JSON.stringify(confirmTestName), diseaseId], (err) => {
      if (err) throw err;
      res.json({ success: true });
    });
  });
});

// Confirm disease and display
app.get('/confirm_disease', (req, res) => {
  db.query('SELECT * FROM diseaseName', (err, results) => {
    if (err) throw err;
    let confirmedDiseases = results.filter(diseaseName => {
      return JSON.parse(diseaseName.confirmTest).every(test => test === 'positive');
    });
    res.render('index', { confirmedDiseases });
  });
});

// Inherit ingredient info based on confirmed diseases
app.get('/inherit_ingredients', (req, res) => {
  db.query('SELECT * FROM diseaseName WHERE JSON_CONTAINS(confirmTest, \'positive\')', (err, diseases) => {
    if (err) throw err;
    let promises = diseases.map(diseaseName => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM new_ingredient_final WHERE JSON_CONTAINS(ingredient_name, ?)', [JSON.stringify(diseaseName.disease_name)], (err, ingredients) => {
          if (err) reject(err);
          resolve({ diseaseName, ingredients });
        });
      });
    });
    Promise.all(promises).then(results => {
      res.render('index', { results });
    }).catch(err => {
      throw err;
    });
  });
});

// Search ingredients based on main_conditions and problem name
app.post('/search_ingredients', (req, res) => {
  const { main_conditions, problem } = req.body;
  let query = 'SELECT * FROM new_ingredient_final WHERE 1=1';
  let queryParams = [];

  if (main_conditions) {
    query += ' AND main_conditions = ?';
    queryParams.push(main_conditions);
  }

  if (problem) {
    query += ' AND JSON_CONTAINS(problem, ?)';
    queryParams.push(JSON.stringify(problem));
  }

  db.query(query, queryParams, (err, results) => {
    if (err) throw err;
    res.render('index', { ingredients: results });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
