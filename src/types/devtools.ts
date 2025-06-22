
export interface Tool {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  link: string;
  description: string;
  tags?: string[];
  createdBy: string;
  createdAt: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export interface FilterState {
  text: string;
  category: string | null;
  tags: string[];
}

export interface User {
  uid: string;
  isAnonymous: boolean;
}
