import { UserCredential } from "firebase/auth";
import { db } from "./firebase";
import { DocumentReference, addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";

const rachelDocRef = doc(db, "users/rachel");
const invoiceLimboCollectionRef = collection(db, "invoiceLimbo");
const toolsCollectionRef = collection(db, "tools");

export const hostname = "https://www.crm.joed.dev"

export class User {
  
  firebaseUser: UserCredential;
  
  invoices: string[] = [];
  unpaidInvoices: string[] = [];
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
        unpaidInvoices: this.unpaidInvoices,
      }).then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      })
    })
  }

  fillData(data: any): User {
    this.invoices = data.invoices;
    this.admin = data.admin;
    this.formAssignments = data.formAssignments;
    this.id = data.id;
    this.email = data.email;
    this.displayName = data.displayName;
    this.pfpUrl = data.pfpUrl;
    return this;
  }

  async createDocument(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      getDoc(this.docRef).then((doc) => {
        if (doc.exists()) { resolve(); } else { this.setData().then(() => { resolve(); }).catch((error) => { reject(error); }); }
      }).catch((error) => {
        reject(error);
      })
    })
  }

  /** Need to be able to create a shallow clione so that state can update */
  clone(): User { return new User(this.firebaseUser).fillData(this); }

  subscribe(setter: Function) {
    onSnapshot(this.docRef, (doc) => {
      if (doc.exists()) {
        this.fillData(doc.data());
        // We need to create a clone of this User object so that the state actually updates
        const cloneUser = this.clone()
        setter(cloneUser);
      }
    })
  }
}

export class FormAssignment {
  formId: string;
  formTitle: string;
  formDescription: string;
  assignedDate: Date | null;
  dueDate: Date | null;
  completed: boolean;
  completedDate: Date | null;
  assignedTo: string | null;
  comment: string | null;
  priority: number;
  href: string;
  assignedLink: string | null;

  static PRIORITIES = {
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2,
  }

  constructor(formId: string, formTitle: string, formDescription: string, href: string) {
    this.formId = formId;
    this.formTitle = formTitle;
    this.assignedDate = null;
    this.dueDate = null;
    this.completed = false;
    this.completedDate = null;
    this.assignedTo = null;
    this.comment = null;
    this.priority = FormAssignment.PRIORITIES.LOW;
    this.formDescription = formDescription;
    this.href = href;
    this.assignedLink = null;
  }
  
  toJson() {
    return {
      formId: this.formId,
      formTitle: this.formTitle,
      assignedDate: this.assignedDate,
      dueDate: this.dueDate,
      completed: this.completed,
      completedDate: this.completedDate,
      assignedTo: this.assignedTo,
      comment: this.comment,
      priority: this.priority,
      formDescription: this.formDescription,
      href: this.href,
      assignedLink: this.assignedLink,
    }
  }

  setPriority(priority: number): void {
    this.priority = priority;
  }

  setDueDate(dueDate: Date): void {
    this.dueDate = dueDate;
  }

  addComment(comment: string): void {
    this.comment = comment;
  }
  
  assign(assignee: string, comment?: string, priority?: number): void {
    
    this.assignedDate = new Date();               // Set assignment date
    this.assignedTo = assignee;                   // Set assignee
    this.assignedLink = this.href + assignee;     // Set link to form

    if (comment) { this.comment = comment; }      // Add comment if specified
    if (priority) { this.priority = priority; }   // Add priority if specified

    console.log(`Assigned ${this.formId} to ${assignee}`)

    fetch(hostname + "/forms/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        formData: this.toJson(),
        userId: assignee
      })
    }).catch((error) => {
      console.error(error);
    })
  }
}

export class Invoice {
  
  static getDaysBefore(n: number) { const today = new Date(); today.setDate(today.getDate() - n); return today; }

  invoiceId: string;
  invoiceNumber: number;
  paid: boolean;
  amount: number;
  createdAt: Date;
  paidAt: Date | null = null;
  dueAt: Date;
  href: string;
  assignedTo: string;
  docRef: DocumentReference;
  limboId: string | null = null;

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
  constructor(invoiceId: string, invoiceNumber: number, paid: boolean, amount: number, createdAt: Date, paidAt: Date | null, dueAt: Date, href: string, assignedTo: string) {
    this.invoiceId = invoiceId;
    this.invoiceNumber = invoiceNumber;
    this.paid = paid;
    this.amount = amount;
    this.createdAt = createdAt;
    this.paidAt = paidAt;
    this.dueAt = dueAt;
    this.href = href;
    this.assignedTo = assignedTo;
    this.docRef = doc(db, `invoices/${this.invoiceId}`)
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
      assignedTo: this.assignedTo,
      limboId: this.limboId
    }
  }

  async setData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setDoc(this.docRef, this.toJson()).then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      })
    })
  }

  tellRachelIHaveBeenPaid(): Promise<DocumentReference> {
    return new Promise<DocumentReference>((resolve, reject) => {
      console.log("Rachel, I have been paid!");
      this.paidAt = new Date();
      addDoc(invoiceLimboCollectionRef, this.toJson()).then(limboRef => {
        resolve(limboRef);
        this.limboId = limboRef.id;
      });
      this.setData();
    })

  }

  tellRachelIHaveNotBeenPaid(limboRef: DocumentReference | null): void {
    console.log("Rachel, I've made a mistake!");
    this.paidAt = null;
    if (!limboRef) {
      limboRef = doc(db, `invoiceLimbo/${this.limboId}`);
    }
    this.limboId = null;
    this.setData();
    deleteDoc(limboRef);
  }

  checkLate(): boolean {
    return this.dueAt < new Date();
  }

  getDaysLate(): number {
    return Math.floor((new Date().getTime() - this.dueAt.getTime()) / (1000 * 60 * 60 * 24)) - 1;
  }

  checkPending(): boolean {
    return this.paidAt !== null && !this.paid;
  }
}

export class Tool {
  static async createOnDatabase(title: string, description: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      fetch(hostname + "/tools/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title,
          description: description
        })
      }).then((response) => {
        response.json().then((data) => {
          resolve(data.id);
        })
      }).catch((error) => {
        reject(error);
      })
    })
  }

  static async fetchAll(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      fetch(hostname + "/tools").then((response) => {
        response.json().then((data) => {
          resolve(data);
        })
      }).catch((error) => {
        reject(error);
      })
    })
  }

  static async delete(id: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      fetch(hostname + "/tools/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: id
        })
      }).then((res) => {
        res.json().then((data) => {
          resolve(data.success);
        })
      }).catch((error) => {
        reject(error);
      })
    })
  }
}