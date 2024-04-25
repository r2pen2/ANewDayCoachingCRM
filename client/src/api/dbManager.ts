import { UserCredential } from "firebase/auth";

export class User {
  
  firebaseUser: UserCredential;
  
  invoices: string[] = [];
  admin: boolean = false;
  formAssignments: FormAssignment[] = [];


  constructor(firebaseUser: UserCredential) {
    this.firebaseUser = firebaseUser;
  }

  getUid(): string | null {
    return this.firebaseUser.user.uid;
  }

  getEmail(): string | null {
    return this.firebaseUser.user.email;
  }

  getDisplayName(): string | null {
    return this.firebaseUser.user.displayName;
  }
}

export class FormAssignment {
  formId: string;
  formTitle: string;
  assignedDate: Date;
  dueDate: Date;
  completed: boolean;
  completedDate: Date;
  assignedTo: string;
  started: boolean;
  comment: string | null;
  priority: number;
  lastModified: Date;
}

export class Invoice {
  invoiceId: string;
  invoiceNumber: string;
  paid: boolean;
  amount: number;
  createdAt: Date;
  paidAt: Date;
  dueAt: Date;
  href: string;
  assignedTo: string;
}