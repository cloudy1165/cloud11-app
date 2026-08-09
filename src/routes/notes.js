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
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid note ID' });

  const note = notes.find(n => n.id === id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

router.post('/', (req, res) => {
  const { title, completed } = req.body || {};
  const trimmedTitle = typeof title === 'string' ? title.trim() : '';
  if (!trimmedTitle) return res.status(400).json({ error: 'Title is required' });

  const note = { id: nextId++, title: trimmedTitle, completed: Boolean(completed) };
  notes.push(note);
  res.status(201).json(note);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid note ID' });

  const note = notes.find(n => n.id === id);
  if (!note) return res.status(404).json({ error: 'Note not found' });

  const { title, completed } = req.body || {};
  if (title !== undefined) {
    const trimmedTitle = typeof title === 'string' ? title.trim() : '';
    if (!trimmedTitle) return res.status(400).json({ error: 'Title cannot be empty' });
    note.title = trimmedTitle;
  }
  note.completed = completed !== undefined ? Boolean(completed) : note.completed;

  res.json(note);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid note ID' });

  const index = notes.findIndex(n => n.id === id);
  if (index === -1) return res.status(404).json({ error: 'Note not found' });

  notes.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
