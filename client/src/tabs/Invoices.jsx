import { ActionIcon, Indicator, NumberFormatter, Pagination, Tooltip, Table, Badge, Blockquote, Modal, Paper, Button, Space, Loader } from '@mantine/core'
import React, { useContext, useEffect, useState } from 'react'
import { getSlashDateString } from '../api/strings';
import { IconBellX, IconCreditCardPay, IconCreditCardRefund, IconEye, IconInfoCircle, IconQuestionMark } from '@tabler/icons-react';
import '../assets/style/invoices.css';
import { exampleInvoicesClassed } from '../api/invoices.ts';
import { LinkMaster } from '../api/links.ts';
import { CurrentUserContext } from '../App.jsx';

// const invoicesPerPage = 10;

export default function Invoices() {

  const [invoices, setInvoices] = useState(exampleInvoicesClassed);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [cancellingPending, setCancellingPending] = useState(false);
  
  const {currentUser} = useContext(CurrentUserContext)

  const InvoiceList = () => {
    
    const sortedInvoices = invoices.sort((a, b) => b.date - a.date);
    // const truncatedInvoices = sortedInvoices.slice((activePage - 1) * 10, (activePage - 1) * 10 + invoicesPerPage)

    //todo: This method needs to be implemented
    function payInvoice(invoice, method) {

      fetch('/payments/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: `Invoice: ${getSlashDateString(invoice.date)}`, unitAmount: invoice.amount * 100, quantity: 1}),
      }).then(res => {
        if (res.ok) { return res.json()}
        return res.json().then(json => Promise.reject(json))
      }).then(({session}) => {
        const url = session.url;
        console.log(session);
        window.location = url;
      }).catch(e => {
        console.error(e.error);
      })
    }

    function getBadgeColor(invoice) {
      if (invoice.paid) { return "green"; }             // This is paid
      if (invoice.paidAt) { return "orange"; }          // This is pending approval
      if (invoice.dueAt < Date.now()) { return "red"; } // This is late
      return "yellow";                                  // This is just unpaid
    }

    function getPaidMessage(invoice) {
      if (invoice.paid) { return `Paid on ${getSlashDateString(invoice.paid)}`; }                                     // This is paid
      if (invoice.paidAt) { return "Pending Approval"; }                                                              // This is pending approval
      if (invoice.checkLate()) { return `${invoice.getDaysLate()} Day${invoice.getDaysLate() > 1 ? "s" : ""} Late`; } // This is late
      return "Unpaid";                                                                                                // This is just unpaid
    }

    return (
      <Table.ScrollContainer minWidth={500} type="native">
        <Table striped>
          <Table.Thead>
            <Table.Th>
              No.
            </Table.Th>
            <Table.Th>
              Assigned
            </Table.Th>
            <Table.Th>
              Due
            </Table.Th>
            <Table.Th>
              Amount
            </Table.Th>
            <Table.Th>
              Status
            </Table.Th>
            <Table.Th>
              Actions
            </Table.Th>
          </Table.Thead>
          <Table.Tbody>
            {sortedInvoices.map((invoice, index) => (
              <Table.Tr key={index}>
                <Table.Td>{invoice.invoiceNumber}</Table.Td>
                <Table.Td>{getSlashDateString(invoice.createdAt)}</Table.Td>
                <Table.Td>{getSlashDateString(invoice.dueAt)}</Table.Td>
                <Table.Td><NumberFormatter prefix="$" value={invoice.amount} /></Table.Td>
                <Table.Td>
                  <Badge color={getBadgeColor(invoice)}>{getPaidMessage(invoice)}</Badge>
                </Table.Td>
                <Table.Td className='d-flex gap-2'>
                  <Tooltip label="View Invoice">
                    <ActionIcon variant="filled" aria-label="View" onClick={() => window.open(invoice.href, "_blank")}>
                      <IconEye />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label={invoice.checkPending() ? "Mark Unpaid" : "Pay Invoice"} disabled={invoice.paid}>
                    <ActionIcon color={invoice.checkPending() ? "orange" : "blue"} variant="filled" disabled={invoice.paid} aria-label="View" onClick={() => {setCurrentInvoice(invoice); setCancellingPending(invoice.checkPending())} }>
                      { !invoice.checkPending() && <IconCreditCardPay /> }
                      { invoice.checkPending() && <IconCreditCardRefund /> }
                    </ActionIcon>
                  </Tooltip>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    )
  }
  
  /** Get the total balance of all unpaid invoices */  
  function getUnpaidBalance() { return invoices.filter(i => !i.paid).reduce((acc, i) => acc + i.amount, 0); }
  /** Get the total balance of all unpaid invoices minus those that are pending */
  function getBalance() { return invoices.filter(i => !i.paid && !i.paidAt).reduce((acc, i) => acc + i.amount, 0); }
  /** Get the total balance of all pending invoices */
  function getPendingBalance() { return invoices.filter(i => !i.paid && i.paidAt).reduce((acc, i) => acc + i.amount, 0); }

  
  const PayButton = (props) => {
    
    /** Get the logo associated with the payment type attached to this button */
    const PayButtonLogo = () => {
      const StripeLogo = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon alt-fill icon-tabler icon-tabler-credit-card" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" /><path d="M3 10l18 0" /><path d="M7 15l.01 0" /><path d="M11 15l2 0" /></svg>
      const VenmoLogo = () => <svg role="img" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><title>Venmo</title><path d="M447.8 153.6c-2 43.6-32.4 103.3-91.4 179.1-60.9 79.2-112.4 118.8-154.6 118.8-26.1 0-48.2-24.1-66.3-72.3C100.3 250 85.3 174.3 56.2 174.3c-3.4 0-15.1 7.1-35.2 21.1L0 168.2c51.6-45.3 100.9-95.7 131.8-98.5 34.9-3.4 56.3 20.5 64.4 71.5 28.7 181.5 41.4 208.9 93.6 126.7 18.7-29.6 28.8-52.1 30.2-67.6 4.8-45.9-35.8-42.8-63.3-31 22-72.1 64.1-107.1 126.2-105.1 45.8 1.2 67.5 31.1 64.9 89.4z"/></svg>
      const ZelleLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Zelle</title><path d="M13.559 24h-2.841a.483.483 0 0 1-.483-.483v-2.765H5.638a.667.667 0 0 1-.666-.666v-2.234a.67.67 0 0 1 .142-.412l8.139-10.382h-7.25a.667.667 0 0 1-.667-.667V3.914c0-.367.299-.666.666-.666h4.23V.483c0-.266.217-.483.483-.483h2.841c.266 0 .483.217.483.483v2.765h4.323c.367 0 .666.299.666.666v2.137a.67.67 0 0 1-.141.41l-8.19 10.481h7.665c.367 0 .666.299.666.666v2.477a.667.667 0 0 1-.666.667h-4.32v2.765a.483.483 0 0 1-.483.483Z"/></svg>
      const PaidLogo = () => <svg xmlns="http://www.w3.org/2000/svg" className="stroke icon icon-tabler icon-tabler-check" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="var(--icon-color)" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" fill='none' /></svg>
      if (props.method === "paid")    { return <PaidLogo />;    }  // This is a Paid invoice
      if (props.method === "stripe")  { return <StripeLogo />;  }  // This is a Stripe payment
      if (props.method === "venmo")   { return <VenmoLogo />;   }  // This is a Venmo payment
      if (props.method === "zelle")   { return <ZelleLogo />;   }  // This is a Zelle payment
    }

    /** The the text associated with the payment type attached to this button */
    const PayButtonText = () => {
      if (props.method === "paid")    { return <p>Mark Invoice Paid</p> } // This is a Paid invoice
      if (props.method === "stripe")  { return <p>Pay With Stripe</p>   } // This is a Stripe payment
      if (props.method === "venmo")   { return <p>Pay With Venmo</p>    } // This is a Venmo payment
      if (props.method === "zelle")   { return <p>Pay With Zelle</p>    } // This is a Zelle payment
    }

    /** Get the color associated with the payment type attached to this button */
    const getColor = () => {
      if (props.method === "paid")    { return "#00BF6F"; }  // This is a Paid invoice
      if (props.method === "stripe")  { return "#F47216"; }  // This is a Stripe payment
      if (props.method === "venmo")   { return "#008CFF"; }  // This is a Venmo payment
      if (props.method === "zelle")   { return "#6D1ED4"; }  // This is a Zelle payment
    }

    /** When a payment method is clicked, open the href associated & propagate the onClick event */
    const handleClick = () => { if (props.link) { window.open(props.link, "_blank"); } if (props.onClick) { props.onClick(); } }
    
    return (
      <div className="col-12 col-md-6 pay-button p-2" style={{ "--icon-color": getColor() }}>
        <Paper onClick={handleClick} withBorder className="clickable d-flex flex-column align-items-center justify-content-center w-100 h-100">
          <PayButtonLogo />
          <PayButtonText />
        </Paper>
      </div>
    )
  }

  /** Invoice payment modal that appears when {@link currentInvoice} is not null. */
  const PayModal = () => {
    
    const [secondPage, setSecondPage] = useState(cancellingPending ? "cancel" : null);
    const [limboRef, setLimboRef] = useState(null);

    function getPayModalTitle() {
      /** Whether wer're on the thanks-venmo or thanks-mark pages */
      const onThanks = secondPage === "thanks-venmo" || secondPage === "thanks-mark";
      if (!secondPage)              { return "Choose how you'd like to pay:"; } // We're on the first page
      if (secondPage === "venmo")   { return "Paying with Venmo:";            } // We're on the Venmo page
      if (secondPage === "mark")    { return "Mark this invoice as paid:";    } // We're trying to mark an invoice as paid
      if (secondPage === "oops")    { return "Undo mark as paid:";            } // We're trying to undo an invoice being marked as paid
      if (secondPage === "cancel")  { return "Mark as unpaid:";               } // We're trying to cancel the approval process of an invoice from a while ago
      if (onThanks)                 { return "Thank you!";                    } // All is well!
    }
    
    const VenmoAndMarkActions = () => {

      if (!secondPage)                                                              { return; } // If we're not on the second page, don't show these action buttons
      if (secondPage !== "venmo" && secondPage !== "mark" && secondPage !== "oops") { return; } // If somehow we're on the wrong page, don't show these action buttons
      
      /** When the done button is pressed, tell Rachel that this invoice is paid & go to the right page */
      function handleDone() { currentInvoice?.tellRachelIHaveBeenPaid().then(ref => { setLimboRef(ref); setSecondPage(`thanks-${secondPage}`); }); }
      
      const DoneButton = () => {
        if (secondPage === "oops") { return; } // Don't show the done button if we're undoing a mark
        return <Button key="done-button" style={{marginBottom: "0.5rem"}} color="green" onClick={handleDone}>{secondPage === "venmo" ? "Done!" : "Yes, I've already paid."}</Button>
      }
      
      return [
        <DoneButton />,
        <Button key="back-button" onClick={() => setSecondPage(null)}>Back to Payment Options</Button>
      ]
    }

    const FirstPage = () => {
      if (secondPage) { return; } // We're on the second page
      /** Link to venmo payment */
      const venmoLink = LinkMaster.createVenmoLink(currentInvoice?.amount, currentInvoice?.invoiceNumber, currentUser.personalData.displayName);
      return (
        <div className="row h-100 p-2">
          <PayButton method="venmo"   color="#008CFF"   link={venmoLink}  onClick={() => setSecondPage("venmo")}  />
          <PayButton method="zelle"   color="#6D1ED4"   link={LinkMaster.payments.zelle} />
          <PayButton method="stripe"  color="#F47216"   link={LinkMaster.payments.stripe} />
          <PayButton method="paid"    color="##00BF6F"                    onClick={() => setSecondPage("mark")}   />
        </div>
      )
    }

    /** When the user wants to undo a mark as paid, tell Rachel that this invoice is unpaid */
    function handleUndoMarkPaid() { currentInvoice?.tellRachelIHaveNotBeenPaid(limboRef); setLimboRef(null); setSecondPage("oops"); }

    return <Modal opened={currentInvoice} onClose={() => setCurrentInvoice(null)} title={getPayModalTitle()} className='container-fluid'>
        <div className="d-flex flex-column align-items-center">
          <strong>Invoice #{currentInvoice?.invoiceNumber}: <NumberFormatter value={currentInvoice?.amount} prefix='$' /></strong>
          <p style={{marginBottom: 0}}>Assigned: {getSlashDateString(currentInvoice?.createdAt)}</p>
          <p>Due: {getSlashDateString(currentInvoice?.dueAt)}</p>
        </div>
        <FirstPage />
        {secondPage && 
          <div className="row h-100 p-2 text-center">
            { secondPage === "venmo" && <p>Thanks for choosing to pay with <strong style={{color: "#228BE6"}}>Venmo</strong>! A new tab should have opened with your payment already filled out. Click <strong>"Done!"</strong> when the payment has been sent, and I'll let Rachel know.</p> }
            { secondPage === "mark" && <p>Would you like me to inform Rachel that this invoice has already been paid?</p>}
            { secondPage === "cancel" && <p>Are you sure you want to mark this invoice as unpaid and cancel the approval process?</p>}
            { secondPage === "oops" && <p>Understood! I've marked this invoice as <strong style={{color: "#FAB005"}}>unpaid</strong>.</p>}
            <VenmoAndMarkActions />
            { secondPage === "thanks-venmo" && <p>You're all set! I've let Rachel know that you paid through <strong style={{color: "#228BE6"}}>Venmo</strong>. The table will update shortly once she's approved the payment.</p> }
            { secondPage === "thanks-mark" && <p>You're all set! I've let Rachel know that you've declared this invoice as paid. The table will update shortly once she's approved the payment.</p> }
            { (secondPage === "thanks-venmo" || secondPage === "thanks-mark") && <Button color="red"  style={{marginBottom: "0.5rem"}} onClick={handleUndoMarkPaid}>Wait! I Didn't mean to do that!</Button>}
            { (secondPage === "cancel") && <Button color="red"  style={{marginBottom: "0.5rem"}} onClick={handleUndoMarkPaid}>Mark unpaid</Button>}
            { (secondPage === "thanks-venmo" || secondPage === "thanks-mark") && <Button color="blue" onClick={() => setCurrentInvoice(null)}>Close</Button>}
            { (secondPage === "cancel") && <Button color="blue" onClick={() => setCurrentInvoice(null)}>Cancel</Button>}
          </div>
        }
    </Modal>
  }

  /** Get the total balance of all unpaid invoices in a NumberFormatter with prefix $ */
  const BalanceFormatter = () => <NumberFormatter value={getBalance()} prefix='$' />;

  /** Display the total balance of all unpaid invoices minus those that are pending */
  const BalanceDisplay = () => <div className="d-flex flex-column gap-2"><p style={{marginBottom: 0}}><strong>Outstanding Balance: </strong><BalanceFormatter /></p></div>;

  /** Show the user how their balance got to it's current point. This is only displayed when there are approval pending payments */
  const BalanceExplanation = () => {
    
    /**
     * Boolean whether there exists any invoices that are pending approval
     * @returns {boolean} Whether or not the balance explanation should be visible
     */
    function getBalanceExplanationVisibility() { return invoices.filter(i => !i.paid && i.paidAt).length > 0; }

    if (!getBalanceExplanationVisibility()) { return; } // Don't show the balance explanation if there are no pending payments
    return (
      <span className="flex-row d-flex gap-2 align-items-center" style={{marginBottom: "1rem", fontWeight: 600}}>
        <p style={{marginBottom: 0, color: "#FAB005"}}>Unpaid ({<NumberFormatter value={getUnpaidBalance()} prefix='$' style={{color: "#FAB005"}} />})</p>
        - 
        <p style={{marginBottom: 0, color: "#FD7314"}}>Pending ({<NumberFormatter value={getPendingBalance()} prefix='$' style={{color: "#FD7314"}} />})</p>
        =
        <BalanceFormatter />
      </span>
    )
  }

  return [
    <PayModal key="pay-modal"/>,
    <hgroup key="invoices-headers" className="d-flex align-items-center flex-column">
      <h2>Invoices</h2>
      <p>This is a list of all invoices: paid and unpaid. They are sorted by invoice number.</p>
      <BalanceDisplay />
      <BalanceExplanation />
    </hgroup>,
    <InvoiceList key="invoice-list" />
  ]
}