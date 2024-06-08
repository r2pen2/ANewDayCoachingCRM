// Library Imports
import React, { useContext } from 'react'
import { Avatar, Blockquote, Button } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'

// API Imports
import { auth } from '../api/firebase'

// Component Imports
import { CurrentUserContext } from '../App'
import { CRMBreadcrumbs } from '../components/Breadcrumbs'
import { navigationItems } from '../components/Navigation'

export default function Settings() {

  const {currentUser} = useContext(CurrentUserContext)

  return (
    <div className="d-flex flex-column gap-2 align-items-center justify-content-center">

      <CRMBreadcrumbs items={[{title: "Settings", href: navigationItems.SETTINGS}]} />

      <SettingsIntro currentUser={currentUser} />
      <SettingsAvatar currentUser={currentUser} />
      
      <Button>Edit Profile</Button>
      <Button onClick={() => auth.signOut()}>Sign Out</Button>
      
      <Blockquote color="blue" icon={<IconInfoCircle />} mt="xl">
        1. Let's brainstorm other settings that could be included. Phone number? Alternative email? Home address? Parent contacts?
      </Blockquote>
    </div>
  )
}

const SettingsIntro = ({currentUser}) => [
  <h1 key="settings-header">Settings</h1>,
  <p key="settings-display-name">Welcome, {currentUser.personalData.displayName}!</p>,
  <p key="settings-directions">Here you can change your name, profile picture, and darkmode preference.</p>
];

const SettingsAvatar = ({currentUser}) => <Avatar src={currentUser.personalData.pfpUrl} alt={currentUser.personalData.displayName} size="xl" style={{marginBottom: "1rem"}} />