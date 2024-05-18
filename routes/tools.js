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
    allTools[doc.id].id = doc.id;
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

  // Remove tool from all users
  for (const userId of allTools[toolId].users) {
    db.collection("users").doc(userId).get().then((docSnap) => {
      if (!docSnap.exists) { return; }
      const user = docSnap.data();
      delete user.tools[toolId];
      // Push changes
      db.collection("users").doc(userId).set(user);
    });
  }

  // Delete the tool itself
  db.collection("tools").doc(toolId).delete().then(() => {
    // console.log(`Deleted tool with ID: ${toolId}`);
    // Delete tool from all users
    res.json({ success: true });
  }).catch((error) => {
    console.error("Error deleting document: ", error);
    res.json({ error: error });
  });
})

router.post("/assign-multiple", (req, res) => {
  const toolId = req.body.toolId;
  const users = req.body.users;
  const title = req.body.title;
  const description = req.body.description;

  for (const userId of users) {
    db.collection("users").doc(userId).get().then((docSnap) => {
      if (!docSnap.exists) { return; }
  
      const user = docSnap.data();
  
      const tool = {
        id: toolId,
        title: title,
        description: description
      }

      if (!user.tools) { user.tools = {}; }
      user.tools[toolId] = tool;
  
      // Push changes
      db.collection("users").doc(userId).set(user);
    });
  }

  // Add users to the tool
  db.collection("tools").doc(toolId).get().then((docSnap) => {
    if (!docSnap.exists) { return; }
    const tool = docSnap.data();
    if (!tool.users) { tool.users = []; }
    tool.users = tool.users.push(users);
    db.collection("tools").doc(toolId).set(tool);
  }).then(() => {
    res.json({ success: true });
  }).catch((error) => {
    console.error("Error assigning tool to users: ", error);
    res.json({ error: error });
  });
})

router.get("/", (req, res) => {
  res.json(allTools);
})

module.exports = router;