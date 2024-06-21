const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../firebase');
const { getUser, getAllUsers, setUser } = require('./users');

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
  const user = getUser(userId);
  if (!user) { res.send("Error: User not found"); return; }

  const retInvoices = Object.values(allInvoices).filter(invoice => user.invoices.includes(invoice.id));
  res.json(retInvoices);
});

router.get("/limbo", (req, res) => {
  const limboInvoices = Object.values(allInvoices).filter(invoice => invoice.limbo);
  for (const invoice of limboInvoices) {
    invoice.userDisplayName = getUser(invoice.assignedTo).personalData.displayName;
  }
  res.json(limboInvoices);
})

router.get("/unpaid", (req, res) => {
  const unpaidInvoices = Object.values(allInvoices).filter(invoice => !invoice.paid && !invoice.paidAt);
  for (const invoice of unpaidInvoices) {
    invoice.userDisplayName = getUser(invoice.assignedTo).personalData.displayName;
  }
  res.json(unpaidInvoices);
})

router.get("/paid", (req, res) => {
  const paidInvoices = Object.values(allInvoices).filter(invoice => invoice.paid);
  for (const invoice of paidInvoices) {
    invoice.userDisplayName = getUser(invoice.assignedTo).personalData.displayName;
  }
  res.json(paidInvoices);
})

router.post("/limbo", (req, res) => {
  const action = req.body.action;
  const invoiceId = req.body.id;
  const invoice = allInvoices[invoiceId];
  if (!invoice) { res.send("Error: Invoice not found"); return; }
  if (action === "accept") {
    invoice.paid = true;
    // Lower num unpaid invoices
    const user = getUser(invoice.assignedTo);
    user.numUnpaidInvoices--;
    setUser(user)
  } else {
    invoice.paid = false;
    invoice.paidAt = null;
  }
  invoice.limbo = null;
  setInvoice(invoice).then(() => {
    res.json({ success: true });
  }).catch((error) => {
    console.error(error);
    res.json({ success: false });
  });
})

router.post("/create", (req, res) => {
  const invoice = req.body.invoice;

  const user = getUser(invoice.assignedTo);
  user.numUnpaidInvoices++;
  if (invoice.invoiceNumber === -1) {
    invoice.invoiceNumber = user.invoices.length + 1;
  }
  db.collection("invoices").add(invoice).then((ref) => {
    // We have a ref to the invoice
    const invoiceId = ref.id;
    user.invoices.push(invoiceId);
    setUser(user).then(() => {
      res.json({ success: true });
    }).catch((error) => {
      console.error(error);
      res.json({ success: false });
    });
  }).catch((error) => {
    console.error(error);
    res.json({ success: false });
  });
  
})

router.post("/update", (req, res) => {
  setInvoice(req.body.invoice).then(() => {
    res.json({ success: true });
  }).catch((error) => {
    console.error(error);
    res.json({ success: false });
  });
})

router.post("/delete", (req, res) => {
  const invoice = req.body.invoice;
  const user = getUser(invoice.assignedTo);
  user.numUnpaidInvoices--;
  setUser(user).then(() => {
    db.collection("invoices").doc(invoice.id).delete().then(() => {
      res.json({ success: true });
    }).catch((error) => {
      console.error(error);
      res.json({ success: false });
    });
  }).catch((error) => {
    console.error(error);
    res.json({ success: false });
  });
})

function getAllInvoices() { return allInvoices }
async function setInvoice(invoice) { return new Promise((resolve, reject) => { db.collection("invoices").doc(invoice.id).set(invoice).then((ref) => { resolve(ref); }).catch((error) => { reject(error); }); }) }

module.exports = { router, getAllInvoices, setInvoice };