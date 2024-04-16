import React, { useContext } from 'react'
import { CurrentUserContext } from '../App'
import { Avatar, Button } from '@mantine/core'
import { auth } from '../api/firebase'

export default function Settings() {

  const {currentUser} = useContext(CurrentUserContext)

  console.log(currentUser.photoURL)

  return (
    <div className="d-flex flex-column gap-2 align-items-center justify-content-center">
      <h1>Settings</h1>
      <p>Welcome, {currentUser.displayName}!</p>
      <p>Here you can change your name, profile picture, and darkmode preference.</p>
      <Avatar src={currentUser.photoURL} alt={currentUser.displayName} size="xl" style={{marginBottom: "1rem"}} />
      <Button>Edit Profile</Button>
      <Button onClick={() => auth.signOut()}>Sign Out</Button>
    </div>
  )
}
