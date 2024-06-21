import { UserCredential } from "firebase/auth";
import { db } from "../firebase";
import { DocumentReference, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { navigationItems } from "../../components/Navigation";
import { hostname } from "./dbManager.ts";
import { FormAssignment } from "./dbFormAssignment.ts";
import { Homework, HomeworkLoaderType, HomeworkPriority, HomeworkPriorityVerbosity, HomeworkStatus, HomeworkSubject } from "./dbHomework.ts";
import { Document } from "./dbDocument.ts";

export enum UserRole {
  STUDENT = "Student",
  PARENT = "Parent",
  COACH = "Coach",
  ADMIN = "Admin",
  DEVELOPER = "Developer"
}

export enum LMS {
  CANVAS = "Canvas",
  GOOGLE_CLASSROOM = "Google Classroom",
  SCHOOLOGY = "Schoology",
  BLACKBOARD = "Blackboard",
  OTHER = "Other"
}

export class User {
  
  firebaseUser: UserCredential;

  metadata: any = {
    lastSignIn: null
  };
  
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
  syncCode: string | null = null;

  homework: Homework[] = [];

  subjects: { [key: string]: any } = {
    "todo": { 
      color: "#ffffff",
      title: "todo",
    }
  }

  documents: any[] = [];

  intents: string[] = [];

  personalData: any = {
    displayName: "",
    email: "",
    pfpUrl: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    role: "",
  }

  schoolInfo: any = {
    advisorName: "",
    advisorHref: "",
    advisorEmail: "",
    advisorOffice: "",
    LMSHref: "",
    LMSName: "",
  }

  settings: any = {
    darkMode: false,
    priorityVerbosity: HomeworkPriorityVerbosity.COLORS,
    priorityPulseThreshold: HomeworkPriority.HIGH,
    homeworkLoaderType: HomeworkLoaderType.CIRCLE,
    requireHomeworkDeleteConfirmation: true,
    ringDeadlineThresholdHours: 24,
    invoices: {
      studentVisibility: false,
      newInvoiceEmailNotification: false,
      pendingStatusEmailNotification: false,
    }
  }

  constructor(firebaseUser?: any) {
    this.firebaseUser = firebaseUser;
    this.id = firebaseUser?.uid;
    this.docRef = doc(db, `users/${this.id}`);
    this.personalData.email = firebaseUser?.email;
    this.personalData.displayName = firebaseUser?.displayName
    this.personalData.pfpUrl = firebaseUser?.photoURL;
  }

  static getInstanceById(id: string): User {
    return new User({uid: id});
  }

  async registerSignIn(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.metadata.lastSignIn = new Date();
      this.setData().then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      })
    })
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
        documents: this.documents.map((d) => d.toJson()),
        intents: this.intents,
        settings: this.settings,
        metadata: this.metadata,
        schoolInfo: this.schoolInfo,
        syncCode: this.syncCode,
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

  static async getById(id: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      fetch(hostname + `/users/user?id=${id}`).then((response) => {
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
      } else if (navPage === navigationItems.ADMINUSERS) {
        endpoint = "search-users";
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

  fillData(data: any): User | void {
    if (data === null) { return; }
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
    this.documents = data.documents.map((d: any) => Document.load(d));
    this.intents = data.intents;
    this.settings = data.settings;
    this.schoolInfo = data.schoolInfo;
    this.metadata = data.metadata;
    this.syncCode = data.syncCode;
    return this;
  }

  async createDocument(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      getDoc(this.docRef).then((doc) => {
        if (doc.exists()) { resolve(); } else { 
          this.generateSyncCode().then(() => {
            this.setData().then(() => { resolve(); }).catch((error) => { reject(error); });
          })
        }
      }).catch((error) => {
        reject(error);
      })
    })
  }

  /** Need to be able to create a shallow clione so that state can update */
  clone(): User | void { return new User(this.firebaseUser).fillData(this); }

  subscribe(setter: Function, setColorScheme: Function) {
    onSnapshot(this.docRef, (doc) => {
      if (doc.exists()) {
        this.fillData(doc.data());
        // We need to create a clone of this User object so that the state actually updates
        const cloneUser = this.clone()
        setter(cloneUser); 
        setColorScheme(cloneUser?.settings.darkMode ? "dark" : "light");
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

  async startHomework(homework: Homework): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const index = this.homework.findIndex((hw) => hw.timestamp === homework.timestamp);
      this.homework[index].status = HomeworkStatus.IN_PROGRESS;
      this.setData().then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    })
  }

  async completeHomework(homework: Homework): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const index = this.homework.findIndex((hw) => hw.timestamp === homework.timestamp);
      this.homework[index].status = HomeworkStatus.COMPLETED;
      this.setData().then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    })
  }

  async pauseHomework(homework: Homework): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const index = this.homework.findIndex((hw) => hw.timestamp === homework.timestamp);
      this.homework[index].status = HomeworkStatus.NOT_STARTED;
      this.setData().then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    })
  }

  async setIntent(intent: string): Promise<void> { 
    return new Promise<void>((resolve, reject) => {
      this.intents.unshift(intent);
      this.setData().then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    })
  }

  async changeInvoiceSetting(setting: string, newValue: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.settings.invoices[setting] = newValue;
      this.setData().then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    })
  }

  async changeSetting(setting: string, newValue: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.settings[setting] = newValue;
      this.setData().then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    })
  }

  async changePersonalData(field: string, newValue: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.personalData[field] = newValue;
      this.setData().then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    })
  }

  async changeSchoolInfo(field: string, newValue: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.schoolInfo[field] = newValue;
      this.setData().then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    })
  }

  async generateSyncCode(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      fetch(hostname + "/users/sync").then((response) => {
        response.json().then((data) => {
          this.syncCode = data.code;
        }).then(() => {
          resolve(this.syncCode as string)
        })
      }).catch((error) => {
        reject(error)
      })
    })
  }

  static async checkSyncCodeUsed(code: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      fetch(hostname + `/users/sync?code=${code}`).then((response) => {
        console.log(response)
        response.json().then((data) => {
          resolve(data !== null);
        })
      }).catch((error) => {
        reject(error);
      })
    })
  }

  /**
   * Filter users by display name and email. Return all users if the query is empty.
   * @param users list of users to filter
   * @param query query string from TextInput
   * @returns a filtered list of users
   */
  static filterByDisplayNameAndEmail(users: User[], query: string): User[] {
    if ( query.length <= 0 ) { return users; }
    query = query.toLowerCase();
    return users.filter((user) => { return user.personalData.displayName.toLowerCase().includes(query) || user.personalData.email.toLowerCase().includes(query) })
  }

  /**
   * Sort users by display name.
   * @param users list of users to sort
   */
  static sortByDisplayName(users: User[]) {
    users.sort((a, b) => a.personalData.displayName.localeCompare(b.personalData.displayName))
  }
}