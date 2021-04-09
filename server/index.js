const express = require('express');

const app = express();

//Registering the default port if available
const PORT = process.env.PORT || 2222;


//Basic API testing
app.get('/api/ping', (req, res) => {
  res.status(200).send("Success");
})


app.listen(PORT, () => {
  console.log(`Web server running on: http://localhost:${PORT}`);
});