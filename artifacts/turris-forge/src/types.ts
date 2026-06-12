export interface Submission {
  workerId: string;
  notes: string;
  submittedAt: number;
  pay: number;
  late: boolean;
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
}

export interface ActiveJob {
  job: Job;
  deadline: number;
  startedAt: number;
  pay: number;
}
