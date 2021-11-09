const express = require('express');
const fs = require('fs');
const path = require('path');
const { clog } = require('./middleware/clog');
// const api = require('./routes/index.js');

const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "cLog"
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile('/public/index.html')
);

app.get("/api/notes/", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/notes.json"), "utf-8", function (err, data) {
    if(err) {
      res.send("Could not find file");
    } else {
      res.json(JSON.parse(data));
    }
  })
})
  
app.post("/api/notes/", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/notes.json"), "utf-8", function (err, data) {
    if(err) {
      res.send("Could not find file");
    } else {
      data = JSON.parse(data);
      data.push(req.body);
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
  
app.delete("/api/notes/:id", (req, res) => {
  const listOfNotes = readNotes();
  const updatedNotes = listOfNotes.filter((note) => note.id !== req.params.id);
  writeNotes(updatedNotes);
  res.json({ok: true});
});

function writeNotes(notes) {
  const data = JSON.stringify(notes);
  fs.writeFileSync(path.join(__dirname, "./db/notes.json"), data, "utf-8");
}
 
function readNotes() {
  return JSON.parse(fs.readFileSync("./db/notes.json", "utf-8"));
}

// GET Route for notes page
app.get('/notes', (req, res) => {
console.log(__dirname)
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);




