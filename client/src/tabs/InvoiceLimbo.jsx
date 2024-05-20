import React from 'react'
import { Invoice } from '../api/dbManager.ts'
import { Table } from '@mantine/core'
import { getSlashDateString } from '../api/strings.js'

export default function InvoiceLimbo() {
  
  const [invoices, setInvoices] = React.useState([])
  React.useState(() => {
    Invoice.getLimbo().then((invoices) => {
      setInvoices(invoices)
    })
  }, [])

  return (
    <div>
      <h2>Invoice Inbox</h2>
      <Table.ScrollContainer minWidth={500} type="native">
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                Date Submitted
              </Table.Th>
              <Table.Th>
                Submitted By
              </Table.Th>
              <Table.Th>
                Platform
              </Table.Th>
              <Table.Th>
                Memo
              </Table.Th>
              <Table.Th>
                Actions
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          
          <Table.Tbody>
            {Object.values(invoices).sort((a, b) => a.paidAt - b.paidAt).map((invoice, index) => {
              return (
                <Table.Tr key={index}>
                  <Table.Td>{getSlashDateString(invoice.paidAt)}</Table.Td>
                  <Table.Td>{invoice.userDisplayName}</Table.Td>
                  <Table.Td>{invoice.limbo}</Table.Td>
                  <Table.Td>{invoice.memo}</Table.Td>
                </Table.Tr>
              )
            })}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </div>
  )
}
