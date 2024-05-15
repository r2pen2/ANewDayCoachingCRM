// Component Imports
import { AppointmentList } from '../components/Schedule/AppointementList.jsx';
import { CalendarFrame } from '../components/Schedule/CalendarFrame.jsx';

// Style Imports
import "../assets/style/schedule.css";

export default function Schedule() {
  return [
    <AppointmentList />,
    <CalendarFrame />
  ]
}
