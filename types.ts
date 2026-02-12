export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'reader';
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown
  coverImage?: string;
  tags: string[];
  status: 'draft' | 'published';
  author: User;
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  readTimeMinutes: number;
}

export type Theme = 'light' | 'dark';

export interface AnalyticsEvent {
  event: string;
  payload?: Record<string, any>;
  timestamp: number;
}
