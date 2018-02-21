const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;


// Helper function to deal with POST requests
const handlePost = (request, response, parsedURL) => {
  if (parsedURL.pathname === '/addChar') {
    const res = response;

    const body = [];

    // stream error handle
    request.on('error', (err) => {
      console.dir(err);
      jsonHandler.clientError(request, response);
    });

    // grab data
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // end upload stream
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      // pass to the add user function
      jsonHandler.handleCharaInput(request, res, bodyParams);
    });
  }
};


// Main request handler
const onRequest = (request, response) => {
  console.log(request.url);
  console.log(request.method);

  const parsedURL = url.parse(request.url);

  // check request method
  if (request.method === 'GET') {
    switch (parsedURL.pathname) {
      case '/':
        htmlHandler.getIndex(request, response);
        break;
      case '/styles.css':
        htmlHandler.getStyles(request, response);
        break;
      case '/gimme':
        jsonHandler.getCharacters(request, response);
        break;
      case '/getUsers':
        console.log('are you fucking me');
        jsonHandler.getCharacters(request, response);
        break;
      case '/getCharacters':
        console.log('Attemping get call');
        jsonHandler.getCharacters(request, response);
        break;
      default:
        jsonHandler.notFound(request, response);
    }
  } else if (request.method === 'HEAD') {
    jsonHandler.notFound(request, response);
  } else if (request.method === 'POST') {
    switch (parsedURL.pathname) {
      case '/addChar':
        handlePost(request, response, parsedURL);
        break;
      default:
        jsonHandler.notFound(request, response);
    }
  } else {
    jsonHandler.notFound(request, response);
  }
};


http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
