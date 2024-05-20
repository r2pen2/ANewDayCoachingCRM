import React from 'react'
import { LimboInvoice } from '../api/dbManager.ts'
import { ActionIcon, Button, Table, Tooltip } from '@mantine/core'
import { getSlashDateString, getTimeString } from '../api/strings.js'
import { IconCheck, IconX } from '@tabler/icons-react'

export default function InvoiceLimbo() {
  
  function fetchInvoices() { LimboInvoice.getAll().then((invoices) => { setInvoices(invoices) }) }

  const [invoices, setInvoices] = React.useState([])
  React.useState(() => {
    fetchInvoices()
  }, [])

  return (
    <div>
      <h2>Invoice Inbox</h2>
      <Table.ScrollContainer minWidth={500} type="native">
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                Timestamp
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
              
              function handleAccept() { invoice.accept().then(() => fetchInvoices()) }
              function handleReject() { invoice.reject().then(() => fetchInvoices()) }

              return (
                <Table.Tr key={index}>
                  <Table.Td>{getSlashDateString(invoice.paidAt)} {getTimeString(invoice.paidAt)}</Table.Td>
                  <Table.Td>{invoice.userDisplayName}</Table.Td>
                  <Table.Td><strong style={{color: invoice.getPlatformColor()}}>{invoice.limbo}</strong></Table.Td>
                  <Table.Td>{invoice.generateMemo()}</Table.Td>
                  <Table.Td className='d-flex gap-2'>
                    <Tooltip label="Accept">
                      <ActionIcon color="green" onClick={handleAccept}><IconCheck /></ActionIcon>
                    </Tooltip>
                    <Tooltip label="Reject">
                      <ActionIcon color="red" onClick={handleReject}><IconX /></ActionIcon>
                    </Tooltip>
                  </Table.Td>
                </Table.Tr>
              )
            })}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </div>
  )
}
