
import { useState, useEffect } from 'react';
import { Tool, FilterState, UserPreferences } from '@/types/devtools';

export const useToolFilters = (tools: Tool[], preferences: UserPreferences) => {
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return window.innerWidth < 768;
  });
  const [filters, setFilters] = useState<FilterState>({
    text: '',
    category: null,
    tags: [],
    rating: undefined
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'rating' | 'recent'>('name');

  useEffect(() => {
    applyFilters();
  }, [tools, filters, preferences, showFavoritesOnly, sortBy]);

  const applyFilters = () => {
    let filtered = [...tools];

    // Apply favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(tool => preferences.favorites.includes(tool.id));
    }

    // Apply text search
    if (filters.text) {
      const searchTerm = filters.text.toLowerCase();
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm) ||
        tool.description.toLowerCase().includes(searchTerm) ||
        tool.category.toLowerCase().includes(searchTerm) ||
        tool.subcategory?.toLowerCase().includes(searchTerm) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        preferences.notes[tool.id]?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(tool => tool.category === filters.category);
    }

    // Apply tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(tool =>
        filters.tags.every(filterTag =>
          tool.tags?.includes(filterTag)
        )
      );
    }

    // Apply rating filter
    if (filters.rating) {
      filtered = filtered.filter(tool => {
        const userRating = preferences.ratings[tool.id];
        return userRating && userRating >= filters.rating!;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'rating':
          const ratingA = preferences.ratings[a.id] || 0;
          const ratingB = preferences.ratings[b.id] || 0;
          return ratingB - ratingA;
        case 'recent':
          const indexA = preferences.recentlyViewed.indexOf(a.id);
          const indexB = preferences.recentlyViewed.indexOf(b.id);
          if (indexA === -1 && indexB === -1) return 0;
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        default:
          return 0;
      }
    });

    setFilteredTools(filtered);
  };

  const getRecentlyViewedTools = () => {
    return preferences.recentlyViewed
      .map(id => tools.find(tool => tool.id === id))
      .filter(tool => tool !== undefined) as Tool[];
  };

  const getFavoriteTools = () => {
    return preferences.favorites
      .map(id => tools.find(tool => tool.id === id))
      .filter(tool => tool !== undefined) as Tool[];
  };

  return {
    filteredTools,
    currentView,
    setCurrentView,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    filters,
    setFilters,
    showFavoritesOnly,
    setShowFavoritesOnly,
    sortBy,
    setSortBy,
    getRecentlyViewedTools,
    getFavoriteTools
  };
};
