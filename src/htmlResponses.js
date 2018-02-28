const fs = require('fs'); // pull in file module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const styles = fs.readFileSync(`${__dirname}/../client/styles.css`);
const sourcescript = fs.readFileSync(`${__dirname}/../client/source.js`);
const noPortrait = fs.readFileSync(`${__dirname}/../client/MissingPort.png`);


// return index file
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// return css
const getStyles = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(styles);
  response.end();
};

// return client script
const getScript = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/babel' });
  response.write(sourcescript);
  response.end();
};

const getDefaultPortrait = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(noPortrait);
  response.end();
};

// exports
module.exports.getIndex = getIndex;
module.exports.getStyles = getStyles;
module.exports.getScript = getScript;
module.exports.getDefaultPortrait = getDefaultPortrait;
