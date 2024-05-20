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

router.get("/search-list", (req, res) => {
  const resUsers = {}
  for (const userId of Object.keys(allUsers)) {
    const u = allUsers[userId];
    resUsers[userId] = {
      personalData: {
        displayName: u.personalData.displayName,
        email: u.personalData.email
      },
      id: u.id
    }
  }
  res.json(resUsers);
})

module.exports = router;