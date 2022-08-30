const express = require("express");
const server = express();

server.all(`/`, (req, res) => {
  res.send(`Result: [OK].`);
});

function doHostWork() {
  server.listen(3000, () => {
    console.log(`Listening on 3000 at ` + Date.now());
  });
}

module.exports = doHostWork;