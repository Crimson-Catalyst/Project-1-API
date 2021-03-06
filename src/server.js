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
  const params = query.parse(parsedURL.query);


  // check request method
  if (request.method === 'GET') {
    switch (parsedURL.pathname) {
      case '/':
        htmlHandler.getIndex(request, response);
        break;
      case '/styles.css':
        htmlHandler.getStyles(request, response);
        break;
      case '/source.js':
        htmlHandler.getScript(request, response);
        break;
      case '/defaultPort.png':
        htmlHandler.getDefaultPortrait(request, response);
        break;
      case '/getChars':
        jsonHandler.getCharacters(request, response);
        break;
      case '/load':
        if (params) {
          jsonHandler.edit(request, response, params);
        }
        break;
      default:
        jsonHandler.notFound(request, response);
    }
  } else if (request.method === 'HEAD') {
    switch (parsedURL.pathname) {
      case '/getChars':
        jsonHandler.getCharactersMeta(request, response);
        break;
      case 'load':
        if (params) {
          jsonHandler.editMeta(request, response, params);
        }
        break;
      default:
        jsonHandler.notFoundMeta(request, response);
    }
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
