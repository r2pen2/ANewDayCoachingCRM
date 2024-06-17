// Library Imports
import { Badge, Button, Modal, NumberFormatter, Table } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import { IconCreditCardPay, IconCreditCardRefund, IconEye } from '@tabler/icons-react';

// API Imports
import { getSlashDateString } from '../api/strings';
import { Invoice } from '../api/db/dbInvoice.ts';
import { LinkMaster } from '../api/links.ts';

// Component Imports
import { CurrentUserContext } from '../App.jsx';
import { notifSuccess } from '../components/Notifications.jsx';

// Style Imports
import IconButton from '../components/IconButton.jsx';
import { FirstPage, FirstPageV2 } from '../components/invoices/PaymentProcess.jsx';
import { InvoiceStats } from '../components/invoices/InvoiceStats.jsx';

export const lateColor = "red"
export const unpaidColor = "orange"
export const pendingColor = "cyan.5"

export default function Invoices() {

  const [invoices, setInvoices] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [cancellingPending, setCancellingPending] = useState(false);
  
  const {currentUser} = useContext(CurrentUserContext)

  function fetchInvoices() { 
    Invoice.getForUser(currentUser.id).then((invoices) => {
      setInvoices(invoices);
    })
  }
  
  useEffect(() => {
    Invoice.getForUser(currentUser.id).then((invoices) => {
      setInvoices(invoices);
    })
  }, [currentUser.id])

  const InvoiceList = () => {
    
    const sortedInvoices = invoices.sort((a, b) => b.invoiceNumber - a.invoiceNumber);

    function getBadgeColor(invoice) {
      if (invoice.paid) { return "green"; }             // This is paid
      if (invoice.paidAt) { return pendingColor; }          // This is pending approval
      if (invoice.checkLate()) { return lateColor; }        // This is late
      return unpaidColor;                                  // This is just unpaid
    }

    function getPaidMessage(invoice) {
      if (invoice.paid) { return `Paid on ${getSlashDateString(invoice.paidAt)}`; }                                     // This is paid
      if (invoice.paidAt) { return "Pending Approval"; }                                                              // This is pending approval
      if (invoice.checkLate()) { return `${invoice.getDaysLate()} Day${invoice.getDaysLate() > 1 ? "s" : ""} Late`; } // This is late
      return "Unpaid";                                                                                                // This is just unpaid
    }

    return (
      <Table.ScrollContainer minWidth={500} type="native">
        <Table striped>
          <Table.Thead>
            <Table.Tr>
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
            </Table.Tr>
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
                  <IconButton label="View Invoice" color="gray" icon={<IconEye />} onClick={() => window.open(LinkMaster.ensureAbsoluteUrl(invoice.href), "_blank")} />
                  <IconButton label={invoice.checkPending() ? "Mark Unpaid" : "Pay Invoice"} color={invoice.checkPending() ? "cyan.5" : ""} disabled={invoice.paid} icon={invoice.checkPending() ? <IconCreditCardRefund /> : <IconCreditCardPay />} onClick={() => {setCurrentInvoice(invoice); setCancellingPending(invoice.checkPending())} } />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    )
  }

  /** Invoice payment modal that appears when {@link currentInvoice} is not null. */
  const PayModal = () => {
    
    const [secondPage, setSecondPage] = useState(cancellingPending ? "cancel" : null);

    function getPayModalTitle() {
      /** Whether wer're on the thanks-venmo or thanks-mark pages */
      const onThanks = secondPage === "thanks-venmo" || secondPage === "thanks-mark";
      if (!secondPage)              { return <strong>Invoice #{currentInvoice?.invoiceNumber}: <NumberFormatter value={currentInvoice?.amount} prefix='$' /></strong>; } // We're on the first page
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
      function handleDone() { 
        currentInvoice?.tellRachelIHaveBeenPaid(secondPage).then(() => {
          setSecondPage(`thanks-${secondPage}`);
          fetchInvoices();
          setCurrentInvoice(null);
          notifSuccess("Marked Paid", 'Your invoice has been marked as "paid" and is pending approval.');
        } );
      }
      
      const DoneButton = () => {
        if (secondPage === "oops") { return; } // Don't show the done button if we're undoing a mark
        return <Button key="done-button" style={{marginBottom: "0.5rem"}} color="green" onClick={handleDone}>{secondPage === "venmo" ? "Done!" : "Yes, I've already paid."}</Button>
      }
      
      return [
        <DoneButton key="done-button" />,
        <Button key="back-button" onClick={() => { setSecondPage(null); setCurrentInvoice(null)}}>Close</Button>
      ]
    }

    /** When the user wants to undo a mark as paid, tell Rachel that this invoice is unpaid */
    function handleUndoMarkPaid() { currentInvoice?.tellRachelIHaveNotBeenPaid(); setSecondPage("oops"); }

    return <Modal opened={currentInvoice} onClose={() => setCurrentInvoice(null)} title={getPayModalTitle()} className='container-fluid'>
        <FirstPageV2 secondPage={secondPage} setSecondPage={setSecondPage} currentInvoice={currentInvoice} />
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
            { (secondPage === "cancel") && <Button color="orange"  style={{marginBottom: "0.5rem"}} onClick={handleUndoMarkPaid}>Mark unpaid</Button>}
            { (secondPage === "thanks-venmo" || secondPage === "thanks-mark") && <Button color="blue" onClick={() => setCurrentInvoice(null)}>Close</Button>}
            { (secondPage === "cancel") && <Button color="blue" onClick={() => setCurrentInvoice(null)}>Cancel</Button>}
          </div>
        }
    </Modal>
  }

  return [
    <PayModal key="pay-modal"/>,
    <hgroup key="invoices-headers" className="d-flex align-items-center flex-column">
      <InvoiceStats invoices={invoices} />
    </hgroup>,
    <InvoiceList key="invoice-list" />
  ]
}
