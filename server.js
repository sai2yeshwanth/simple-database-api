const express = require('express');
const bodyParser = require('body-parser');
const SimpleDatabase = require('./SimpleDatabase');

const app = express();
const db = new SimpleDatabase();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// API Routes

// Create a new record
app.post('/api/records', async (req, res) => {
  try {
    const newRecord = await db.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error creating record', error });
  }
});

// Read a record by ID
app.get('/api/records/:id', (req, res) => {
  const record = db.read(parseInt(req.params.id));
  if (record) {
    res.json(record);
  } else {
    res.status(404).json({ message: 'Record not found' });
  }
});

// Read all records
app.get('/api/records', (req, res) => {
  const records = db.getAll();
  res.json(records);
});

// Update a record by ID
app.put('/api/records/:id', async (req, res) => {
  const updatedRecord = await db.update(parseInt(req.params.id), req.body);
  if (updatedRecord) {
    res.json(updatedRecord);
  } else {
    res.status(404).json({ message: 'Record not found' });
  }
});

// Delete a record by ID
app.delete('/api/records/:id', async (req, res) => {
  const deleted = await db.delete(parseInt(req.params.id));
  if (deleted) {
    res.status(204).send(); // No content
  } else {
    res.status(404).json({ message: 'Record not found' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
