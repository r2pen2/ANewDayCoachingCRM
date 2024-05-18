const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../firebase');

router.use(bodyParser.json());

let allUsers = {};

/** Update tools when a change is detected */
db.collection("users").onSnapshot((querySnapshot) => {
  allUsers = {};
  querySnapshot.forEach((doc) => {
    allUsers[doc.id] = doc.data();
    allUsers[doc.id].id = doc.id;
  });
});

router.get("/", (req, res) => {
  res.json(allUsers);
})

module.exports = router;