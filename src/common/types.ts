// types.ts

// Interface for User
export interface User {
  mobile: number;
  guardian: any;
  needs_guardian: boolean;
  verified: boolean;
  date_created: string;
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string | Image; // ID of the user's profile image
  bio?: string;
  birthdate: Date;
  applications?: Application[];
  jobs?: Job[];
  messagesReceived?: Message[]; // Messages where the user is the receiver
  messagesSent?: Message[]; // Messages where the user is the sender
  parents?: Parent[];
  reviewsByUser?: Review[]; // Reviews made by the user
  reviewsAboutUser?: Review[]; // Reviews about the user
}
interface Image {
  id: string;
}

export type UserRole = 'arbeidstaker' | 'arbeidsgiver' | null;

// Interface for Job
export interface Job {
  id: string;
  status?: string;
  title: string;
  description?: string;
  place: string;
  date_accessible: string;
  user: User;
  applications?: Application[];
  categories: Category[];
  email_notifications: boolean;
}

// types.ts

// Interface for Job Form Data
export interface JobFormData {
  title: string;
  description: string;
  place: string;
  date_accessible: string;
  categories: string[]; // Array of category IDs
  email_notifications: boolean;
}

export type ApplicationStatus = "waiting" | "approved" | "rejected";
// Interface for Application
export interface Application {
  id: string;
  status: ApplicationStatus;
  user: User; // ID of the user who applied
  job: Job; // ID of the job applied for
  parentalApproval?: boolean;
  parentalApprovalRequired?: boolean;
}

// Interface for Category
export interface Category {
  id: string;
  name?: string;
  description?: string;
  jobs?: Job[];
}

// Interface for JobsCategory (intermediate table)
export interface JobsCategory {
  id: number;
  jobsId?: string; // ID of the job
  categoriesId?: string; // ID of the category
  job?: Job;
  category?: Category;
}

// Interface for Message
export interface Message {
  id: string;
  sender?: string; // ID of the sender
  receiver?: string; // ID of the receiver
  read?: boolean;
  content?: string;
  senderObject?: User; // User object of the sender
  receiverObject?: User; // User object of the receiver
}

// Interface for Review
export interface Review {
  id: string;
  user?: string; // ID of the user being reviewed
  byUser?: string; // ID of the user who wrote the review
  rating?: number;
  comment?: string;
  job?: string; // ID of the associated job
  userObject?: User; // User object being reviewed
  byUserObject?: User; // User object of the reviewer
  jobObject?: Job; // Job object associated with the review
}

// Interface for Parent
export interface Parent {
  id: string;
  user?: string; // ID of the user who is a parent
  userObject?: User; // User object of the parent
}
// Interface for Article
export interface Article {
  id: string;
  title: string;
  content: string; // HTML string from WYSIWYG editor
  description: string,
  author: User;
  date_published: string; // ISO date string
  image?: string; // URL or path to the article's featured image
}

// Interface for Info
export interface Info {
  id: string;
  title: string;
  content: string; // HTML string from WYSIWYG editor
  description: string,
  date_created: string; // ISO date string
  date_updated: string;
}
export interface Employee {
  id: string;
  name: string;
  role: string;
  details: string;
  image: string;
}
