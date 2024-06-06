import { UserCredential } from "firebase/auth";
import { db } from "../firebase";
import { DocumentReference, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { navigationItems } from "../../components/Navigation";
import { hostname } from "./dbManager.ts";
import { FormAssignment } from "./dbFormAssignment.ts";
import { Homework, HomeworkSubject } from "./dbHomework.ts";

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
  tools: any[] = [];
  numUnpaidInvoices: number = 0;

  homework: Homework[] = [];

  subjects: { [key: string]: any } = {}

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
      const data = {
        invoices: this.invoices,
        admin: this.admin,
        formAssignments: this.formAssignments,
        id: this.id,
        personalData: this.personalData,
        tools: this.tools,
        homework: this.homework.map((h) => h.toJson()),
        subjects: this.subjects,
        numUnpaidInvoices: this.numUnpaidInvoices,
      }
      setDoc(this.docRef, data).then(() => {
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
    this.tools = data.tools;
    this.numUnpaidInvoices = data.numUnpaidInvoices;
    this.homework = data.homework.map((h: any) => Homework.load(h));
    this.subjects = data.subjects;
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

  async addSubject(subject: HomeworkSubject): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.subjects[subject.title] = subject.toJson();
      this.setData().then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    })
  }

  async removeSubject(title: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      delete this.subjects[title];
      this.setData().then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    })
  }

  async updateSubject(subject: HomeworkSubject): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.subjects[subject.title] = subject.toJson();
      this.setData().then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    })
  }

  async addHomework(homework: Homework): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      homework.registerTimestamp();
      this.homework.push(homework);
      this.setData().then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    })
  }

  async updateHomework(homework: Homework): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const index = this.homework.findIndex((hw) => hw.timestamp === homework.timestamp);
      this.homework[index] = homework;
      this.setData().then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    })
  }

  async removeHomework(homework: Homework): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.homework = this.homework.filter((hw) => {
        return hw.timestamp !== homework.timestamp
      });
      this.setData().then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    })
  }
}