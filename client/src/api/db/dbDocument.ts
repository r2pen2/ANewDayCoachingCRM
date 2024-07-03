import { notifSuccess } from "../../components/Notifications.jsx";
import { LinkMaster } from "../links.ts";
import { hostname } from "./dbManager.ts";

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

  async extractData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      
      if (!this.href) {
        console.error('No href provided');
        reject()
        return;
      }


      if (!LinkMaster.checkValid(this.href)) {
        console.error('Invalid URL');
        reject()
        return;
      }

      const docIdMatch = this.href.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (!docIdMatch) {
        console.error('Invalid Google Docs URL');
        reject()
        return;
      }

      const docId = docIdMatch[1];

      fetch(hostname + "/document?id="+docId).then(res => {
        res.json().then(data => {
          this.title = data.title;
          this.type = Document.mapMimeTypeToDocumentType(data.mimeType);
          resolve();
        })
      }).catch(err => {
        console.error('Error fetching document data:', err);
        reject(err);
      });
    })
  }

  static mapMimeTypeToDocumentType(mimeType: string): DocumentType {
    switch (mimeType) {
      case 'application/vnd.google-apps.document':
        return DocumentType.DOCUMENT;
      case 'application/vnd.google-apps.spreadsheet':
        return DocumentType.SPREADSHEET;
      case 'application/vnd.google-apps.presentation':
        return DocumentType.PRESENTATION;
      case 'application/vnd.google-apps.form':
        return DocumentType.FORM;
      case 'application/vnd.google-apps.photo':
        return DocumentType.PHOTOSANDIMAGES;
      case 'application/pdf':
        return DocumentType.PDF;
      case 'application/vnd.google-apps.video':
        return DocumentType.VIDEO;
      case 'application/vnd.google-apps.shortcut':
        return DocumentType.SHORTCUT;
      case 'application/vnd.google-apps.folder':
        return DocumentType.FOLDER;
      case 'application/vnd.google-apps.site':
        return DocumentType.SITE;
      case 'application/vnd.google-apps.audio':
        return DocumentType.AUDIO;
      case 'application/vnd.google-apps.drawing':
        return DocumentType.DRAWING;
      case 'application/zip':
        return DocumentType.ARCHIVE;
      default:
        return 'Unknown Type' as DocumentType;
    }
  }
}