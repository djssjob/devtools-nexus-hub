
import { useState, useEffect } from 'react';
import { UserPreferences } from '@/types/devtools';

const STORAGE_KEY = 'devtools-hub-preferences';

const defaultPreferences: UserPreferences = {
  favorites: [],
  recentlyViewed: [],
  notes: {},
  ratings: {},
  viewHistory: []
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPreferences(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  const savePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
  };

  const toggleFavorite = (toolId: string) => {
    const newFavorites = preferences.favorites.includes(toolId)
      ? preferences.favorites.filter(id => id !== toolId)
      : [...preferences.favorites, toolId];
    
    savePreferences({
      ...preferences,
      favorites: newFavorites
    });
  };

  const addToRecentlyViewed = (toolId: string) => {
    const newRecentlyViewed = [
      toolId,
      ...preferences.recentlyViewed.filter(id => id !== toolId)
    ].slice(0, 10); // Keep only last 10

    const newViewHistory = [
      { toolId, timestamp: new Date().toISOString() },
      ...preferences.viewHistory
    ].slice(0, 100); // Keep only last 100

    savePreferences({
      ...preferences,
      recentlyViewed: newRecentlyViewed,
      viewHistory: newViewHistory
    });
  };

  const setToolNote = (toolId: string, note: string) => {
    savePreferences({
      ...preferences,
      notes: {
        ...preferences.notes,
        [toolId]: note
      }
    });
  };

  const setToolRating = (toolId: string, rating: number) => {
    savePreferences({
      ...preferences,
      ratings: {
        ...preferences.ratings,
        [toolId]: rating
      }
    });
  };

  const clearHistory = () => {
    savePreferences({
      ...preferences,
      recentlyViewed: [],
      viewHistory: []
    });
  };

  const exportPreferences = () => {
    const dataStr = JSON.stringify(preferences, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'devtools-hub-preferences.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importPreferences = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedPreferences = JSON.parse(e.target?.result as string);
          savePreferences(importedPreferences);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  return {
    preferences,
    toggleFavorite,
    addToRecentlyViewed,
    setToolNote,
    setToolRating,
    clearHistory,
    exportPreferences,
    importPreferences
  };
};
