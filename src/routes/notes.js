const express = require('express');
const router = express.Router();

let notes = [
  { id: 1, title: 'Setup CI/CD Pipeline', completed: false },
  { id: 2, title: 'Write unit tests', completed: true },
  { id: 3, title: 'Build Docker image', completed: false }
];
let nextId = 4;

router.get('/', (req, res) => {
  res.json(notes);
});

router.get('/:id', (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

router.post('/', (req, res) => {
  const { title, completed } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  
  const note = { id: nextId++, title, completed: completed || false };
  notes.push(note);
  res.status(201).json(note);
});

router.put('/:id', (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) return res.status(404).json({ error: 'Note not found' });
  
  const { title, completed } = req.body;
  note.title = title || note.title;
  note.completed = completed !== undefined ? completed : note.completed;
  
  res.json(note);
});

router.delete('/:id', (req, res) => {
  const index = notes.findIndex(n => n.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Note not found' });
  
  notes.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
