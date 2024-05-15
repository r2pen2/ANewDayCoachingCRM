const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../firebase');

router.use(bodyParser.json());

router.post("/submitted", (req, res) => {
  const formId = req.body.formId;
  const userId = req.body.userId;
  db.collection("users").doc(userId).get().then((docSnap) => {
    
    const user = docSnap.data();

    for (const formAssignment of user.formAssignments) {
      if (formAssignment.formId === formId) {
        
        console.log(`Marking form ${formId} as completed for user ${userId}...`)

        formAssignment.completed = true;
        formAssignment.completedDate = new Date();
      }
    }
    
    db.collection("users").doc(userId).set(user);
  });
})

router.post("/assign", (req, res) => {
  
  const formData = req.body.formData;
  const userId = req.body.userId;

  console.log(`Assigning form ${formData.formId} to user ${userId}...`)

  db.collection("users").doc(userId).get().then((docSnap) => {
    
    if (!docSnap.exists()) { return; }

    const user = docSnap.data();

    // Check if the form is already assigned & uncompleted
    const userHasFormInList = user.formAssignments.filter(formAssignment => formAssignment.formId === formData.formId).length > 0;
    const userHasFormCompleted = user.formAssignments.filter(formAssignment => formAssignment.formId === formData.formId)[0].completed;
    if (userHasFormInList && !userHasFormCompleted) { return; }
    
    // Add the form
    user.formAssignments.push(formData);

    // Push changes
    db.collection("users").doc(userId).set(user);
  });
})

module.exports = router;