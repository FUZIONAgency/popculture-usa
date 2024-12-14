export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  website: string | null;
  budget: string;
  templateType: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}