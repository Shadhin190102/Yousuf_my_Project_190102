const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '..')));

// app.get('/', async(req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'Dash_Board_panel.html'));
// });

app.use(express.static(path.join(__dirname, '../data-management/Product')));

app.get('/', async(req, res) => {
    res.sendFile(path.join(__dirname, '../data-management/Product', 'panel-detailes.html'));
});

app.get('/', async(req, res) => {
    res.sendFile(path.join(__dirname, '../data-management/Product', 'product.html'));
});
app.listen(8080, () => {
    console.log("Server successfully running on port 8080");
  });