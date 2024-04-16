import {AppShell, Badge, NavLink, Tooltip } from "@mantine/core"
import { IconHome2, IconCreditCard, IconCalendarEvent, IconSettings, IconFiles } from '@tabler/icons-react';


/**
 * Object containing names for navigation tabs.
 * @typedef {Object} NavigationStyles
 * @property {string} DASHBOARD - The dashboard's tab ID.
 * @property {string} INVOICES - The invoice page's tab ID.
 * @property {string} SCHEDULE - The schedule page's tab ID.
 * @property {string} SETTINGS - The settings page's tab ID.
 */
export const navigationItems = {
  DASHBOARD: "dashboard",
  INVOICES: "invoices",
  SCHEDULE: "schedule",
  FORMS: "forms",
  SETTINGS: "settings"
}

/**
 * Object containing the navigation styles.
 * @typedef {Object} NavigationStyles
 * @property {string} variant - The variant of the navigation styles.
 */
const navigationStyles = {
  variant: null
};

/**
 * Renders the navigation bar for the app shell.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.currentTab - The currently active tab.
 * @param {function} props.setCurrentTab - A function to set the current tab.
 * @returns {JSX.Element} The rendered component.
 */
export function AppShellNavigator({currentTab, setCurrentTab, setBurgerOpen}) {
  
  const exampleInvoicesBadgeNumber = 3
  const exampleFormsBadgeNumber = 1

  function updateTab(tab) {
    setCurrentTab(tab)
    setBurgerOpen(false)
  }

  return (    
    <AppShell.Navbar p="md">
      <NavLink
        label="Dashboard"
        leftSection={<IconHome2 />}
        variant={navigationStyles.variant}
        active={currentTab === navigationItems.DASHBOARD}
        onClick={() => updateTab(navigationItems.DASHBOARD)}
      />
      <NavLink
        label="Invoices"
        leftSection={<IconCreditCard />}
        rightSection={
          <Tooltip label={`You have ${exampleInvoicesBadgeNumber} outstanding invoice${exampleInvoicesBadgeNumber > 1 ? "s" : ""}.`}>
            <Badge size="xs" color="red" circle>
              {exampleInvoicesBadgeNumber}
            </Badge>
          </Tooltip>
        }
        variant={navigationStyles.variant}
        active={currentTab === navigationItems.INVOICES} 
        onClick={() => updateTab(navigationItems.INVOICES)}
      />
      <NavLink
        label="Schedule"
        leftSection={<IconCalendarEvent />}
        variant={navigationStyles.variant}
        active={currentTab === navigationItems.SCHEDULE}
        onClick={() => updateTab(navigationItems.SCHEDULE)}
      />
      <NavLink
        label="Forms"
        leftSection={<IconFiles />}
        rightSection={
          <Tooltip label={`There ${exampleFormsBadgeNumber > 1 ? "are" : "is"} ${exampleFormsBadgeNumber} form${exampleFormsBadgeNumber > 1 ? "s" : ""} for you to complete.`}>
            <Badge size="xs" color="red" circle>
              {exampleFormsBadgeNumber}
            </Badge>
          </Tooltip>
        }
        variant={navigationStyles.variant}
        active={currentTab === navigationItems.FORMS}
        onClick={() => updateTab(navigationItems.FORMS)}
      />
      <NavLink
        label="Settings"
        leftSection={<IconSettings />}
        variant={navigationStyles.variant}
        active={currentTab === navigationItems.SETTINGS}
        onClick={() => updateTab(navigationItems.SETTINGS)}
      />
    </AppShell.Navbar>
  )
}