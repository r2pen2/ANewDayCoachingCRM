import { UserCredential } from "firebase/auth";
import { db } from "./firebase";
import { DocumentReference, doc, getDoc, setDoc } from "firebase/firestore";

export class User {
  
  firebaseUser: UserCredential;
  
  invoices: string[] = [];
  admin: boolean = false;
  formAssignments: FormAssignment[] = [];
  id: string;
  docRef: DocumentReference;
  email: string;
  displayName: string;
  pfpUrl: string;

  personalData: any = {
    displayName: "",
    email: "",
    pfpUrl: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  }

  constructor(firebaseUser: any) {
    this.firebaseUser = firebaseUser;
    this.id = firebaseUser.uid;
    this.docRef = doc(db, `users/${this.id}`);
    this.personalData.email = firebaseUser.email;
    this.personalData.displayName = firebaseUser.displayName
    this.personalData.pfpUrl = firebaseUser.photoURL;
  }
  
  async setData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setDoc(this.docRef, {
        invoices: this.invoices,
        admin: this.admin,
        formAssignments: this.formAssignments.map((formAssignment) => formAssignment.toJson()),
        id: this.id,
        personalData: this.personalData,
      }).then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      })
    })
  }

  async loadData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      getDoc(this.docRef).then((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data) {
            this.invoices = data.invoices;
            this.admin = data.admin;
            this.formAssignments = data.formAssignments;
            this.id = data.id;
            this.email = data.email;
            this.displayName = data.displayName;
            this.pfpUrl = data.pfpUrl;
            resolve();
          } else {
            reject("Document data is undefined");
          }
        } else {
          reject("Document does not exist");
        }
      }).catch((error) => {
        reject(error);
      })
    })
  }

  async createDocument(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      getDoc(this.docRef).then((doc) => {
        if (doc.exists()) {
          // This document already exists! No need to do any of this
          resolve();
        } else {
          // This is a new user
          // Create a document
          this.setData().then(() => { resolve(); }).catch((error) => { reject(error); });
        }
      }).catch((error) => {
        reject(error);
      })
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