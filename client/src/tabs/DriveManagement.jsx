import React from 'react'
import { CRMBreadcrumbs } from '../components/Breadcrumbs'
import { navigationItems } from '../components/Navigation'

export default function DriveManagement() {
  return (
    <div>
      <CRMBreadcrumbs items={[{title: "Drive Management", href: navigationItems.ADMINDRIVE}]} />
    </div>
  )
}
