const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../firebase');

router.use(bodyParser.json());

router.post("/submitted", (req, res) => {
  const formId = req.body.formId;
  const userEmail = req.body.userEmail;
  db.collection("users").where("personalData.email", "==", userEmail).get().then((querySnapshot) => {
    querySnapshot.docs.forEach((doc) => {
      const user = doc.data();
      if (user.forms) {
        user.forms.push(formId);
      } else {
        user.forms = [formId];
      }
      db.collection("users").doc(doc.id).set(user);
    });
  });
})

module.exports = router;