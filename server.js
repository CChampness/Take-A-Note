const express = require('express');
const path = require('path');
const fs = require('fs');
// const { clog } = require('./middleware/clog');
const api = require('./routes/index.js');

const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "cLog"
// app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    const notes = readNotes();
    res.json(notes);
  });
  
app.post(path.join(__dirname,"/public/pages/notes"), (req, res) => {
  const notes = readNotes();
  const note = req.body;
  const title = note.title;
  const text = note.text;
  const newNote = { title, text, id: uuid };
  notes.push(newNote);
  writeNotes(notes);
  res.json(newNote);
});

app.delete("/public/pages/notes/:id", (req, res) => {
  const notes = readNotes();
  const updateNotes = notes.filter((note) => note.id !== req.params.id)
  writeNotes(updatedNotes);
  res.json({ ok: true });
});

function readNotes() {
  return JSON.parse(fs.readFileSync("./db/notes.json", "utf-8"));
}

function writeNotes(notes) {
  const db = JSON.stringify(notes);
  fs.writeFile("./db/notes.json", "utf-8");
}


// // GET Route for feedback page
// app.get('/feedback', (req, res) =>
//   res.sendFile(path.join(__dirname, '/public/pages/feedback.html'))
// );

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
