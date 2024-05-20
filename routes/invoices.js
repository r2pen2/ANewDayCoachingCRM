const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../firebase');
const { allUsers } = require('./users');

router.use(bodyParser.json());

let allInvoices = {};

/** Update invoices when a change is detected */
db.collection("invoices").onSnapshot((querySnapshot) => {
  allInvoices = {};
  querySnapshot.forEach((doc) => {
    allInvoices[doc.id] = doc.data();
    allInvoices[doc.id].id = doc.id;
  });
});

router.get("/", (req, res) => {
  const userId = req.query.userId;
  if (!userId) { res.send("Error: No userId provided"); return; }
  const user = allUsers[userId];
  if (!user) { res.send("Error: User not found"); return; }

  const retInvoices = Object.values(allInvoices).filter(invoice => user.invoices.includes(invoice.id));
  res.json(retInvoices);
});

router.get("/limbo", (req, res) => {
  const limboInvoices = Object.values(allInvoices).filter(invoice => invoice.limbo);
  res.json(limboInvoices);
})

function getAllInvoices() { return allInvoices }

module.exports = { router, getAllInvoices };