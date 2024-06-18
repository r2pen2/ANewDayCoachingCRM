import { FormAssignment } from "./db/dbFormAssignment.ts";


export const parentGuardianForm: FormAssignment = new FormAssignment("parentGuardianForm", "Parent / Guardian Application Form", "Basic information about the student and parent or guardian.", "https://docs.google.com/forms/d/e/1FAIpQLSeZ7lFNqQ4KYdrvgoWZ7uo9H82dJ5xXyT4wiB63xU1f23IrTw/viewform?usp=pp_url&entry.986666223=", 20);
export const webHookTestForm: FormAssignment = new FormAssignment("webhookTestForm", "Webhook Test Form", "A form designed to validate functionality of Webooks interacting with Firestore Database.", "https://docs.google.com/forms/d/e/1FAIpQLScE6pUzztBY-mbD6NrQl6R-qeDLAJOp2_QWR0uUR7NyMu_TJg/viewform?usp=pp_url&entry.1520732463=", 1);

export const allForms: FormAssignment[] = [parentGuardianForm, webHookTestForm];

export function getFormById(id: string): FormAssignment | null {
  switch(id) {
    case parentGuardianForm.formId: return parentGuardianForm;
    case webHookTestForm.formId: return webHookTestForm;
    default: return null;
  }
}