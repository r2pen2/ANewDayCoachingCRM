// Library Imports
import React from 'react';

// Component Imports
import { Tracker } from '../components/dashboard/HomeworkTracker.jsx';
import { ToolsList } from '../components/dashboard/ToolsList.jsx';
import { AddHomeworkModal, AddSubjectModal } from '../components/dashboard/HomeworkTrackerModals.jsx';

// Style Imports
import '@mantine/carousel/styles.css';
import "../assets/style/dashboard.css";
import DocumentsList from '../components/dashboard/DocumentsList.jsx';
import { CRMBreadcrumbs } from '../components/Breadcrumbs.jsx';
import { navigationItems } from '../components/Navigation.jsx';
import ExternalToolsList from '../components/dashboard/ExternalToolsList.jsx';

export default function Dashboard() {
  
  const [subjectAddMenuOpen, setSubjectAddMenuOpen] = React.useState(false);
  const [homeworkAddMenuOpen, setHomeworkAddMenuOpen] = React.useState(false);

  return (
    <div>
      <CRMBreadcrumbs items={[{title: "Dashboard", href: navigationItems.DASHBOARD}]} />
      <AddSubjectModal open={subjectAddMenuOpen} close={() => setSubjectAddMenuOpen(false)} />
      <AddHomeworkModal open={homeworkAddMenuOpen} close={() => setHomeworkAddMenuOpen(false)} />
      <Tracker setHomeworkAddMenuOpen={setHomeworkAddMenuOpen} setSubjectAddMenuOpen={setSubjectAddMenuOpen}/>
      <ToolsList />
      <div className="container-fluid">
        <div className="row">
          <div className="mt-3 col-12 col-xl-6">
            <DocumentsList />
          </div>
          <div className="mt-3 col-12 col-xl-6">
            <ExternalToolsList />
          </div>
        </div>
      </div>
    </div>
  )
}