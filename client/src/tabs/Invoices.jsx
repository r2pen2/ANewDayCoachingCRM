import { ActionIcon, Indicator, NumberFormatter, Pagination, Tooltip, Table, Badge, Blockquote, Modal, Paper } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { getSlashDateString } from '../api/strings';
import { IconCreditCardPay, IconCreditCardRefund, IconEye, IconInfoCircle } from '@tabler/icons-react';
import '../assets/style/invoices.css';
import { exampleInvoices } from '../api/invoices.ts';
import { LinkMaster } from '../api/links.ts';

const invoicesPerPage = 10;

export default function Invoices() {
  
  const [invoices, setInvoices] = useState(exampleInvoices);
  const [payModalOpen, setPayModalOpen] = useState(false);

  const InvoiceList = () => {
    
    const sortedInvoices = invoices.sort((a, b) => b.date - a.date);
    const truncatedInvoices = sortedInvoices.slice((activePage - 1) * 10, (activePage - 1) * 10 + invoicesPerPage)

    function payInvoice(invoice) {

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
      if (invoice.paid) {
        return "green";
      }
      if (invoice.pending) {
        return "orange";
      }
      return "yellow";
    }

    function getPaidMessage(invoice) {
      if (invoice.paid) {
        return `Paid on ${getSlashDateString(invoice.paid)}`;
      }
      if (invoice.pending) {
        return "Pending Approval";
      }
      return "Unpaid";
    }

    return (
      <Table.ScrollContainer minWidth={500} type="native">
        <Table striped>
          <Table.Thead>
            <Table.Th>
              No.
            </Table.Th>
            <Table.Th>
              Date
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
            {truncatedInvoices.map((invoice, index) => (
              <Table.Tr key={index}>
                <Table.Td>{invoice.id}</Table.Td>
                <Table.Td>{getSlashDateString(invoice.date)}</Table.Td>
                <Table.Td><NumberFormatter prefix="$" value={invoice.amount} /></Table.Td>
                <Table.Td>
                  <Badge color={getBadgeColor(invoice)}>{getPaidMessage(invoice)}</Badge>
                </Table.Td>
                <Table.Td className='d-flex gap-2'>
                  <Tooltip label="View Invoice">
                    <ActionIcon variant="filled" aria-label="View">
                      <IconEye />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Pay Invoice" disabled={invoice.paid}>
                    <ActionIcon variant="filled" disabled={invoice.paid} aria-label="View" onClick={() => payInvoice(invoice)}>
                      { !invoice.pending && <IconCreditCardPay /> }
                      { invoice.pending && <IconCreditCardRefund /> }
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

  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, [activePage])

  const unpaidInvoices = invoices.filter(i => !i.paid);

  function getBalance() {
    let c = 0;
    for (const i of unpaidInvoices) {
      c += i.amount;
    }
    return c;
  }

  
  const PayButton = (props) => {
    
    const getLogo = () => {
      const StripeLogo = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon alt-fill icon-tabler icon-tabler-credit-card" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" /><path d="M3 10l18 0" /><path d="M7 15l.01 0" /><path d="M11 15l2 0" /></svg>
      const VenmoLogo = () => <svg role="img" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><title>Venmo</title><path d="M447.8 153.6c-2 43.6-32.4 103.3-91.4 179.1-60.9 79.2-112.4 118.8-154.6 118.8-26.1 0-48.2-24.1-66.3-72.3C100.3 250 85.3 174.3 56.2 174.3c-3.4 0-15.1 7.1-35.2 21.1L0 168.2c51.6-45.3 100.9-95.7 131.8-98.5 34.9-3.4 56.3 20.5 64.4 71.5 28.7 181.5 41.4 208.9 93.6 126.7 18.7-29.6 28.8-52.1 30.2-67.6 4.8-45.9-35.8-42.8-63.3-31 22-72.1 64.1-107.1 126.2-105.1 45.8 1.2 67.5 31.1 64.9 89.4z"/></svg>
      const ZelleLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Zelle</title><path d="M13.559 24h-2.841a.483.483 0 0 1-.483-.483v-2.765H5.638a.667.667 0 0 1-.666-.666v-2.234a.67.67 0 0 1 .142-.412l8.139-10.382h-7.25a.667.667 0 0 1-.667-.667V3.914c0-.367.299-.666.666-.666h4.23V.483c0-.266.217-.483.483-.483h2.841c.266 0 .483.217.483.483v2.765h4.323c.367 0 .666.299.666.666v2.137a.67.67 0 0 1-.141.41l-8.19 10.481h7.665c.367 0 .666.299.666.666v2.477a.667.667 0 0 1-.666.667h-4.32v2.765a.483.483 0 0 1-.483.483Z"/></svg>
      const PaidLogo = () => <svg xmlns="http://www.w3.org/2000/svg" className="stroke icon icon-tabler icon-tabler-check" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="var(--icon-color)" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" fill='none' /></svg>
      switch (props.method) {
        case "stripe":
          return <StripeLogo />
        case "venmo":
          return <VenmoLogo />
        case "zelle":
          return <ZelleLogo />
        case "paid":
          return <PaidLogo />
        default:
          return null;
      }
    }

    const getText = () => {
      switch (props.method) {
        case "stripe":
          return "Pay With Stripe"
        case "venmo":
          return "Pay With Venmo"
        case "zelle":
          return "Pay With Zelle"
        case "paid":
          return "Mark Invoice Paid"
        default:
          return null;
      }
    }

    const getColor = () => {
      switch (props.method) {
        case "stripe":
          return "#F47216"
        case "venmo":
          return "#008CFF"
        case "zelle":
          return "#6D1ED4"
        case "paid":
          return "#00BF6F"
        default:
          return null;
      }
    }

    
    const handleClick = () => { window.open(props.link, "_blank") }
    
    return (
      <div className="col-12 col-md-6 pay-button p-2" style={{ "--icon-color": getColor() }}>
        <Paper onClick={handleClick} withBorder className="clickable d-flex flex-column align-items-center justify-content-center w-100 h-100">
          {getLogo()}
          <p>{getText()}</p>
        </Paper>
      </div>
    )
  }

  const PayModal = () => (
    <Modal opened={true} onClose={() => setPayModalOpen(false)} title="Choose how you'd like to pay:" className='container-fluid'>
        <div className="row h-100 p-2">
          <PayButton method="venmo" color="#008CFF" link={LinkMaster.payments.venmo} />
          <PayButton method="zelle" color="#6D1ED4" link={LinkMaster.payments.zelle} />
          <PayButton method="stripe" color="#F47216" link={LinkMaster.payments.stripe} />
          <PayButton method="paid" color="##00BF6F" link={LinkMaster.payments.paid} />
        </div>
    </Modal>
  )

  return (
    <div>
      <div className="d-flex align-items-center flex-column">
        <h2>Invoices</h2>
        <PayModal />
        <p>This is a list of all invoices: paid and unpaid. They are sorted by date. {invoicesPerPage} are displayed per page.</p>
        <span className="d-flex flex-row gap-2"><p style={{fontWeight: 600}}>Oustanding Balance:</p> {<NumberFormatter value={getBalance()} prefix='$' />}</span>
      </div>
      <InvoiceList />
      <div className="d-flex align-items-center flex-column">
        <Pagination style={{marginTop: "1rem"}} total={invoices.length / invoicesPerPage} value={activePage} onChange={setActivePage}/>
      </div>
      <Blockquote color="blue" icon={<IconInfoCircle />} mt="xl">
        1. Maybe we want to have some sort of due date? Invoices could say <Badge color="red">3 Days Late</Badge> or something similar.<br/>
        2. Accepting payments through stripe costs 2.9% + 30¢.<br/>
        3. Should we have a build in "View Invoice" feature? This would show a modal with the invoice details. At the moment, my thought is that the "View Invoice" button just opens a Google doc or PDF. The reason not to implement such a feature is that you'd have to type up the invoice in this portal too, not just wherever else you're generating them.<br/>
      </Blockquote>
    </div>
  )
}
