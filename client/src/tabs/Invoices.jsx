// Library Imports
import { Badge, Button, Modal, NumberFormatter, Table } from '@mantine/core';
import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import { IconCreditCardPay, IconCreditCardRefund, IconEye } from '@tabler/icons-react';

// API Imports
import { getSlashDateString } from '../api/strings';
import { Invoice } from '../api/db/dbInvoice.ts';
import { LinkMaster } from '../api/links.ts';

// Component Imports
import { CurrentUserContext, SettingsContext } from '../App.jsx';
import { notifSuccess } from '../components/Notifications.jsx';

// Style Imports
import IconButton from '../components/IconButton.jsx';
import { FirstPageV2, SecondPage } from '../components/invoices/PaymentProcess.jsx';
import { InvoiceStats } from '../components/invoices/InvoiceStats.jsx';
import { InvoiceSettings } from '../components/invoices/InvoiceSettings.jsx';

export const lateColor = "red"
export const unpaidColor = "orange"
export const pendingColor = "cyan.5"

export default function Invoices() {

  const {currentUser} = useContext(CurrentUserContext)

  const [invoices, setInvoices] = useState([]);
  const [invoicesPulled, setInvoicesPulled] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [cancellingPending, setCancellingPending] = useState(false);
  
  function fetchInvoices() {  Invoice.getForUser(currentUser.id).then((invoices) => { setInvoices(invoices); setInvoicesPulled(true); }) }
  
  useEffect(() => fetchInvoices, [currentUser.id])

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

    return <Modal opened={currentInvoice} onClose={() => setCurrentInvoice(null)} title={getPayModalTitle()} className='container-fluid'>
        <FirstPageV2 secondPage={secondPage} setSecondPage={setSecondPage} currentInvoice={currentInvoice} />
        <SecondPage secondPage={secondPage} setSecondPage={setSecondPage} currentInvoice={currentInvoice} setCurrentInvoice={setCurrentInvoice} fetchInvoices={fetchInvoices}/>
    </Modal>
  }

  const invoiceSettings = useMemo(() => currentUser.settings.invoices, [currentUser.settings])
  const invoicesMemo = useMemo(() => { return invoices; }, [invoices])
  const invoicesPulledMemo = useMemo(() => invoicesPulled, [invoicesPulled])
  
  return <div className="d-flex flex-column align-items-center w-100">
    <PayModal />
    <div className="container-fluid">
      <div className="row d-flex">
        <InvoiceStats invoices={invoicesMemo} invoicesPulled={invoicesPulledMemo} />
        <InvoiceSettings settings={invoiceSettings} />
      </div>
    </div>
    <InvoiceList invoices={invoicesMemo} setCurrentInvoice={setCurrentInvoice} setCancellingPending={setCancellingPending} />
  </div>
}

const InvoiceList = memo(function InvoiceList({invoices, setCurrentInvoice, setCancellingPending}) {

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
    <Table.ScrollContainer minWidth={500} className="w-100" type="native">
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
})