const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

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

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};


// GET Route for retrieving all the feedback
app.get('/api/db', (req, res) => {
  console.info(`${req.method} request received for Notes`);

  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for submitting feedback
app.post('/api/db', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to submit Notes`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newFeedback,
    };

    res.json(response);
  } else {
    res.json('Error in posting feedback');
  }
});


app.listen(PORT, () =>
  console.log(`Express server listening on port http://localhost:${PORT} `)
);