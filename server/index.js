const express = require('express');

const app = express();
//Parsing incoming requests bodies
const bodyParser = require('body-parser');
const morgan = require('morgan');
// Better than fetch module for testing and making requests
const axios = require('axios');

app.use(bodyParser.json());

//Middleware used for logging requests to the application.
app.use(morgan('dev'));

//Registering the default port if available
const PORT = process.env.PORT || 2222;


//Basic API testing
app.get('/api/ping', (req, res) => {
    res.status(200).send({
        success: 'true',
    })
})

//Fetching all posts
app.get('/api/posts', (req, res) => {
    //Replace with the custom url
    axios.all([
        axios.get('http://localhost:2222/api/blog/posts?tag=item1'),
        axios.get('http://localhost:2222/api/blog/posts?tag=item2')
      ])
      .then(axios.spread((response1, response2) => {
        const data1 = response1.data.posts;
        const data2 = response2.data.posts;
        const posts = data1.concat(data2)
        const post = {
          posts
        }
        res.status(200).send(post);
      }))
      .catch(error => {
        res.status(400).send({
          error: 'Tags parameter is required'
        })
        console.log(error)
      });
  })


app.listen(PORT, () => {
  console.log(`Web server running on: http://localhost:${PORT}`);
});