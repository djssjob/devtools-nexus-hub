
import { useState } from 'react';
import { Plus, Grid3X3, List, ChevronLeft, ChevronRight, Upload, Download, Filter } from 'lucide-react';
import { Tool } from '@/types/devtools';
import { Button } from '@/components/ui/button';
import { ToolGrid } from './ToolGrid';
import { ToolList } from './ToolList';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface MainContentProps {
  tools: Tool[];
  totalTools: number;
  currentView: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  onAddTool: () => void;
  onEditTool: (tool: Tool) => void;
  onDeleteTool: (id: string) => void;
  onExportCSV: () => void;
  onImportCSV: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  isLoading?: boolean;
}

export const MainContent = ({
  tools,
  totalTools,
  currentView,
  onViewChange,
  onAddTool,
  onEditTool,
  onDeleteTool,
  onExportCSV,
  onImportCSV,
  onToggleSidebar,
  isSidebarCollapsed,
  isLoading = false
}: MainContentProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleContentAction = (id: string) => {
    console.log(`Content action for tool: ${id}`);
  };

  return (
    <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
      {/* Header Sticky */}
      <header className="sticky-header p-4 md:p-6 animate-fade-in-scale">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="glass hover:scale-105 smooth-transition lg:hidden"
              title={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="glass hover:scale-105 smooth-transition hidden lg:flex"
              title={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>

            <div className="animate-slide-in-right">
              <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Base de Ferramentas
              </h2>
              <p className="text-sm text-muted-foreground">
                Mostrando {tools.length} de {totalTools} ferramentas
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-wrap items-center gap-2 lg:gap-4">
            {/* Mobile Filter Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="glass lg:hidden"
              title="Filtros"
            >
              <Filter />
            </Button>

            {/* View Toggle */}
            <div className="flex items-center gap-1 glass rounded-lg p-1">
              <Button
                variant={currentView === 'grid' ? "default" : "ghost"}
                size="icon"
                onClick={() => onViewChange('grid')}
                className="smooth-transition button-glow"
                title="Visualização em Grade"
              >
                <Grid3X3 />
              </Button>
              <Button
                variant={currentView === 'list' ? "default" : "ghost"}
                size="icon"
                onClick={() => onViewChange('list')}
                className="smooth-transition button-glow"
                title="Visualização em Lista"
              >
                <List />
              </Button>
            </div>

            {/* Import/Export */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".csv"
                onChange={onImportCSV}
                className="hidden"
                id="csv-import"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => document.getElementById('csv-import')?.click()}
                className="glass button-glow hidden sm:flex"
                title="Importar de CSV"
              >
                <Upload className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Importar</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={onExportCSV}
                className="glass button-glow hidden sm:flex"
                title="Exportar para CSV"
              >
                <Download className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </div>

            {/* Add Button */}
            <Button 
              onClick={onAddTool} 
              className="gradient-primary text-white border-0 button-glow hover:scale-105 smooth-transition"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Adicionar</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 animate-fade-in-scale">
            <div className="text-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-muted-foreground">Carregando ferramentas...</p>
            </div>
          </div>
        ) : tools.length === 0 ? (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="text-6xl mb-4 animate-float">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar seus filtros ou busca.</p>
          </div>
        ) : currentView === 'grid' ? (
          <div className="animate-fade-in-up">
            <ToolGrid
              tools={tools}
              onEdit={onEditTool}
              onDelete={onDeleteTool}
              onContent={handleContentAction}
            />
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <ToolList
              tools={tools}
              onEdit={onEditTool}
              onDelete={onDeleteTool}
              onContent={handleContentAction}
            />
          </div>
        )}
      </div>
    </main>
  );
};
