const express = require('express');

const app = express();
//Parsing incoming requests bodies
const bodyParser = require('body-parser');
const morgan = require('morgan');
// Better than fetch module for testing and making requests
const axios = require('axios');

// Caching using the api cache will enhance the performance
const apicache = require('apicache');
const { basicAPI, getTags } = require('./controller/controller.js')
app.use(bodyParser.json());

//Middleware used for logging requests to the application.
app.use(morgan('dev'));
const cache = apicache.middleware;

//Registering the default port if available
const PORT = process.env.PORT || 2222;


//Basic API testing
app.get('/api/ping', cache('60 minutes'), basicAPI);

// Tags are a required parameter, while sortBy and direction are optional.
// SortBy and direction default to id and asc, respectively
app.get('/api/posts/:tags/:sortBy?/:direction?', cache('60 minutes'), getTags);


app.listen(PORT, () => {
  console.log(`Web server running on: http://localhost:${PORT}`);
});