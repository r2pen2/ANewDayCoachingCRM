import {AppShell, Badge, NavLink, Tooltip } from "@mantine/core"
import { IconHome2, IconCreditCard, IconCalendarEvent, IconSettings, IconFiles, IconTools, IconForms } from '@tabler/icons-react';
import { useContext } from "react";
import { CurrentUserContext } from "../App";


/**
 * Object containing names for navigation tabs.
 * @typedef {Object} NavigationStyles
 * @property {string} DASHBOARD - The dashboard's tab ID.
 * @property {string} INVOICES - The invoice page's tab ID.
 * @property {string} SCHEDULE - The schedule page's tab ID.
 * @property {string} SETTINGS - The settings page's tab ID.
 * @property {string} TOOLS - The tools page's tab ID.
 */
export const navigationItems = {
  DASHBOARD: "dashboard",
  INVOICES: "invoices",
  SCHEDULE: "schedule",
  FORMS: "forms",
  SETTINGS: "settings",
  ADMINTOOLS: "tools-admin",
  ADMINFORMS: "forms-admin",
  ADMININVOICES: "invoices-admin",
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
  
  const {currentUser} = useContext(CurrentUserContext)
  
  /** Change current tab state & close the burger when a new tab is pressed */
  function updateTab(tab) { setCurrentTab(tab); setBurgerOpen(false); }
  
  /** Renders the invoices badge when there are unpaid invoices */
  const InvoicesBadge = () => {
    /** The number to display in invoices badge */
    const invoiceBadgeNumber = currentUser.numUnpaidInvoices;
    /** The text to display as tooltop over forms badge */
    const invoicesBadgeTooltipText = `You have ${invoiceBadgeNumber} outstanding invoice${invoiceBadgeNumber > 1 ? "s" : ""}.`
    if (invoiceBadgeNumber <= 0) { return; }
    return (
      <Tooltip label={invoicesBadgeTooltipText}>
        <Badge size="xs" color="red" circle>{invoiceBadgeNumber}</Badge>
      </Tooltip>
    )
  }

  /** Renders the forms badge when there are incomplete forms */
  const FormsBadge = () => {
    /** The number to display in forms badge */
    const formsBadgeNumber = currentUser.formAssignments.filter(fa => fa.completed === false).length;
    /** The text to display as tooltop over invoices badge */
    const formsBadgeTooltipText = `There ${formsBadgeNumber > 1 ? "are" : "is"} ${formsBadgeNumber} form${formsBadgeNumber > 1 ? "s" : ""} for you to complete.`;
    if (formsBadgeNumber <= 0) { return; }
    return (
      <Tooltip label={formsBadgeTooltipText}>
        <Badge size="xs" color="red" circle>{formsBadgeNumber}</Badge>
      </Tooltip>
    )
  }

  const AdminTabs = () => {
    if (!currentUser.admin) { return; }
    return [
      <NavLink
        key="admin-tools-nav"
        label="Manage Tools"
        leftSection={<IconTools />}
        variant={navigationStyles.variant}
        active={currentTab === navigationItems.ADMINTOOLS}
        onClick={() => updateTab(navigationItems.ADMINTOOLS)}
      />,
      <NavLink
        key="admin-forms-nav"
        label="Manage Forms"
        leftSection={<IconFiles />}
        variant={navigationStyles.variant}
        active={currentTab === navigationItems.ADMINFORMS}
        onClick={() => updateTab(navigationItems.ADMINFORMS)}
      />,
      <NavLink
        key="admin-invoices-nav"
        label="Manage Invoices"
        leftSection={<IconCreditCard />}
        variant={navigationStyles.variant}
        active={currentTab === navigationItems.ADMININVOICES}
        onClick={() => updateTab(navigationItems.ADMININVOICES)}
      />,
    ]
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
        rightSection={<InvoicesBadge />}
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
        rightSection={<FormsBadge />}
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
      <AdminTabs />
    </AppShell.Navbar>
  )
}