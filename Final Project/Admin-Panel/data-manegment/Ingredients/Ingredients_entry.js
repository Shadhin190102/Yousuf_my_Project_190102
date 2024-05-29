const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 8081;

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "product"
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/Ingredients-entry', (req, res) => {
  res.sendFile(__dirname + '/Ingredients-entry.html');
});

// Handle form submission
app.post('/submit', (req, res) => {
  const formData = req.body;
  console.log('Received form data:', formData);

  const { ingredient_name, weight, ingredient_type, sub_ingredient_name, Problem, main_conditions, Warnings } = formData;

  const sql = `
      INSERT INTO new_ingredient_final (ingredient_name, weight, ingredient_type, sub_ingredient_name, problems, main_conditions, warnings)
      VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
      ingredient_name,
      weight,
      ingredient_type,
      sub_ingredient_name,
      JSON.stringify(Problem),
      JSON.stringify(main_conditions),
      JSON.stringify(Warnings)
  ];

  con.query(sql, values, (err, results) => {
      if (err) {
          console.error('Error inserting data into MySQL:', err);
          res.status(500).json({ error: 'Database error' });
          return;
      }

      console.log('New ingredient Id : ' + results.insertId);
      res.json({ success: true }); // Sending a JSON response indicating success
  });
});





app.get('/new_data', (req, res) => {
  const sql = 'SELECT * FROM new_ingredient_final';
  con.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching form data from database:', err);
      res.status(500).json({ error: 'Failed to fetch form data' });
    } else {
      const parsedResults = results.map(row => ({
        ...row,
        problems: JSON.parse(row.problems),
        main_conditions: JSON.parse(row.main_conditions),
        warnings: JSON.parse(row.warnings)
      }));

      console.log(JSON.stringify(parsedResults, null, 2));

      res.render('new_data', { formData: parsedResults, searchResults: [] });
    }
  });
});

function getAgeCategory(age) {
  if (age >= 0 && age <= 2) return 'Infant';
  if (age >= 2 && age <= 5) return 'Toddlers and Preschoolers';
  if (age >= 6 && age <= 12) return 'Children';
  if (age >= 13 && age <= 17) return 'Adolescents';
  if (age >= 18 && age <= 64) return 'Adults';
  if (age >= 0 && age > 65) return 'All';
  if (age >= 18 && age > 65) return 'Adults+';
  if (age >= 0 && age <= 12) return '+Children';
  if (age >= 13 && age <= 64) return '+Adults';
  if (age >= 13 && age > 65) return '+Adults+';
  if (age >= 1 && age <= 17) return 'Child';
  if (age >= pregnancy && age <= pregnancy) return 'pregnancy';
  
  if (age > 65) return 'Elderly';
  return null;
}

function getConditionDuration(duration) {
  if (duration >= 1 && duration <= 7) return '1-7';
  if (duration >= 8 && duration <= 15) return '8-15';
  if (duration >= 16 && duration <= 30) return '16-30';
  if (duration >= 31) return '31+';
  if (duration >= 1) return 'No';
  if (duration >= 1) return 'no';
  return null;
}

function searchByConditionName(data, conditionName) {
  return data.map(item => {
    const filteredMainConditions = item.main_conditions.map(mainCondition => {
      const filteredConditions = mainCondition.conditions.filter(condition => condition.condition_name.toLowerCase() === conditionName.toLowerCase());
      if (filteredConditions.length > 0) {
        return {
          ...mainCondition,
          conditions: filteredConditions
        };
      }
      return null;
    }).filter(mc => mc !== null);

    if (filteredMainConditions.length > 0) {
      return {
        ...item,
        main_conditions: filteredMainConditions
      };
    }
    return null;
  }).filter(item => item !== null);
}

function searchByMainConditionName(data, mainConditionName) {
  return data.map(item => {
    const filteredMainConditions = item.main_conditions.filter(mainCondition => mainCondition.main_condition_name.toLowerCase() === mainConditionName.toLowerCase());
    if (filteredMainConditions.length > 0) {
      return {
        ...item,
        main_conditions: filteredMainConditions
      };
    }
    return null;
  }).filter(item => item !== null);
}

app.get('/search', (req, res) => {
  const { conditionName, mainConditionName } = req.query;
  const sql = 'SELECT * FROM new_ingredient_final';

  con.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching form data from database:', err);
      res.status(500).json({ error: 'Failed to fetch form data' });
    } else {
      const parsedResults = results.map(row => ({
        ...row,
        problems: JSON.parse(row.problems),
        main_conditions: JSON.parse(row.main_conditions),
        warnings: JSON.parse(row.warnings)
      }));

      let searchResults = [];

      if (conditionName) {
        const duration = parseInt(conditionName, 10);
        const conditionCategory = !isNaN(duration) ? getConditionDuration(duration) : conditionName;
        searchResults = searchByConditionName(parsedResults, conditionCategory);
      } else if (mainConditionName) {
        const age = parseInt(mainConditionName, 10);
        const ageCategory = !isNaN(age) ? getAgeCategory(age) : mainConditionName;
        searchResults = searchByMainConditionName(parsedResults, ageCategory);
      }

      res.render('new_data', { formData: parsedResults, searchResults });
    }
  });
});


app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
});
