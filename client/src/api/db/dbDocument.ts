import { notifSuccess } from "../../components/Notifications";
import { User } from "./dbUser";

/**
 * Enum representing the type of a document
 */
export enum DocumentType {
  DOCUMENT = "Document",
  SPREADSHEET = "Spreadsheet",
  PRESENTATION = "Presentation",
  FORM = "Form",
  PHOTOSANDIMAGES = "Photos & Images",
  PDF = "PDF",
  VIDEO = "Video",
  SHORTCUT = "Shortcut",
  FOLDER = "Folder",
  SITE = "Site",
  AUDIO = "Audio",
  DRAWING = "Drawing",
  ARCHIVE = "Archive (zip)",
}

export class Document {
  title: string | null = null;
  type: string | null = null;
  href: string | null = null;

  constructor(document?: any) {
    this.title = document?.title;
    this.type = document?.type;
    this.href = document?.href;
  }

  static load(data: any): Document {
    const d = new Document();
    d.title = data.title;
    d.type = data.type;
    d.href = data.href;
    return d;
  }

  toJson(): any {
    return {
      title: this.title,
      type: this.type,
      href: this.href,
    }
  }

  getColor(): string {
    if (this.type === DocumentType.DOCUMENT) return "#4285F4";
    if (this.type === DocumentType.SPREADSHEET) return "#34A853";
    if (this.type === DocumentType.PRESENTATION) return "#FBBC04";
    if (this.type === DocumentType.FORM) return "#673AB7";
    if (this.type === DocumentType.PHOTOSANDIMAGES) return "#EA4335";
    if (this.type === DocumentType.PDF) return "#EA4335";
    if (this.type === DocumentType.VIDEO) return "#EA4335";
    if (this.type === DocumentType.SHORTCUT) return "#5F6368";
    if (this.type === DocumentType.FOLDER) return "#5F6368";
    if (this.type === DocumentType.SITE) return "#4D5DBA";
    if (this.type === DocumentType.AUDIO) return "#EA4335";
    if (this.type === DocumentType.DRAWING) return "#EA4335";
    if (this.type === DocumentType.ARCHIVE) return "#5F6368";
    return "black";
  }
}