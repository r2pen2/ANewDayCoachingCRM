
/**
 * Enum representing the status of a homework assignment
 */
export enum HomeworkStatus {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed"
}

/**
 * Enum representing the priority of a homework assignment
 */
export enum HomeworkPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High"
}

export class Homework {
  subject: string | null = null;
  dueDate: Date | null = null;
  startDate: Date | null = null;
  status: HomeworkStatus = HomeworkStatus.NOT_STARTED;
  priority: HomeworkPriority = HomeworkPriority.LOW;
  description: string | null = null;
  estTime: string | null = null;
  timestamp: number | null = null;

  registerTimestamp(): void { this.timestamp = Date.now(); }

  constructor(homework?: any) {
    this.subject = homework?.subject;
    this.dueDate = homework ? homework.dueDate : null;
    this.startDate = homework ? homework.startDate : null;
    this.status = homework? homework.status : HomeworkStatus.NOT_STARTED;
    this.priority = homework?.priority;
    this.description = homework?.description;
    this.estTime = homework ? homework.estTime : null;
    this.timestamp = homework?.timestamp;
  }

  static getPriorityColor(homework: Homework | string): string | undefined {
    const p = typeof homework === "string" ? homework : homework.priority;
    switch(p) {
      case HomeworkPriority.LOW: return "blue";
      case HomeworkPriority.MEDIUM: return "yellow";
      case HomeworkPriority.HIGH: return "red";
    }
  }

  static getStatusColor(homework: Homework): string | null {
    const s = homework.status;
    switch(s) {
      case HomeworkStatus.NOT_STARTED: return "gray";
      case HomeworkStatus.IN_PROGRESS: return "yellow";
      case HomeworkStatus.COMPLETED: return "green";
    }
  }

  static load(data: any): Homework {
    const hw = new Homework();
    hw.description = data.description;
    hw.dueDate = data.dueDate;
    hw.startDate = data.startDate;
    hw.status = data.status;
    hw.priority = data.priority;
    hw.subject = data.subject;
    hw.estTime = data.estTime;
    hw.timestamp = data.timestamp;
    return hw;
  }

  toJson(): any {
    return {
      subject: this.subject,
      dueDate: this.dueDate,
      startDate: this.startDate,
      status: this.status,
      priority: this.priority,
      description: this.description,
      estTime: this.estTime,
      timestamp: this.timestamp
    }
  }

  setEstTime(time: string): Homework {
    this.estTime = time;
    return this;
  }

  static getPriorityValue(homework: Homework) {
    switch(homework.priority) {
      case HomeworkPriority.LOW: return 1;
      case HomeworkPriority.MEDIUM: return 2;
      case HomeworkPriority.HIGH: return 3;
    }
  }
}

export class HomeworkSubject {
  title: string;
  color: string;

  constructor(title: string, color: string) {
    this.title = title;
    this.color = color;
  }

  toJson() {
    return {
      title: this.title,
      color: this.color
    }
  }
}