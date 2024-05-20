const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../firebase');
const { allUsers } = require('./users');

router.use(bodyParser.json());

let allInvoices = {};

router.get("/", (req, res) => {
  const userId = req.body.userId;
  if (!userId) { res.send("Error: No userId provided"); return; }
  const user = allUsers[userId];
  if (!user) { res.send("Error: User not found"); return; }

  const retInvoices = [];

  for (const invoiceId of user.invoices) { retInvoices.push(allInvoices[invoiceId]); }

  db.collection("users").doc(userId).get().then((docSnap) => {
    
    const user = docSnap.data();

    for (const formAssignment of user.formAssignments) {
      if (formAssignment.formId === formId) {
        
        console.log(`Marking form ${formId} as completed for user ${userId}...`)

        formAssignment.completed = true;
        formAssignment.completedDate = new Date();
        confettiRecipients[userId] = formId;
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
    
    if (!docSnap.exists) { return; }

    const user = docSnap.data();

    // Check if the form is already assigned & uncompleted
    const userHasFormInList = user.formAssignments.filter(formAssignment => formAssignment.formId === formData.formId).length > 0;
    const existingForm = user.formAssignments.filter(formAssignment => formAssignment.formId === formData.formId)[0];
    
    if (userHasFormInList && !existingForm.completed) { return; }
    
    if (userHasFormInList && existingForm.completed) {
      // Mark the form as uncompleted
      existingForm.completed = false;
      db.collection("users").doc(userId).set(user);
      return;
    }
    
    // Add the form
    user.formAssignments.push(formData);

    // Push changes
    db.collection("users").doc(userId).set(user).then(() => {
      res.json({ success: true });
    }).catch((error) => {
      console.error(error);
      res.json({ success: false });
    });
  });
})


router.post("/unassign", (req, res) => {
  
  const formId = req.body.formId;
  const userId = req.body.userId;

  db.collection("users").doc(userId).get().then((docSnap) => {
    
    if (!docSnap.exists) { return; }

    const user = docSnap.data();
    
    // Remove the form
    user.formAssignments = user.formAssignments.filter(fa => fa.formId !== formId);

    // Push changes
    db.collection("users").doc(userId).set(user).then(() => {
      res.json({ success: true });
    }).catch((error) => {
      console.error(error);
      res.json({ success: false });
    });
  });
})

router.post("/incomplete", (req, res) => {
  const formId = req.body.formId;
  const userId = req.body.userId;
  db.collection("users").doc(userId).get().then((docSnap) => {
    
    const user = docSnap.data();

    for (const formAssignment of user.formAssignments) {
      if (formAssignment.formId === formId) {
        
        console.log(`Marking form ${formId} as incomplete for user ${userId}...`)

        formAssignment.completed = false;
        formAssignment.completedDate = null;
      }
    }
    
    db.collection("users").doc(userId).set(user);
  });
})

module.exports = router;