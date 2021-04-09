const express = require('express');

const app = express();
//Parsing incoming requests bodies
const bodyParser = require('body-parser');
const morgan = require('morgan');
// Better than fetch module for testing and making requests
const axios = require('axios');

// Caching using the api cache will enhance the performance
const apicache = require('apicache');

app.use(bodyParser.json());

//Middleware used for logging requests to the application.
app.use(morgan('dev'));

//Registering the default port if available
const PORT = process.env.PORT || 2222;


//Basic API testing
app.get('/api/ping', cache('60 minutes'), (req, res) => {
    res.status(200).send({
        success: 'true',
    })
})

//Fetching all posts
app.get('/api/posts', cache('60 minutes'), (req, res) => {
    //Replace with the custom url
     // Gets all posts with at least one tag from the API using axios
     //http://localhost:8888/api/
  axios.all([
    axios.get('http://localhost:8888/api/blog/posts?tag=tech'),
    axios.get('http://localhost:8888/api/blog/posts?tag=history'),
    axios.get('http://localhost:8888/api/blog/posts?tag=health'),
    axios.get('http://localhost:8888/api/blog/posts?tag=startups'),
    axios.get('http://localhost:8888/api/blog/posts?tag=science'),
    axios.get('http://localhost:8888/api/blog/posts?tag=design'),
    axios.get('http://localhost:8888/api/blog/posts?tag=culture'),
    axios.get('http://localhost:8888/api/blog/posts?tag=politics'),
    axios.get('http://localhost:8888/api/blog/posts?tag=science')
  ])
  .then(axios.spread((response1, response2, response3, response4, response5, response6, response7, response8, response9) => {
    // Organizes data into an array
    let data = [
      response1.data.posts,
      response2.data.posts,
      response3.data.posts,
      response4.data.posts,
      response5.data.posts,
      response6.data.posts,
      response7.data.posts,
      response8.data.posts,
      response9.data.posts
    ];
    // Object so that a hash can be made on the id of the post and remove duplicates
    let post = {};
    let posts = [];
    for (let i = 0; i < data.length; i++) {
      let blog = data[i];
      for (let i = 0; i < blog.length; i++) {
        post[blog[i].id] = blog[i];
      }
    }
    // Create response object so that the result of the request is in the correct format
    for (let key in post) {
      posts.push(post[key]);
    }
    let response = {
      posts,
    }
    res.status(200).send(response);
  }))
  .catch(error => {
    res.status(400).send({
      error: 'Tags parameter is required'
    })
    console.log(error)
  });
})

// Initial code for sortBy functionality
app.get('/api/posts/sortBy', cache('60 minutes'), (req, res) => {
    axios.all([
        // Replace with your custom url
        axios.get('http://localhost:8888/api/blog/posts?tag=tech'),
        axios.get('http://localhost:8888/api/blog/posts?tag=history')
      ])
      .then(axios.spread((response1, response2) => {
        let data = [
            response1.data.posts,
            response2.data.posts
          ];
          // Object so that a hash can be made on the id of the post and remove duplicates
          let post = {};
          let posts = [];
          for (let i = 0; i < data.length; i++) {
            let blog = data[i];
            for (let i = 0; i < blog.length; i++) {
              post[blog[i].id] = blog[i];
            }
          }
          // Create response object so that the result of the request is in the correct format
          for (let key in post) {
            posts.push(post[key]);
          }
      
          // Merge Sort function so that the data is sorted quickly
          // Sorting is notoriously slow so this is a great place to optimize code
          const merge = (arr1, arr2) => {
            let result = [];
            var i = 0;
            var j = 0;
            while(i < arr1.length && j < arr2.length) {
              if (arr2[j].likes < arr1[i].likes) {
                result.push(arr1[i]);
                i++;
              } else {
                result.push(arr2[j]);
                j++;
              }
            }
            while(i < arr1.length) {
              result.push(arr1[i]);
              i++
            }
            while(j < arr2.length) {
              result.push(arr2[j]);
              j++
            }
            return result;
        }
        const mergeSort = (arr) => {
            if (arr.length <= 1) {
              return arr;
            }
            let mid = Math.floor(arr.length / 2);
            let left = mergeSort(arr.slice(0, mid));
            let right = mergeSort(arr.slice(mid));
            return merge(left, right);
          }
          // Calling Merge sort on the retrieved data
          let sortedPosts = mergeSort(posts);
          let response = {
            posts: sortedPosts
          }
          res.status(200).send(response);
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