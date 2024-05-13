import { UserCredential } from "firebase/auth";
import { db } from "./firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

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

  async checkIfExists(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const docRef = doc(db, `users/${this.getUid()}`);
      getDoc(docRef).then((doc) => {
        if (doc.exists()) {
          resolve(true);
        } else {
          resolve(false);
        }
      }).catch((error) => {
        reject(error);
      })
    })
  }

  async createDocument(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const docRef = doc(db, `users/${this.getUid()}`);
      setDoc(docRef, {
        invoices: this.invoices,
        admin: this.admin,
        formAssignments: this.formAssignments.map((formAssignment) => { return formAssignment.toJson(); })
      }).then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      }
      )
    })
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

  toJson() {
    return {
      formId: this.formId,
      formTitle: this.formTitle,
      assignedDate: this.assignedDate,
      dueDate: this.dueDate,
      completed: this.completed,
      completedDate: this.completedDate,
      assignedTo: this.assignedTo,
      started: this.started,
      comment: this.comment,
      priority: this.priority,
      lastModified: this.lastModified
    }
  }
}

export class Invoice {
  
  static getDaysBefore(n: number) { const today = new Date(); today.setDate(today.getDate() - n); return today; }

  invoiceId: string;
  invoiceNumber: string;
  paid: boolean;
  amount: number;
  createdAt: Date;
  paidAt: Date;
  dueAt: Date;
  href: string;
  assignedTo: string;

  /**
   * 
   * @param invoiceId - firestoreId of this invoice
   * @param invoiceNumber - invoice numerical identifier 
   * @param paid - boolean indicating if invoice has been paid
   * @param amount - amount of invoice
   * @param createdAt - date invoice was created
   * @param paidAt - date invoice was paid
   * @param dueAt - date invoice is due
   * @param href - link to invoice pdf
   * @param assignedTo - firestoreId of user assigned to this invoice
   */
  constructor(invoiceId: string, invoiceNumber: string, paid: boolean, amount: number, createdAt: Date, paidAt: Date, dueAt: Date, href: string, assignedTo: string) {
    this.invoiceId = invoiceId;
    this.invoiceNumber = invoiceNumber;
    this.paid = paid;
    this.amount = amount;
    this.createdAt = createdAt;
    this.paidAt = paidAt;
    this.dueAt = dueAt;
    this.href = href;
    this.assignedTo = assignedTo;
  }

  toJson() {
    return {
      invoiceId: this.invoiceId,
      invoiceNumber: this.invoiceNumber,
      paid: this.paid,
      amount: this.amount,
      createdAt: this.createdAt,
      paidAt: this.paidAt,
      dueAt: this.dueAt,
      href: this.href,
      assignedTo: this.assignedTo
    }
  }
}