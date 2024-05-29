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

app.set('view engine', 'ejs'); // Set EJS as view engine

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes for serving EJS file and handling data submission
app.get('/', async (req, res) => {
    try {
        // Fetch data from information_table
        const [rows, fields] = await pool.query('SELECT * FROM ingredient_info');
        // Render EJS template with fetched data
        res.render('index', { informationData: rows });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle form submission to copy data and generate new IDs
app.post('/copyData', async (req, res) => {
    try {
        // Fetch data from information_table
        const [rows, fields] = await pool.query('SELECT * FROM ingredient_info');

        // Insert data into panel_info with new IDs
        for (let row of rows) {
            await pool.query('INSERT INTO panel_info (ingredient_name, weight, ingredient_type, sub_ingredient_name, product_name, details, photo) VALUES (?, ?, ?, ?, ?, ?, ?)', [
                row.ingredient_name,
                row.weight,
                row.ingredient_type,
                row.sub_ingredient_name,
                row.product_name,
                row.details,
                row.photo
            ]);
        }

        // Respond with success message
        res.send('Data copied successfully!');
    } catch (error) {
        console.error('Error copying data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Form server is listening on port ${port}`);
  });
