import { UserCredential } from "firebase/auth";
import { db } from "./firebase";
import { DocumentReference, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { navigationItems } from "../components/Navigation";

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
  tools: any[] = [];
  numUnpaidInvoices: number = 0;

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
        tools: this.tools
      }).then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      })
    })
  }

  static async fetchAll(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      fetch(hostname + "/users").then((response) => {
        response.json().then((data) => {
          resolve(data);
        })
      }).catch((error) => {
        reject(error);
      })
    })
  }

  static async fetchSearch(navPage: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      
      let endpoint = ""
      if (navPage === navigationItems.ADMINFORMS) {
        endpoint = "search-forms";
      } else if (navPage === navigationItems.ADMINTOOLS) {
        endpoint = "search-tools";
      }

      fetch(hostname + `/users/${endpoint}`).then((response) => {
        response.json().then((data) => {
          resolve(data);
        })
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
    this.personalData = data.personalData;
    this.unpaidInvoices = data.unpaidInvoices;
    this.tools = data.tools;
    this.numUnpaidInvoices = data.numUnpaidInvoices;
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
  href: string;
  assignedLink: string | null;

  constructor(formId: string, formTitle: string, formDescription: string, href: string) {
    this.formId = formId;
    this.formTitle = formTitle;
    this.assignedDate = null;
    this.dueDate = null;
    this.completed = false;
    this.completedDate = null;
    this.assignedTo = null;
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
      formDescription: this.formDescription,
      href: this.href,
      assignedLink: this.assignedLink,
    }
  }

  setDueDate(dueDate: Date): void {
    this.dueDate = dueDate;
  }

  /**
   * Assign a form to a user
   * @param assignee - userId of assignee
   */
  assign(assignee: string): Promise<boolean> {
    
    this.assignedDate = new Date();               // Set assignment date
    this.assignedTo = assignee;                   // Set assignee
    this.assignedLink = this.href + assignee;     // Set link to form

    return new Promise<boolean>((resolve, reject) => {
      fetch(hostname + "/forms/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          formData: this.toJson(),
          userId: assignee
        })
      }).then((response) => {
        response.json().then((data) => {
          resolve(data.success);
        })
      }).catch((error) => { console.error(error); reject(error) })
    })
  }

    /**
   * Unassign a form from a user
   * @param assignee - userId of assignee
   */
    unassign(assignee: string): Promise<boolean> {
  
      return new Promise<boolean>((resolve, reject) => {
        fetch(hostname + "/forms/unassign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            formId: this.formId,
            userId: assignee
          })
        }).then((response) => {
          response.json().then((data) => {
            resolve(data.success);
          })
        }).catch((error) => { console.error(error); reject(error) })
      })
    }

    /**
   * Mark a form as incomplete on a user
   * @param assignee - userId of assignee
   */
    incomplete(assignee: string): Promise<boolean> {
  
      return new Promise<boolean>((resolve, reject) => {
        fetch(hostname + "/forms/incomplete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            formId: this.formId,
            userId: assignee
          })
        }).then((response) => {
          response.json().then((data) => {
            resolve(data.success);
          })
        }).catch((error) => { console.error(error); reject(error) })
      })
    }

  assignToMultiple(userIds: string[]): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      let success = true;
      for (const userId of userIds) {
        success = success && await this.assign(userId);
      }
      if (success) { resolve(true); } else { reject(false); }
    });
  }

  unassignToMultiple(userIds: string[]): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      let success = true;
      for (const userId of userIds) {
        success = success && await this.unassign(userId);
      }
      if (success) { resolve(true); } else { reject(false); }
    });
  }

  incompleteToMultiple(userIds: string[]): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      let success = true;
      for (const userId of userIds) {
        success = success && await this.incomplete(userId);
      }
      if (success) { resolve(true); } else { reject(false); }
    });
  }

  static fetchAll(): Promise<FormAssignment[]> {
    return new Promise<FormAssignment[]>((resolve, reject) => {
      fetch(hostname + "/forms").then((response) => {
        response.json().then((data) => {
          resolve(data.map((d: any) => new FormAssignment(d.formId, d.formTitle, d.formDescription, d.href)));
        })
      }).catch((error) => {
        reject(error);
      })
    })
  }
}

export class Invoice {
  
  static getDaysBefore(n: number) { const today = new Date(); today.setDate(today.getDate() - n); return today; }

  id: string | null;
  invoiceNumber: number;
  paid: boolean;
  amount: number;
  createdAt: Date;
  paidAt: Date | null = null;
  dueAt: Date;
  href: string;
  assignedTo: string;
  limbo: string | null = null;

  /**
   * 
   * @param id - firestoreId of this invoice
   * @param invoiceNumber - invoice numerical identifier 
   * @param paid - boolean indicating if invoice has been paid
   * @param amount - amount of invoice
   * @param createdAt - date invoice was created
   * @param paidAt - date invoice was paid
   * @param dueAt - date invoice is due
   * @param href - link to invoice pdf
   * @param assignedTo - firestoreId of user assigned to this invoice
   */
  constructor(id: string | null, invoiceNumber: number, paid: boolean, amount: number, createdAt: Date, paidAt: Date | null, dueAt: Date, href: string, assignedTo: string) {
    this.id = id;
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
      id: this.id,
      invoiceNumber: this.invoiceNumber,
      paid: this.paid,
      amount: this.amount,
      createdAt: this.createdAt,
      paidAt: this.paidAt,
      dueAt: this.dueAt,
      href: this.href,
      assignedTo: this.assignedTo,
      limbo: this.limbo,
    }
  }

  async setData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      
      fetch(hostname + "/invoices/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          invoice: this.toJson()
        })
      }).then((response) => {
        console.log(response);
        response.json().then((data) => {
          resolve();
        })
      }).catch((error) => {
        reject(error);
      })
    })
  }

  async tellRachelIHaveBeenPaid(platform: string): Promise<boolean> {
    platform = platform.substring(0, 1).toUpperCase() + platform.substring(1);
    return new Promise<boolean>((resolve, reject) => {
      this.paidAt = new Date();
      this.limbo = platform;
      console.log("setting");
      this.setData().then(() => {
        console.log("set");
        resolve(true);
      }).catch((error) => {
        console.log("err");
        reject(error);
      })
    })
  }

  tellRachelIHaveNotBeenPaid(): void {
    console.log("Rachel, I've made a mistake!");
    this.paidAt = null;
    this.limbo = null;
    this.setData();
  }

  checkLate(): boolean {
    return new Date(this.dueAt) < new Date();
  }

  getDaysLate(): number {
    return Math.floor((new Date().getTime() - new Date(this.dueAt).getTime()) / (1000 * 60 * 60 * 24));
  }

  checkPending(): boolean {
    return this.limbo !== null;
  }

  static async create(href: string, amount: number, user: any, dueDate: Date): Promise<any> {
    
    const invoice = new Invoice(null, -1, false, amount, new Date(), null, dueDate, href, user.id);
    
    return new Promise<any>((resolve, reject) => {
      fetch(hostname + "/invoices/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          invoice: invoice.toJson()
        })
      }).then((response) => {
        response.json().then((data) => {
          resolve(data);
        })
      }).catch((error) => {
        reject(error);
      })
    })    
  }

  static async getForUser(userId: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      fetch(hostname + `/invoices?userId=${userId}`).then((response) => {
        response.json().then((data) => {
          resolve(data.map((d: any) => new Invoice(d.id, d.invoiceNumber, d.paid, d.amount, d.createdAt, d.paidAt, d.dueAt, d.href, d.assignedTo) ));
        })
      }).catch((error) => {
        reject(error);
      })
    })
  }
}

export class LimboInvoice extends Invoice {
  
  userDisplayName: string;

  static getAll(): Promise<LimboInvoice[]> {
    return new Promise<LimboInvoice[]>((resolve, reject) => {
      fetch(hostname + "/invoices/limbo").then((response) => {
        response.json().then((data) => {

          
          resolve(data.map((d: any) => {
            const invoice = new LimboInvoice(d.id, d.invoiceNumber, d.paid, d.amount, d.createdAt, d.paidAt, d.dueAt, d.href, d.assignedTo);
            invoice.userDisplayName = d.userDisplayName;
            invoice.limbo = d.limbo;
            return invoice;
          }));
        })
      }).catch((error) => {
        reject(error);
      })
    })
  }

  generateMemo(): string {
    if (this.limbo === "Venmo") { return `${this.userDisplayName}'s ANDC Invoice No.${this.invoiceNumber}`; }
    return "Error: Memo not generated."
  }

  getPlatformColor(): string {
    if (this.limbo === "Paid")    { return "#00BF6F"; }  // This is a Paid invoice
    if (this.limbo === "Venmo")   { return "#008CFF"; }  // This is a Venmo payment
    if (this.limbo === "Zelle")   { return "#6D1ED4"; }  // This is a Zelle payment
    return "black";
  }

  async accept(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fetch(hostname + "/invoices/limbo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: this.id,
          action: "accept"
        })
      }).then((response) => {
        response.json().then((data) => {
          resolve();
        })
      }).catch((error) => {
        reject(error);
      })
    })
  }

  async reject(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fetch(hostname + "/invoices/limbo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: this.id,
          action: "reject"
        })
      }).then((response) => {
        response.json().then((data) => {
          resolve();
        })
      }).catch((error) => {
        reject(error);
      })
    })
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

  static assignToMultiple(title: string, description: string, toolId: string, users: string[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      fetch(hostname + "/tools/assign-multiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title,
          description: description,
          users: users,
          toolId: toolId
        })
      }).then((response) => {
        response.json().then((data) => {
          resolve(data);
        })
      }).catch((error) => {
        reject(error);
      })
    })
  }

  static unassignMultiple(toolId: string, users: string[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      fetch(hostname + "/tools/unassign-multiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          users: users,
          toolId: toolId
        })
      }).then((response) => {
        response.json().then((data) => {
          resolve(data);
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

  static async delete(id: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      fetch(hostname + "/tools/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          toolId: id
        })
      }).then((res) => {
        res.json().then((data) => {
          resolve(data);
        })
      }).catch((error) => {
        reject(error);
      })
    })
  }

  static star(toolId: string, userId: string): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {
      fetch(hostname + "/tools/user-star", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userId,
          toolId: toolId
        })
      }).then((response) => {
        response.json().then((data) => {
          resolve(data.success);
        })
      }).catch((error) => {
        reject(error);
      })
    })
  }
}