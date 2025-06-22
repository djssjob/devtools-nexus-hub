
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
  rating?: number;
  viewCount?: number;
  lastViewed?: string;
  notes?: string;
}

export interface FilterState {
  text: string;
  category: string | null;
  tags: string[];
  rating?: number;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface User {
  uid: string;
  isAnonymous: boolean;
}

export interface UserPreferences {
  favorites: string[];
  recentlyViewed: string[];
  notes: Record<string, string>;
  ratings: Record<string, number>;
  viewHistory: Array<{
    toolId: string;
    timestamp: string;
  }>;
}

export interface ToolComparison {
  tools: Tool[];
  criteria: string[];
}
