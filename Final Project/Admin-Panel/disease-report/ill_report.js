const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "product"
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the directory where the views are located
app.set('views', path.join(__dirname));

// Season definitions
const seasons = {
    Winter: ['December', 'January', 'February'],
    Spring: ['March', 'April', 'May'],
    Summer: ['June', 'July', 'August'],
    Fall: ['September', 'October', 'November']
};

const seasonDiseases = {
    Winter: ["Influenza (Flu)", "Common Cold", "Norovirus", "Seasonal Affective Disorder (SAD)"],
    Spring: ["Allergies (Pollen Allergies, Hay Fever)", "Asthma (Pollen-induced)", "Lyme Disease", "Chickenpox"],
    Summer: ["Heat-Related Illnesses (Heat Exhaustion, Heat Stroke)", "Food Poisoning", "West Nile Virus", "Sunburn and Skin Cancer"],
    Fall: ["Seasonal Flu", "Ragweed Allergies (Hay Fever)", "Asthma", "RSV (Respiratory Syncytial Virus)"]
};

// Helper function to get current season
const getCurrentSeason = (date) => {
    const month = date.toLocaleString('default', { month: 'long' });
    for (const [season, months] of Object.entries(seasons)) {
        if (months.includes(month)) {
            return season;
        }
    }
    return null;
};

// Define the route for illness report
app.get('/', (req, res) => {
    const currentDate = new Date();
    const currentSeason = getCurrentSeason(currentDate);
    const commonDiseases = seasonDiseases[currentSeason];

    console.log(`Current season: ${currentSeason}`);
    console.log(`Common diseases: ${commonDiseases}`);

    const query = `
        SELECT d.diseaseName, SUM(m.product_quantity) as total_sales
        FROM xyz1_shop_sales_datas m
        JOIN new_ingredient_final i ON m.ingredient_name = i.ingredient_name
        JOIN disease_info d ON JSON_CONTAINS(d.ingredient_name, JSON_QUOTE(i.ingredient_name), '$')
        GROUP BY d.diseaseName
        ORDER BY total_sales DESC
    `;

    console.log(`Executing query: ${query}`);

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }

        console.log('Query results:', results);

        const seasonalResults = [];
        const nonSeasonalResults = [];

        results.forEach(item => {
            if (commonDiseases.includes(item.diseaseName)) {
                seasonalResults.push(item);
            } else {
                nonSeasonalResults.push(item);
            }
        });

        res.render('Ill-report', { 
            seasonalData: seasonalResults, 
            nonSeasonalData: nonSeasonalResults, 
            season: currentSeason,
            currentDate: currentDate.toLocaleDateString() // Pass the current date
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
