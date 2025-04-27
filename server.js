const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // Your MySQL user
    password: 'Hrushi@2003',        // Your MySQL password
    database: 'students1' // Ensure this DB exists
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit', (req, res) => {
    const { name, roll, marks } = req.body;
    const sql = 'INSERT INTO student_data (name, roll, marks) VALUES (?, ?, ?)';
    db.query(sql, [name, roll, marks], (err, result) => {
        if (err) throw err;
        res.send('Student record added successfully!');
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

app.get('/students', (req, res) => {
    const sql = 'SELECT * FROM student_data';
    db.query(sql, (err, results) => {
        if (err) throw err;

        // Build a simple HTML table
        let html = `
            <h2>All Students</h2>
            <table border="1" cellpadding="8" cellspacing="0">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Roll</th>
                    <th>Marks</th>
                </tr>
        `;

        results.forEach(row => {
            html += `
                <tr>
                    <td>${row.id}</td>
                    <td>${row.name}</td>
                    <td>${row.roll}</td>
                    <td>${row.marks}</td>
                </tr>
            `;
        });

        html += '</table><br><a href="/">Back to Form</a>';
        res.send(html);
    });
});
