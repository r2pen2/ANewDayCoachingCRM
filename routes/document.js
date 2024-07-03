const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { getUser, setUser } = require('./users');

router.use(bodyParser.json());

router.get("/", (req, res) => {
  const documentId = req.query.id
  fetch(`https://www.googleapis.com/drive/v3/files/${documentId}?fields=name,mimeType`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer YOUR_ACCESS_TOKEN` // Replace with your actual access token
    }
  }).then(response => {
    response.json().then(data => {
      res.json(data);
    })
  });
})

module.exports = router;