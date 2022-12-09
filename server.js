const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

const PORT = 3001;
const app = express();

app.use(express.static("public"));


app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);