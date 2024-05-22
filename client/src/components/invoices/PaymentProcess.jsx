// Library Imports
import { Paper } from "@mantine/core"
import React from "react"
// API Imports
import { LinkMaster } from "../../api/links.ts"
// Component Imports
import { CurrentUserContext } from "../../App"
// Style Imports
import "../../assets/style/paymentProcess.css";

const StripeLogo = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon alt-fill icon-tabler icon-tabler-credit-card" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" /><path d="M3 10l18 0" /><path d="M7 15l.01 0" /><path d="M11 15l2 0" /></svg>
const VenmoLogo = () => <svg role="img" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><title>Venmo</title><path d="M447.8 153.6c-2 43.6-32.4 103.3-91.4 179.1-60.9 79.2-112.4 118.8-154.6 118.8-26.1 0-48.2-24.1-66.3-72.3C100.3 250 85.3 174.3 56.2 174.3c-3.4 0-15.1 7.1-35.2 21.1L0 168.2c51.6-45.3 100.9-95.7 131.8-98.5 34.9-3.4 56.3 20.5 64.4 71.5 28.7 181.5 41.4 208.9 93.6 126.7 18.7-29.6 28.8-52.1 30.2-67.6 4.8-45.9-35.8-42.8-63.3-31 22-72.1 64.1-107.1 126.2-105.1 45.8 1.2 67.5 31.1 64.9 89.4z"/></svg>
const ZelleLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Zelle</title><path d="M13.559 24h-2.841a.483.483 0 0 1-.483-.483v-2.765H5.638a.667.667 0 0 1-.666-.666v-2.234a.67.67 0 0 1 .142-.412l8.139-10.382h-7.25a.667.667 0 0 1-.667-.667V3.914c0-.367.299-.666.666-.666h4.23V.483c0-.266.217-.483.483-.483h2.841c.266 0 .483.217.483.483v2.765h4.323c.367 0 .666.299.666.666v2.137a.67.67 0 0 1-.141.41l-8.19 10.481h7.665c.367 0 .666.299.666.666v2.477a.667.667 0 0 1-.666.667h-4.32v2.765a.483.483 0 0 1-.483.483Z"/></svg>
const PaidLogo = () => <svg xmlns="http://www.w3.org/2000/svg" className="stroke icon icon-tabler icon-tabler-check" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="var(--icon-color)" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" fill='none' /></svg>

export const PayButton = (props) => {
  
  const payButtonData = {
    paid: { color: "#00BF6F", text: <p>Mark Invoice Paid</p>, logo: <PaidLogo /> },
    stripe: { color: "#F47216", text: <p>Pay With Stripe</p>, logo: <StripeLogo /> },
    venmo: { color: "#008CFF", text: <p>Pay With Venmo</p>, logo: <VenmoLogo /> },
    zelle: { color: "#6D1ED4", text: <p>Pay With Zelle</p>, logo: <ZelleLogo /> }
  }

  /** When a payment method is clicked, open the href associated & propagate the onClick event */
  const handleClick = () => {
    if (props.onClick) { 
      props.onClick(); 
    }
    if (props.link) { 
      window.open(props.link, "_blank"); 
    }
  }
  
  return (
    <div className="col-12 col-md-6 pay-button p-2" style={{ "--icon-color": payButtonData[props.method].color }}>
      <Paper onClick={handleClick} withBorder className="clickable d-flex flex-column align-items-center justify-content-center w-100 h-100">
        {payButtonData[props.method].logo}
        {payButtonData[props.method].text}
      </Paper>
    </div>
  )
}

/** Then first page of the payment process */
export const FirstPage = ({secondPage, currentInvoice, setSecondPage}) => {
  
  /** Get the current user */
  const {currentUser} = React.useContext(CurrentUserContext);

  if (secondPage) { return; } // We're on the second page
  /** Link to venmo payment */
  const venmoLink = LinkMaster.createVenmoLink(currentInvoice?.amount, currentInvoice?.invoiceNumber, currentUser.personalData.displayName);
  return (
    <div className="row h-100 p-2">
      <PayButton method="venmo"   color="#008CFF"   link={venmoLink}  onClick={() => setSecondPage("venmo")}  />
      <PayButton method="zelle"   color="#6D1ED4"   link={LinkMaster.payments.zelle} />
      <PayButton method="stripe"  color="#F47216"   link={LinkMaster.payments.stripe} />
      <PayButton method="paid"    color="#00BF6F"                    onClick={() => setSecondPage("mark")}   />
    </div>
  )
}
