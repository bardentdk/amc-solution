export interface User {
  id: string;
  email: string;
  role: 'admin' | 'client';
  created_at: string;
  first_name?: string;
  last_name?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  is_active: boolean;
  created_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  author_id: string;
  category_id: string;
  created_at: string;
  published: boolean;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

export interface ContactMessage {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  attachment_url?: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  context?: string;
  content: string;
  rating: number;
  is_published: boolean;
  created_at: string;
}