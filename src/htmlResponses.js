const fs = require('fs'); // pull in file module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const styles = fs.readFileSync(`${__dirname}/../client/styles.css`);


// return index file
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// return css
const getStyles = (request, response) => {
  console.log('got styles');
  console.log('got styles');
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(styles);
  response.end();
};


// exports
module.exports.getIndex = getIndex;
module.exports.getStyles = getStyles;
