import { Anchor, Avatar, Badge, Button, Center, Divider, Flex, Group, Loader, Paper, Popover, Skeleton, Text, TextInput, Tooltip } from "@mantine/core";
import { IconAt, IconCheck, IconHome, IconPencil, IconPhoneCall, IconPlus, IconRefresh, IconSchool, IconStar, IconUserCog, IconUserUp, IconX } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { User, UserRole } from "../../api/db/dbUser.ts";
import { notifFail, notifSuccess, notifWarn } from "../Notifications.jsx";
import { CurrentUserContext } from "../../App.jsx";

export const PersonalData = ({user}) => {

  const dbUser = User.getInstanceById(user?.id)
  dbUser.fillData(user);
  
  const handleEmailEditClick = () => {
    setEditEmail(!editEmail)
  }
  
  const handlePhoneEditClick = () => {
    setEditPhone(!editPhone)
  }

  const [tempEmail, setTempEmail] = useState("")
  const [tempPhone, setTempPhone] = useState("")
  const [tempAdmin, setTempAdmin] = useState(false)

  useEffect(() => {
    setTempEmail(user?.personalData.email)
    setTempPhone(user?.personalData.phoneNumber)
    setTempRole(user?.personalData.role)
    setTempAdmin(user?.admin)
  }, [user])
  
  const [editEmail, setEditEmail] = useState(false)
  const [editPhone, setEditPhone] = useState(false)

  const handleEmailEditKeyDown = (e) => { if (e.key === "Enter") { updateEmail() } }
  const handlePhoneEditKeyDown = (e) => { if (e.key === "Enter") { updatePhoneNumber() } }

  const updateEmail = () => {
    if (tempEmail.length <= 0) { return; }
    if (tempEmail === user.personalData.email) { return; }
    setEditEmail(false)
    dbUser.personalData.email = tempEmail;
    dbUser.setData().then(() => {
      notifSuccess("Email Updated", `Email for ${user.personalData.displayName} updated to ${tempEmail}.`)
    });
  }
  
  const updatePhoneNumber = () => {
    if (tempPhone.length <= 0) { return; }
    if (tempPhone === user.personalData.phoneNumber) { return; }
    setEditPhone(false)
    dbUser.personalData.phoneNumber = tempPhone;
    dbUser.setData().then(() => { 
      notifSuccess("Phone Number Updated", `Phone number for ${user.personalData.displayName} updated to ${tempPhone}.`)
    });
  }

  const [tempRole, setTempRole] = useState(user?.personalData.role)
  
  function setRole(newRole) {
    setRolePopoverOpen(false)
    if (newRole === tempRole) { return; }
    setTempRole(newRole)
    dbUser.personalData.role = newRole;
    dbUser.setData().then(() => {
      notifSuccess("Role Updated", `Role for ${user.personalData.displayName} updated to ${newRole}.`)
    })
  }

  const [rolePopoverOpen, setRolePopoverOpen] = useState(false)

  const {currentUser} = useContext(CurrentUserContext)
  const isMe = currentUser?.id === user?.id;

  const revokeAdmin = () => {
    if (isMe) {
      notifWarn("Cannot Revoke Admin", "You cannot revoke your own admin status.")
      return;
    }
    if (!window.confirm(`Are you sure you want to revoke admin status from ${user.personalData.displayName}?`)) { return; }
    dbUser.admin = false;
    setTempAdmin(false)
    dbUser.setData().then(() => {
      notifSuccess("Admin Status Revoked", `${user.personalData.displayName} is no longer an admin.`)
    })
  }
  
  const canBeAdmin = tempRole === UserRole.DEVELOPER || tempRole === UserRole.COACH
  
  const makeAdmin = () => {
    if (!canBeAdmin) {
      notifWarn("Cannot Make Admin", "Only coaches and developers can be made admins.")
      return;
    }
    if (!window.confirm(`Are you sure you want to make ${user.personalData.displayName} an admin?`)) { return;}
    setTempAdmin(true)
    dbUser.admin = true;
    dbUser.setData().then(() => {
      notifSuccess("Admin Status Granted", `${user.personalData.displayName} is now an admin.`)
    })
  }

  if (!user) { return; }
  return (
    <div className="col-12 col-lg-6 p-1 py-2">
      <Paper withBorder className="p-2 bg-gray-1 gap-2 d-flex flex-row align-items-center justify-content-lg-start justify-content-center">
        <Avatar src={user.pfpUrl} alt={user.displayName} className="m-0" size={100} style={{marginBottom: "1rem"}} />
        <div className="d-flex flex-column justify-content-center">      
          <div className="d-flex gap-2 align-items-center">
            <Popover position="right" opened={rolePopoverOpen} onClose={() => setRolePopoverOpen(false)}>
              <Popover.Target style={{cursor: "pointer"}} onClick={() => setRolePopoverOpen(true)} >
                <Text fz="sm" c="dimmed"  tt="uppercase" fw={700}>{tempRole ? tempRole : "no role"}</Text>
              </Popover.Target>
              <Popover.Dropdown className="p-0">
                <Paper withBorder className="p-2 d-flex flex-column align-items-center justify-content-center">
                  <Anchor onClick={() => setRole(UserRole.STUDENT)} >Student</Anchor>
                  <Anchor onClick={() => setRole(UserRole.PARENT)}>Parent</Anchor>
                  <Anchor onClick={() => setRole(UserRole.COACH)} >Coach</Anchor>
                  <Anchor onClick={() => setRole(UserRole.DEVELOPER)} >Developer</Anchor>
                </Paper>
              </Popover.Dropdown>
            </Popover>
            {tempAdmin && <Tooltip label="This account can manage tools, forms, invoices, and users."><Center><Badge rightSection={<IconX size="1rem" style={{cursor:!isMe ? 'pointer' : "not-allowed"}} onClick={revokeAdmin} />}>Admin</Badge></Center></Tooltip>}
            {!tempAdmin && <Tooltip label={canBeAdmin ? "Promote to Admin" : "Only COACH and DEVELOPER can promoted to admin"}><Center><IconUserUp size="1rem" style={{cursor:canBeAdmin ? 'pointer' : "not-allowed"}} className="text-dimmed" onClick={makeAdmin} /></Center></Tooltip>}
          </div>
          <Text fz="lg" fw={500}>{user.personalData.displayName}</Text>
          <Group wrap="nowrap" gap={10} mt={3}>
            <IconStar stroke={1.5} size="1rem" className="text-dimmed"/>
            <Text fz="xs" c="dimmed">"{user.intents[0]}"</Text>
          </Group>
        </div>
        <Divider orientation="vertical" className="mx-2" />
        <div className="d-flex flex-column align-items-start justify-content-start">
          <Group wrap="nowrap" gap={10} mt={3}>
            <IconAt stroke={1.5} size="1rem" className="text-dimmed"/>
            {!editEmail && <Text fz="xs" c="dimmed">{tempEmail}</Text>}
            {editEmail && <TextInput size="xs" c="dimmed" value={tempEmail} onKeyDown={handleEmailEditKeyDown} onBlur={updateEmail} onChange={e => setTempEmail(e.target.value)}/>}
            <Tooltip label={!editEmail ? "Edit Email" : "Cancel"}>
              <Center>
                {!editEmail && <IconPencil onClick={handleEmailEditClick} stroke={1.5} size="1rem" className="text-dimmed" style={{cursor: "pointer"}}/>}
                {editEmail && <IconX onClick={handleEmailEditClick} stroke={1.5} size="1rem" className="text-dimmed" style={{cursor: "pointer"}}/>}
              </Center>
            </Tooltip>
          </Group>
          <Group wrap="nowrap" gap={10} mt={3}>
            <IconPhoneCall stroke={1.5} size="1rem" className="text-dimmed"/>
            {!editPhone && <Text fz="xs" c="dimmed">{tempPhone}</Text>}
            {editPhone && <TextInput size="xs" c="dimmed" value={tempPhone} onKeyDown={handlePhoneEditKeyDown} onBlur={updatePhoneNumber} onChange={e => setTempPhone(e.target.value)}/>}
            <Tooltip label={!editPhone ? "Edit Phone Number" : "Cancel"}>
              <Center>
                {!editPhone && <IconPencil onClick={handlePhoneEditClick} stroke={1.5} size="1rem" className="text-dimmed" style={{cursor: "pointer"}}/>}
                {editPhone && <IconX onClick={handlePhoneEditClick} stroke={1.5} size="1rem" className="text-dimmed" style={{cursor: "pointer"}}/>}
              </Center>
            </Tooltip>
          </Group>
          <Group wrap="nowrap" gap={10} mt={3}>
            <IconHome stroke={1.5} size="1rem" className="text-dimmed"/>
            <Text fz="xs" c="dimmed">{user.personalData.address}, {user.personalData.city} {user.personalData.state}, {user.personalData.zip}</Text>
          </Group>
        </div>
      </Paper>
    </div>
  )
}

export const SyncData = ({user, changeSelectedUser}) => {

  const dbUser = User.getInstanceById(user?.id)
  dbUser.fillData(user);

  const [tempSyncCode, setTempSyncCode] = useState(user?.syncCode)

  useEffect(() => {
    setTempSyncCode(user?.syncCode)
  }, [user])

  const [editSyncCode, setEditSyncCode] = useState(false)

  const regenSync = () => {
    dbUser.generateSyncCode().then((c) => {
      setTempSyncCode(c)
      dbUser.setData().then(() => {
        notifSuccess("Sync Code Regenerated", `Sync code for ${user.personalData.displayName} has been regenerated.`)
      })
    })
  }

  const handleSyncCodeKeyDown = (e) => { if (e.key === "Enter") { updateSyncCode() } }
  const updateSyncCode = () => {
    if (tempSyncCode.length <= 0) { 
      notifFail("Invalid Sync Code", "Sync code cannot be empty.")
      return;
    }
    if (!checkThatCodeStringIsValid(tempSyncCode)) {
      notifFail("Invalid Sync Code", "Sync code can only contain capital letters and numbers.")
      return;
    }
    if (tempSyncCode === user.syncCode) { return; }
    User.getSyncCodeOwner(tempSyncCode).then((codeUsed) => {
      if (!codeUsed) {
        dbUser.syncCode = tempSyncCode;
        dbUser.setData().then(() => {
          notifSuccess("Sync Code Updated", `Sync code for ${user.personalData.displayName} updated to ${tempSyncCode}.`)
          setEditSyncCode(false)
        })
      } else {
        notifFail("Sync Code Already Used", `Sync code ${tempSyncCode} is already in use by another user. Please choose a different code.`)
      }
    })
  }

  function getCodeString(string) {
    return string.replace(/[^A-Z0-9]/ig, "").toUpperCase()
  }
  
  function checkThatCodeStringIsValid(string) {
    return string.match(/[^A-Z0-9]/ig) === null
  }

  const [linking, setLinking] = useState(false)

  const link = () => {
    const code = getCodeString(document.getElementById("sync-input").value)
    if (!code || code.length <= 0) {
      notifFail("Invalid Sync Code", "Sync code cannot be empty.")
      setLinking(false);
      return;
    }
    if (code === user.syncCode) {
      notifFail("Cannot Link", "You cannot link your own account.")
      setLinking(false);
      return;
    }
    if (!checkThatCodeStringIsValid(code)) {
      notifFail("Invalid Sync Code", "Sync code can only contain capital letters and numbers.")
      setLinking(false);
      return;
    }
    setLinking(false)
    User.getSyncCodeOwner(code).then((u) => {
      if (u) {

        dbUser.linkAccount(u.id).then(() => {
          notifSuccess("Account Linked", `Account linked to ${u.personalData.displayName}.`)
        })
      
        const otherUser = User.getInstanceById(u.id)
        otherUser.fillData(u)
        otherUser.linkAccount(dbUser.id)
      }
    })

    dbUser.linkAccount()
  }

  const copySync = () => {
    navigator.clipboard.writeText(tempSyncCode)
    notifSuccess("Sync Code Copied", `Sync code for ${user.personalData.displayName} copied to clipboard.`)
  }

  if (!user) { return; }
  return (
    <div className="col-12 col-lg-6 p-1 py-2">
      <Paper withBorder className="h-100  p-2 bg-gray-1 gap-2 d-flex flex-row align-items-center justify-content-lg-start justify-content-center">
        <div className="w-100 d-flex align-items-center gap-2 justify-content-center flex-column">
          <div className="d-flex flex-row gap-2">
            <Text fz="sm" c="dimmed" tt="uppercase" fw={700}>Sync Code</Text>
            {!editSyncCode && <Tooltip label="Regenerate Sync Code">
              <Center>
                <IconRefresh onClick={regenSync} stroke={1.5} size="1rem" className="text-dimmed" style={{cursor: "pointer"}}/>
              </Center>
            </Tooltip>}
            {!editSyncCode && <Tooltip label="Set Sync Code">
              <Center>
                <IconPencil onClick={() => setEditSyncCode(true)} stroke={1.5} size="1rem" className="text-dimmed" style={{cursor: "pointer"}}/>
              </Center>
            </Tooltip>}
          </div>
          {!editSyncCode && <Text fz="lg" fw={500} style={{cursor: "pointer"}} onClick={copySync}>{tempSyncCode}</Text>}
          <div className="d-flex gap-2">
            {editSyncCode && <TextInput size="xs" c="dimmed" value={tempSyncCode} onKeyDown={handleSyncCodeKeyDown} onBlur={updateSyncCode} onChange={e => setTempSyncCode(getCodeString(e.target.value))}/>}
            {editSyncCode && 
                <Tooltip label="Cancel">
                <Center>
                  <IconX onClick={() => setEditSyncCode(false)} stroke={1.5} size="1rem" className="text-dimmed" style={{cursor: "pointer"}}/>
                </Center>
              </Tooltip>
            }
          </div>
        </div>
        <Divider orientation="vertical" className="mx-2" />
        <div className="w-100 d-flex flex-column align-items-center justify-content-start h-100 pt-2">
          <Text fz="sm" c="dimmed" tt="uppercase" fw={700}>Linked Accounts</Text>
          {user?.linkedAccounts.map((id, index) => <LinkedAccount changeSelectedUser={changeSelectedUser} key={index} id={id} />)}
          {!linking && <Tooltip position="bottom" label="Link Account" onClick={() => setLinking(true)}>
            <IconPlus stroke={1.5} size="1rem" className="text-dimmed" style={{cursor: "pointer"}}/>
          </Tooltip>}
          {linking && <div className="d-flex align-items-center justify-content-center w-100 gap-2"><TextInput id="sync-input" size="xs" c="dimmed" placeholder="Sync Code" onKeyDown={(e) => { if (e.key === "Enter") { link() } }} /><Tooltip label="Done"><IconCheck size="1rem" onClick={link} className="text-dimmed" /></Tooltip></div>}
        </div>
      </Paper>
    </div>
  )
}

const LinkedAccount = ({id, changeSelectedUser}) => {
  const [userData, setUserData] = useState(null)
  useEffect(() => {
    User.getById(id).then((data) => { setUserData(data) })
  }, [id])
  const handleLinkedUserClick = (e) => {
    e.preventDefault();
    changeSelectedUser(id)
  }
  if (!userData) { return <Skeleton /> }
  if (!userData.personalData) { return; }
  return (
    <Anchor onClick={handleLinkedUserClick} className="gap-2 d-flex flex-row">
      <Text fz="sm" fw={500}>{userData.personalData.displayName} ({userData.personalData.role})</Text>
    </Anchor>
  )
}