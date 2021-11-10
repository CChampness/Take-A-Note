const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require("./helpers/uuid");

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile('/public/index.html')
);

// GET Route for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
  });

// GET route for loading notes to client
app.get("/api/notes/", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/notes.json"), "utf-8", function (err, data) {
    if(err) {
      res.send("File not found");
    } else {
      res.json(JSON.parse(data));
    }
  })
})

// POST route for adding a note
app.post("/api/notes/", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/notes.json"), "utf-8", function (err, data) {
    if(err) {
      res.send("Could not find file");
    } else {
      data = JSON.parse(data);
      const title = req.body.title;
      const text = req.body.text;
      const newNote = { title, text, id: uuid() };
      data.push(newNote);
      // writeNotes(data);

      fs.writeFile(path.join(__dirname, "./db/notes.json"), JSON.stringify(data), "utf-8", function (err) {
        if(err) {
          res.send("Could not find file");
        } else {
          res.send("Success");
        }
      })
    }
  })
})

// PUT route for updating  note
app.put("/api/notes/", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/notes.json"), "utf-8", function (err, data) {
    if(err) {
      res.send("Could not find file");
    } else {
      data = JSON.parse(data);
      const id = req.body.id;
      const text = req.body.text;
      data.forEach(note => {if (note.id && (note.id === id)) {note.text = text}});
      // writeNotes(data);

      fs.writeFile(path.join(__dirname, "./db/notes.json"), JSON.stringify(data), "utf-8", function (err) {
        if(err) {
          res.send("Could not find file");
        } else {
          res.send("Success");
        }
      })
    }
  })
})

// DELETE route for deleting one specific note
app.delete("/api/notes/:id", (req, res) => {
  const allNotes = readNotes();
  const filteredNotes = allNotes.filter((note) => note.id !== req.params.id);
  writeNotes(filteredNotes);
  res.json({ok: true});
});

// GET 404 for anything that we don't have
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/404.html'))
);

function writeNotes(notes) {
  const data = JSON.stringify(notes);
  fs.writeFileSync(path.join(__dirname, "./db/notes.json"), data, "utf-8");
}
 
function readNotes() {
  return JSON.parse(fs.readFileSync("./db/notes.json", "utf-8"));
}

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);




