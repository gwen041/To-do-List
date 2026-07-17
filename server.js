const express = require('express');
const db = require('./db');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());


app.use(express.static('public'));

app.get('/api/tasks', async (req, res) => {

  try {
    const [tasks] = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');

    res.status(200).json(tasks);

  }
  catch (error) {
    console.error(error);
      res.status(500).json({error: 'Database error fetching tasks'});
  }
});

app.post('/api/tasks', async (req, res) => {
  const {title} = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({error: 'Title is required'});
  }

  try {
    const [result] = await db.query('INSERT into tasks (title) VALUES (?)', [title]);

    res.status(201).json({
      id: result.insertId,
      title: title,
      completed: false
    })

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error creating task'});
  }
});


