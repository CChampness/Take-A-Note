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
  console.log(__dirname)
    res.sendFile(path.join(__dirname, '/public/notes.html'))
  });

// GET route for loading notes
app.get("/api/notes/", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/notes.json"), "utf-8", function (err, data) {
    console.log(err);
    if(err) {
      res.send("File not found");
      // const data = [{}];
      // fs.writeFile(path.join(__dirname, "./db/notes.json"), JSON.stringify(data), "utf-8");
      // res.json({"title": "Nothing", "text": "nothing saved"});
      // res.send('{"title": "Nothing", "text": "nothing saved"}');
    } else {
      console.log("data: "+data)
      res.json(JSON.parse(data));
    }
  })
})

// POST route for updating notes
app.post("/api/notes/", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/notes.json"), "utf-8", function (err, data) {
    if(err) {
      res.send("Could not find file");
    } else {
      data = JSON.parse(data);
      // const newNote = { title, text, id: uuid() };
      console.log(req.body);
      const title = req.body.title;
      const text = req.body.text;
      const newNote = { title, text, id: uuid() };
      data.push(newNote);
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
  const listOfNotes = readNotes();
  const updatedNotes = listOfNotes.filter((note) => note.id !== req.params.id);
  writeNotes(updatedNotes);
  res.json({ok: true});
});

// GET 404 for anything else
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




