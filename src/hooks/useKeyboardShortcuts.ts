
import { useEffect } from 'react';

interface KeyboardShortcuts {
  onSearch: () => void;
  onAddTool: () => void;
  onToggleView: () => void;
  onToggleSidebar: () => void;
  onExport: () => void;
  onShowHelp: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if not typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Cmd/Ctrl + K - Search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        shortcuts.onSearch();
      }

      // Cmd/Ctrl + N - Add new tool
      if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
        event.preventDefault();
        shortcuts.onAddTool();
      }

      // Cmd/Ctrl + G - Toggle view
      if ((event.metaKey || event.ctrlKey) && event.key === 'g') {
        event.preventDefault();
        shortcuts.onToggleView();
      }

      // Cmd/Ctrl + B - Toggle sidebar
      if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
        event.preventDefault();
        shortcuts.onToggleSidebar();
      }

      // Cmd/Ctrl + E - Export
      if ((event.metaKey || event.ctrlKey) && event.key === 'e') {
        event.preventDefault();
        shortcuts.onExport();
      }

      // ? - Show help
      if (event.key === '?' && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        shortcuts.onShowHelp();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
