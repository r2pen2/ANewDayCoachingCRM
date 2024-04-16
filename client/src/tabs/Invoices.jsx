import { ActionIcon, Indicator, NumberFormatter, Pagination, Tooltip, Table, Badge, Blockquote } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { getSlashDateString } from '../api/strings';
import { IconCreditCardPay, IconCreditCardRefund, IconEye, IconInfoCircle, } from '@tabler/icons-react';

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

  const InvoiceList = () => {
    
    const sortedInvoices = invoices.sort((a, b) => b.date - a.date);
    const truncatedInvoices = sortedInvoices.slice((activePage - 1) * 10, (activePage - 1) * 10 + invoicesPerPage)

    function markInvoicePaid(invoice) {
      const newInvoices = [...invoices]
      for (let i = 0; i < newInvoices.length; i++) {
        if (newInvoices[i].id === invoice.id) {
          newInvoices[i].pending = !newInvoices[i].pending;
          break;
        }
      }
      setInvoices(newInvoices)
    }

    function getBadgeColor(invoice) {
      console.log(invoice.pending)
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
                  <Tooltip label={invoice.pending ? "Mark as Unpaid" : "Mark As Paid"} disabled={invoice.paid}>
                    <ActionIcon variant="filled" disabled={invoice.paid} aria-label="View" onClick={() => markInvoicePaid(invoice)}>
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

  return (
    <div>
      <div className="d-flex align-items-center flex-column">
        <h2>Invoices</h2>
        <p>This is a list of all invoices: paid and unpaid. They are sorted by date. {invoicesPerPage} are displayed per page.</p>
        <span className="d-flex flex-row gap-2"><p style={{fontWeight: 600}}>Oustanding Balance:</p> {<NumberFormatter value={getBalance()} prefix='$' />}</span>
      </div>
      <InvoiceList />
      <div className="d-flex align-items-center flex-column">
        <Pagination style={{marginTop: "1rem"}} total={invoices.length / invoicesPerPage} value={activePage} onChange={setActivePage}/>
      </div>
      <Blockquote color="blue" icon={<IconInfoCircle />} mt="xl">
        1. Maybe we want to have some sort of due date? Invoices could say <Badge color="red">3 Days Late</Badge> or something similar.<br/>
        2. Should we have this "mark as paid" feature? The idea is for it to show up in an inbox on your end so that you can accept/reject this when it comes through.<br/>
        3. Should we have a build in "View Invoice" feature? This would show a modal with the invoice details. At the moment, my thought is that the "View Invoice" button just opens a Google doc. The reason not to implement such a feature is that you'd have to type up the invoice in this portal too, not just wherever else you're generating them.<br/>
      </Blockquote>
    </div>
  )
}
