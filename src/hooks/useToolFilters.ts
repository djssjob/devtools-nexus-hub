
import { useState, useEffect } from 'react';
import { Tool, FilterState } from '@/types/devtools';

export const useToolFilters = (tools: Tool[]) => {
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return window.innerWidth < 768;
  });
  const [filters, setFilters] = useState<FilterState>({
    text: '',
    category: null,
    tags: []
  });

  useEffect(() => {
    applyFilters();
  }, [tools, filters]);

  const applyFilters = () => {
    let filtered = [...tools];

    if (filters.text) {
      const searchTerm = filters.text.toLowerCase();
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm) ||
        tool.description.toLowerCase().includes(searchTerm) ||
        tool.category.toLowerCase().includes(searchTerm) ||
        tool.subcategory?.toLowerCase().includes(searchTerm) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.category) {
      filtered = filtered.filter(tool => tool.category === filters.category);
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(tool =>
        filters.tags.every(filterTag =>
          tool.tags?.includes(filterTag)
        )
      );
    }

    setFilteredTools(filtered);
  };

  return {
    filteredTools,
    currentView,
    setCurrentView,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    filters,
    setFilters
  };
};
