// Library Imports
import React from 'react';

// Component Imports
import { Tracker } from '../components/dashboard/HomeworkTracker.jsx';
import { ToolsList } from '../components/dashboard/ToolsList.jsx';
import { AddHomeworkModal, AddSubjectModal } from '../components/dashboard/HomeworkTrackerModals.jsx';

// Style Imports
import '@mantine/carousel/styles.css';
import "../assets/style/dashboard.css";

export default function Dashboard() {
  
  const [subjectAddMenuOpen, setSubjectAddMenuOpen] = React.useState(false);
  const [homeworkAddMenuOpen, setHomeworkAddMenuOpen] = React.useState(false);

  return (
    <div>
      <AddSubjectModal open={subjectAddMenuOpen} close={() => setSubjectAddMenuOpen(false)} />
      <AddHomeworkModal open={homeworkAddMenuOpen} close={() => setHomeworkAddMenuOpen(false)} />
      <Tracker setHomeworkAddMenuOpen={setHomeworkAddMenuOpen} setSubjectAddMenuOpen={setSubjectAddMenuOpen}/>
      <ToolsList />
    </div>
  )
}