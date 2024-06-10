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
import ExternalToolsList from '../components/dashboard/ExternalToolsList.jsx';
import Intent from '../components/dashboard/Intent.jsx';
import { Carousel, CarouselSlide } from '@mantine/carousel';
import NextMeetingNotif from '../components/dashboard/NextMeetingNotif.jsx';

export default function Dashboard() {
  
  const [subjectAddMenuOpen, setSubjectAddMenuOpen] = React.useState(false);
  const [homeworkAddMenuOpen, setHomeworkAddMenuOpen] = React.useState(false);

  return (
    <div className="container-fluid w-100">
      <div className="row">     
        {/* <NextMeetingNotif /> */}
        <div className="d-xxl-none col-12">
          <Carousel height="auto" slideSize="90%" slideGap={10} withControls={false}>
            <CarouselSlide>
              <Intent height="100%" />
            </CarouselSlide>
            <CarouselSlide>
              <ToolsList height="100%" />
            </CarouselSlide>
            <CarouselSlide>
              <DocumentsList height="100%" />
            </CarouselSlide>
            <CarouselSlide>
              <ExternalToolsList height="100%" />
            </CarouselSlide>
          </Carousel>
        </div>
        <div className="col-12 col-xxl-9">      
          <Tracker setHomeworkAddMenuOpen={setHomeworkAddMenuOpen} setSubjectAddMenuOpen={setSubjectAddMenuOpen}/>
        </div>
        <div className="d-none d-xxl-block col-xxl-3">        
          <Intent />
          <ToolsList />
          <DocumentsList />
          <ExternalToolsList />
        </div>
        <AddSubjectModal open={subjectAddMenuOpen} close={() => setSubjectAddMenuOpen(false)} />
        <AddHomeworkModal open={homeworkAddMenuOpen} close={() => setHomeworkAddMenuOpen(false)} />
      </div>
    </div>
  )
}