const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Garda@123', // Replace 'your_password' with the correct password
    database: 'recomed'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

// Route to handle form submission
app.post('/save-emergency-info', (req, res) => {
    const { bloodType, allergies, contactName1, contactPhone1, contactName2, contactPhone2 } = req.body;

    const sql = `INSERT INTO emergency_info (blood_type, allergies, contact_name_1, contact_phone_1, contact_name_2, contact_phone_2)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [bloodType, allergies, contactName1, contactPhone1, contactName2, contactPhone2], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error saving emergency information');
            return;
        }
        console.log('Emergency info saved:', result);
        res.send('Emergency information saved successfully!');
    });
});

// Route to fetch emergency information
app.get('/emergency-info', (req, res) => {
    const sql = 'SELECT * FROM emergency_info';

    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Route to handle health information submission
app.post('/save-health-info', (req, res) => {
    const { name, dob, blood, contact, allergies, medications, conditions } = req.body;

    const sql = `INSERT INTO health_info (name, dob, blood_type, contact, allergies, medications, conditions)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [name, dob, blood, contact, allergies, medications, conditions], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error saving health information');
            return;
        }
        console.log('Health info saved:', result);
        res.send('Health information saved successfully!');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// SQL script to create the database and table
/*
CREATE DATABASE recomed;

USE recomed;

CREATE TABLE emergency_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blood_type VARCHAR(10),
    allergies TEXT,
    contact_name_1 VARCHAR(100),
    contact_phone_1 VARCHAR(15),
    contact_name_2 VARCHAR(100),
    contact_phone_2 VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE health_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    dob DATE,
    blood_type VARCHAR(10),
    contact TEXT,
    allergies TEXT,
    medications TEXT,
    conditions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Garda@123';
FLUSH PRIVILEGES;

SELECT user, host, plugin FROM mysql.user;
SHOW DATABASES;
USE recomed;
SHOW TABLES;
*/

function saveInfo() {
  const name = document.getElementById("name").value;
  const dob = document.getElementById("dob").value;
  const blood = document.getElementById("blood").value;
  const contact = document.getElementById("contact").value;
  const allergies = document.getElementById("allergies").value;
  const medications = document.getElementById("medications").value;
  const conditions = document.getElementById("conditions").value;

  if (!name || !dob || !blood || !contact) {
    alert("Please fill in all required fields.");
    return;
  }

  // Send data to the backend
  fetch('http://localhost:3000/save-health-info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      dob,
      blood,
      contact,
      allergies,
      medications,
      conditions,
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Information saved successfully!");
      } else {
        alert("Error saving information. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error saving information. Please try again.");
    });
}

<script>
  function fetchHealthInfo() {
    fetch('http://localhost:3000/emergency-info')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Display data on the page
        const container = document.getElementById("dataContainer");
        container.innerHTML = ""; // Clear previous data
        data.forEach((item) => {
          const div = document.createElement("div");
          div.innerHTML = `
            <p><strong>Name:</strong> ${item.name}</p>
            <p><strong>DOB:</strong> ${item.dob}</p>
            <p><strong>Blood Type:</strong> ${item.blood_type}</p>
            <p><strong>Contact:</strong> ${item.contact}</p>
            <p><strong>Allergies:</strong> ${item.allergies}</p>
            <p><strong>Medications:</strong> ${item.medications}</p>
            <p><strong>Conditions:</strong> ${item.conditions}</p>
            <hr>
          `;
          container.appendChild(div);
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
</script>

<div id="dataContainer"></div>
<button onclick="fetchHealthInfo()">Fetch Health Info</button>