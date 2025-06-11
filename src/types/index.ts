
export interface Lead {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  application: string;
  source: 'website' | 'email' | 'phone' | 'referral';
  status: 'new' | 'contacted' | 'proposal_sent' | 'negotiation' | 'won' | 'cancelled' | 'hold';
  assignedTo?: string;
  assignedBy?: string;
  memos: Memo[];
  followUps: FollowUp[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  attachments: Attachment[];
  spareParts: string[];
}

export interface Memo {
  id: string;
  type: 'spare' | 'project' | 'service' | 'key_account';
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface FollowUp {
  id: string;
  date: string;
  notes: string;
  nextFollowUp?: string;
  createdBy: string;
  createdAt: string;
}

export interface Proposal {
  id: string;
  leadId: string;
  templateId?: string;
  robot: string;
  controller: string;
  reach: string;
  payload: string;
  brand: string;
  cost: number;
  description: string;
  attachments: Attachment[];
  spareParts?: string[];
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  version: number;
  history: ProposalHistory[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ProposalHistory {
  id: string;
  version: number;
  changes: string;
  modifiedBy: string;
  modifiedAt: string;
}

export interface ProposalTemplate {
  id: string;
  name: string;
  robot: string;
  controller: string;
  reach: string;
  payload: string;
  brand: string;
  cost: number;
  description: string;
  headerContent: string;
  footerContent: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface Product {
  id: string;
  name: string;
  robot: string;
  controller: string;
  reach: string;
  payload: string;
  brand: string;
  cost: number;
  description: string;
  image?: string;
  createdAt: string;
}

export interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  description: string;
  cost: number;
  compatibility: string[];
  image?: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
}

// @/types/index.ts
export type UserRole = 'admin' | 'manager' | 'engineer' | 'sales';

export interface User {
  name: string;
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
  createdAt: string;
}

