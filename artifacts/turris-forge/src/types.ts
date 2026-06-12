export interface Submission {
  workerId: string;
  notes: string;
  submittedAt: number;
  pay: number;
  late: boolean;
  files: UploadedFile[];
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

export interface Job {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  pay: number;
  deadline: number;
  status: string;
  submissions: Submission[];
  visibility: string;
  posted: number;
  refNote?: string;
  messages: Message[];
}

export interface Message {
  id: string;
  from: string;
  fromName: string;
  fromRole: "worker" | "admin";
  text: string;
  at: number;
  read: boolean;
}

export interface PaymentRecord {
  jobId: string;
  title: string;
  amount: number;
  date: number;
  status: string;
}

export interface Worker {
  id: string;
  name: string;
  email: string;
  role: "worker" | "admin";
  skills: string[];
  balance: number;
  joined: number;
  bio: string;
  portfolio: string;
  history: PaymentRecord[];
  rating: number;
  ratingCount: number;
}

export interface ActiveJob {
  job: Job;
  deadline: number;
  startedAt: number;
  pay: number;
}

export interface Notification {
  id: string;
  text: string;
  at: number;
  read: boolean;
  jobId?: string;
  type: "job_match" | "approved" | "rejected" | "message" | "submitted";
}
