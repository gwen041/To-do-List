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

app.put('/api/tasks/:id', async (req, res) => {
  const {id} = req.params;
  const {completed} = req.body;

  if(completed === null || completed === undefined ) {
    return res.status(400).json({error: 'Status is required'});
  }

  try {
    const [result] = await db.query('UPDATE tasks SET completed = ? WHERE id = ?', [completed, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({error: 'Task is not found'});
    }

    res.status(200).json({message: 'Sucessfully Updated'});
  }
  catch(error) {
    console.error(error);
    res.status(500).json({error: 'Server error'});
  }
});

app.delete('/api/tasks/:id', async (req,res) => {
  const {id} = req.params;

  try {
    const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [id]);

    if(result.affectedRows === 0) {
      return res.status(404).json({error: 'Task not Found'});
    }

    res.status(200).json({message: 'Successfully Deleted'});

  }
  catch(error) {
    console.log(error);
    res.status(500).json({error: 'Server error'});
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
