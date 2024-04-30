import { ActionIcon, Indicator, NumberFormatter, Pagination, Tooltip, Table, Badge, Blockquote, Modal, Paper } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { getSlashDateString } from '../api/strings';
import { IconCreditCardPay, IconCreditCardRefund, IconEye, IconInfoCircle } from '@tabler/icons-react';
import '../assets/style/invoices.css';

const invoicesPerPage = 10;

function getDaysBefore(n) {
  const today = new Date();
  today.setDate(today.getDate() - n)
  return today;
}

const exampleInvoices = [
  {
    amount: 100,
    paid: false,
    id: 20,
    date: new Date(),
    pending: false,
  },
  {
    amount: 200,
    paid: getDaysBefore(1),
    id: 19,
    date: getDaysBefore(1),
    pending: false,
  },
  {
    amount: 150,
    paid: false,
    id: 18,
    date: getDaysBefore(2),
    pending: false,
  },
  {
    amount: 300,
    paid: getDaysBefore(3),
    id: 17,
    date: getDaysBefore(3),
    pending: false,
  },
  {
    amount: 250,
    paid: getDaysBefore(4),
    id: 16,
    date: getDaysBefore(4),
    pending: false,
  },
  {
    amount: 180,
    paid: false,
    id: 15,
    date: getDaysBefore(5),
    pending: false,
  },
  {
    amount: 120,
    paid: getDaysBefore(6),
    id: 14,
    date: getDaysBefore(6),
    pending: false,
  },
  {
    amount: 350,
    paid: false,
    id: 13,
    date: getDaysBefore(7),
    pending: false,
  },
  {
    amount: 280,
    paid: getDaysBefore(8),
    id: 12,
    date: getDaysBefore(8),
    pending: false,
  },
  {
    amount: 220,
    paid: false,
    id: 11,
    date: getDaysBefore(9),
    pending: false,
  },
  {
    amount: 400,
    paid: getDaysBefore(10),
    id: 10,
    date: getDaysBefore(10),
    pending: false,
  },
  {
    amount: 320,
    paid: false,
    id: 9,
    date: getDaysBefore(11),
    pending: false,
  },
  {
    amount: 270,
    paid: getDaysBefore(12),
    id: 8,
    date: getDaysBefore(12),
    pending: false,
  },
  {
    amount: 190,
    paid: false,
    id: 7,
    date: getDaysBefore(13),
    pending: false,
  },
  {
    amount: 150,
    paid: getDaysBefore(14),
    id: 6,
    date: getDaysBefore(14),
    pending: false,
  },
  {
    amount: 230,
    paid: false,
    id: 5,
    date: getDaysBefore(15),
    pending: false,
  },
  {
    amount: 380,
    paid: getDaysBefore(16),
    id: 4,
    date: getDaysBefore(16),
    pending: false,
  },
  {
    amount: 290,
    paid: false,
    id: 3,
    date: getDaysBefore(17),
    pending: false,
  },
  {
    amount: 210,
    paid: getDaysBefore(18),
    id: 2,
    date: getDaysBefore(18),
    pending: false,
  },
  {
    amount: 170,
    paid: false,
    id: 1,
    date: getDaysBefore(19),
    pending: false,
  },
];

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

  const StripeLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Stripe</title><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/></svg>
  const VenmoLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Venmo</title><path d="M21.772 13.119c-.267 0-.381-.251-.38-.655 0-.533.121-1.575.712-1.575.267 0 .357.243.357.598 0 .533-.13 1.632-.689 1.632Zm.502-3.377c-1.677 0-2.405 1.285-2.405 2.658 0 1.042.421 1.874 1.693 1.874 1.717 0 2.438-1.406 2.438-2.763 0-1.025-.462-1.769-1.726-1.769Zm-3.833 0c-.558 0-.964.17-1.393.477-.154-.275-.462-.477-.932-.477-.542 0-.947.219-1.247.437l-.04-.364H13.54l-.688 4.354h1.506l.479-3.053c.129-.065.323-.154.518-.154.145 0 .267.049.267.267 0 .056-.016.145-.024.218l-.429 2.722h1.498l.478-3.053c.138-.073.324-.154.51-.154.146 0 .268.049.268.267 0 .056-.017.145-.025.218l-.429 2.722h1.499l.461-2.908c.025-.153.049-.388.049-.549 0-.582-.267-.97-1.037-.97Zm-6.871 0c-.575 0-.98.219-1.287.421l-.017-.348H8.962l-.689 4.354H9.78l.478-3.053c.13-.065.324-.154.518-.154.147 0 .268.049.268.242 0 .081-.024.227-.032.299l-.422 2.666h1.499l.462-2.908c.024-.153.049-.388.049-.549 0-.582-.268-.97-1.03-.97Zm-5.631 1.834c.041-.485.413-.824.697-.824.162 0 .299.097.299.291 0 .404-.713.533-.996.533Zm.843-1.834c-1.604 0-2.382 1.39-2.382 2.698 0 1.01.478 1.817 1.814 1.817.527 0 1.07-.113 1.418-.282l.186-1.26c-.494.25-.874.347-1.271.347-.365 0-.64-.194-.64-.687.826-.008 2.252-.347 2.252-1.453 0-.687-.494-1.18-1.377-1.18Zm-4.239.267c.089.186.146.412.146.743 0 .606-.429 1.494-.777 2.06l-.373-2.989L0 9.969l.705 4.2h1.757c.77-1.01 1.718-2.448 1.718-3.554 0-.347-.073-.622-.235-.889l-1.402.283Z"/></svg>


  const PayModal = () => (
    <Modal opened={true} onClose={() => setPayModalOpen(false)} title="Pay Invoice" className='container-fluid'>
        <div className="row h-100 p-2">
          <div className="col-12 col-md-6 pay-button p-2">
            <Paper withBorder className="clickable d-flex flex-column align-items-center justify-content-center w-100 h-100">
              
              <p>Venmo</p>
            </Paper>
          </div>
          <div className="col-12 col-md-6 pay-button p-2">
            <Paper withBorder className="clickable d-flex flex-column align-items-center justify-content-center w-100 h-100">
            
              <p>Zelle</p>
            </Paper>
          </div>
          <div className="col-12 col-md-6 pay-button p-2">
            <Paper withBorder className="clickable d-flex flex-column align-items-center justify-content-center w-100 h-100">
            
              <p>Credit Card</p>
            </Paper>
          </div>
          <div className="col-12 col-md-6 pay-button p-2">
            <Paper withBorder className="clickable d-flex flex-column align-items-center justify-content-center w-100 h-100">
            
              <p>Mark Paid</p>
            </Paper>
          </div>
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
