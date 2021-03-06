const axios = require('axios');

const basicAPI = (req, res) => {
  res.status(200).send({
    success: 'true',
  })
}

const getTags = (req, res) => {
    const { tags, sortBy, direction } = req.params;
    const validSortValues = ['id', 'author', 'authorId', 'likes', 'popularity', 'reads', 'tags', undefined];
    const validDirections = ['asc', 'desc', undefined];

    // Throws error if the sortBy/direction value are not valid.
    if (validSortValues.indexOf(sortBy) === - 1) {
        res.status(400).send({
        error: 'sortBy parameter is invalid',
        });
    }
    if (validDirections.indexOf(direction) === -1) {
        res.status(400).send({
        error: 'sortBy parameter is invalid',
        });
    }

    // If the user requests more than one tag, we will precede with the following
    if (tags.indexOf(',') !== - 1) {
      console.log('one', tags)
      let tagArray = tags.split(',');
      console.log('third', tagArray);
      let getPaths = tagArray.map((tag, i) => {
        return axios.get(`http://localhost:8888/api/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`)
    });
        axios.all([
        ...getPaths
        ])
        .then(axios.spread((tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9) => {
            let data = [
              tag1 ? tag1.data.posts : '',
              tag2 ? tag2.data.posts : '',
              tag3 ? tag3.data.posts : '',
              tag4 ? tag4.data.posts : '',
              tag5 ? tag5.data.posts : '',
              tag6 ? tag6.data.posts : '',
              tag7 ? tag7.data.posts : '',
              tag8 ? tag8.data.posts : '',
              tag9 ? tag9.data.posts : ''
            ]
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
            if (sortBy) {
              if (direction === 'desc') {
                posts = posts.sort((a, b) => (b[sortBy] > a[sortBy]) ? 1 : -1);
              } else {
                posts = posts.sort((a, b) => (b[sortBy] < a[sortBy]) ? 1 : -1);
              }
            }
            res.status(200).send(posts);
        }))
        .catch(error => {
          res.status(400).send({
            error: 'Tags parameter is required',
          })
          console.log(error)
        });
    } else {
        axios.get(`http://localhost:8888/api/blog/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`)
        .then(request => {
            let data = request.data.posts;
            if (sortBy) {
            if (direction === 'desc') {
                data = data.sort((a, b) => (b[sortBy] > a[sortBy]) ? 1 : -1);
            } else {
                data = data.sort((a, b) => (b[sortBy] < a[sortBy]) ? 1 : -1);
            }
            }
            res.status(200).send(data);
          })
          .catch(error => {
            res.status(400).send({
              error: 'Tags parameter is required',
            })
            console.log(error)
          });
      }
}

const sortPosts = (req, res) => {
  axios.all([
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
      error: 'sortBy parameter is invalid'
    })
    console.log(error)
  });
}

module.exports = {
  basicAPI,
  getTags,
  sortPosts,
}