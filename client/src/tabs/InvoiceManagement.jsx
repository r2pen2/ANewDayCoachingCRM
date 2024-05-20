import React from 'react'
import { Invoice, LimboInvoice, User } from '../api/dbManager.ts'
import { ActionIcon, Avatar, Button, Checkbox, Modal, NumberInput, Paper, Table, Text, TextInput, Tooltip } from '@mantine/core'
import { DateInput } from "@mantine/dates"
import { getSlashDateString, getTimeString } from '../api/strings.js'
import { IconCheck, IconMoneybag, IconSearch, IconX } from '@tabler/icons-react'
import { navigationItems } from '../components/Navigation.jsx'
import '@mantine/dates/styles.css';


export default function InvoiceManagement() {
  
  function fetchInvoices() { LimboInvoice.getAll().then((invoices) => { setInvoices(invoices) }) }

  const [invoices, setInvoices] = React.useState([])
  const [allUsers, setAllUsers] = React.useState({});
  const [userQuery, setUserQuery] = React.useState("");
  const [dueDate, setDueDate] = React.useState(null)
  const [createMenuOpen, setCreateMenuOpen] = React.useState(false);
  React.useState(() => {
    fetchInvoices()
    User.fetchSearch(navigationItems.ADMINFORMS).then((users) => { setAllUsers(users); })
  }, [])

  function createInvoice(event) {
    event.preventDefault()

    
    const href = document.getElementById("href").value
    const amount = document.getElementById("amount").value
    
    if (window.confirm(`Send ${selectedUser.personalData.displayName} an invoice for $${amount}?`)) {
      Invoice.create(href, amount, selectedUser, dueDate).then(() => fetchInvoices())
    }

  }

  const [selectedUser, setSelectedUser] = React.useState(null)

  const UserSearchResults = () => {

    if (selectedUser) { return; }

    let users = Object.values(allUsers);

    if (userQuery.length > 0) {
      users = users.filter((user) => { return user.personalData.displayName.includes(userQuery) || user.personalData.email.includes(userQuery) })
    }

    // Let's sort alphabetically by displayName, too
    users.sort((a, b) => a.personalData.displayName.localeCompare(b.personalData.displayName))

    if (users.length === 0) {
      return <Text>No users found.</Text>
    }

    return (
      users.map((user, index) => {
        return (
          <Paper key={index} onClick={() => setSelectedUser(user)} className={`d-flex mb-2 flex-row justify-content-between align-items-center p-2`} withBorder style={{cursor: "pointer"}} >
            <div className="d-flex flex-row align-items-center justify-content-center">
              <Avatar src={user.personalData.pfpUrl} alt={user.personalData.displayName} />
              <Text style={{marginLeft: "0.5rem"}}>{user.personalData.displayName}</Text>
            </div>
          </Paper>
        )
      })
    )
  }

  function handleSearchChange(event) {
    if (selectedUser) { setSelectedUser(null) }
    setUserQuery(event.target.value)
    checkSubmitReady()
  }

  const [submitReady, setSubmitReady] = React.useState(false)

  function checkSubmitReady() {
    setSubmitReady(selectedUser && document.getElementById("href").value.length > 0 && document.getElementById("amount").value.length > 0 && dueDate !== null)
  }

  return (
    <div>
      <h2>Manage Invoices</h2>
      <Button onClick={() => setCreateMenuOpen(true)}>Create A New Invoice</Button>
      <Modal opened={createMenuOpen} onClose={() => {setCreateMenuOpen(false); setSelectedUser(null)}} title="Create A New Invoice">
        <form onSubmit={createInvoice} className="gap-2 d-flex flex-column">
          <TextInput id="href" label="Link" placeholder="Enter a link to the invoice" required onChange={checkSubmitReady} />
          <NumberInput id="amount" label="Amount" placeholder="Enter the invoice amount" required leftSection="$" onChange={checkSubmitReady} />
          <DateInput value={dueDate} required label="Due Date" placeholder="Due date" onChange={setDueDate} />
          <TextInput label="User" required style={{marginBottom: "1rem"}} value={selectedUser ? selectedUser.personalData.displayName : userQuery} onChange={handleSearchChange} placeholder="Search for a user by display name or email..." rightSection={<IconSearch size="1rem" />}/>
          <UserSearchResults />
          <div className="d-flex flex-row justify-content-end align-items-center p-2 gap-2">
            { selectedUser && <Avatar src={selectedUser.personalData.pfpUrl} alt={selectedUser.personalData.displayName} />}
            <Button type="submit" disabled={!submitReady}>Create Invoice</Button>
          </div>
        </form>
      </Modal>
      <h3>Inbox</h3>
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
