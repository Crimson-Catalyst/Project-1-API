// characters array
const characters = {};

// json response function
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });

  response.write(JSON.stringify(object));
  console.log(`Fetched: ${JSON.stringify(object)}`);
  response.end();
};

// json response function for meta calls
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });

  response.end();
};


// MAJOR
const getCharacters = (request, response) => {
  console.log('Get Requested');
  const responseJSON = {
    characters,
  };

  console.log('Fetching characters.');

  return respondJSON(request, response, 200, responseJSON);
};

const getCharactersMeta = (request, response) => respondJSONMeta(request, response, 200);


const handleCharaInput = (request, response, body) => {
  const responseJSON = {
    message: 'Name and alignment are required fields.',
  };
  // successful creation - default code
  let responseCode = 201;

  // if the character already exists, update - code 204
  // otherwise, make new section under this character's name
  if (characters[body.name]) {
    responseCode = 204;
  } else {
    characters[body.name] = {};
  }

  // add or update the fields
  characters[body.name].name = body.name;
  characters[body.name].alignment = body.alignment;

  // upon creation, send success message and exit
  if (responseCode === 201) {
    responseJSON.message = `Created ${characters[body.name].name} successfully`;
    console.log(responseJSON.message);
    console.log(`Created ${characters[body.name].name}: ${characters[body.name].alignment}`);
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // 204 does not have an object to deliver, exit
  return respondJSONMeta(request, response, responseCode);
};


// STATUS CODES
// 404
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

// 400
const clientError = (request, response) => {
  const responseJSON = {
    message: 'Name and age are both required.',
    id: 'clientError',
  };

  return respondJSON(request, response, 400, responseJSON);
};


// exports
module.exports = {
  getCharacters,
  getCharactersMeta,
  handleCharaInput,
  notFound,
  notFoundMeta,
  clientError,
};
