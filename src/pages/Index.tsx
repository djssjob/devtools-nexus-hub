import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/DevToolsHub/Sidebar';
import { MainContent } from '@/components/DevToolsHub/MainContent';
import { ToolModal } from '@/components/DevToolsHub/ToolModal';
import { ComparisonModal } from '@/components/DevToolsHub/ComparisonModal';
import { ToolNotesModal } from '@/components/DevToolsHub/ToolNotesModal';
import { HelpModal } from '@/components/DevToolsHub/HelpModal';
import { useFirestore } from '@/hooks/useFirestore';
import { useAuth } from '@/hooks/useAuth';
import { useToolOperations } from '@/hooks/useToolOperations';
import { useCSVOperations } from '@/hooks/useCSVOperations';
import { useToolFilters } from '@/hooks/useToolFilters';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Tool } from '@/types/devtools';
import { toast } from '@/hooks/use-toast';
import { useFileOperations } from '@/hooks/useFileOperations';

const Index = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [comparisonTools, setComparisonTools] = useState<Tool[]>([]);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [notesTool, setNotesTool] = useState<Tool | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const { user, userId } = useAuth();
  const { tools: firestoreTools } = useFirestore();
  const { preferences, toggleFavorite, addToRecentlyViewed, setToolNote, setToolRating } = useUserPreferences();
  
  const {
    isModalOpen,
    setIsModalOpen,
    editingTool,
    handleAddTool,
    handleEditTool,
    handleDeleteTool,
    handleSaveTool
  } = useToolOperations(userId);
  
  const { handleExportCSV, handleExportTXT, handleImportCSV, handleImportTXT } = useFileOperations(userId);
  
  const {
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
    setSortBy
  } = useToolFilters(tools, preferences);

  const openComparison = () => setIsComparisonOpen(true);
  const openHelp = () => setIsHelpModalOpen(true);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => {
      const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement;
      searchInput?.focus();
    },
    onAddTool: handleAddTool,
    onToggleView: () => setCurrentView(currentView === 'grid' ? 'list' : 'grid'),
    onToggleSidebar: () => setIsSidebarCollapsed(!isSidebarCollapsed),
    onExport: () => handleExportCSV(tools),
    onShowHelp: openHelp
  });

  useEffect(() => {
    if (firestoreTools) {
      setTools(firestoreTools);
      setIsLoading(false);
    }
  }, [firestoreTools]);

  const handleToolClick = (toolId: string) => {
    addToRecentlyViewed(toolId);
  };

  const handleOpenNotes = (tool: Tool) => {
    setNotesTool(tool);
    setIsNotesModalOpen(true);
  };

  const handleSaveNote = (note: string) => {
    if (notesTool) {
      setToolNote(notesTool.id, note);
      toast({
        title: "Nota salva",
        description: "Sua nota foi salva com sucesso!",
      });
    }
  };

  const handleRating = (toolId: string, rating: number) => {
    setToolRating(toolId, rating);
    toast({
      title: "Avaliação salva",
      description: "Sua avaliação foi registrada!",
    });
  };

  const addToComparison = (tool: Tool) => {
    if (comparisonTools.length >= 4) {
      toast({
        title: "Limite atingido",
        description: "Você pode comparar no máximo 4 ferramentas.",
        variant: "destructive",
      });
      return;
    }

    if (!comparisonTools.find(t => t.id === tool.id)) {
      setComparisonTools([...comparisonTools, tool]);
      toast({
        title: "Adicionado à comparação",
        description: `${tool.name} foi adicionado à comparação.`,
      });
    }
  };

  const removeFromComparison = (toolId: string) => {
    setComparisonTools(comparisonTools.filter(t => t.id !== toolId));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in-scale">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground w-full">
      <Sidebar
        tools={tools}
        filters={filters}
        onFiltersChange={setFilters}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        userId={userId}
        preferences={preferences}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={setShowFavoritesOnly}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      
      <MainContent
        tools={filteredTools}
        totalTools={tools.length}
        currentView={currentView}
        onViewChange={setCurrentView}
        onAddTool={handleAddTool}
        onEditTool={handleEditTool}
        onDeleteTool={handleDeleteTool}
        onExportCSV={() => handleExportCSV(tools)}
        onExportTXT={() => handleExportTXT(tools)}
        onImportCSV={handleImportCSV}
        onImportTXT={handleImportTXT}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isSidebarCollapsed={isSidebarCollapsed}
        isLoading={isLoading}
        preferences={preferences}
        onToggleFavorite={toggleFavorite}
        onToolClick={handleToolClick}
        onOpenNotes={handleOpenNotes}
        onRating={handleRating}
        onAddToComparison={addToComparison}
        onOpenComparison={openComparison}
        comparisonCount={comparisonTools.length}
        onOpenHelp={openHelp}
        onSaveTool={handleSaveTool}
      />

      <ToolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTool}
        tool={editingTool}
      />

      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        selectedTools={comparisonTools}
        allTools={tools}
        onAddTool={addToComparison}
        onRemoveTool={removeFromComparison}
      />

      <ToolNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        tool={notesTool}
        currentNote={notesTool ? preferences.notes[notesTool.id] || '' : ''}
        onSaveNote={handleSaveNote}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
};

export default Index;
