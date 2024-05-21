export class Homework {
  subject: string;
  dueDate: Date;
  startDate: Date;
  status: HomeworkStatus;
  priority: HomeworkPriority;
  description: string;
  color: string | null = null;

  /**
   * @constructor Create a new Homework assignment for the tracker
   * @param subject - class that the assignment is associated with 
   * @param dueDate - date that the assignment is due
   * @param startDate - date to start the assignment
   * @param status - HomeworkStatus enum representing the status of the assignment
   * @param priority - HomeworkPriority enum representing the priority of the assignment
   * @param description - Title of the assignment in the tracker
   */
  constructor(subject: string, dueDate: Date, startDate: Date, status: HomeworkStatus, priority: HomeworkPriority, description: string) {
    this.subject = subject;
    this.dueDate = dueDate;
    this.startDate = startDate;
    this.status = status;
    this.priority = priority;
    this.description = description; 
  }

  setColor(color: string): Homework { this.color = color; return this; }

  static load(data: any): Homework {
    return new Homework(data.subject, new Date(data.dueDate), new Date(data.startDate), data.status, data.priority, data.description).setColor(data.color);
  }
}

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
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3
}