// types.ts

// Interface for User
export interface User {
  stripe_account_id: string;
  stripe_person_id: string;
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
  account_url: string;
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

export interface Job {
  date_updated: string | null | undefined;
  date_created: string;
  id: string;
  slug: string;
  status?: string;
  title: string;
  description?: string;
  scheduled_at: string;
  user: User;
  category: Category;
  email_notifications: boolean;
  rate: number;
  hours_estimated: number;
  payment_type: 'hourly' | 'fixed';
  // place: string; // REMOVED if not needed
  // possibly store position or reversedGeocode if needed
  position: {
    farm?: string | undefined;
    suburb?: string | undefined;
    type?: 'Point';
    coordinates?: [number, number];
    latitude?: number;
    longitude?: number;
    formattedAddress?: string;
    country?: string;
    city?: string;
    zipcode?: string;
    streetName?: string;
    streetNumber?: string;
    countryCode?: string;
    neighbourhood?: string;
    provider?: string;
  };
}

// Updated JobFormData: remove 'place', add lat/long
export interface JobFormData {
  rate: number;
  hours_estimated: number;
  payment_type: 'hourly' | 'fixed' | '';
  latitude: string;
  longitude: string;
  title: string;
  description: string;
  scheduled_at: string;
  category: Category['id'];
  email_notifications: boolean;
}


export type ApplicationStatus = "waiting" | "approved" | "declined" | "finished" | "confirmed" | "waitingOnGuardian" | "deniedByGuardian";
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
  image: string;
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
  user?: User;
  timestamp?: string;
  sentByCurrentUser?: boolean;
  senderObject?: User; // User object of the sender
  receiverObject?: User; // User object of the receiver
  type?: 'user' | 'system';
  action?: {
    id: string;         // some ID or key to trigger
    label: string;      // button text
    payload?: any;      // any extra data your action needs
  };
}

// Interface for Review
export interface Review {
  id: string;
  user?: string; // ID of the user being reviewed
  by_user?: User; // ID of the user who wrote the review
  rating?: number;
  comment?: string;
  job?: Job; // ID of the associated job
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
