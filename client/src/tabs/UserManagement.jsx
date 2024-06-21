import { Paper } from '@mantine/core'
import React from 'react'
import { User } from '../api/db/dbUser.ts';
import { navigationItems } from '../components/Navigation';
import ModuleHeader from '../components/dashboard/ModuleHeader.jsx';
import { UserSelect } from '../components/userManagement/UserManagementSelectPaper.jsx';
import { PersonalData } from '../components/userManagement/UserData.jsx';


export default function UserManagement() {

  const [selectedUser, setSelectedUser] = React.useState(null);
  const [allUsers, setAllUsers] = React.useState({});

  React.useEffect(() => { User.fetchSearch(navigationItems.ADMINUSERS).then((users) => { setAllUsers(users); }) }, [])

  return (
    <div className='d-flex flex-column gap-2 p-0 align-items-center justify-content-center py-2 px-1 container-fluid'>
      <div className="row w-100">
        <UserSelect selectedUser={selectedUser} setSelectedUser={setSelectedUser} allUsers={allUsers} />
        <div className="col-xl-9 col-12 px-1">
          <Paper withBorder className="w-100 container-fluid p-0">
            <ModuleHeader>{selectedUser ? selectedUser.personalData.displayName : "No User Selected"}</ModuleHeader>
            <div className="row w-100">
              <PersonalData user={selectedUser} />
            </div>
          </Paper>
        </div>
      </div>
    </div>
  )
}