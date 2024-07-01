import { Paper } from '@mantine/core'
import React from 'react'
import { User } from '../api/db/dbUser.ts';
import { navigationItems } from '../components/Navigation';
import ModuleHeader from '../components/dashboard/ModuleHeader.jsx';
import { UserSelect } from '../components/userManagement/UserManagementSelectPaper.jsx';
import { PersonalData, SyncData, InvoiceData, AddInvoice, ManagementTracker, FormsData } from '../components/userManagement/UserData.jsx';


export default function UserManagement() {

  const [selectedUser, setSelectedUser] = React.useState(null);
  const [allUsers, setAllUsers] = React.useState({});

  React.useEffect(() => { User.fetchSearch(navigationItems.ADMINUSERS).then((users) => { setAllUsers(users); }) }, [])

  const [fullUserData, setFullUserData] = React.useState(null)
  
  React.useEffect(() => {
    if (selectedUser) {
      User.getById(selectedUser.id).then((userData) => {
        setFullUserData(userData)
      })
    } else {
      setFullUserData(null)
    }
  }, [selectedUser])

  function changeSelectedUser(id) {
    setSelectedUser(allUsers[id])
  }

  return (
    <div className='d-flex flex-column gap-2 p-0 align-items-center justify-content-center py-2 px-1 container-fluid'>
      <div className="row w-100">
        <UserSelect selectedUser={selectedUser} setSelectedUser={setSelectedUser} allUsers={allUsers} />
        <div className="col-xl-9 col-12 px-1">
          <Paper withBorder className="w-100 container-fluid px-0">
            <ModuleHeader>{selectedUser ? selectedUser.personalData.displayName : "No User Selected"}</ModuleHeader>
            <div className="row m-0">
              <PersonalData user={fullUserData} />
              <SyncData user={fullUserData} changeSelectedUser={changeSelectedUser} />
              <ManagementTracker user={fullUserData} />
              <AddInvoice user={fullUserData} setFullUserData={setFullUserData} />
              <InvoiceData user={fullUserData} />
              <FormsData user={fullUserData} setFullUserData={setFullUserData} />
            </div>
          </Paper>
        </div>
      </div>
    </div>
  )
}