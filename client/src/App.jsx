import logo from './logo.svg';
import './App.css';
import '@mantine/core/styles.css';

import { createTheme, MantineProvider, AppShell, Burger, Group } from '@mantine/core';
import { createContext, useEffect, useState } from 'react';
import { AppShellNavigator, navigationItems } from './components/Navigation';
import { AppShellHeader } from './components/Header';
import Invoices from './tabs/Invoices';
import Forms from './tabs/Forms';
import Settings from './tabs/Settings';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getCurrentUser } from './api/firebase';
import Login from './tabs/Login';
import Schedule from './tabs/Schedule';

const theme = createTheme({});

export const CurrentUserContext = createContext();

function App() {

  const [burgerOpen, setBurgerOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("dashboard")
  const [currentUser, setCurrentUser] = useState(null);

  const CurrentTab = () => {
    switch (currentTab) {
      case navigationItems.DASHBOARD:
        return <div>Dashboard</div>
      case navigationItems.INVOICES:
        return <Invoices />
      case navigationItems.FORMS:
        return <Forms />
      case navigationItems.SCHEDULE:
        return <Schedule />
      case navigationItems.SETTINGS:
        return <Settings />
      default:
    }
  }

  /** Get the current user on load */
  useEffect(() => { getCurrentUser(setCurrentUser); }, [])

  if (!currentUser) {
    return <MantineProvider theme={theme}><Login /></MantineProvider>
  }

  return (
    <CurrentUserContext.Provider value={{currentUser, setCurrentUser}}>
    <MantineProvider theme={theme}>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !burgerOpen } }}
        padding="md"
      >
        <AppShellHeader burgerOpen={burgerOpen} setBurgerOpen={setBurgerOpen}/> 
        <AppShellNavigator currentTab={currentTab} setCurrentTab={setCurrentTab} setBurgerOpen={setBurgerOpen}/>
        <AppShell.Main>
          <CurrentTab />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
    </CurrentUserContext.Provider>
  );
}

export default App;
