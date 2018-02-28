// characters array
const characters = {};


// json response function
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });

  response.write(JSON.stringify(object));
  response.end();
};

// json response function for meta calls
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });

  response.end();
};


// MAJOR
// retrieve character JSON object
const getCharacters = (request, response) => {
  const responseJSON = {
    characters,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getCharactersMeta = (request, response) => respondJSONMeta(request, response, 200);


const edit = (request, response, params) => {
  const loadName = params.name;
  const inputValues = characters[loadName];

  const responseJSON = {
    inputValues,
  };

  return respondJSON(request, response, 204, responseJSON);
};

const editMeta = (request, response) => respondJSONMeta(request, response, 204);



// handle addition or update of information
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

    // check the fields that might be empty
    if (body.race !== '') {
      characters[body.name].race = body.race;
    }
    if (body.class !== '') {
      characters[body.name].class = body.class;
    }
    if (body.portrait !== '') {
      characters[body.name].portraitUrl = body.portrait;
    }
  } else {
    characters[body.name] = {};

    // add fields that could cause update issues
    characters[body.name].name = body.name;
    characters[body.name].race = body.race;
    characters[body.name].class = body.class;
    characters[body.name].portraitUrl = body.portrait;
    if (body.portrait === '') {
      characters[body.name].portraitUrl = '/defaultPort.png';
    }
  }

  // add or update universally filled fields
  characters[body.name].alignment = body.alignment;
  if (body.alignment === 'Neutral Neutral') {
    characters[body.name].alignment = 'True Neutral';
  }
  characters[body.name].strength = body.str;
  characters[body.name].dexterity = body.dex;
  characters[body.name].constitution = body.con;
  characters[body.name].intelligence = body.int;
  characters[body.name].wisdom = body.wis;
  characters[body.name].charisma = body.cha;


  // upon creation, send success message and exit
  if (responseCode === 201) {
    responseJSON.message = `Created ${characters[body.name].name} successfully`;
    console.log(responseJSON.message);
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // 204 does not have an object to deliver, exit
  return respondJSONMeta(request, response, responseCode);
};


// STATUS CODES
// 400
const clientError = (request, response) => {
  const responseJSON = {
    message: 'Name and age are both required.',
    id: 'clientError',
  };

  return respondJSON(request, response, 400, responseJSON);
};

// 404
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

// 500 Internal Server Error
const internal = (request, response) => {
  const responseJSON = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  return respondJSON(request, response, 500, responseJSON);
};


// exports
module.exports = {
  getCharacters,
  getCharactersMeta,
  handleCharaInput,
  edit,
  clientError,
  notFound,
  notFoundMeta,
  internal,
};
