const mysql = require('mysql2');
const mysql5 = require('mysql2/promise');
const mysql1= require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const { format, addYears } = require('date-fns');
const moment = require('moment-timezone');
const bcrypt = require('bcrypt');
const app = express();
const port = 8081;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname);
app.set('view engine', 'ejs');
app.set('views', [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'data-entry/admin-data/views-admin-data'),
    path.join(__dirname, 'data-entry/compnay-data/views-compnay-data'),
    path.join(__dirname, 'data-entry/e-commerce-data/e-commerce-views'),
    path.join(__dirname, 'data-entry/shop-data/views-shop-data'),
    path.join(__dirname, 'data-entry/others-data/views-others-data'),
    path.join(__dirname, 'data-manegment/Ingredients/views-Ingredients'),
    path.join(__dirname, 'data-manegment/Product/product-views'),
    path.join(__dirname, 'data-manegment/disease-panel/disease-views'),
    path.join(__dirname, 'shop/shop-pos-views'),
    path.join(__dirname, 'compnay/compnay-views'),
    path.join(__dirname, 'e-commerce-side'),
    path.join(__dirname, 'disease-report'),
    path.join(__dirname, 'email/views-email'),
    path.join(__dirname, 'email/e-commerce-email'),
    path.join(__dirname, 'email/others-email'),
    path.join(__dirname, 'email/shop-email'),
    path.join(__dirname, 'email/views-email-compnay')

]);
app.use(express.static(path.join(__dirname, 'data-entry')));
app.use(express.static(path.join(__dirname, 'shop')));
app.use(express.static(path.join(__dirname, 'compnay')));
app.use(express.static(path.join(__dirname, 'email')));
app.use(express.static(path.join(__dirname, 'e-commerce-side')));
app.use(express.static(path.join(__dirname, 'disease-report')));
app.use(express.static(path.join(__dirname, 'Admin-Panel')));
app.use(express.static(path.join(__dirname, 'data-manegment')));
app.use(express.static(path.join(__dirname, 'img')));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const connection66 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'yousufdbs'
});

const connection55 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'product'
});

const connection666 = mysql1.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'yousufdbs'
});

const connection555 = mysql1.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'product'
});








async function connectToDatabase() {
    const connection855 = await mysql5.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "product"
    });
    return connection855;
  }
  
  // Function to convert sales date to year, month, week number, and season
  function convertSalesDate(sales_time) {
    const date = new Date(sales_time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekNumber = Math.ceil(day / 7);
  
    let season = '';
    switch (true) {
      case month >= 1 && month <= 3:
        season = 'Winter';
        break;
      case month >= 4 && month <= 6:
        season = 'Spring';
        break;
      case month >= 7 && month <= 9:
        season = 'Summer';
        break;
      case month >= 10 && month <= 12:
        season = 'Autumn';
        break;
      default:
        season = 'Unknown';
    }
  
    return {
      year,
      month,
      weekNumber,
      season
    };
  }
  
  // Function to calculate the percentages and ProductionPrediction
  function calculatePrediction(data, currentYear, currentMonth, currentSeason, prevYearMonthSales, physicalStock) {
    const ThisYearSales = data.ThisYearSales;
    const LastYearSales = data.LastYearSales;
    const ThisSeasonSales = data.ThisSeasonSales;
    const LastSeasonSales = data.LastSeasonSales;
    const ThisMonthAllSales = data.ThisMonthAllSales;
    const ThisWeekAllSales = data.ThisWeekAllSales;
    const LastDaySales = data.LastDaySales;
  
    const value_1 = LastSeasonSales ? ((ThisSeasonSales / LastSeasonSales) * 100) - 100 : 0;
    const value_2 = LastYearSales ? ((ThisYearSales / currentMonth) / (LastYearSales / 12) * 100) - 100 : 0;
    const value_3 = LastSeasonSales ? ((ThisMonthAllSales / (LastSeasonSales / 3)) * 100) - 100 : 0;
    const value_4 = LastSeasonSales ? ((ThisWeekAllSales / (LastSeasonSales / 3 / 4)) * 100) - 100 : 0;
    const value_5 = LastSeasonSales ? ((LastDaySales / (LastSeasonSales / 3 / 30)) * 100) - 100 : 0;
  
    let ProductionTem;
    if (!LastYearSales && !LastSeasonSales) {
      const value_6 = ThisWeekAllSales * 2;
      const value_7 = LastDaySales * 10;
      ProductionTem = value_6 + value_7;
    } else {
      ProductionTem = prevYearMonthSales * (1 + (value_1 + value_2 + value_3 + (value_4 / 2) + (value_5 / 3)) / 100);
    }
  
    const ProductionPrediction = ProductionTem - physicalStock;
    return ProductionPrediction < 0 ? 0 : ProductionPrediction; // Ensure ProductionPrediction is not less than 0
  }
  
  async function main() {
    const connection855 = await connectToDatabase();
  
    try {
      const [rows] = await connection855.query('SELECT * FROM xyz1_shop_sales_datas');
  
      // Aggregate data by product_id
      const aggregatedData = rows.reduce((acc, row) => {
        if (!acc[row.product_id]) {
          acc[row.product_id] = {
            product_id: row.product_id,
            product_name: row.product_name,
            product_weight: parseInt(row.product_weight, 10),
            company_name: row.company_name,
            total_quantity: 0,
            sales: []
          };
        }
        acc[row.product_id].total_quantity += row.product_quantity;
        acc[row.product_id].sales.push(row);
        return acc;
      }, {});
  
      const updatePromises = Object.values(aggregatedData).map(async data => {
        const { product_id, product_name, product_weight, company_name, total_quantity, sales } = data;
  
        // Get current date details
        const currentYear = moment().year();
        const currentMonth = moment().month() + 1;
        const currentSeason = convertSalesDate(new Date()).season;
        const startOfWeek = moment().startOf('week').toDate();
        const endOfWeek = moment().endOf('week').toDate();
        const lastDay = moment().subtract(1, 'days').toDate();
        const lastYear = currentYear - 1;
        const lastYearSeason = convertSalesDate(new Date(moment().subtract(1, 'years'))).season;
  
        // Calculate sales data
        const ThisYearSales = sales.filter(r => moment(r.sales_time).year() === currentYear).reduce((sum, r) => sum + r.product_quantity, 0);
        const ThisMonthAllSales = sales.filter(r => moment(r.sales_time).year() === currentYear && moment(r.sales_time).month() + 1 === currentMonth).reduce((sum, r) => sum + r.product_quantity, 0);
        const ThisSeasonSales = sales.filter(r => convertSalesDate(r.sales_time).season === currentSeason && moment(r.sales_time).year() === currentYear).reduce((sum, r) => sum + r.product_quantity, 0);
        const ThisWeekAllSales = sales.filter(r => r.sales_time >= startOfWeek && r.sales_time <= endOfWeek).reduce((sum, r) => sum + r.product_quantity, 0);
        const LastDaySales = sales.filter(r => moment(r.sales_time).isSame(lastDay, 'day')).reduce((sum, r) => sum + r.product_quantity, 0);
        const LastYearSales = sales.filter(r => moment(r.sales_time).year() === lastYear).reduce((sum, r) => sum + r.product_quantity, 0);
        const LastSeasonSales = sales.filter(r => convertSalesDate(r.sales_time).season === lastYearSeason && moment(r.sales_time).year() === lastYear).reduce((sum, r) => sum + r.product_quantity, 0);
  
        // Fetch PhysicalStock and LastProductionQuantity from copmay_medicine_stock table
        const [[stockRecord]] = await connection855.query('SELECT updateStock, lastproduction FROM copmay_medicine_stock WHERE id = ?', [product_id]);
        const physicalStock = stockRecord ? stockRecord.updateStock : 0;
        const LastProductionQuantity = stockRecord ? stockRecord.lastproduction : 0;
  
        // Check if ProductionPrediction should be updated
        let shouldUpdateProductionPrediction = true;
  
        // Condition 1: LastProductionQuantity <= PhysicalStock
        if (LastProductionQuantity <= physicalStock) {
          shouldUpdateProductionPrediction = false;
        }
  
        // Condition 2: Gap between PhysicalStock and LastProductionQuantity is 10% or less
        if (Math.abs((physicalStock - LastProductionQuantity) / LastProductionQuantity) <= 0.1) {
          shouldUpdateProductionPrediction = false;
        }
  
        if (shouldUpdateProductionPrediction) {
          // Calculate previous year monthly sales
          const prevYearMonthSales = LastYearSales / 12;
  
          // Calculate ProductionPrediction
          const ProductionPrediction = calculatePrediction({
            ThisYearSales,
            LastYearSales,
            ThisSeasonSales,
            LastSeasonSales,
            ThisMonthAllSales,
            ThisWeekAllSales,
            LastDaySales
          }, currentYear, currentMonth, currentSeason, prevYearMonthSales, physicalStock);
  
          // Prepare data for update or insertion
          const updateData = {
            product_id,
            product_name,
            product_weight,
            company_name,
            LastYearSales,
            LastSeasonSales,
            ThisYearSales,
            ThisSeasonSales,
            LastDaySales,
            ThisWeekAllSales,
            ThisMonthAllSales,
            LastProductionQuantity: LastProductionQuantity || 0, // Default to 0 if no value
            PhysicalStock: physicalStock,
            ProductionPrediction: ProductionPrediction.toFixed(2)
          };
  
          // Check if product_id already exists in production_prediction_database
          const [existingRows] = await connection855.query('SELECT * FROM production_prediction_database WHERE product_id = ?', [product_id]);
  
          if (existingRows.length > 0) {
            // If product_id exists, update the existing record
            const updateQuery = `
              UPDATE production_prediction_database
              SET 
                product_name = ?,
                product_weight = ?,
                company_name = ?,
                LastYearSales = ?,
                LastSeasonSales = ?,
                ThisYearSales = ?,
                ThisSeasonSales = ?,
                LastDaySales = ?,
                ThisWeekAllSales = ?,
                ThisMonthAllSales = ?,
                LastProductionQuantity = ?,
                PhysicalStock = ?,
                ProductionPrediction = ?
              WHERE product_id = ?
            `;
            
            await connection855.query(updateQuery, [
              updateData.product_name,
              updateData.product_weight,
              updateData.company_name,
              updateData.LastYearSales,
              updateData.LastSeasonSales,
              updateData.ThisYearSales,
              updateData.ThisSeasonSales,
              updateData.LastDaySales,
              updateData.ThisWeekAllSales,
              updateData.ThisMonthAllSales,
              updateData.LastProductionQuantity,
              updateData.PhysicalStock,
              updateData.ProductionPrediction,
              product_id
            ]);
          } else {
            // If product_id does not exist, insert a new record
            const insertQuery = `
              INSERT INTO production_prediction_database
              SET ?
            `;
            
            await connection855.query(insertQuery, [updateData]);
          }
        }
      });
  
      await Promise.all(updatePromises);
      console.log('All data updated successfully.');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await connection855.end();
    }
  }









function synchronizeData(connection) {
    // Query to insert/update data from xyz1_shop_sales_datas
    const syncQuery1 = `
        INSERT INTO all_shop_sales_datas (id, product_id, product_name, product_weight, ingredient_name, product_type, company_name, product_quantity, sales_time)
        SELECT id, product_id, product_name, product_weight, ingredient_name, product_type, company_name, product_quantity, sales_time
        FROM xyz1_shop_sales_datas
        ON DUPLICATE KEY UPDATE
        product_name = VALUES(product_name),
        product_weight = VALUES(product_weight),
        ingredient_name = VALUES(ingredient_name),
        product_type = VALUES(product_type),
        company_name = VALUES(company_name),
        product_quantity = VALUES(product_quantity),
        sales_time = VALUES(sales_time);
    `;

    // Query to insert/update data from xyz2_shop_sales_datas
    const syncQuery2 = `
        INSERT INTO all_shop_sales_datas (id, product_id, product_name, product_weight, ingredient_name, product_type, company_name, product_quantity, sales_time)
        SELECT id, product_id, product_name, product_weight, ingredient_name, product_type, company_name, product_quantity, sales_time
        FROM xyz2_shop_sales_datas
        ON DUPLICATE KEY UPDATE
        product_name = VALUES(product_name),
        product_weight = VALUES(product_weight),
        ingredient_name = VALUES(ingredient_name),
        product_type = VALUES(product_type),
        company_name = VALUES(company_name),
        product_quantity = VALUES(product_quantity),
        sales_time = VALUES(sales_time);
    `;

    // Execute queries
    connection55.query(syncQuery1, (err, result1) => {
        if (err) {
            console.error('Error synchronizing data from xyz1_shop_sales_datas:', err.stack);
            return;
        }
        

        connection55.query(syncQuery2, (err, result2) => {
            if (err) {
                console.error('Error synchronizing data from xyz2_shop_sales_datas:', err.stack);
                return;
            }
            

            // Close connection after synchronization
            // connection.end(err => {
            //     if (err) {
            //         console.error('Error ending the connection:', err.stack);
            //     } else {
            //         console.log('Connection ended.');
            //     }
            // });
        });
    });
}

// Connect to the databases and start synchronization
connection55.connect(err => {
    if (err) {
        console.error('Error connecting to the database connection55:', err.stack);
        return;
    }
    

    synchronizeData(connection55); // Synchronize data using connection66
});

connection55.connect(err => {
    if (err) {
        console.error('Error connecting to the database connection55:', err.stack);
        return;
    }
    

    // Uncomment this line if you want to synchronize data using connection55
    // synchronizeData(connection55);
});



// Step 1: Copy data from xyz1_shop to all_shop_stock initially
const copyDataInitially = () => {
    const query = `
        INSERT INTO all_shop_stock
        (product_id, product_name, product_weight, product_type, company_name, shop_name, shop_area, price, shop_stock)
        SELECT
            xyz1.product_id,
            xyz1.product_name,
            xyz1.product_weight,
            xyz1.product_type,
            xyz1.company_name,
            xyz1.shop_name,
            xyz1.shop_area,
            xyz1.price,
            xyz1.shop_stock
        FROM
            xyz1_shop AS xyz1
        ON DUPLICATE KEY UPDATE
            product_name = xyz1.product_name,
            product_weight = xyz1.product_weight,
            product_type = xyz1.product_type,
            company_name = xyz1.company_name,
            shop_name = xyz1.shop_name,
            shop_area = xyz1.shop_area,
            price = xyz1.price,
            shop_stock = xyz1.shop_stock;
    `;
    connection55.query(query, (err, result) => {
        if (err) throw err;
        
        // Start monitoring changes after initial copy
        monitorChanges();
    });
};

// Step 2: Implement continuous monitoring in Node.js
const monitorChanges = () => {
    // Here you can implement logic to continuously monitor changes in all_shop_stock
    // For simplicity, let's log the data from all_shop_stock periodically
    setInterval(() => {
        const query = 'SELECT * FROM all_shop_stock';
        connection55.query(query, (err, rows) => {
            if (err) throw err;
            
        });
    }, 5000); // Adjust the interval as needed
};

// Connect to the database and initiate initial data copy
connection55.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
  

    // Call function to copy initial data and start monitoring changes
    copyDataInitially();
});























app.get('/', (req, res) => {
    res.render('login', { error: null });
});

// Route to handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    connection66.query('SELECT * FROM admins_info WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error executing login query:', err);
            return res.status(500).send('Database query error');
        }
        if (results.length > 0) {
            req.session.user = results[0];
            res.redirect('/dash_board');
        } else {
            res.render('login', { error: 'Invalid username or password' });
        }
    });
});



// Route to render the dash_board
app.get('/dash_board', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    const queries = [
       
        { table: 'Compnay', query: 'SELECT COUNT(*) AS count FROM admin_compnay' },
        { table: 'Shop', query: 'SELECT COUNT(*) AS count FROM admin_shop_id' },
        { table: 'E_Commerce', query: 'SELECT COUNT(*) AS count FROM admin_e_commerce' },
        { table: 'Others', query: 'SELECT COUNT(*) AS count FROM admin_others_id' }
    ];

    let results = [];
    let completedQueries = 0;

    queries.forEach((queryObj, index) => {
        connection66.query(queryObj.query, (error, queryResults) => {
            if (error) {
                console.error(`Error executing query for ${queryObj.table}:`, error.stack);
                res.status(500).send('Database query error');
                return;
            }

            results[index] = { table: queryObj.table, count: queryResults[0].count };
            completedQueries++;

            if (completedQueries === queries.length) {
                // Fetching photos
                connection66.query('SELECT mime_type, photo FROM admins_info', (err, photos) => {
                    if (err) {
                        console.error('Error fetching photos:', err);
                        res.status(500).send('Database query error');
                        return;
                    }

                    res.render('dash_board', { results: results, user: req.session.user, photos: photos });
                });
            }
        });
    });
});


app.get('/aboutd', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    
                connection66.query('SELECT mime_type, photo FROM admins_info', (err, photos) => {
                    if (err) {
                        console.error('Error fetching photos:', err);
                        res.status(500).send('Database query error');
                        return;
                    }

                    res.render('about', { user: req.session.user, photos: photos });
                });
            
});

app.get('/create_id_home', (req, res) => {
  res.sendFile(path.join(__dirname, 'data-entry', 'create_id_home.html'));
});



// Admin Routes
app.get('/admin-home', (req, res) => {
    connection66.query("SELECT * FROM admins_info", (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("admin-home", { admins_info: result });
        }
    });
});

app.get('/admin-search', (req, res) => {
    const { id, name, mobileNumber, email } = req.query;
    const sql = "SELECT * FROM admins_info WHERE id LIKE ? AND name LIKE ? AND mobileNumber LIKE ? AND email LIKE ?";
    const values = [`%${id}%`, `%${name}%`, `%${mobileNumber}%`, `%${email}%`];

    connection66.query(sql, values, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("admin-home", { admins_info: result });
        }
    });
});

app.get('/admin-detalies/:id', (req, res) => {
    const adminId = req.params.id;
    connection66.query('SELECT * FROM admins_info WHERE id = ?', [adminId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('admin-detalies', { admin: results[0] });
        } else {
            res.send('Admin not found');
        }
    });
});

app.post('/admin-update', upload.single('photo'), (req, res) => {
    const { id, name, username, address, mobileNumber, email, type, nidNumber, password } = req.body;
    const photo = req.file;

    if (photo) {
        const mimeType = photo.mimetype;
        const photoData = photo.buffer;
        connection66.query('UPDATE admins_info SET name = ?, username = ?, address = ?, mobileNumber = ?, email = ?, type = ?, nidNumber = ?, password = ?, mime_type = ?, photo = ? WHERE id = ?', 
            [name, username, address, mobileNumber, email, type, nidNumber, password, mimeType, photoData, id], (err, result) => {
            if (err) throw err;
            res.redirect('/admin-home'); // Redirect to admin list after update
        });
    } else {
        connection66.query('UPDATE admins_info SET name = ?, username = ?, address = ?, mobileNumber = ?, email = ?, type = ?, nidNumber = ?, password = ? WHERE id = ?', 
            [name, username, address, mobileNumber, email, type, nidNumber, password, id], (err, result) => {
            if (err) throw err;
            res.redirect('/admin-home'); // Redirect to admin list after update
        });
    }
});

app.post('/admin-delete/:id', (req, res) => {
    const adminId = req.params.id;
    connection66.query('DELETE FROM admins_info WHERE id = ?', [adminId], (err, result) => {
        if (err) throw err;
        res.redirect('/admin-home'); // Redirect to home page after deletion
    });
});

app.get('/admin-form', (req, res) => {
    res.render('admin-form', { error: null });
});

app.post('/admin-id', upload.single('photo'), (req, res) => {
    const { names, username, address, mobileNumber, email, type, nidNumber, password } = req.body;
    const photo = req.file;

    // Check if username, email, or mobileNumber already exist
    connection66.query('SELECT * FROM admins_info WHERE username = ? OR email = ? OR mobileNumber = ?', [username, email, mobileNumber], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // If any of the fields already exist, render the form with an error message
            return res.render('admin-form', { error: 'Username, Email, or Mobile Number already exists' });
        }

        if (photo) {
            const mimeType = photo.mimetype;
            const photoData = photo.buffer;

            connection66.query('INSERT INTO admins_info (name, username, address, mobileNumber, email, type, nidNumber, password, mime_type, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [names, username, address, mobileNumber, email, type, nidNumber, password, mimeType, photoData], (err, result) => {
                if (err) throw err;
                res.redirect('/admin-home');
            });
        } else {
            res.send('No photo uploaded');
        }
    });
});

// Company Routes
app.get('/compnay-home', (req, res) => {
    connection66.query("SELECT * FROM admin_compnay", (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("compnay-home", { admin_compnay: result });
        }
    });
});

app.get('/compnay-search', (req, res) => {
    const { id, companyName, mobileNumber, email } = req.query;
    const sql = "SELECT * FROM admin_compnay WHERE id LIKE ? AND companyName LIKE ? AND mobileNumber LIKE ? AND email LIKE ?";
    const values = [`%${id}%`, `%${companyName}%`, `%${mobileNumber}%`, `%${email}%`];

    connection66.query(sql, values, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("compnay-home", { admin_compnay: result });
        }
    });
});

app.get('/compnay-detalies/:id', (req, res) => {
    const adminId = req.params.id;
    connection66.query('SELECT * FROM admin_compnay WHERE id = ?', [adminId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('compnay-detalies', { admin: results[0] });
        } else {
            res.send('Admin not found');
        }
    });
});

app.post('/compnay-update', upload.single('photo'), (req, res) => {
    const { id, companyName, username, address, mobileNumber, email, type, nidNumber, password } = req.body;
    const photo = req.file;

    if (photo) {
        const mimeType = photo.mimetype;
        const photoData = photo.buffer;
        connection66.query('UPDATE admin_compnay SET companyName = ?, username = ?, address = ?, mobileNumber = ?, email = ?, type = ?, nidNumber = ?, password = ?, mime_type = ?, photo = ? WHERE id = ?', 
            [companyName, username, address, mobileNumber, email, type, nidNumber, password, mimeType, photoData, id], (err, result) => {
            if (err) throw err;
            res.redirect('/compnay-home'); // Redirect to admin list after update
        });
    } else {
        connection66.query('UPDATE admin_compnay SET companyName = ?, username = ?, address = ?, mobileNumber = ?, email = ?, type = ?, nidNumber = ?, password = ? WHERE id = ?', 
            [companyName, username, address, mobileNumber, email, type, nidNumber, password, id], (err, result) => {
            if (err) throw err;
            res.redirect('/compnay-home'); // Redirect to admin list after update
        });
    }
});

app.post('/compnay-delete/:id', (req, res) => {
    const adminId = req.params.id;
    connection66.query('DELETE FROM admin_compnay WHERE id = ?', [adminId], (err, result) => {
        if (err) throw err;
        res.redirect('/compnay-home'); // Redirect to home page after deletion
    });
});

app.get('/compnay-form', (req, res) => {
    res.render('compnay-form', { error: null });
});

app.post('/compnay-id', upload.single('photo'), (req, res) => {
    const { companyName, username, person, mobileNumber, email, address, type, nidNumber, tradeLicense, tinNumber, bankAccountName, bankAccountNumber, bankBranchName, password } = req.body;
    const photo = req.file;

    // Check if username, email, or mobileNumber already exist
    connection66.query('SELECT * FROM admin_compnay WHERE username = ? OR email = ? OR mobileNumber = ?', [username, email, mobileNumber], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // If any of the fields already exist, render the form with an error message
            return res.render('compnay-form', { error: 'Username, Email, or Mobile Number already exists' });
        }

        if (photo) {
            const mimeType = photo.mimetype;
            const photoData = photo.buffer;

            connection66.query('INSERT INTO admin_compnay (companyName, username, person, mobileNumber, email, address, type, nidNumber, tradeLicense, tinNumber, bankAccountName, bankAccountNumber, bankBranchName, password, mime_type, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [companyName, username, person, mobileNumber, email, address, type, nidNumber, tradeLicense, tinNumber, bankAccountName, bankAccountNumber, bankBranchName, password, mimeType, photoData], (err, result) => {
                if (err) throw err;
                res.redirect('/compnay-home');
            });
        } else {
            res.send('No photo uploaded');
        }
    });
});

// E-Commerce Routes
app.get('/e-commerce-home', (req, res) => {
    connection66.query("SELECT * FROM admin_e_commerce", (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("e-commerce-home", { admin_e_commerce: result });
        }
    });
});

app.get('/E-Commerce-search', (req, res) => {
    const { id, name, mobileNumber, email } = req.query;
    const sql = "SELECT * FROM admin_e_commerce WHERE id LIKE ? AND name LIKE ? AND mobileNumber LIKE ? AND email LIKE ?";
    const values = [`%${id}%`, `%${name}%`, `%${mobileNumber}%`, `%${email}%`];

    connection66.query(sql, values, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("e-commerce-home", { admin_e_commerce: result });
        }
    });
});

app.get('/e-commerce-detalies/:id', (req, res) => {
    const adminId = req.params.id;
    connection66.query('SELECT * FROM admin_e_commerce WHERE id = ?', [adminId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('e-commerce-detalies', { admin: results[0] });
        } else {
            res.send('Admin not found');
        }
    });
});

app.post('/e-commerce-update', upload.single('photo'), (req, res) => {
    const { id, name, username, address, mobileNumber, email, nidNumber, password } = req.body;
    const photo = req.file;

    if (photo) {
        const mimeType = photo.mimetype;
        const photoData = photo.buffer;
        connection66.query('UPDATE admin_e_commerce SET name = ?, username = ?, address = ?, mobileNumber = ?, email = ?, nidNumber = ?, password = ?, mime_type = ?, photo = ? WHERE id = ?', 
            [name, username, address, mobileNumber, email, nidNumber, password, mimeType, photoData, id], (err, result) => {
            if (err) throw err;
            res.redirect('/e-commerce-home'); // Redirect to admin list after update
        });
    } else {
        connection66.query('UPDATE admin_e_commerce SET name = ?, username = ?, address = ?, mobileNumber = ?, email = ?, nidNumber = ?, password = ? WHERE id = ?', 
            [name, username, address, mobileNumber, email, nidNumber, password, id], (err, result) => {
            if (err) throw err;
            res.redirect('/e-commerce-home'); // Redirect to admin list after update
        });
    }
});

app.post('/e-commerce-delete/:id', (req, res) => {
    const adminId = req.params.id;
    connection66.query('DELETE FROM admin_e_commerce WHERE id = ?', [adminId], (err, result) => {
        if (err) throw err;
        res.redirect('/e-commerce-home'); // Redirect to home page after deletion
    });
});

app.get('/e-commerce-form', (req, res) => {
    res.render('e-commerce-form', { error: null });
});

app.post('/e-commerce-id', upload.single('photo'), (req, res) => {
    const { name, username, person, mobileNumber, email, address, nidNumber, tradeLicense, tinNumber, bankAccountName, bankAccountNumber, bankBranchName, password } = req.body;
    const photo = req.file;

    // Check if username, email, or mobileNumber already exist
    connection66.query('SELECT * FROM admin_e_commerce WHERE username = ? OR email = ? OR mobileNumber = ?', [username, email, mobileNumber], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // If any of the fields already exist, render the form with an error message
            return res.render('e-commerce-form', { error: 'Username, Email, or Mobile Number already exists' });
        }

        if (photo) {
            const mimeType = photo.mimetype;
            const photoData = photo.buffer;

            connection66.query('INSERT INTO admin_e_commerce (name, username, person, mobileNumber, email, address, nidNumber, tradeLicense, tinNumber, bankAccountName, bankAccountNumber, bankBranchName, password, mime_type, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [name, username, person, mobileNumber, email, address, nidNumber, tradeLicense, tinNumber, bankAccountName, bankAccountNumber, bankBranchName, password, mimeType, photoData], (err, result) => {
                if (err) throw err;
                res.redirect('/e-commerce-home');
            });
        } else {
            res.send('No photo uploaded');
        }
    });
});

// Others Routes
app.get('/others-home', (req, res) => {
    connection66.query("SELECT * FROM admin_others_id", (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("others-home", { admin_others_id: result });
        }
    });
});

app.get('/others-search', (req, res) => {
    const { id, name, mobileNumber, email } = req.query;
    const sql = "SELECT * FROM admin_others_id WHERE id LIKE ? AND name LIKE ? AND mobileNumber LIKE ? AND email LIKE ?";
    const values = [`%${id}%`, `%${name}%`, `%${mobileNumber}%`, `%${email}%`];

    connection66.query(sql, values, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("others-home", { admin_others_id: result });
        }
    });
});

app.get('/others-detalies/:id', (req, res) => {
    const adminId = req.params.id;
    connection66.query('SELECT * FROM admin_others_id WHERE id = ?', [adminId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('others-detalies', { admin: results[0] });
        } else {
            res.send('Admin not found');
        }
    });
});

app.post('/others-update', upload.single('photo'), (req, res) => {
    const { id, name, username, address, mobileNumber, email, type, nidNumber, password } = req.body;
    const photo = req.file;

    if (photo) {
        const mimeType = photo.mimetype;
        const photoData = photo.buffer;
        connection66.query('UPDATE admin_others_id SET name = ?, username = ?, address = ?, mobileNumber = ?, email = ?, type = ?, nidNumber = ?, password = ?, mime_type = ?, photo = ? WHERE id = ?', 
            [name, username, address, mobileNumber, email, type, nidNumber, password, mimeType, photoData, id], (err, result) => {
            if (err) throw err;
            res.redirect('/others-home'); // Redirect to admin list after update
        });
    } else {
        connection66.query('UPDATE admin_others_id SET name = ?, username = ?, address = ?, mobileNumber = ?, email = ?, type = ?, nidNumber = ?, password = ? WHERE id = ?', 
            [name, username, address, mobileNumber, email, type, nidNumber, password, id], (err, result) => {
            if (err) throw err;
            res.redirect('/others-home'); // Redirect to admin list after update
        });
    }
});

app.post('/others-delete/:id', (req, res) => {
    const adminId = req.params.id;
    connection66.query('DELETE FROM admin_others_id WHERE id = ?', [adminId], (err, result) => {
        if (err) throw err;
        res.redirect('/others-home'); // Redirect to home page after deletion
    });
});

app.get('/others-form', (req, res) => {
    res.render('others-form', { error: null });
});

app.post('/others-id', upload.single('photo'), (req, res) => {
    const { name, username, person, mobileNumber, email, address, type, nidNumber, tradeLicense, tinNumber, bankAccountName, bankAccountNumber, bankBranchName, password } = req.body;
    const photo = req.file;

    // Check if username, email, or mobileNumber already exist
    connection66.query('SELECT * FROM admin_others_id WHERE username = ? OR email = ? OR mobileNumber = ?', [username, email, mobileNumber], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // If any of the fields already exist, render the form with an error message
            return res.render('others-form', { error: 'Username, Email, or Mobile Number already exists' });
        }

        if (photo) {
            const mimeType = photo.mimetype;
            const photoData = photo.buffer;

            connection66.query('INSERT INTO admin_others_id (name, username, person, mobileNumber, email, address, type, nidNumber, tradeLicense, tinNumber, bankAccountName, bankAccountNumber, bankBranchName, password, mime_type, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [name, username, person, mobileNumber, email, address, type, nidNumber, tradeLicense, tinNumber, bankAccountName, bankAccountNumber, bankBranchName, password, mimeType, photoData], (err, result) => {
                if (err) throw err;
                res.redirect('/others-home');
            });
        } else {
            res.send('No photo uploaded');
        }
    });
});

// Shop Routes
app.get('/shop-home', (req, res) => {
    connection66.query("SELECT * FROM admin_shop_id", (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("shop-home", { admin_shop_id: result });
        }
    });
});

app.get('/shop-search', (req, res) => {
    const { id, name, area, type, mobileNumber, email } = req.query;
    const sql = "SELECT * FROM admin_shop_id WHERE (id LIKE ? OR ? IS NULL OR ? = '') AND (name LIKE ? OR ? IS NULL OR ? = '') AND (area LIKE ? OR ? IS NULL OR ? = '') AND (type LIKE ? OR ? IS NULL OR ? = '') AND (mobileNumber LIKE ? OR ? IS NULL OR ? = '') AND (email LIKE ? OR ? IS NULL OR ? = '')";
    const values = [`%${id}%`, id, id, `%${name}%`, name, name, `%${area}%`, area, area, `%${type}%`, type, type, `%${mobileNumber}%`, mobileNumber, mobileNumber, `%${email}%`, email, email];

    connection66.query(sql, values, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("shop-home", { admin_shop_id: result });
        }
    });
});

app.get('/shop-detalies/:id', (req, res) => {
    const adminId = req.params.id;
    connection66.query('SELECT * FROM admin_shop_id WHERE id = ?', [adminId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('shop-detalies', { admin: results[0] });
        } else {
            res.send('Admin not found');
        }
    });
});

app.post('/shop-update', upload.single('photo'), (req, res) => {
    const { id, name, username, address, mobileNumber, email, area, nidNumber, type, password } = req.body;
    const photo = req.file;

    if (photo) {
        const mimeType = photo.mimetype;
        const photoData = photo.buffer;
        connection66.query('UPDATE admin_shop_id SET name = ?, username = ?, address = ?, mobileNumber = ?, email = ?, area = ?, nidNumber = ?, type = ?, password = ?, mime_type = ?, photo = ? WHERE id = ?', 
            [name, username, address, mobileNumber, email, area, nidNumber, type, password, mimeType, photoData, id], (err, result) => {
            if (err) throw err;
            res.redirect('/shop-home'); // Redirect to admin list after update
        });
    } else {
        connection66.query('UPDATE admin_shop_id SET name = ?, username = ?, address = ?, mobileNumber = ?, email = ?, area = ?, nidNumber = ?, type = ?, password = ? WHERE id = ?', 
            [name, username, address, mobileNumber, email, area, nidNumber, type, password, id], (err, result) => {
            if (err) throw err;
            res.redirect('/shop-home'); // Redirect to admin list after update
        });
    }
});

app.post('/shop-delete/:id', (req, res) => {
    const adminId = req.params.id;
    connection66.query('DELETE FROM admin_shop_id WHERE id = ?', [adminId], (err, result) => {
        if (err) throw err;
        res.redirect('/shop-home'); // Redirect to home page after deletion
    });
});

app.get('/shop-form', (req, res) => {
    res.render('shop-form', { error: null });
});

app.post('/shop-id', upload.single('photo'), (req, res) => {
    const { name, username, person, mobileNumber, email, address, area, nidNumber, tradeLicense, tinNumber, type, bankAccountName, bankAccountNumber, bankBranchName, password } = req.body;
    const photo = req.file;

    // Check if username, email, or mobileNumber already exist
    connection66.query('SELECT * FROM admin_shop_id WHERE username = ? OR email = ? OR mobileNumber = ?', [username, email, mobileNumber], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // If any of the fields already exist, render the form with an error message
            return res.render('shop-form', { error: 'Username, Email, or Mobile Number already exists' });
        }

        if (photo) {
            const mimeType = photo.mimetype;
            const photoData = photo.buffer;

            connection66.query('INSERT INTO admin_shop_id (name, username, person, mobileNumber, email, address, area, nidNumber, tradeLicense, tinNumber, type, bankAccountName, bankAccountNumber, bankBranchName, password, mime_type, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [name, username, person, mobileNumber, email, address, area, nidNumber, tradeLicense, tinNumber, type, bankAccountName, bankAccountNumber, bankBranchName, password, mimeType, photoData], (err, result) => {
                if (err) throw err;
                res.redirect('/shop-home');
            });
        } else {
            res.send('No photo uploaded');
        }
    });
});


















app.get('/all-panel', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'all-panel.html'));
});


app.get('/login_shop', (req, res) => {
    const user15 = { name: 'John Doe' }; // Replace with actual user data

    // Rendering login page and passing data to EJS template
    res.render('login_shop', { user15: user15, error: null });
});

// Route to handle login submission
app.post('/login_shop', (req, res) => {
    const { username, password } = req.body;
    connection66.query('SELECT * FROM admin_shop_id WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error executing login query:', err);
            return res.status(500).send('Database query error');
        }
        if (results.length > 0) {
            req.session.user15 = results[0]; // Set session for user15
            res.redirect('/shop-pos-panel');
        } else {
            res.render('login_shop', { error: 'Invalid username or password' });
        }
    });
});

// Route to company panel
app.get('/shop-pos-panel', (req, res) => {
    res.render('shop-pos-panel', { user15: req.session.user15 });
});



app.get('/pos_xyz', (req, res) => {
    res.render('pos_xyz', { xyz1_shop: [] });
  });
  
  app.get('/sales-prodct-search', (req, res) => {
  const { product_id, product_name, product_weight, product_type, company_name } = req.query;
  const sql = `
    SELECT * FROM xyz1_shop 
    WHERE product_id LIKE ? 
    AND product_name LIKE ? 
    AND product_weight LIKE ? 
    AND product_type LIKE ? 
    AND company_name LIKE ?
  `;
  const values = [`%${product_id}%`, `%${product_name}%`, `%${product_weight}%`, `%${product_type}%`, `%${company_name}%`];
  
  connection555.query(sql, values, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
  });
  
  app.post('/submit-sales-data', (req, res) => {
      const salesData = req.body;
  
      const sql1 = 'INSERT INTO xyz1_shop_sales_report (sales_details) VALUES (?)';
      const values1 = [JSON.stringify(salesData)];
  
      connection555.query(sql1, values1, (error, results) => {
          if (error) {
              console.error('Error inserting sales data into xyz1_shop_sales_report:', error);
              return res.status(500).send('Error inserting sales data into xyz1_shop_sales_report');
          } else {
              
  
              const sql2 = `INSERT INTO xyz1_shop_sales_datas 
                (product_id, product_name, product_weight, product_type, company_name, product_quantity, sales_time) 
                VALUES ?`;
  
              const values2 = salesData.products.map(product => [
                  product.product_id,
                  product.product_name,
                  product.product_weight,
                  product.product_type,
                  product.company_name,
                  product.quantity,
                  'CURRENT_TIMESTAMP' // Placeholder to match columns count, will be replaced in query
              ]);
  
              // Convert the array of arrays to a string and replace the placeholder
              const values2Str = values2.map(row => `(${row.map(val => connection555.escape(val)).join(', ').replace("'CURRENT_TIMESTAMP'", 'CURRENT_TIMESTAMP')})`).join(', ');
  
              connection555.query(sql2.replace('?', values2Str), (error, results) => {
                  if (error) {
                      console.error('Error inserting product details into xyz1_shop_sales_datas:', error);
                      return res.status(500).send('Error inserting product details into xyz1_shop_sales_datas');
                  } else {
                      
  
                      const updateStockQueries = salesData.products.map(product => {
                          return new Promise((resolve, reject) => {
                              const sql3 = `
                                UPDATE xyz1_shop 
                                SET shop_stock = shop_stock - ? 
                                WHERE product_id = ?
                              `;
                              const values3 = [product.quantity, product.product_id];
                              connection555.query(sql3, values3, (error, results) => {
                                  if (error) {
                                      console.error(`Error updating shop_stock for product_id ${product.product_id}:`, error);
                                      reject(error);
                                  } else {
                                    
                                      resolve();
                                  }
                              });
                          });
                      });
  
                      Promise.all(updateStockQueries)
                          .then(() => {
                             
                              res.status(200).send('Sales data submitted successfully');
                          })
                          .catch(error => {
                              console.error('Error updating stock quantities:', error);
                              res.status(500).send('Error updating stock quantities');
                          });
                  }
              });
          }
      });
  });
  



  app.get('/sales_report', (req, res) => {
    const sql = "SELECT * FROM xyz1_shop_sales_report";
    connection55.query(sql, (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
        res.render('sales_report', { salesReports: results });
    });
});

// Route to display sales report details
app.get('/sales_report_detalis/:id', (req, res) => {
    const reportId = req.params.id;
    const sql = "SELECT * FROM xyz1_shop_sales_report WHERE id = ?";
    connection55.query(sql, [reportId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            const salesDetails = JSON.parse(results[0].sales_details);
            // Adding the id to salesDetails for rendering in the template
            salesDetails.id = results[0].id;
            res.render('sales_report_detalis', { salesDetails });
        } else {
            res.status(404).send('Sales report not found');
        }
    });
});




app.get('/shop-online-order', function(req, res) {
    connection55.query("SELECT * FROM product_database", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("shop-online-order", { product_database: result });
        }
    });
});



app.get('/online-product-search', function(req, res) {
    const { id, productName, companyName } = req.query;
    const sql = "SELECT * FROM product_database WHERE id LIKE ? AND productName LIKE ? AND companyName LIKE ?";
    const values = [`%${id}%`, `%${productName}%`, `%${companyName}%`];

    connection55.query(sql, values, function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("shop-online-order", { product_database: result });
        }
    });
});




app.get('/shop-order-review', function(req, res) {
    connection55.query("SELECT * FROM shop_product_order_review", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("shop-order-review", { shop_product_order_review: result });
        }
    });
});

app.post('/cancel-item', function(req, res) {
    const itemId = req.body.id;
    const sql = "DELETE FROM shop_product_order_review WHERE id = ?";
    connection55.query(sql, [itemId], function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/shop-order-review');
        }
    });
});

// Route to search products

app.get('/online-product-details', function(req, res) {
    const id = req.query.id;
    const sql = "SELECT * FROM product_database WHERE id=?";

    connection55.query(sql, [id], function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render("online-product-details", { product_database: result });
        }
    });
});

app.post('/submit-product', (req, res) => {
    console.log('Received JSON data:', req.body);

    const { Id, 'Product Name': productName, 'Product Pcs': productPcs, Weight, Company, 'Product Type': productType, single_price, box_price, discount, Quantity, a_d_b_price } = req.body;

    if (!Id || !productName || !productPcs || !Weight || !Company || !productType || !single_price || !box_price || !discount || !Quantity || !a_d_b_price) {
        return res.status(400).send('All fields are required');
    }

    const sql = 'INSERT INTO shop_product_order_review (id, product_name, product_pcs, weight, company, product_type, single_price, box_price, discount, quantity, a_d_b_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [Id, productName, productPcs, Weight, Company, productType, single_price, box_price, discount, Quantity, a_d_b_price];

    connection55.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            return res.status(500).send('Error inserting data into MySQL');
        }
        
        res.sendStatus(200);
    });
});

app.post('/your-endpoint', (req, res) => {
    const jsonData = req.body;
   

    // Iterate over JSON data
    jsonData.forEach(item => {
        const companyName = item['Company'];
        const tableName = `${companyName}`; // Adjust the table naming convention as per your database structure

        // Check if the table exists
        const checkTableSql = `SHOW TABLES LIKE '${tableName}'`;
        connection55.query(checkTableSql, (err, result) => {
            if (err) {
                console.error('Error checking if table exists:', err);
                return;
            }

            if (result.length === 0) {
                console.error(`Table '${tableName}' does not exist.`);
                return;
            }

            // Check if single_price is not null
            if (item['Single Price'] === null) {
                console.error(`Error: 'single_price' cannot be null for item ${item['Id']}. Skipping insertion.`);
                return;
            }

            // Table exists and single_price is not null, insert data into it
            const sql = `INSERT INTO ${tableName} (product_id, product_name, product_pcs, weight, company, product_type, single_price, box_price, discount, quantity, a_d_b_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [item['Id'], item['Product Name'], item['Product Pcs'], item['Weight'], item['Company'], item['Product Type'], item['Single Price'], item['Box Price'], item['Discount'], item['Quantity'], item['A.D.B.Price']];

            connection55.query(sql, values, (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    return;
                }
                

                // Delete all records from shop_product_order_review after successful insertion
                connection55.query("DELETE FROM shop_product_order_review", (err, result) => {
                    if (err) {
                        console.error('Error deleting data from shop_product_order_review:', err);
                        return;
                    }
                   
                });
            });
        });
    });

    res.sendStatus(200); // Sending back a success response
});






app.get('/xyz1_shop_invoice', (req, res) => {
    const sql = "SELECT * FROM xyz1_shop_invoice";
    connection55.query(sql, (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
        // Format the date_time field
        results.forEach(invoice => {
            invoice.date_time = moment(invoice.date_time).tz('Asia/Dhaka').format('DD-MM-YYYY');
        });
        res.render('xyz1_shop_invoice', { invoices: results });
    });
});

// Route to display invoice details
app.get('/shop-invoice-details/:id', (req, res) => {
    const invoiceId = req.params.id;
    const sql = "SELECT * FROM xyz1_shop_invoice WHERE id = ?";
    connection55.query(sql, [invoiceId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            const invoice = results[0];
            invoice.date_time = moment(invoice.date_time).tz('Asia/Dhaka').format('DD-MM-YYYY');
            const invoiceDetails = JSON.parse(invoice.invoice);
            res.render('shop-invoice-details', { invoice, invoiceDetails });
        } else {
            res.status(404).send('Invoice not found');
        }
    });
});

// Route to delete invoice
app.delete('/shop-invoice-delete/:id', (req, res) => {
    const invoiceId = req.params.id;
    const sql = "DELETE FROM xyz1_shop_invoice WHERE id = ?";
    connection55.query(sql, [invoiceId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).send('Invoice deleted successfully');
    });
});

// Route to save invoice and update stock
app.post('/shop-invoice-save/:id', (req, res) => {
    const invoiceId = req.params.id;
    const getInvoiceSql = "SELECT * FROM xyz1_shop_invoice WHERE id = ?";
    connection55.query(getInvoiceSql, [invoiceId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            const invoice = results[0];
            const invoiceDetails = JSON.parse(invoice.invoice);
            const date_time = moment().tz('Asia/Dhaka').format('YYYY-MM-DD');

            // Insert into xyz1_shop_stock_invoice_history
            const insertHistorySql = `INSERT INTO xyz1_shop_stock_invoice_history (company, invoice, date_time) VALUES (?, ?, ?)`;
            const insertHistoryValues = [invoice.company, JSON.stringify(invoiceDetails), date_time];
            connection55.query(insertHistorySql, insertHistoryValues, (historyError, historyResult) => {
                if (historyError) {
                    console.log(historyError);
                    return res.status(500).send('Internal Server Error');
                }

                // Update xyz1_shop stock
                const updateStockPromises = invoiceDetails.map(item => {
                    return new Promise((resolve, reject) => {
                        const updateStockSql = `UPDATE xyz1_shop SET shop_stock = shop_stock + ? WHERE product_id = ?`;
                        const updateStockValues = [item.quantity, item.product_id];
                        connection55.query(updateStockSql, updateStockValues, (updateError, updateResult) => {
                            if (updateError) {
                                return reject(updateError);
                            }
                            resolve(updateResult);
                        });
                    });
                });

                Promise.all(updateStockPromises)
                    .then(() => {
                        // Delete the invoice from xyz1_shop_invoice
                        const deleteInvoiceSql = "DELETE FROM xyz1_shop_invoice WHERE id = ?";
                        connection55.query(deleteInvoiceSql, [invoiceId], (deleteError, deleteResult) => {
                            if (deleteError) {
                                console.log(deleteError);
                                return res.status(500).send('Internal Server Error');
                            }
                            res.status(200).send('Invoice saved and stock updated successfully');
                        });
                    })
                    .catch(updateError => {
                        console.log(updateError);
                        res.status(500).send('Internal Server Error');
                    });
            });
        } else {
            res.status(404).send('Invoice not found');
        }
    });
});





















app.get('/shop_invoice_history', (req, res) => {
    const sql = "SELECT * FROM xyz1_shop_stock_invoice_history";
    connection55.query(sql, (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
        // Format the date_time field
        results.forEach(invoice => {
            invoice.date_time = moment(invoice.date_time).tz('Asia/Dhaka').format('DD-MM-YYYY');
        });
        res.render('shop_invoice_history', { invoices: results });
    });
});

// Route to display invoice details
app.get('/shop_invoice_history_detalis/:id', (req, res) => {
    const invoiceId = req.params.id;
    const sql = "SELECT * FROM xyz1_shop_stock_invoice_history WHERE id = ?";
    connection55.query(sql, [invoiceId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            const invoice = results[0];
            invoice.date_time = moment(invoice.date_time).tz('Asia/Dhaka').format('DD-MM-YYYY');
            const invoiceDetails = JSON.parse(invoice.invoice);
            res.render('shop_invoice_history_detalis', { invoice, invoiceDetails });
        } else {
            res.status(404).send('Invoice not found');
        }
    });
});

























  




























app.get('/login-e-commerce', (req, res) => {
    // Example retrieval of user and photos data from database
    const user13 = { name: 'John Doe' }; // Replace with actual user data

    // Query to fetch photos from database
    connection66.query('SELECT mime_type, photo FROM admin_e_commerce', (err, results) => {
        if (err) {
            console.error('Error fetching photos from database:', err);
            res.render('error', { message: 'Error fetching photos from database' });
            return;
        }
        
        // Convert binary photo data to base64
        const photos = results.map(photo => ({
            mime_type: photo.mime_type,
            photo: Buffer.from(photo.photo).toString('base64')
        }));

        // Rendering login page and passing data to EJS template
        res.render('login-e-commerce', { user13: user13, photos: photos, error: null });
    });
});

// Route to handle login submission
app.post('/login-e-commerce', (req, res) => {
    const { username, password } = req.body;
    connection66.query('SELECT * FROM admin_e_commerce WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error executing login query:', err);
            return res.status(500).send('Database query error');
        }
        if (results.length > 0) {
            req.session.user13 = results[0]; // Set session for user13
            res.redirect('/e-commerce-profile');
        } else {
            res.render('login-e-commerce', { error: 'Invalid username or password' });
        }
    });
});

// Route to render the e-commerce-profile page
app.get('/e-commerce-profile', (req, res) => {
    if (req.session.user13) {
        const query = `
            SELECT plan, created_at, plan_end_date 
            FROM payments 
            WHERE user_name = ? AND plan_end_date >= CURRENT_DATE
        `;
        connection55.query(query, [req.session.user13.username], (err, results) => {
            if (err) {
                console.error('Error fetching data from MySQL:', err);
                res.status(500).send('Error fetching data from database');
                return;
            }

            const plans = results.map(plan => ({
                ...plan,
                created_at: format(new Date(plan.created_at), 'dd MMM yyyy'),
                plan_end_date: format(new Date(plan.plan_end_date), 'dd MMM yyyy')
            }));

            const message = req.query.message || null;
            res.render('e-commerce-profile', { user13: req.session.user13, plans, message });
        });
    } else {
        res.redirect('/login-e-commerce');
    }
});

// Middleware to check subscription status
function checkSubscription(req, res, next) {
    if (!req.session.user14) {
        return res.redirect('/login-e-commerce');
    }

    const query = `
        SELECT plan_end_date 
        FROM payments 
        WHERE user_name = ? 
        ORDER BY plan_end_date DESC 
        LIMIT 1
    `;
    connection55.query(query, [req.session.user14.username], (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            res.status(500).send('Error fetching data from database');
            return;
        }

        if (results.length === 0) {
            // No active plans found, redirect to purchase page or show an error
            return res.redirect('/e-commerce-profile?message=No%20active%20subscription%20found.%20Please%20purchase%20a%20plan.');
        }

        const planEndDate = new Date(results[0].plan_end_date);
        const currentDate = new Date();

        if (planEndDate >= currentDate) {
            next(); // User has an active subscription, proceed to the next middleware/route handler
        } else {
            res.redirect('/e-commerce-profile?message=Your%20subscription%20has%20expired.%20Please%20renew%20your%20plan.');
        }
    });
}

app.post('/payment-ill_report', (req, res) => {
    const data = req.body;

    // Log the incoming JSON data
   

    const { plan, amount, card_type, card_number, cardholder_name, expiration_date, cvv, userName } = data;

    // Get the current date
    const currentDate = new Date();
    const formattedCurrentDate = format(currentDate, 'yyyy-MM-dd');

    // Calculate the plan end date (assuming plan is in years)
    const years_count = parseInt(plan.match(/\d+/)[0]); // Extract years_count from plan (assuming format like '2nd Year')
    const planEndDate = addYears(currentDate, years_count);
    const formattedPlanEndDate = format(planEndDate, 'yyyy-MM-dd');

    const query = `INSERT INTO payments (plan, amount, card_type, card_number, cardholder_name, expiration_date, cvv, user_name, created_at, plan_end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [plan, amount, card_type, card_number, cardholder_name, expiration_date, cvv, userName, formattedCurrentDate, formattedPlanEndDate];

    

    connection55.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).json({ success: false, message: 'Error inserting data into database' });
            return;
        }
        
        res.json({ success: true, message: 'Payment data saved successfully' });
    });
});





app.get('/payment-history-e-commerce', (req, res) => {
    if (!req.session.user13) {
        return res.redirect('/login-e-commerce');
    }

    const query = `
        SELECT plan, amount, cardholder_name, card_type, created_at, plan_end_date 
        FROM payments 
        WHERE user_name = ? 
        ORDER BY created_at DESC
    `;
    
    connection55.query(query, [req.session.user13.username], (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            res.status(500).send('Error fetching data from database');
            return;
        }

        const payments = results.map(payment => ({
            plan: payment.plan,
            amount: payment.amount,
            cardholder_name: payment.cardholder_name,
            card_type: payment.card_type,
            created_at: format(new Date(payment.created_at), 'dd MMM yyyy'),
            plan_end_date: format(new Date(payment.plan_end_date), 'dd MMM yyyy')
        }));

        res.render('payment-history-e-commerce', { user13: req.session.user13, payments });
    });
});


app.get('/e-commerce-panel', checkSubscription2, (req, res) => {
    // If the user has a valid subscription, render the company panel page
    res.render('e-commerce-panel', { user13: req.session.user13 });
});


app.get('/Ingredients_detalies', (req, res) => {
    res.render('Ingredients_detalies', { error: null });
});


app.get('/ingredients_home', function(req, res) {
    connection55.query("SELECT * FROM new_ingredient_final", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('ingredients_home', { new_ingredient_final: result });
        }
    });
  });


  app.get('/Ingredients_detalies/:id', (req, res) => {
    const ingredientId = req.params.id;
    const sql = 'SELECT * FROM new_ingredient_final WHERE id = ?';
    connection55.query(sql, [ingredientId], (err, results) => {
      if (err) {
        console.error('Error fetching data from MySQL:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }
      if (results.length === 0) {
        // If no data found for the given ID, handle accordingly
        res.status(404).send('Ingredient not found');
        return;
      }
      // Parse the JSON strings in the results
      results.forEach(item => {
        item.problems = JSON.parse(item.problems);
        item.main_conditions = JSON.parse(item.main_conditions);
        item.warnings = JSON.parse(item.warnings);
      });
      // Render the 'Ingredients_detalies' template, passing the data to be displayed
      res.render('Ingredients_detalies', { data: results });
    });
});




app.get('/e-commerce', function(req, res) {
    connection55.query("SELECT * FROM all_shop_stock", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('e-commerce', { all_shop_stock: result });
        }
    });
});

// Route to search products
app.get('/e-commerce-search', function(req, res) {
    const { product_id, product_name, company_name, shop_area } = req.query;

    

    let sql = "SELECT * FROM all_shop_stock WHERE 1=1";
    const values = [];

    if (product_id) {
        sql += " AND product_id LIKE ?";
        values.push(`%${product_id}%`);
    }
    if (product_name) {
        sql += " AND product_name LIKE ?";
        values.push(`%${product_name}%`);
    }
    if (company_name) {
        sql += " AND company_name LIKE ?";
        values.push(`%${company_name}%`);
    }
    if (shop_area) {
        sql += " AND shop_area LIKE ?";
        values.push(`%${shop_area}%`);
    }

    

    connection55.query(sql, values, function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
         
            res.render('e-commerce', { all_shop_stock: result });
        }
    });
});

















app.get('/login-ill_report', (req, res) => {
    // Example retrieval of user and photos data from database
    const user11 = { name: 'John Doe' }; // Replace with actual user data

    // Query to fetch photos from database
    connection66.query('SELECT mime_type, photo FROM admin_others_id', (err, results) => {
        if (err) {
            console.error('Error fetching photos from database:', err);
            res.render('error', { message: 'Error fetching photos from database' });
            return;
        }
        
        // Convert binary photo data to base64
        const photos = results.map(photo => ({
            mime_type: photo.mime_type,
            photo: Buffer.from(photo.photo).toString('base64')
        }));

        // Rendering login page and passing data to EJS template
        res.render('login-ill_report', { user11: user11, photos: photos, error: null });
    });
});

// Route to handle login submission
app.post('/login-ill_report', (req, res) => {
    const { username, password } = req.body;
    connection66.query('SELECT * FROM admin_others_id WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error executing login query:', err);
            return res.status(500).send('Database query error');
        }
        if (results.length > 0) {
            req.session.user11 = results[0]; // Set session for user11
            res.redirect('/ill_report-profile');
        } else {
            res.render('login-ill_report', { error: 'Invalid username or password' });
        }
    });
});

// Route to render the ill_report-profile page
app.get('/ill_report-profile', (req, res) => {
    if (req.session.user11) {
        const query = `
            SELECT plan, created_at, plan_end_date 
            FROM payments 
            WHERE user_name = ? AND plan_end_date >= CURRENT_DATE
        `;
        connection55.query(query, [req.session.user11.username], (err, results) => {
            if (err) {
                console.error('Error fetching data from MySQL:', err);
                res.status(500).send('Error fetching data from database');
                return;
            }

            const plans = results.map(plan => ({
                ...plan,
                created_at: format(new Date(plan.created_at), 'dd MMM yyyy'),
                plan_end_date: format(new Date(plan.plan_end_date), 'dd MMM yyyy')
            }));

            const message = req.query.message || null;
            res.render('ill_report-profile', { user11: req.session.user11, plans, message });
        });
    } else {
        res.redirect('/login-ill_report');
    }
});

// Middleware to check subscription status
function checkSubscription(req, res, next) {
    if (!req.session.user12) {
        return res.redirect('/login-ill_report');
    }

    const query = `
        SELECT plan_end_date 
        FROM payments 
        WHERE user_name = ? 
        ORDER BY plan_end_date DESC 
        LIMIT 1
    `;
    connection55.query(query, [req.session.user12.username], (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            res.status(500).send('Error fetching data from database');
            return;
        }

        if (results.length === 0) {
            // No active plans found, redirect to purchase page or show an error
            return res.redirect('/ill_report-profile?message=No%20active%20subscription%20found.%20Please%20purchase%20a%20plan.');
        }

        const planEndDate = new Date(results[0].plan_end_date);
        const currentDate = new Date();

        if (planEndDate >= currentDate) {
            next(); // User has an active subscription, proceed to the next middleware/route handler
        } else {
            res.redirect('/ill_report-profile?message=Your%20subscription%20has%20expired.%20Please%20renew%20your%20plan.');
        }
    });
}

app.post('/payment-ill_report', (req, res) => {
    const data = req.body;

    // Log the incoming JSON data
    

    const { plan, amount, card_type, card_number, cardholder_name, expiration_date, cvv, userName } = data;

    // Get the current date
    const currentDate = new Date();
    const formattedCurrentDate = format(currentDate, 'yyyy-MM-dd');

    // Calculate the plan end date (assuming plan is in years)
    const years_count = parseInt(plan.match(/\d+/)[0]); // Extract years_count from plan (assuming format like '2nd Year')
    const planEndDate = addYears(currentDate, years_count);
    const formattedPlanEndDate = format(planEndDate, 'yyyy-MM-dd');

    const query = `INSERT INTO payments (plan, amount, card_type, card_number, cardholder_name, expiration_date, cvv, user_name, created_at, plan_end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [plan, amount, card_type, card_number, cardholder_name, expiration_date, cvv, userName, formattedCurrentDate, formattedPlanEndDate];

    

    connection55.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).json({ success: false, message: 'Error inserting data into database' });
            return;
        }
        
        res.json({ success: true, message: 'Payment data saved successfully' });
    });
});





app.get('/payment-history-ill_report', (req, res) => {
    if (!req.session.user11) {
        return res.redirect('/login-ill_report');
    }

    const query = `
        SELECT plan, amount, cardholder_name, card_type, created_at, plan_end_date 
        FROM payments 
        WHERE user_name = ? 
        ORDER BY created_at DESC
    `;
    
    connection55.query(query, [req.session.user11.username], (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            res.status(500).send('Error fetching data from database');
            return;
        }

        const payments = results.map(payment => ({
            plan: payment.plan,
            amount: payment.amount,
            cardholder_name: payment.cardholder_name,
            card_type: payment.card_type,
            created_at: format(new Date(payment.created_at), 'dd MMM yyyy'),
            plan_end_date: format(new Date(payment.plan_end_date), 'dd MMM yyyy')
        }));

        res.render('payment-history-ill_report', { user11: req.session.user11, payments });
    });
});

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
app.get('/Ill-report', (req, res) => {
    const currentDate = new Date();
    const currentSeason = getCurrentSeason(currentDate);
    const commonDiseases = seasonDiseases[currentSeason];

    

    const query = `
        SELECT d.diseaseName, SUM(m.product_quantity) as total_sales
        FROM xyz1_shop_sales_datas m
        JOIN new_ingredient_final i ON m.ingredient_name = i.ingredient_name
        JOIN disease_info d ON JSON_CONTAINS(d.ingredient_name, JSON_QUOTE(i.ingredient_name), '$')
        GROUP BY d.diseaseName
        ORDER BY total_sales DESC
    `;

    

    connection55.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }

        

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



















app.get('/email-panel', (req, res) => {
    const username = req.session.user ? req.session.user.username : null;

    if (!username) {
        return res.redirect('/');
    }

    // Fetch user's emails from the database
    connection55.query('SELECT * FROM all_emails_data WHERE recipient = ?', [username], (err, results) => {
        if (err) {
            console.error('Error executing email query:', err);
            return res.status(500).send('Database query error');
        }

        // Fetch user's photos from the database
        connection66.query('SELECT * FROM admins_info WHERE username = ?', [username], (err, photos) => {
            if (err) {
                console.error('Error fetching photos:', err);
                return res.status(500).send('Database query error');
            }

            // Render the email panel with user's emails and photos
            res.render('email-panel', { all_emails_data: results, user: req.session.user, photos: photos });
        });
    });
});

app.get('/email-panel-send', (req, res) => {
    const username = req.session.user ? req.session.user.username : null;

    if (!username) {
        return res.redirect('/');
    }

    // Fetch user's sent emails from the database
    connection55.query('SELECT * FROM all_emails_data WHERE sender = ?', [username], (err, results) => {
        if (err) {
            console.error('Error executing email query:', err);
            return res.status(500).send('Database query error');
        }

        // Fetch user's photos from the database
        connection66.query('SELECT * FROM admins_info WHERE username = ?', [username], (err, photos) => {
            if (err) {
                console.error('Error fetching photos:', err);
                return res.status(500).send('Database query error');
            }

            // Render the email panel with user's emails and photos
            res.render('email-panel-send', { all_emails_data: results, user: req.session.user, photos: photos });
        });
    });
});

app.get('/compose', (req, res) => {
    const username = req.session.user ? req.session.user.username : null;
    
    if (!username) {
        return res.redirect('/');
    }

    // Fetch user's photos from the database
    connection66.query('SELECT * FROM admins_info WHERE username = ?', [username], (err, photos) => {
        if (err) {
            console.error('Error fetching photos:', err);
            return res.status(500).send('Database query error');
        }
        res.render('compose', { user: req.session.user, photos: photos });
    });
});

app.post('/send-email', upload.single('attachment'), (req, res) => {
    if (!req.session.user) {
        return res.redirect('/'); // Redirect to login if not logged in
    }

    const { to, subject, body } = req.body;
    const from = req.session.user.username;
    const attachment = req.file ? req.file.buffer : null;
    const mimeType = req.file ? req.file.mimetype : null;
    const fileName = req.file ? req.file.originalname : null;

    const query = 'INSERT INTO all_emails_data (sender, recipient, subject, body, attachment, mime_type, file_name) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection55.query(query, [from, to, subject, body, attachment, mimeType, fileName], (err, result) => {
        if (err) {
            console.error('Error inserting email into database:', err);
            return res.status(500).send('Database insert error');
        }
        res.redirect('/email-panel-send');
    });
});


app.get('/email-sms/:id', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/'); // Redirect to login if not logged in
    }

    

    const emailId = req.params.id;
    const username = req.session.user.username;

    const query = 'SELECT * FROM all_emails_data WHERE id = ? AND (sender = ? OR recipient = ?)';
    connection55.query(query, [emailId, username, username], (err, results) => {
        if (err) {
            console.error('Error fetching email details:', err);
            return res.status(500).send('Database query error');
        }

        if (results.length === 0) {
            return res.status(404).send('Email not found');
        }

        const email = results[0];
        res.render('email-sms', { email });
    });
});







app.get('/download-attachment/:id', (req, res) => {
    const emailId = req.params.id;

    const query = 'SELECT attachment, mime_type, file_name FROM all_emails_data WHERE id = ?';
    connection55.query(query, [emailId], (err, results) => {
        if (err) {
            console.error('Error fetching attachment:', err);
            return res.status(500).send('Database query error');
        }

        if (results.length === 0) {
            return res.status(404).send('Attachment not found');
        }

        const email = results[0];
        res.setHeader('Content-Disposition', 'attachment; filename=' + email.file_name);
        res.setHeader('Content-Type', email.mime_type);
        res.send(email.attachment);
    });
});







app.get('/email-panel_company', (req, res) => {
    if (!req.session.user21) {
        return res.redirect('/login-compnay-admin'); // Redirect to login if not logged in
    }

    const username = req.session.user21.username;

    connection55.query('SELECT * FROM all_emails_data WHERE recipient = ?', [username], (err, results) => {
        if (err) {
            console.error('Error executing email query:', err);
            return res.status(500).send('Database query error');
        }

        connection66.query('SELECT * FROM admin_compnay WHERE username = ?', [username], (err, photos) => {
            if (err) {
                console.error('Error fetching photos:', err);
                return res.status(500).send('Database query error');
            }

            res.render('email-panel_company', { all_emails_data: results, user21: req.session.user21, photos: photos });
        });
    });
});

app.get('/email-panel-send_compnay', (req, res) => {
    if (!req.session.user21) {
        return res.redirect('/login-compnay-admin'); // Redirect to login if not logged in
    }

    const username = req.session.user21.username;

    connection55.query('SELECT * FROM all_emails_data WHERE sender = ?', [username], (err, results) => {
        if (err) {
            console.error('Error executing email query:', err);
            return res.status(500).send('Database query error');
        }

        connection66.query('SELECT * FROM admin_compnay WHERE username = ?', [username], (err, photos) => {
            if (err) {
                console.error('Error fetching photos:', err);
                return res.status(500).send('Database query error');
            }

            res.render('email-panel-send_compnay', { all_emails_data: results, user21: req.session.user21, photos: photos });
        });
    });
});

app.get('/compose_company', (req, res) => {
    if (!req.session.user21) {
        return res.redirect('/login-compnay-admin'); // Redirect to login if not logged in
    }

    const username = req.session.user21.username;
    
    connection66.query('SELECT * FROM admin_compnay WHERE username = ?', [username], (err, photos) => {
        if (err) {
            console.error('Error fetching photos:', err);
            return res.status(500).send('Database query error');
        }
        res.render('compose_company', { user21: req.session.user21, photos: photos });
    });
});

app.post('/send-email_compnay', upload.single('attachment'), (req, res) => {
    if (!req.session.user21) {
        return res.redirect('/login-compnay-admin'); // Redirect to login if not logged in
    }

    const { to, subject, body } = req.body;
    const from = req.session.user21.username;
    const attachment = req.file ? req.file.path : null;

    const query = 'INSERT INTO all_emails_data (sender, recipient, subject, body, attachment) VALUES (?, ?, ?, ?, ?)';
    connection55.query(query, [from, to, subject, body, attachment], (err, result) => {
        if (err) {
            console.error('Error inserting email into database:', err);
            return res.status(500).send('Database insert error');
        }
        res.redirect('/compose_company');
    });
});



app.get('/email-sms-compnay/:id', (req, res) => {
    if (!req.session.user21) {
        return res.redirect('/login-compnay-admin'); // Redirect to login if not logged in
    }

    const emailId = req.params.id;
    const username = req.session.user21.username;

    const query = 'SELECT * FROM all_emails_data WHERE id = ? AND (sender = ? OR recipient = ?)';
    connection55.query(query, [emailId, username, username], (err, results) => {
        if (err) {
            console.error('Error fetching email details:', err);
            return res.status(500).send('Database query error');
        }

        if (results.length === 0) {
            return res.status(404).send('Email not found');
        }

        const email = results[0];
        res.render('email-sms-compnay', { email });
    });
});






























app.get('/email-panel_e-commerce', (req, res) => {
    if (!req.session.user13) {
        return res.redirect('/login-e-commerce'); // Redirect to login if not logged in
    }

    const username = req.session.user13.username;

    connection55.query('SELECT * FROM all_emails_data WHERE recipient = ?', [username], (err, results) => {
        if (err) {
            console.error('Error executing email query:', err);
            return res.status(500).send('Database query error');
        }

        connection66.query('SELECT * FROM admin_e_commerce WHERE username = ?', [username], (err, photos) => {
            if (err) {
                console.error('Error fetching photos:', err);
                return res.status(500).send('Database query error');
            }

            res.render('email-panel_e-commerce', { all_emails_data: results, user13: req.session.user13, photos: photos });
        });
    });
});

app.get('/email-panel-send_e-commerce', (req, res) => {
    if (!req.session.user13) {
        return res.redirect('/login-e-commerce'); // Redirect to login if not logged in
    }

    const username = req.session.user13.username;

    connection55.query('SELECT * FROM all_emails_data WHERE sender = ?', [username], (err, results) => {
        if (err) {
            console.error('Error executing email query:', err);
            return res.status(500).send('Database query error');
        }

        connection66.query('SELECT * FROM admin_e_commerce WHERE username = ?', [username], (err, photos) => {
            if (err) {
                console.error('Error fetching photos:', err);
                return res.status(500).send('Database query error');
            }

            res.render('email-panel-send_e-commerce', { all_emails_data: results, user13: req.session.user13, photos: photos });
        });
    });
});

app.get('/compose_e-commerce', (req, res) => {
    if (!req.session.user13) {
        return res.redirect('/login-e-commerce'); // Redirect to login if not logged in
    }

    const username = req.session.user13.username;
    
    connection66.query('SELECT * FROM admin_e_commerce WHERE username = ?', [username], (err, photos) => {
        if (err) {
            console.error('Error fetching photos:', err);
            return res.status(500).send('Database query error');
        }
        res.render('compose_e-commerce', { user13: req.session.user13, photos: photos });
    });
});

app.post('/send-email_e-commerce', upload.single('attachment'), (req, res) => {
    if (!req.session.user13) {
        return res.redirect('/login-e-commerce'); // Redirect to login if not logged in
    }

    const { to, subject, body } = req.body;
    const from = req.session.user13.username;
    const attachment = req.file ? req.file.path : null;

    const query = 'INSERT INTO all_emails_data (sender, recipient, subject, body, attachment) VALUES (?, ?, ?, ?, ?)';
    connection55.query(query, [from, to, subject, body, attachment], (err, result) => {
        if (err) {
            console.error('Error inserting email into database:', err);
            return res.status(500).send('Database insert error');
        }
        res.redirect('/compose_e-commerce');
    });
});



app.get('/email-sms-e-commerce/:id', (req, res) => {
    if (!req.session.user13) {
        return res.redirect('/login-e-commerce'); // Redirect to login if not logged in
    }

    const emailId = req.params.id;
    const username = req.session.user13.username;

    const query = 'SELECT * FROM all_emails_data WHERE id = ? AND (sender = ? OR recipient = ?)';
    connection55.query(query, [emailId, username, username], (err, results) => {
        if (err) {
            console.error('Error fetching email details:', err);
            return res.status(500).send('Database query error');
        }

        if (results.length === 0) {
            return res.status(404).send('Email not found');
        }

        const email = results[0];
        res.render('email-sms-e-commerce', { email });
    });
});




























app.get('/email-panel_shop', (req, res) => {
    if (!req.session.user15) {
        return res.redirect('/login_shop'); // Redirect to login if not logged in
    }

    const username = req.session.user15.username;

    connection55.query('SELECT * FROM all_emails_data WHERE recipient = ?', [username], (err, results) => {
        if (err) {
            console.error('Error executing email query:', err);
            return res.status(500).send('Database query error');
        }

        connection66.query('SELECT * FROM admin_shop_id WHERE username = ?', [username], (err, photos) => {
            if (err) {
                console.error('Error fetching photos:', err);
                return res.status(500).send('Database query error');
            }

            res.render('email-panel_shop', { all_emails_data: results, user15: req.session.user15, photos: photos });
        });
    });
});

app.get('/email-panel-send_shop', (req, res) => {
    if (!req.session.user15) {
        return res.redirect('/login_shop'); // Redirect to login if not logged in
    }

    const username = req.session.user15.username;

    connection55.query('SELECT * FROM all_emails_data WHERE sender = ?', [username], (err, results) => {
        if (err) {
            console.error('Error executing email query:', err);
            return res.status(500).send('Database query error');
        }

        connection66.query('SELECT * FROM admin_shop_id WHERE username = ?', [username], (err, photos) => {
            if (err) {
                console.error('Error fetching photos:', err);
                return res.status(500).send('Database query error');
            }

            res.render('email-panel-send_shop', { all_emails_data: results, user15: req.session.user15, photos: photos });
        });
    });
});

app.get('/compose_shop', (req, res) => {
    if (!req.session.user15) {
        return res.redirect('/login_shop'); // Redirect to login if not logged in
    }

    const username = req.session.user15.username;
    
    connection66.query('SELECT * FROM admin_shop_id WHERE username = ?', [username], (err, photos) => {
        if (err) {
            console.error('Error fetching photos:', err);
            return res.status(500).send('Database query error');
        }
        res.render('compose_shop', { user15: req.session.user15, photos: photos });
    });
});

app.post('/send-email_shop', upload.single('attachment'), (req, res) => {
    if (!req.session.user15) {
        return res.redirect('/login_shop'); // Redirect to login if not logged in
    }

    const { to, subject, body } = req.body;
    const from = req.session.user15.username;
    const attachment = req.file ? req.file.path : null;

    const query = 'INSERT INTO all_emails_data (sender, recipient, subject, body, attachment) VALUES (?, ?, ?, ?, ?)';
    connection55.query(query, [from, to, subject, body, attachment], (err, result) => {
        if (err) {
            console.error('Error inserting email into database:', err);
            return res.status(500).send('Database insert error');
        }
        res.redirect('/compose_shop');
    });
});



app.get('/email-sms-shop/:id', (req, res) => {
    if (!req.session.user15) {
        return res.redirect('/login_shop'); // Redirect to login if not logged in
    }

    const emailId = req.params.id;
    const username = req.session.user15.username;

    const query = 'SELECT * FROM all_emails_data WHERE id = ? AND (sender = ? OR recipient = ?)';
    connection55.query(query, [emailId, username, username], (err, results) => {
        if (err) {
            console.error('Error fetching email details:', err);
            return res.status(500).send('Database query error');
        }

        if (results.length === 0) {
            return res.status(404).send('Email not found');
        }

        const email = results[0];
        res.render('email-sms-shop', { email });
    });
});


















app.get('/email-panel_others', (req, res) => {
    if (!req.session.user11) {
        return res.redirect('/login-ill_report'); // Redirect to login if not logged in
    }

    const username = req.session.user11.username;

    connection55.query('SELECT * FROM all_emails_data WHERE recipient = ?', [username], (err, results) => {
        if (err) {
            console.error('Error executing email query:', err);
            return res.status(500).send('Database query error');
        }

        connection66.query('SELECT * FROM admin_others_id WHERE username = ?', [username], (err, photos) => {
            if (err) {
                console.error('Error fetching photos:', err);
                return res.status(500).send('Database query error');
            }

            res.render('email-panel_others', { all_emails_data: results, user11: req.session.user11, photos: photos });
        });
    });
});

app.get('/email-panel-send_others', (req, res) => {
    if (!req.session.user11) {
        return res.redirect('/login-ill_report'); // Redirect to login if not logged in
    }

    const username = req.session.user11.username;

    connection55.query('SELECT * FROM all_emails_data WHERE sender = ?', [username], (err, results) => {
        if (err) {
            console.error('Error executing email query:', err);
            return res.status(500).send('Database query error');
        }

        connection66.query('SELECT * FROM admin_others_id WHERE username = ?', [username], (err, photos) => {
            if (err) {
                console.error('Error fetching photos:', err);
                return res.status(500).send('Database query error');
            }

            res.render('email-panel-send_others', { all_emails_data: results, user11: req.session.user11, photos: photos });
        });
    });
});

app.get('/compose_others', (req, res) => {
    if (!req.session.user11) {
        return res.redirect('/login-ill_report'); // Redirect to login if not logged in
    }

    const username = req.session.user11.username;
    
    connection66.query('SELECT * FROM admin_others_id WHERE username = ?', [username], (err, photos) => {
        if (err) {
            console.error('Error fetching photos:', err);
            return res.status(500).send('Database query error');
        }
        res.render('compose_others', { user11: req.session.user11, photos: photos });
    });
});

app.post('/send-email_others', upload.single('attachment'), (req, res) => {
    if (!req.session.user11) {
        return res.redirect('/login-ill_report'); // Redirect to login if not logged in
    }

    const { to, subject, body } = req.body;
    const from = req.session.user11.username;
    const attachment = req.file ? req.file.buffer : null;
    const mimeType = req.file ? req.file.mimetype : null;
    const fileName = req.file ? req.file.originalname : null;

    const query = 'INSERT INTO all_emails_data (sender, recipient, subject, body, attachment, mime_type, file_name) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection55.query(query, [from, to, subject, body, attachment, mimeType, fileName], (err, result) => {
        if (err) {
            console.error('Error inserting email into database:', err);
            return res.status(500).send('Database insert error');
        }
        res.redirect('/compose_others');
    });
});



app.get('/email-sms-otherss/:id', (req, res) => {
    if (!req.session.user11) {
        return res.redirect('/login-ill_report'); // Redirect to login if not logged in
    }

    const emailId = req.params.id;
    const username = req.session.user11.username;

    const query = 'SELECT * FROM all_emails_data WHERE id = ? AND (sender = ? OR recipient = ?)';
    connection55.query(query, [emailId, username, username], (err, results) => {
        if (err) {
            console.error('Error fetching email details:', err);
            return res.status(500).send('Database query error');
        }

        if (results.length === 0) {
            return res.status(404).send('Email not found');
        }

        const email = results[0];
        res.render('email-sms-otherss', { email });
    });
});






























  app.get('/data-management-panel', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'data-management-panel.html'));
  });




  app.get('/ingredients-home', function(req, res) {
    connection55.query("SELECT * FROM new_ingredient_final", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('ingredients-home', { new_ingredient_final: result });
        }
    });
  });
  
  app.get('/ingredients-search', function(req, res) {
    const { id, ingredient_name, weight, ingredient_type } = req.query;
    const sql = "SELECT * FROM new_ingredient_final WHERE id LIKE ? AND ingredient_name LIKE ? AND weight LIKE ? AND ingredient_type LIKE ?";
    const values = [`%${id}%`, `%${ingredient_name}%`, `%${weight}%`, `%${ingredient_type}%`];
    connection55.query(sql, values, function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('ingredients-home', { new_ingredient_final: result });
        }
    });
  });
  
  
  
  
  
  app.get('/Ingredients-edite/:id', (req, res) => {
    const ingredientId = req.params.id;
    const sql = 'SELECT * FROM new_ingredient_final WHERE id = ?';
    connection55.query(sql, [ingredientId], (err, results) => {
      if (err) {
        console.error('Error fetching data from MySQL:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }
      if (results.length === 0) {
        // If no data found for the given ID, handle accordingly
        res.status(404).send('Ingredient not found');
        return;
      }
      // Parse the JSON strings in the results
      results.forEach(item => {
        item.problems = JSON.parse(item.problems);
        item.main_conditions = JSON.parse(item.main_conditions);
        item.warnings = JSON.parse(item.warnings);
      });
      res.render('Ingredients-edite', { data: results });
    });
  });
  
  app.post('/update/:id', (req, res) => {
    const ingredientId = req.params.id;
    const { ingredient_name, weight, ingredient_type, sub_ingredient_name, main_conditions, warnings } = req.body;
    const problems = req.body.problems ? JSON.stringify(req.body.problems) : '[]'; // Handle empty problems array
    const sql = `
        UPDATE new_ingredient_final 
        SET ingredient_name = ?, weight = ?, ingredient_type = ?, sub_ingredient_name = ?, main_conditions = ?, warnings = ?
        WHERE id = ?
    `;
    connection55.query(sql, [ingredient_name, weight, ingredient_type, sub_ingredient_name, JSON.stringify(main_conditions), JSON.stringify(warnings), ingredientId], (err, result) => {
        if (err) {
            console.error('Error updating data in MySQL:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.redirect('/ingredients-home');
    });
  });
  
  app.get('/delete/:id', (req, res) => {
    const ingredientId = req.params.id;
    const sql = 'DELETE FROM new_ingredient_final WHERE id = ?';
    connection55.query(sql, [ingredientId], (err, result) => {
        if (err) {
            console.error('Error deleting data from MySQL:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.redirect('/ingredients-home');
    });
  });
  
  
  
  app.get('/Ingredients-panel-entry', function(req, res) {
    connection55.query("SELECT * FROM panel_new_ingredient_final", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('Ingredients-panel-entry', { panel_new_ingredient_final: result });
        }
    });
  });
  
  
  app.get('/save/:id', (req, res) => {
    const ingredientId = req.params.id;
    const selectSql = 'SELECT * FROM panel_new_ingredient_final WHERE id = ?';
    connection55.query(selectSql, [ingredientId], (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        if (results.length > 0) {
            const item = results[0];
            const { ingredient_name, weight, ingredient_type, sub_ingredient_name, problems, main_conditions, warnings } = item;
            
            const checkSql = 'SELECT * FROM new_ingredient_final WHERE ingredient_name = ? AND weight = ?';
            connection55.query(checkSql, [ingredient_name, weight], (checkErr, checkResults) => {
                if (checkErr) {
                    console.error('Error checking data in MySQL:', checkErr);
                    res.status(500).json({ error: 'Database error' });
                    return;
                }
                if (checkResults.length === 0) {
                    const insertSql = `
                        INSERT INTO new_ingredient_final (ingredient_name, weight, ingredient_type, sub_ingredient_name, problems, main_conditions, warnings)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `;
                    const values = [ingredient_name, weight, ingredient_type, sub_ingredient_name, problems, main_conditions, warnings];
                    connection55.query(insertSql, values, (insertErr, insertResults) => {
                        if (insertErr) {
                            console.error('Error inserting data into MySQL:', insertErr);
                            res.status(500).json({ error: 'Database error' });
                            return;
                        }
                        const deleteSql = 'DELETE FROM panel_new_ingredient_final WHERE id = ?';
                        connection55.query(deleteSql, [ingredientId], (deleteErr, deleteResults) => {
                            if (deleteErr) {
                                console.error('Error deleting data from MySQL:', deleteErr);
                                res.status(500).json({ error: 'Database error' });
                                return;
                            }
                            res.redirect('/Ingredients-panel-entry');
                        });
                    });
                } else {
                    res.redirect('/Ingredients-panel-entry');
                }
            });
        } else {
            res.redirect('/Ingredients-panel-entry');
        }
    });
  });
  
  
  app.get('/Ingredients-panel-detailes/:id', (req, res) => {
    const ingredientId = req.params.id;
    const sql = 'SELECT * FROM panel_new_ingredient_final WHERE id = ?';
    connection55.query(sql, [ingredientId], (err, results) => {
      if (err) {
        console.error('Error fetching data from MySQL:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }
      if (results.length === 0) {
        // If no data found for the given ID, handle accordingly
        res.status(404).send('Ingredient not found');
        return;
      }
      // Parse the JSON strings in the results
      results.forEach(item => {
        item.problems = JSON.parse(item.problems);
        item.main_conditions = JSON.parse(item.main_conditions);
        item.warnings = JSON.parse(item.warnings);
      });
      res.render('Ingredients-panel-detailes', { data: results });
    });
  });
  
  app.get('/delete-panel/:id', (req, res) => {
    const ingredientId = req.params.id;
    const sql = 'DELETE FROM panel_new_ingredient_final WHERE id = ?';
    connection55.query(sql, [ingredientId], (err, result) => {
        if (err) {
            console.error('Error deleting data from MySQL:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.redirect('/Ingredients-panel-entry');
    });
  });






app.get('/Ingredients-entry', (req, res) => {
    res.render('Ingredients-entry', { error: null });
});

// Handle form submission
app.post('/submit', (req, res) => {
    const formData = req.body;
   

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

    connection55.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }

       
        res.json({ success: true }); // Sending a JSON response indicating success
    });
});





  
app.get('/product-entry', (req, res) => {
    res.render('product-entry', { error: null });
  });
  
  app.get('/api/ingredient_nameSelect-options', (req, res) => {
    const query = 'SELECT ingredient_name FROM new_ingredient_final';
    connection55.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
  });

  app.get('/api/diseaseName-options', (req, res) => {
    const query = 'SELECT diseaseName FROM disease_info';
    connection55.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
  });
  
  // Route to handle form submission
  app.post('/product-entry', upload.single('photo'), (req, res) => {
    const { 
        productName, 
        ingredient_name, 
        weight, 
        productType, 
        companyName, 
        diseaseName, 
        productCount, 
        single_price, 
        box_price, 
        discount, 
        a_d_b_price, 
        publishedDate, 
        productDetails 
    } = req.body;
    const photo = req.file;

    const sql = `
        INSERT INTO product_database (productName, ingredient_name, weight, productType, companyName, diseaseName, ProductCount, single_price, box_price, discount, a_d_b_price, publishedDate, productDetails, mime_type, photo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection55.query(sql, [
        productName,
        JSON.stringify(ingredient_name),
        weight,
        productType,
        companyName,
        JSON.stringify(diseaseName),
        productCount,
        single_price,
        box_price,
        discount,
        a_d_b_price,
        publishedDate,
        productDetails,
        photo ? photo.mimetype : null,
        photo ? photo.buffer : null
    ], (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            return res.status(500).send('Database error');
        }

        
        res.redirect('/product-entry'); // Redirect to the product-entry page
    });
});


app.get('/product-home', function(req, res) {
    connection55.query("SELECT * FROM product_database", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('product-home', { product_database: result });
        }
    });
});


app.get('/product-panel-dashboard', function(req, res) {
    connection55.query("SELECT * FROM product_panel_dashboard", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('product-panel-dashboard', { product_database: result });
        }
    });
});


// Route to search products
app.get('/product-search', function(req, res) {
    const { id, productName, companyName } = req.query;
    const sql = "SELECT * FROM product_database WHERE id LIKE ? AND productName LIKE ? AND companyName LIKE ?";
    const values = [`%${id}%`, `%${productName}%`, `%${companyName}%`];

    connection55.query(sql, values, function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('product-home', { product_database: result });
        }
    });
});

app.get('/product-details/:id', (req, res) => {
    const productId = req.params.id;
    connection55.query('SELECT * FROM product_database WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).send('Database error');
        }
        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }
        res.render('product-details', { product: results[0] });
    });
});

// Route to update a product
app.post('/product-details/:id/edit', (req, res) => {
    const productId = req.params.id;
    const {
        productName,
        ingredient_name,
        weight,
        productType,
        companyName,
        diseaseName,
        productCount,
        single_price,
        box_price,
        discount,
        a_d_b_price,
        publishedDate,
        productDetails
    } = req.body;

    const updateQuery = `
        UPDATE product_database
        SET productName = ?, ingredient_name = ?, weight = ?, productType = ?, companyName = ?, diseaseName = ?, ProductCount = ?, single_price = ?, box_price = ?, discount = ?, a_d_b_price = ?, publishedDate = ?, productDetails = ?
        WHERE id = ?
    `;

    const values = [
        productName,
        JSON.stringify(ingredient_name),
        weight,
        productType,
        companyName,
        JSON.stringify(diseaseName),
        productCount,
        single_price,
        box_price,
        discount,
        a_d_b_price,
        publishedDate,
        productDetails,
        productId
    ];

    connection55.query(updateQuery, values, (err, results) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/product-home/' + productId);
    });
});



app.post('/product-details/:id/delete', (req, res) => {
    const productId = req.params.id;
    connection55.query('DELETE FROM product_database WHERE id = ?', [productId], (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/product-home'); // Adjust the redirect URL as needed
    });
});












app.get('/product-panel-detalis/:id', (req, res) => {
    const productId = req.params.id;
    connection55.query('SELECT * FROM product_panel_dashboard WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).send('Database error');
        }
        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }
        res.render('product-panel-detalis', { product: results[0] });
    });
});
// Route to copy a product
app.post('/product-panel-detalis/:id/copy', (req, res) => {
    const productId = req.params.id;
    connection55.query('SELECT * FROM product_panel_dashboard WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).send('Database error');
        }
        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }

        const product = results[0];
        const insertQuery = `
            INSERT INTO product_database (productName, ingredient_name, weight, productType, companyName, diseaseName, ProductCount, single_price, box_price, discount, a_d_b_price, publishedDate, productDetails, mime_type, photo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            product.productName,
            product.ingredient_name,
            product.weight,
            product.productType,
            product.companyName,
            product.diseaseName,
            product.ProductCount,
            product.single_price,
            product.box_price,
            product.discount,
            product.a_d_b_price,
            product.publishedDate,
            product.productDetails,
            product.mime_type,
            product.photo
        ];

        connection55.query(insertQuery, values, (err, result) => {
            if (err) {
                console.error('Error copying product:', err);
                return res.status(500).send('Database error');
            }

            // If copy is successful, delete the product from the current database
            connection55.query('DELETE FROM product_panel_dashboard WHERE id = ?', [productId], (err, result) => {
                if (err) {
                    console.error('Error deleting product after copy:', err);
                    return res.status(500).send('Database error');
                }
                res.redirect('/product-panel-dashboard'); // Adjust the redirect URL as needed
            });
        });
    });
});

app.post('/product-panel-detalis/:id/delete', (req, res) => {
    const productId = req.params.id;
    connection55.query('DELETE FROM product_panel_dashboard WHERE id = ?', [productId], (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/product-panel-dashboard'); // Adjust the redirect URL as needed
    });
});















app.get('/disease-entry', (req, res) => {
    res.render('disease-entry', { error: null });
});

// Endpoint to fetch confirm test options
app.get('/api/confirm-test-options', (req, res) => {
    const query = 'SELECT testName FROM diseases_tests';
    connection55.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Endpoint to fetch physical condition options
app.get('/api/physical_condition-options', (req, res) => {
    const query = 'SELECT physicals_condition FROM patient_physical_condition';
    connection55.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Endpoint to fetch problem select options
app.get('/api/problemSelect-options', (req, res) => {
    const query = 'SELECT problem_name FROM disease_problems';
    connection55.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Endpoint to fetch ingredient name select options
app.get('/api/ingredient_nameSelect-options', (req, res) => {
    const query = 'SELECT ingredient_name FROM new_ingredient_final';
    connection55.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Endpoint to submit disease data
app.post('/api/submit-data', (req, res) => {
    const jsonData = req.body;
    

    // Insert the JSON data into the database
    const sql = 'INSERT INTO disease_info (diseaseName, season, problem, physicals_condition, confirmTest,  ingredient_name, resistance) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [
        jsonData.diseaseName,
        jsonData.season,
        JSON.stringify(jsonData.problem),
        JSON.stringify(jsonData.physicals_condition),
        JSON.stringify(jsonData.confirmTest),
        JSON.stringify(jsonData.ingredient_name),
        jsonData.resistance
    ];

    connection55.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            res.status(500).json({ error: 'Error inserting data into the database' });
            return;
        }
       
        res.status(200).json({ message: 'Data inserted into the database successfully' });
    });
});

// Endpoint to render disease details page
app.get('/disease-details/:id', (req, res) => {
    const query = 'SELECT * FROM disease_info WHERE id = ?';
    const id = req.params.id;

    connection55.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) {
            res.render('disease-details', { data: results[0] });
        } else {
            res.send('No data found');
        }
    });
});

app.post('/update-disease/:id', (req, res) => {
    const id = req.params.id;
    const { diseaseName, season, resistance, problems, physicals_conditions, confirmTests, ingredient_names } = req.body;

    // Convert arrays to JSON strings
    const problemsJSON = JSON.stringify(problems);
    const physicalsConditionsJSON = JSON.stringify(physicals_conditions);
    const confirmTestsJSON = JSON.stringify(confirmTests);
    const ingredientNamesJSON = JSON.stringify(ingredient_names);

    const query = 'UPDATE disease_info SET diseaseName=?, season=?, resistance=?, problem=?, physicals_condition=?, confirmTest=?, ingredient_name=? WHERE id=?';
    connection55.query(query, [diseaseName, season, resistance, problemsJSON, physicalsConditionsJSON, confirmTestsJSON, ingredientNamesJSON, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/disease-panel-home'); // Redirect after update
    });
});

app.post('/delete-disease/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM disease_info WHERE id = ?';
    connection55.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/disease-panel-home'); // Redirect after deletion
    });
});

app.get('/disease-panel-home', function(req, res) {
    connection55.query("SELECT * FROM disease_info", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('disease-panel-home', { disease_info: result });
        }
    });
  });
  
  app.get('/diseaseName-search', function(req, res) {
    const { id, ingredient_name, weight, ingredient_type } = req.query;
    const sql = "SELECT * FROM disease_info WHERE id LIKE ? AND ingredient_name LIKE ? AND weight LIKE ? AND ingredient_type LIKE ?";
    const values = [`%${id}%`, `%${ingredient_name}%`, `%${weight}%`, `%${ingredient_type}%`];
    connection55.query(sql, values, function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('disease-panel-home', { disease_info: result });
        }
    });
  });



  app.get('/disease-problem-form', (req, res) => {
    res.render('disease-problem-form', { successMessage: null });
});

// POST route to handle form submission
app.post('/disease_problem-submit', (req, res) => {
    const { disease_problem } = req.body;

    // Insert into database
    const sql = 'INSERT INTO disease_problems (problem_name) VALUES (?)';
    connection55.query(sql, [disease_problem], (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            res.status(500).send('Error inserting data into the database');
            return;
        }

        const insertedId = result.insertId; // Retrieve the inserted ID
        

        // Redirect back to the form with success message and inserted ID
        res.render('disease-problem-form', { successMessage: `Successfully Upload by ID = ${insertedId}` });
    });
});





app.get('/disease-test-form', (req, res) => {
    res.render('disease-test-form', { successMessage: null });
});


// POST route to handle form submission
app.post('/submit-disease-test', (req, res) => {
    const { testGroup, testName } = req.body;

    // Insert into database
    const sql = 'INSERT INTO diseases_tests (testGroup, testName) VALUES (?, ?)';
    connection55.query(sql, [testGroup, testName], (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            res.status(500).send('Error inserting data into the database');
            return;
        }

        const insertedId = result.insertId; // Retrieve the inserted ID
        

        // Redirect back to the form with success message and inserted ID
        res.render('disease-test-form', { successMessage: `Successfully Upload by ID = ${insertedId}` });
    });
});


app.get('/physical-condition-form', (req, res) => {
    res.render('physical-condition-form', { successMessage: null });
});

// Route to handle form submission
app.post('/submit-physical-condition', (req, res) => {
    const { physicalCondition } = req.body;

    // Insert into database
    const sql = 'INSERT INTO patient_physical_condition (physicals_condition) VALUES (?)';
    connection55.query(sql, [physicalCondition], (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            res.status(500).send('Error inserting data into the database');
            return;
        }
        

        // Redirect back to the form with success message
        res.render('physical-condition-form', { successMessage: `Successfully Upload by ID = ${result.insertId}` });
    });
});














app.get('/login-compnay-admin', (req, res) => {
    // Example retrieval of user and photos data from database
    const user21 = { name: 'John Doe' }; // Replace with actual user data

    // Query to fetch photos from database
    connection66.query('SELECT mime_type, photo FROM admin_compnay', (err, results) => {
        if (err) {
            console.error('Error fetching photos from database:', err);
            res.render('error', { message: 'Error fetching photos from database' });
            return;
        }
        
        // Convert binary photo data to base64
        const photos = results.map(photo => ({
            mime_type: photo.mime_type,
            photo: Buffer.from(photo.photo).toString('base64')
        }));

        // Rendering login page and passing data to EJS template
        res.render('login-compnay-admin', { user21: user21, photos: photos, error: null });
    });
});



// Route to handle login submission
app.post('/login-compnay-admin', (req, res) => {
    const { username, password } = req.body;
    connection66.query('SELECT * FROM admin_compnay WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error executing login query:', err);
            return res.status(500).send('Database query error');
        }
        if (results.length > 0) {
            req.session.user21 = results[0]; // Set session for user21
            res.redirect('/compnay-admin-profile');
        } else {
            res.render('login-compnay-admin', { error: 'Invalid username or password' });
        }
    });
});

// Route to render the compnay-admin-profile page
app.get('/compnay-admin-profile', (req, res) => {
    if (req.session.user21) {
        const query = `
            SELECT plan, created_at, plan_end_date 
            FROM payments 
            WHERE user_name = ? AND plan_end_date >= CURRENT_DATE
        `;
        connection55.query(query, [req.session.user21.username], (err, results) => {
            if (err) {
                console.error('Error fetching data from MySQL:', err);
                res.status(500).send('Error fetching data from database');
                return;
            }

            const plans = results.map(plan => ({
                ...plan,
                created_at: format(new Date(plan.created_at), 'dd MMM yyyy'),
                plan_end_date: format(new Date(plan.plan_end_date), 'dd MMM yyyy')
            }));

            const message = req.query.message || null;
            res.render('compnay-admin-profile', { user21: req.session.user21, plans, message });
        });
    } else {
        res.redirect('/login-compnay-admin');
    }
});

function checkSubscriptions(req, res, next) {
    // Check if the user is logged in
    if (!req.session.user21) {
        return res.redirect('/login-compnay-admin');
    }

    // Query to check for the user's subscription plan
    const query = `
        SELECT plan, plan_end_date 
        FROM payments 
        WHERE user_name = ? 
        ORDER BY plan_end_date DESC 
        LIMIT 1
    `;
    connection55.query(query, [req.session.user21.username], (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            res.status(500).send('Error fetching data from database');
            return;
        }

        // Check if there are any results (i.e., any plan exists for the user)
        if (results.length === 0) {
            // No active plan found, redirect to the profile page with a message
            return res.redirect('/compnay-admin-profile?message=No%20active%20subscription%20plan%20found.%20Please%20purchase%20a%20plan.');
        }

        // Check the plan's end date to see if it's still valid
        const planEndDate = new Date(results[0].plan_end_date);
        const currentDate = new Date();

        // If the subscription is active (planEndDate >= currentDate), allow access to the panel
        if (planEndDate >= currentDate) {
            next(); // Subscription is valid, proceed to the next middleware/route handler
        } else {
            // If the subscription has expired, redirect to the profile page with a message
            res.redirect('/compnay-admin-profile?message=Your%20subscription%20has%20expired.%20Please%20renew%20your%20plan.');
        }
    });
}









function checkSubscription2(req, res, next) {
    // Check if the user is logged in
    if (!req.session.user13) {
        return res.redirect('/login-e-commerce');
    }

    // Query to check for the user's subscription plan
    const query = `
        SELECT plan, plan_end_date 
        FROM payments 
        WHERE user_name = ? 
        ORDER BY plan_end_date DESC 
        LIMIT 1
    `;
    connection55.query(query, [req.session.user13.username], (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            res.status(500).send('Error fetching data from database');
            return;
        }

        // Check if there are any results (i.e., any plan exists for the user)
        if (results.length === 0) {
            // No active plan found, redirect to the profile page with a message
            return res.redirect('/e-commerce-profile?message=No%20active%20subscription%20plan%20found.%20Please%20purchase%20a%20plan.');
        }

        // Check the plan's end date to see if it's still valid
        const planEndDate = new Date(results[0].plan_end_date);
        const currentDate = new Date();

        // If the subscription is active (planEndDate >= currentDate), allow access to the panel
        if (planEndDate >= currentDate) {
            next(); // Subscription is valid, proceed to the next middleware/route handler
        } else {
            // If the subscription has expired, redirect to the profile page with a message
            res.redirect('/e-commerce-profile?message=Your%20subscription%20has%20expired.%20Please%20renew%20your%20plan.');
        }
    });
}




































app.post('/payment-ill_report', (req, res) => {
    const data = req.body;

    // Log the incoming JSON data
    console.log('Received JSON data:', data);

    const { plan, amount, card_type, card_number, cardholder_name, expiration_date, cvv, userName } = data;

    // Get the current date
    const currentDate = new Date();
    const formattedCurrentDate = format(currentDate, 'yyyy-MM-dd');

    // Calculate the plan end date (assuming plan is in years)
    const years_count = parseInt(plan.match(/\d+/)[0]); // Extract years_count from plan (assuming format like '2nd Year')
    const planEndDate = addYears(currentDate, years_count);
    const formattedPlanEndDate = format(planEndDate, 'yyyy-MM-dd');

    const query = `INSERT INTO payments (plan, amount, card_type, card_number, cardholder_name, expiration_date, cvv, user_name, created_at, plan_end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [plan, amount, card_type, card_number, cardholder_name, expiration_date, cvv, userName, formattedCurrentDate, formattedPlanEndDate];

    console.log('Executing query:', query);
    console.log('Query values:', values);

    connection55.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).json({ success: false, message: 'Error inserting data into database' });
            return;
        }
        console.log('Inserted successfully:', results);
        res.json({ success: true, message: 'Payment data saved successfully' });
    });
});





app.get('/payment-history-compnay-admin', (req, res) => {
    if (!req.session.user21) {
        return res.redirect('/login-compnay-admin');
    }

    const query = `
        SELECT plan, amount, cardholder_name, card_type, created_at, plan_end_date 
        FROM payments 
        WHERE user_name = ? 
        ORDER BY created_at DESC
    `;
    
    connection55.query(query, [req.session.user21.username], (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            res.status(500).send('Error fetching data from database');
            return;
        }

        const payments = results.map(payment => ({
            plan: payment.plan,
            amount: payment.amount,
            cardholder_name: payment.cardholder_name,
            card_type: payment.card_type,
            created_at: format(new Date(payment.created_at), 'dd MMM yyyy'),
            plan_end_date: format(new Date(payment.plan_end_date), 'dd MMM yyyy')
        }));

        res.render('payment-history-compnay-admin', { user21: req.session.user21, payments });
    });
});

// Route to company panel with subscription check
app.get('/compnay-panel', checkSubscriptions, (req, res) => {
    // If the user has a valid subscription, render the company panel page
    res.render('compnay-panel', { user21: req.session.user21 });
});

app.get('/compnay_all_history', (req, res) => {
    res.render('compnay_all_history', { user21: req.session.user21 });
    
});


app.get('/shop_all_history', (req, res) => {
    res.render('shop_all_history', { user21: req.session.user21 });
    
});


app.get('/Predection-report', (req, res) => {
    connection55.query("SELECT * FROM production_prediction_database", (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('Predection-report', { production_prediction_database: result });
        }
    });
});

app.get('/Predection-report-search', (req, res) => {
    const { product_id, product_name, company_name } = req.query;
    const sql = "SELECT * FROM production_prediction_database WHERE product_id LIKE ? AND product_name LIKE ? AND company_name LIKE ?";
    const values = [`%${product_id}%`, `%${product_name}%`, `%${company_name}%`];

    connection55.query(sql, values, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('Predection-report', { production_prediction_database: result });
        }
    });
});

app.post('/submit-compnay-productions-report', (req, res) => {
    const data = req.body;

    data.forEach(item => {
        const sql = `INSERT INTO report_for_production (product_id, product_name, product_weight, company_name, PhysicalStock, productionQuantity) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [item.product_id, item.product_name, item.product_weight, item.company_name, item.PhysicalStock, item.productionQuantity];

        connection55.query(sql, values, (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send('Internal Server Error');
            }
        });
    });

    res.status(200).json({ message: 'Data successfully submitted' });
});

app.get('/compnay-productions-report', (req, res) => {
    connection55.query("SELECT * FROM report_for_production", (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('compnay-productions-report', { report_for_production: result });
        }
    });
});

app.post('/delete-compnay-productions-report', (req, res) => {
    const { id } = req.body;
    const sql = "DELETE FROM report_for_production WHERE id = ?";

    connection55.query(sql, [id], (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).json({ message: 'Data successfully deleted' });
        }
    });
});

app.post('/save-compnay-productions-report', (req, res) => {
    const data = req.body;
    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    data.forEach(item => {
        const checkSql = `SELECT * FROM copmay_medicine_stock WHERE id = ?`;
        const checkValues = [item.product_id];

        connection55.query(checkSql, checkValues, (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Internal Server Error');
            }

            if (result.length > 0) {
                // If product_id exists, update the existing record
                const updateSql = `UPDATE copmay_medicine_stock SET lastproduction = ?, updateStock = updateStock + ? WHERE id = ?`;
                const updateValues = [item.productionQuantity, item.productionQuantity, item.product_id];

                connection55.query(updateSql, updateValues, (updateError, updateResult) => {
                    if (updateError) {
                        console.log(updateError);
                        return res.status(500).send('Internal Server Error');
                    }
                });
            } else {
                // If product_id does not exist, insert a new record
                const insertSql = `INSERT INTO copmay_medicine_stock (id, product_name, product_quantity, product_weight, company_name, lastproduction, updateStock) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                const insertValues = [item.product_id, item.product_name, item.product_quantity, item.product_weight, item.company_name, item.productionQuantity, item.productionQuantity];

                connection55.query(insertSql, insertValues, (insertError, insertResult) => {
                    if (insertError) {
                        console.log(insertError);
                        return res.status(500).send('Internal Server Error');
                    }
                });
            }

            // Insert data into company_production_history
            const historySql = `INSERT INTO company_production_history (product_id, product_name, product_weight, company_name, PhysicalStock, productionQuantity, date_time) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const historyValues = [item.product_id, item.product_name, item.product_weight, item.company_name, item.PhysicalStock, item.productionQuantity, currentDateTime];

            connection55.query(historySql, historyValues, (historyError, historyResult) => {
                if (historyError) {
                    console.log(historyError);
                    return res.status(500).send('Internal Server Error');
                }
            });

            // Delete data from report_for_production
            const deleteSql = `DELETE FROM report_for_production WHERE product_id = ?`;
            const deleteValues = [item.product_id];

            connection55.query(deleteSql, deleteValues, (deleteError, deleteResult) => {
                if (deleteError) {
                    console.log(deleteError);
                    return res.status(500).send('Internal Server Error');
                }
            });
        });
    });

    res.status(200).json({ message: 'Data successfully saved and processed' });
});


app.get('/company-medicine-stock', (req, res) => {
    const sql = "SELECT * FROM copmay_medicine_stock";
    
    connection55.query(sql, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('company-medicine-stock', { copmay_medicine_stock: result });
        }
    });
});


app.get('/company-medicine-stock-search', (req, res) => {
    const { product_id, product_name, company_name } = req.query;
    let sql = "SELECT * FROM copmay_medicine_stock WHERE 1=1";
    const values = [];

    if (product_id) {
        sql += " AND id LIKE ?";
        values.push(`%${product_id}%`);
    }

    if (product_name) {
        sql += " AND product_name LIKE ?";
        values.push(`%${product_name}%`);
    }

    if (company_name) {
        sql += " AND company_name LIKE ?";
        values.push(`%${company_name}%`);
    }

    connection55.query(sql, values, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('company-medicine-stock', { copmay_medicine_stock: result });
        }
    });
});


app.get('/shop-order-view', (req, res) => {
    // Fetch data from xyz_compnay1
    connection55.query("SELECT * FROM xyz_compnay1", (error1, result1) => {
        if (error1) {
            console.log(error1);
            res.status(500).send('Internal Server Error');
        } else {
            // Fetch data from copmay_medicine_stock
            connection55.query("SELECT * FROM copmay_medicine_stock", (error2, result2) => {
                if (error2) {
                    console.log(error2);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.render('shop-order-view', { xyz_compnay1: result1, copmay_medicine_stock: result2 });
                }
            });
        }
    });
});




app.delete('/delete-item/:id', (req, res) => {
    const itemId = req.params.id;
    const deleteSql = `DELETE FROM xyz_compnay1 WHERE id = ?`;
    connection55.query(deleteSql, [itemId], (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed to delete item' });
        } else {
            res.status(200).json({ message: 'Item deleted successfully' });
        }
    });
});



app.post('/handover-items', (req, res) => {
    const items = req.body;
    const company = items.length > 0 ? items[0].company : 'Unknown';

    // Get current date and time in Bangladesh time
    const date_time = moment().tz("Asia/Dhaka").format('YYYY-MM-DD HH:mm:ss');

    const invoice = JSON.stringify(items);

    const insertSql = `INSERT INTO xyz1_shop_invoice (company, date_time, invoice) VALUES (?, ?, ?)`;
    const insertValues = [company, date_time, invoice];

    connection55.query(insertSql, insertValues, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Process each item and update the stock
        const processItem = (index) => {
            if (index >= items.length) {
                // All items processed, now delete from report_for_production
                const deleteSql = `DELETE FROM xyz_compnay1`;
                connection55.query(deleteSql, (deleteError, deleteResult) => {
                    if (deleteError) {
                        console.log(deleteError);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.status(200).send('Handover successful');
                    }
                });
                return;
            }

            const item = items[index];

            const updateSql = `UPDATE copmay_medicine_stock SET updateStock = updateStock - ? WHERE id = ?`;
            const updateValues = [item.quantity, item.product_id];

            connection55.query(updateSql, updateValues, (updateError, updateResult) => {
                if (updateError) {
                    console.log(updateError);
                    // Handle individual update errors
                    processItem(index + 1);
                    return;
                }

                // Insert data into company_stock_out_history
                const historySql = `INSERT INTO company_stock_out_history (product_id, product_name, product_pcs, weight, company, product_type, single_price, box_price, discount, quantity, a_d_b_price, date_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const historyValues = [item.product_id, item.product_name, item.product_pcs, item.weight, item.company, item.product_type, item.single_price, item.box_price, item.discount, item.quantity, item.a_d_b_price, date_time];

                connection55.query(historySql, historyValues, (historyError, historyResult) => {
                    if (historyError) {
                        console.log(historyError);
                        // Handle the error appropriately
                    }

                    // Process next item
                    processItem(index + 1);
                });
            });
        };

        // Start processing the items
        processItem(0);
    });
});



app.get('/compnay-data-management', (req, res) => {
    res.sendFile(path.join(__dirname, 'compnay/compnay-views', 'compnay-data-management.html'));
  });




  app.get('/ingredients-home-p', function(req, res) {
    connection555.query("SELECT * FROM panel_new_ingredient_final", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('ingredients-home-p', { panel_new_ingredient_final: result });
        }
    });
  });
  
  app.get('/ingredients-search-p', function(req, res) {
    const { id, ingredient_name, weight, ingredient_type } = req.query;
    const sql = "SELECT * FROM panel_new_ingredient_final WHERE id LIKE ? AND ingredient_name LIKE ? AND weight LIKE ? AND ingredient_type LIKE ?";
    const values = [`%${id}%`, `%${ingredient_name}%`, `%${weight}%`, `%${ingredient_type}%`];
    connection555.query(sql, values, function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('ingredients-home-p', { panel_new_ingredient_final: result });
        }
    });
  });
  
  
  
  
  
  app.get('/Ingredients-edite-p/:id', (req, res) => {
    const ingredientId = req.params.id;
    const sql = 'SELECT * FROM panel_new_ingredient_final WHERE id = ?';
    connection555.query(sql, [ingredientId], (err, results) => {
      if (err) {
        console.error('Error fetching data from MySQL:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }
      if (results.length === 0) {
        // If no data found for the given ID, handle accordingly
        res.status(404).send('Ingredient not found');
        return;
      }
      // Parse the JSON strings in the results
      results.forEach(item => {
        item.problems = JSON.parse(item.problems);
        item.main_conditions = JSON.parse(item.main_conditions);
        item.warnings = JSON.parse(item.warnings);
      });
      res.render('Ingredients-edite-p', { data: results });
    });
  });
  
  app.post('/update-p/:id', (req, res) => {
    const ingredientId = req.params.id;
    const { ingredient_name, weight, ingredient_type, sub_ingredient_name, main_conditions, warnings } = req.body;
    const problems = req.body.problems ? JSON.stringify(req.body.problems) : '[]'; // Handle empty problems array
    const sql = `
        UPDATE panel_new_ingredient_final 
        SET ingredient_name = ?, weight = ?, ingredient_type = ?, sub_ingredient_name = ?, main_conditions = ?, warnings = ?
        WHERE id = ?
    `;
    connection555.query(sql, [ingredient_name, weight, ingredient_type, sub_ingredient_name, JSON.stringify(main_conditions), JSON.stringify(warnings), ingredientId], (err, result) => {
        if (err) {
            console.error('Error updating data in MySQL:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.redirect('/ingredients-home-p');
    });
  });
  
  app.get('/delete-p/:id', (req, res) => {
    const ingredientId = req.params.id;
    const sql = 'DELETE FROM panel_new_ingredient_final WHERE id = ?';
    connection555.query(sql, [ingredientId], (err, result) => {
        if (err) {
            console.error('Error deleting data from MySQL:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.redirect('/ingredients-home-p');
    });
  });
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  app.get('/Ingredients-entry-p', (req, res) => {
    res.render('Ingredients-entry-p', { error: null });
  });
  
  // Handle form submission
  app.post('/submit-p', (req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData);
  
    const { ingredient_name, weight, ingredient_type, sub_ingredient_name, Problem, main_conditions, Warnings } = formData;
  
    const sql = `
        INSERT INTO panel_new_ingredient_final (ingredient_name, weight, ingredient_type, sub_ingredient_name, problems, main_conditions, warnings)
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
  
    connection555.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
  
        console.log('New ingredient Id : ' + results.insertId);
        res.json({ success: true }); // Sending a JSON response indicating success
    });
  });


  app.get('/product-entry-p', (req, res) => {
    res.render('product-entry-p', { error: null });
  });
  
  app.get('/api/ingredient_nameSelect-options-p', (req, res) => {
    const query = 'SELECT ingredient_name FROM new_ingredient_final';
    connection555.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
  });

  app.get('/api/companyName-options-p', (req, res) => {
    const query = 'SELECT companyName FROM admin_compnay';
    connection66.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
  });

  app.get('/api/diseaseName-options-p', (req, res) => {
    const query = 'SELECT diseaseName FROM disease_info';
    connection555.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
  });
  
  // Route to handle form submission
  app.post('/product-entry-p', upload.single('photo'), (req, res) => {
    const { 
        productName, 
        ingredient_name, 
        weight, 
        productType, 
        companyName, 
        diseaseName, 
        productCount, 
        single_price, 
        box_price, 
        discount, 
        a_d_b_price, 
        publishedDate, 
        productDetails 
    } = req.body;
    const photo = req.file;

    const sql = `
        INSERT INTO product_panel_dashboard (productName, ingredient_name, weight, productType, companyName, diseaseName, ProductCount, single_price, box_price, discount, a_d_b_price, publishedDate, productDetails, mime_type, photo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection555.query(sql, [
        productName,
        JSON.stringify(ingredient_name),
        weight,
        productType,
        companyName,
        JSON.stringify(diseaseName),
        productCount,
        single_price,
        box_price,
        discount,
        a_d_b_price,
        publishedDate,
        productDetails,
        photo ? photo.mimetype : null,
        photo ? photo.buffer : null
    ], (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            return res.status(500).send('Database error');
        }

        console.log('New product ID:', results.insertId);
        res.redirect('/product-entry-p');
    });
});


app.get('/product-home-p', function(req, res) {
    connection555.query("SELECT * FROM product_panel_dashboard", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('product-home-p', { product_panel_dashboard: result });
        }
    });
});




// Route to search products
app.get('/product-search-p', function(req, res) {
    const { id, productName, companyName } = req.query;
    const sql = "SELECT * FROM product_panel_dashboard WHERE id LIKE ? AND productName LIKE ? AND companyName LIKE ?";
    const values = [`%${id}%`, `%${productName}%`, `%${companyName}%`];

    connection555.query(sql, values, function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('product-home-p', { product_panel_dashboard: result });
        }
    });
});

app.get('/product-details-p/:id', (req, res) => {
    const productId = req.params.id;
    connection555.query('SELECT * FROM product_panel_dashboard WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).send('Database error');
        }
        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }
        res.render('product-details-p', { product: results[0] });
    });
});

// Route to update a product
app.post('/product-details-p/:id/edit', (req, res) => {
    const productId = req.params.id;
    const {
        productName,
        ingredient_name,
        weight,
        productType,
        companyName,
        diseaseName,
        productCount,
        single_price,
        box_price,
        discount,
        a_d_b_price,
        publishedDate,
        productDetails
    } = req.body;

    const updateQuery = `
        UPDATE product_panel_dashboard
        SET productName = ?, ingredient_name = ?, weight = ?, productType = ?, companyName = ?, diseaseName = ?, ProductCount = ?, single_price = ?, box_price = ?, discount = ?, a_d_b_price = ?, publishedDate = ?, productDetails = ?
        WHERE id = ?
    `;

    const values = [
        productName,
        JSON.stringify(ingredient_name),
        weight,
        productType,
        companyName,
        JSON.stringify(diseaseName),
        productCount,
        single_price,
        box_price,
        discount,
        a_d_b_price,
        publishedDate,
        productDetails,
        productId
    ];

    connection555.query(updateQuery, values, (err, results) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/product-home-p/' + productId);
    });
});



app.post('/product-details-p/:id/delete', (req, res) => {
    const productId = req.params.id;
    connection555.query('DELETE FROM product_panel_dashboard WHERE id = ?', [productId], (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/product-home-p'); // Adjust the redirect URL as needed
    });
});



app.get('/company_stock_out_history', (req, res) => {
    const query = 'SELECT * FROM company_stock_out_history';
    
    connection55.query(query, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
      } else {
        res.render('company_stock_out_history', { history: results });
      }
    });
  });
  
  app.post('/company_stock_out_history-search', (req, res) => {
    const { product_id, product_name, company, date_time } = req.body;
    
    let query = 'SELECT * FROM company_stock_out_history WHERE 1=1';
    const params = [];
  
    if (product_id) {
      query += ' AND product_id = ?';
      params.push(product_id);
    }
    if (product_name) {
      query += ' AND product_name LIKE ?';
      params.push(`%${product_name}%`);
    }
    if (company) {
      query += ' AND company LIKE ?';
      params.push(`%${company}%`);
    }
    if (date_time) {
      query += ' AND date_time LIKE ?';
      params.push(`%${date_time}%`);
    }
  
    connection55.query(query, params, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
      } else {
        res.render('company_stock_out_history', { history: results });
      }
    });
  });


  app.get('/compnay-production-history', (req, res) => {
    const query = 'SELECT * FROM company_production_history';
    connection55.query(query, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
      } else {
        res.render('compnay-production-history', { history: results, search: {} });
      }
    });
  });
  
  app.post('/company_production_history-search', (req, res) => {
    const { product_id, product_name, company_name, date_time } = req.body;
    let query = 'SELECT * FROM company_production_history WHERE 1=1';
    const params = [];
  
    if (product_id) {
      query += ' AND product_id = ?';
      params.push(product_id);
    }
    if (product_name) {
      query += ' AND product_name LIKE ?';
      params.push(`%${product_name}%`);
    }
    if (company_name) {
      query += ' AND company_name LIKE ?';
      params.push(`%${company_name}%`);
    }
    if (date_time) {
      query += ' AND date_time LIKE ?';
      params.push(`%${date_time}%`);
    }
  
    connection55.query(query, params, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
      } else {
        res.render('compnay-production-history', { history: results, search: req.body });
      }
    });
  });











app.listen(port, () => {
    console.log(`Form server is listening on port ${port}`);
});
