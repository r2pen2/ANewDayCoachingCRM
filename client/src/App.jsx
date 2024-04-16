import logo from './logo.svg';
import './App.css';
import '@mantine/core/styles.css';

import { createTheme, MantineProvider, AppShell, Burger, Group } from '@mantine/core';
import { useState } from 'react';
import { AppShellNavigator, navigationItems } from './components/Navigation';
import { AppShellHeader } from './components/Header';
import Invoices from './tabs/Invoices';
import Forms from './tabs/Forms';

const theme = createTheme({});

function App() {

  const [burgerOpen, setBurgerOpen] = useState(false);

  const [currentTab, setCurrentTab] = useState("dashboard")

  const CurrentTab = () => {
    switch (currentTab) {
      case navigationItems.DASHBOARD:
        return <div>Dashboard</div>
      case navigationItems.INVOICES:
        return <Invoices />
      case navigationItems.FORMS:
        return <Forms />
      case navigationItems.SCHEDULE:
        return <div>Schedule</div>
      case navigationItems.SETTINGS:
        return <div>Settings</div>
      default:
    }
  }

  return (
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
  );
}

export default App;
