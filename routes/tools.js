const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../firebase');

router.use(bodyParser.json());

let allTools = {};

/** Update tools when a change is detected */
db.collection("tools").onSnapshot((querySnapshot) => {
  allTools = {};
  querySnapshot.forEach((doc) => {
    allTools[doc.id] = doc.data();
  });
});

router.post("/create", (req, res) => {
  const toolId = req.body.title;
  const userId = req.body.description;

  db.collection("tools").add({
    title: toolId,
    description: userId
  }).then((docRef) => {
    console.log(`Created tool with ID: ${docRef.id}`);
    res.json({ id: docRef.id });
  }).catch((error) => {
    console.error("Error adding document: ", error);
    res.json({ error: error });
  });
})

router.post("/delete", (req, res) => {
  const toolId = req.body.toolId;

  db.collection("tools").doc(toolId).delete().then(() => {
    console.log(`Deleted tool with ID: ${toolId}`);
    res.json({ success: true });
  }).catch((error) => {
    console.error("Error deleting document: ", error);
    res.json({ error: error });
  });
}

router.get("/", (req, res) => {
  res.json(allTools);
})

module.exports = router;