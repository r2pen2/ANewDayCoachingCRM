// Library Imports
import { Badge, Modal, NumberFormatter, Paper, Table } from '@mantine/core';
import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import { IconCreditCardPay, IconCreditCardRefund, IconEye } from '@tabler/icons-react';

// API Imports
import { getSlashDateString } from '../api/strings';
import { Invoice } from '../api/db/dbInvoice.ts';
import { LinkMaster } from '../api/links.ts';

// Component Imports
import { CurrentUserContext } from '../App.jsx';

// Style Imports
import IconButton from '../components/IconButton.jsx';
import { FirstPageV2, SecondPage } from '../components/invoices/PaymentProcess.jsx';
import { InvoiceStats } from '../components/invoices/InvoiceStats.jsx';
import { InvoiceSettings } from '../components/invoices/InvoiceSettings.jsx';
import { CRMScrollContainer, TableSortButton } from '../components/Tables.jsx';
import { acceptButtonColor, unpaidColor, viewButtonColor } from '../api/color.ts';

export const lateColor = "red"
export const pendingColor = "cyan.5"

export default function Invoices() {

  const {currentUser} = useContext(CurrentUserContext)

  const [invoices, setInvoices] = useState([]);
  const [invoicesPulled, setInvoicesPulled] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [cancellingPending, setCancellingPending] = useState(false);
  
  function fetchInvoices() {  Invoice.getForUser(currentUser.id).then((invoices) => { setInvoices(invoices); setInvoicesPulled(true); }) }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  
  return <div className='d-flex flex-column gap-2 py-2 px-1 align-items-center justify-content-center container-fluid'>
    <PayModal />
      <div className="row w-100">
        <div className="p-1 col-12 col-lg-3 gap-2 d-flex flex-column align-items-start justify-content-start">
          <InvoiceStats invoices={invoicesMemo} invoicesPulled={invoicesPulledMemo} />
          <InvoiceSettings settings={invoiceSettings} />
        </div>
        <div className="col-12 col-lg-9 p-1">
          <InvoiceList invoices={invoicesMemo} setCurrentInvoice={setCurrentInvoice} setCancellingPending={setCancellingPending} />
        </div>
      </div>
  </div>
}

const InvoiceList = memo(function InvoiceList({invoices, setCurrentInvoice, setCancellingPending}) {

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

  const [scrolled, setScrolled] = useState(false)

  const [sort, setSort] = useState("number")
  const [sortReversed, setSortReversed] = useState(false)

  const sortedInvoices = Invoice.sortBy(invoices, sort, sortReversed);

  
  function handleSortChange(newSort) {
    return () => {
      if (sort === newSort) {
        setSortReversed(!sortReversed)
      } else {
        setSort(newSort)
        setSortReversed(false)
      }
    }
  }

  return (
    <Paper withBorder className="w-100">
    <CRMScrollContainer setScrolled={setScrolled}>
      <Table striped>
        <Table.Thead className={"scroll-table-header " + (scrolled ? "scrolled" : "")}>
          <Table.Tr>
            <Table.Th><TableSortButton sorted={sort === "number"} reversed={sortReversed} onClick={handleSortChange("number")}>No.</TableSortButton></Table.Th>
            <Table.Th><TableSortButton sorted={sort === "createdAt"} reversed={sortReversed} onClick={handleSortChange("createdAt")}>Assigned</TableSortButton></Table.Th>
            <Table.Th><TableSortButton sorted={sort === "dueAt"} reversed={sortReversed} onClick={handleSortChange("dueAt")}>Due</TableSortButton></Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
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
                <IconButton label="View Invoice" color={viewButtonColor} icon={<IconEye />} onClick={() => window.open(LinkMaster.ensureAbsoluteUrl(invoice.href), "_blank")} />
                <IconButton label={invoice.checkPending() ? "Mark Unpaid" : "Pay Invoice"} color={invoice.checkPending() ? unpaidColor : acceptButtonColor} disabled={invoice.paid} icon={invoice.checkPending() ? <IconCreditCardRefund /> : <IconCreditCardPay />} onClick={() => {setCurrentInvoice(invoice); setCancellingPending(invoice.checkPending())} } />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </CRMScrollContainer>
    </Paper>
  )
})