// Library Imports
import React from 'react'
import { Avatar, Button, NumberInput, Paper, TextInput, } from '@mantine/core'
import { DateInput } from "@mantine/dates"
import { IconSearch } from '@tabler/icons-react'

// API Imports
import { Invoice, LimboInvoice, UnpaidInvoice, PaidInvoice } from '../api/db/dbInvoice.ts'
import { User } from '../api/db/dbUser.ts'

// Component Imports
import { navigationItems } from '../components/Navigation.jsx'
import { notifSuccess } from '../components/Notifications.jsx'

// Style Imports
import '@mantine/dates/styles.css';
import ModuleHeader from '../components/dashboard/ModuleHeader.jsx'
import { UserSearchResults } from '../components/Users.jsx'
import { LimboTable, PaidTable, UnpaidTable } from '../components/invoiceManagement/InvoiceManagementTables.jsx'

export default function InvoiceManagement() {
  
  const [limboInvoices, setLimboInvoices] = React.useState([])
  const [unpaidInvoices, setUnpaidInvoices] = React.useState([])
  const [paidInvoices, setPaidInvoices] = React.useState([])
  function fetchInvoices() { 
    LimboInvoice.getAll().then((invoices) => { setLimboInvoices(invoices); })
    UnpaidInvoice.getAll().then((invoices) => { setUnpaidInvoices(invoices); })
    PaidInvoice.getAll().then((invoices) => { setPaidInvoices(invoices); })
  }

  const [allUsers, setAllUsers] = React.useState({});
  const [userQuery, setUserQuery] = React.useState("");
  const [dueDate, setDueDate] = React.useState(null)
  const [href, setHref] = React.useState("")
  const [amount, setAmount] = React.useState("")
  React.useEffect(() => {
    fetchInvoices()
    User.fetchSearch(navigationItems.ADMINFORMS).then((users) => { setAllUsers(users); })
  }, [])

  function createInvoice(event) {
    event.preventDefault()

    setHref("")
    setDueDate(null)
    setAmount("")
    setUserQuery("")
    setSelectedUser(null)
    
    if (window.confirm(`Send ${selectedUser.personalData.displayName} an invoice for $${amount}?`)) {
      Invoice.create(href, amount, selectedUser, dueDate).then(() => {
        fetchInvoices()
        notifSuccess("Invoice Created", `Invoice sent to ${selectedUser.personalData.displayName}`)
      })
    }

  }

  const [selectedUser, setSelectedUser] = React.useState(null)

  function handleSearchChange(event) {
    if (selectedUser) { setSelectedUser(null) }
    setUserQuery(event.target.value)
  }

  const submitReady = selectedUser && dueDate && amount > 0 && href.length > 0

  const AssignmentConfirmation = () => (
    <div className="d-flex flex-row justify-content-end align-items-center p-2 gap-2">
      { selectedUser && <Avatar src={selectedUser.personalData.pfpUrl} alt={selectedUser.personalData.displayName} />}
      <Button type="submit" disabled={!submitReady}>Create Invoice</Button>
    </div>
  )

  return (
    <div className='d-flex flex-column gap-2 p-0 align-items-center justify-content-center py-2 px-1 container-fluid'>
      <div className="row w-100">
        <div className="p-1 col-12 col-xl-3">
          <Paper withBorder className="p-0">
            <ModuleHeader>New Invoice</ModuleHeader>
            <form onSubmit={createInvoice} className="p-2 gap-2 d-flex flex-column">
              <TextInput id="href" label="Link" placeholder="Enter a link to the invoice" required value={href} onChange={(e) => setHref(e.target.value)} />
              <NumberInput id="amount" label="Amount" placeholder="Enter the invoice amount" required value={amount} leftSection="$" onChange={(v) => setAmount(parseInt(v))} />
              <DateInput value={dueDate} required label="Due Date" placeholder="Due date" onChange={setDueDate} />
              <TextInput label="User" required style={{marginBottom: "1rem"}} value={selectedUser ? selectedUser.personalData.displayName : userQuery} onChange={handleSearchChange} placeholder="Search for a user by display name or email..." rightSection={<IconSearch size="1rem" />}/>
              <UserSearchResults selectedUser={selectedUser} setSelectedUser={setSelectedUser} allUsers={allUsers} userQuery={userQuery} />
              <AssignmentConfirmation />
            </form>
          </Paper>
        </div>
        <div className="col-xl-9 col-12 p-1">
          <div className="container-fluid p-0 px-2">
            <div className="row w-100">
              <UnpaidTable  invoices={unpaidInvoices} fetchInvoices={() => UnpaidInvoice.getAll().then( (invoices) => { setUnpaidInvoices(invoices);  })} />
              <PaidTable    invoices={paidInvoices}   fetchInvoices={() => PaidInvoice.getAll().then(   (invoices) => { setPaidInvoices(invoices);    })} />
              <LimboTable   invoices={limboInvoices}  fetchInvoices={() => LimboInvoice.getAll().then(  (invoices) => { setLimboInvoices(invoices);   })} />
            </div>
          </div>
        </div>
      </div>
      {/* <AssignModal /> */}
    </div>
  )
}