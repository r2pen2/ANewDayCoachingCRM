const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../firebase');

router.use(bodyParser.json());

let allUsers = {};

/** Update users when a change is detected */
db.collection("users").onSnapshot((querySnapshot) => {
  allUsers = {};
  querySnapshot.forEach((doc) => {
    allUsers[doc.id] = doc.data();
    allUsers[doc.id].id = doc.id;
  });
});

router.get("/search-forms", (req, res) => {
  const resUsers = {}
  for (const userId of Object.keys(allUsers)) {
    const u = allUsers[userId];
    resUsers[userId] = {
      personalData: {
        displayName: u.personalData.displayName,
        email: u.personalData.email
      },
      id: u.id,
      formAssignments: u.formAssignments
    }
  }
  res.json(resUsers);
})

router.get("/search-tools", (req, res) => {
  const resUsers = {}
  for (const userId of Object.keys(allUsers)) {
    const u = allUsers[userId];
    resUsers[userId] = {
      personalData: {
        displayName: u.personalData.displayName,
        email: u.personalData.email
      },
      id: u.id,
      tools: u.tools
    }
  }
  res.json(resUsers);
})

function getAllUsers() { return allUsers }

module.exports = { router, getAllUsers };