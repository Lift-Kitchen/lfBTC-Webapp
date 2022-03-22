//Install express server
const express = require('express');
const sslRedirect = require('heroku-ssl-redirect');
const path = require('path');

const app = express();
app.use(sslRedirect(['development', 'staging', 'production']));
// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/build'));

app.get('/*', function (req, res) {

  res.sendFile(path.join(__dirname + '/build/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);