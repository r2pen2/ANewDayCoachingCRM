const express = require('express');
const router = express.Router();
require("dotenv").config()

const serviceAccountKey = require("../config/cal.json")

const { google } = require('googleapis');

const bodyParser = require('body-parser');

router.use(bodyParser.json());


router.get("/", (req, res) => {
  
  const docs = google.docs('v1');

  const documentId = req.query.id

  docs.documents.get(documentId).then(doc => {
    res.json(doc)
  })
})


module.exports = router;