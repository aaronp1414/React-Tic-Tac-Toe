const express = require('express');
const functions = require('firebase-functions');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
    return res.send('pong');
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

exports.app = functions.https.onRequest(app);
