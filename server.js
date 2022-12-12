const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = 3001;
const app = express();
const uuid = require('./helpers/uuid');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET route for index
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for db
app.get('/db', (req, res) =>
  res.sendFile(path.join(__dirname, '/db/db'))
);

// GET request for note
app.get('/api/db', (req, res) => {

// Send a message to the client
  res.json(`${req.method} request received to get notes`);
  console.info(`${req.method} request received to get notes`);
});

// POST request to add a note
app.post('/api/db', (req, res) => {

  console.info(`${req.method} request received to add a notes`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    fs.readFile('./db/db.json', `utf-8`, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile(`./db/db.json`, JSON.stringify(notes, null, `\t`), (err) =>
          err
            ? console.error(err)
            : console.log(
              `Review for ${newNote.title} has been written to JSON file`
            )
        );
      }
    })

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});


app.listen(PORT, () =>
  console.log(`Express server listening on port http://localhost:${PORT} `)
);