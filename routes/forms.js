const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post("/submitted", (req, res) => {
  const formId = req.body.formId;
  const userEmail = req.body.userEmail;
  console.log(formId, userEmail);  
})