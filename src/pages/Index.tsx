
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/DevToolsHub/Sidebar';
import { MainContent } from '@/components/DevToolsHub/MainContent';
import { ToolModal } from '@/components/DevToolsHub/ToolModal';
import { useFirestore } from '@/hooks/useFirestore';
import { useAuth } from '@/hooks/useAuth';
import { useToolOperations } from '@/hooks/useToolOperations';
import { useCSVOperations } from '@/hooks/useCSVOperations';
import { useToolFilters } from '@/hooks/useToolFilters';
import { Tool } from '@/types/devtools';

const Index = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user, userId } = useAuth();
  const { tools: firestoreTools } = useFirestore();
  
  const {
    isModalOpen,
    setIsModalOpen,
    editingTool,
    handleAddTool,
    handleEditTool,
    handleDeleteTool,
    handleSaveTool
  } = useToolOperations(userId);
  
  const { handleExportCSV, handleImportCSV } = useCSVOperations(userId);
  
  const {
    filteredTools,
    currentView,
    setCurrentView,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    filters,
    setFilters
  } = useToolFilters(tools);

  useEffect(() => {
    if (firestoreTools) {
      setTools(firestoreTools);
      setIsLoading(false);
    }
  }, [firestoreTools]);

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
        onImportCSV={handleImportCSV}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isSidebarCollapsed={isSidebarCollapsed}
        isLoading={isLoading}
      />

      <ToolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTool}
        tool={editingTool}
      />
    </div>
  );
};

export default Index;
