require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
// MySQL connection configuration
const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Endpoint for user login
app.post('/login', (req, res) => {
  const { username, password} = req.body;

  // Query the database to check if the username and password match
  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  connection.query(query, [username, password], (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 1) {
            // If user is found, return user data including name
            const user = results[0];
            res.status(200).json({
              id: user.uniquecode,
              username: user.email,
              name: user.firstname + user.lastname,
              message: 'Login successful'// Include user's name in the response
              // Add other user data as needed
            });
          } else {
            // If user is not found or password is incorrect, return error
            res.status(401).json({ error: 'Invalid username or password' });
          }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});