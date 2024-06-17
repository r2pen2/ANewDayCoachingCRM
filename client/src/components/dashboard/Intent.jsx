import React from 'react'
import { CurrentUserContext } from '../../App'
import { ActionIcon, Avatar, Modal, Paper, Text, TextInput, Tooltip } from '@mantine/core'
import { IconCheck, IconEdit, IconHistory, IconSend, IconTools, IconX } from '@tabler/icons-react'
import IconButton from '../IconButton'
import { notifSuccess, notifWarn } from '../Notifications'

export default function Intent({height}) {

  const {currentUser} = React.useContext(CurrentUserContext)

  const welcomeText = `Welcome back, ${currentUser.personalData.displayName.split(" ")[0]}!`

  const intentText = (currentUser.intents && currentUser.intents[0]);

  const [newIntentText, setNewIntentText] = React.useState(null)

  const IntentTextDisplay = () => {
    if (newIntentText !== null) { return; }
    return <Text size="lg" className="text-center intent-text">{ intentText || "You haven't set an intent yet!"}</Text>
  }

  function updateIntent() {
    if (newIntentText === null) { return; }
    if (newIntentText.length === 0) {
      notifWarn("Intent Not Updated", "Your intent cannot be empty!");
      return;
    }
    currentUser.setIntent(newIntentText).then(() => {
      notifSuccess("Intent Updated", "Your intent has been updated!");
      setNewIntentText(null);
    })
  }

  function handleEnter(e) { if (e.key === "Enter") { updateIntent(); } }

  const IntentSubmit = () => ( 
    <Tooltip label="Submit">
      <ActionIcon variant="light" color="#658a54" onClick={() => updateIntent()}>
        <IconCheck />
      </ActionIcon>
    </Tooltip>  
  )

  const IntentCancel = () => ( 
    <Tooltip label="Cancel">
      <ActionIcon variant="light" color="#658a54" onClick={() => setNewIntentText(null)}>
        <IconX />
      </ActionIcon>
    </Tooltip>  
  )

  const meetingText = "Your next meeting is on 6/25 at 5pm."

  function handleClick(e) {
    if (newIntentText !== null) { return; }
    setNewIntentText("");
  }

  return (
    <Paper withBorder style={{height: height}} className="w-100 p-2 d-flex flex-column text-center align-items-center justify-content-start top-green mb-xl-2">
      <Avatar src={currentUser.personalData.pfpUrl} alt={currentUser.personalData.displayName} size="large" />
      <Text size="xl">{welcomeText}</Text>
      <Text>{meetingText}</Text>
      <div className={"container d-flex flex-row " + (newIntentText === null ? "intent-container" : "")} onClick={handleClick}>
        <div className="col-1 gap-2 d-flex flex-column align-items-center justify-content-between py-2">
          {quoteSvg}
        </div>
        <div className="col-10 p-2 gap-2 d-flex flex-column intent-edit-container align-items-center justify-content-center">
          <IntentTextDisplay />
          { newIntentText !== null && <TextInput placeholder="What's your intent?" className="w-100" value={newIntentText} onKeyDown={handleEnter} onChange={(e) => setNewIntentText(e.target.value)} /> }
          { newIntentText !== null && <div className="d-flex gap-2"><IntentSubmit /><IntentCancel /></div> }
        </div>
        <div className="col-1 gap-2 d-flex flex-column align-items-center justify-content-start py-2">
          {quoteRightSvg}
        </div>
      </div>
      <div className="d-flex gap-2 align-items-center">
        <Tooltip label="See Intent History" position='bottom'>
          <ActionIcon variant="light" color="#658a54" onClick={() => {}}>
            <IconHistory />
          </ActionIcon>
        </Tooltip>
      </div>
    </Paper>
  )
}



const quoteSvg = (
  <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" style={{borderRadius: "50%", maxWidth: 50}}>
    <path fill="#D6E3D1" d="M30,20.07C23.8,22.7,19.19,26.26,19.19,31.52c0,4.6,4.35,5.65,8.81,6.7.8.13,1.72,2,1.72,3.56,0,3.54-2.77,5.91-6.71,5.91-5.79,0-11.57-4.73-11.57-13.41,0-9.34,8.41-15.52,16.83-17.88Zm23.16,0C47,22.7,42.34,26.26,42.34,31.52c0,4.6,4.47,5.65,8.95,6.7.79.13,1.71,2,1.71,3.56,0,3.54-2.89,5.91-6.71,5.91-5.79,0-11.57-4.73-11.57-13.41,0-9.34,8.42-15.52,16.83-17.88Z"></path>
  </svg>
)

const quoteRightSvg = (
  <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" style={{transform:"scale(-1,1)", borderRadius: "50%", maxWidth: 50}}>
    <path fill="#D6E3D1" d="M30,20.07C23.8,22.7,19.19,26.26,19.19,31.52c0,4.6,4.35,5.65,8.81,6.7.8.13,1.72,2,1.72,3.56,0,3.54-2.77,5.91-6.71,5.91-5.79,0-11.57-4.73-11.57-13.41,0-9.34,8.41-15.52,16.83-17.88Zm23.16,0C47,22.7,42.34,26.26,42.34,31.52c0,4.6,4.47,5.65,8.95,6.7.79.13,1.71,2,1.71,3.56,0,3.54-2.89,5.91-6.71,5.91-5.79,0-11.57-4.73-11.57-13.41,0-9.34,8.42-15.52,16.83-17.88Z"></path>
  </svg>
)