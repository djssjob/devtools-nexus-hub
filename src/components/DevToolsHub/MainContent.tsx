
import { useState } from 'react';
import { 
  Plus, Grid3X3, List, ChevronLeft, ChevronRight, Upload, Download, 
  Filter, BarChart3, HelpCircle, Clock, Star, MessageSquare, FileText, BookOpen
} from 'lucide-react';
import { Tool, UserPreferences } from '@/types/devtools';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToolGrid } from './ToolGrid';
import { ToolList } from './ToolList';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AIChat } from './AIChat';
import { DocumentationModal } from './DocumentationModal';

interface MainContentProps {
  tools: Tool[];
  totalTools: number;
  currentView: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  onAddTool: () => void;
  onEditTool: (tool: Tool) => void;
  onDeleteTool: (id: string) => void;
  onExportCSV: () => void;
  onExportTXT: () => void;
  onImportCSV: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImportTXT: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  isLoading?: boolean;
  preferences: UserPreferences;
  onToggleFavorite: (toolId: string) => void;
  onToolClick: (toolId: string) => void;
  onOpenNotes: (tool: Tool) => void;
  onRating: (toolId: string, rating: number) => void;
  onAddToComparison: (tool: Tool) => void;
  onOpenComparison: () => void;
  comparisonCount: number;
  onOpenHelp: () => void;
  onSaveTool: (toolData: any) => void;
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
  onExportTXT,
  onImportCSV,
  onImportTXT,
  onToggleSidebar,
  isSidebarCollapsed,
  isLoading = false,
  preferences,
  onToggleFavorite,
  onToolClick,
  onOpenNotes,
  onRating,
  onAddToComparison,
  onOpenComparison,
  comparisonCount,
  onOpenHelp,
  onSaveTool
}: MainContentProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false);

  const handleContentAction = (id: string) => {
    onToolClick(id);
    console.log(`Content action for tool: ${id}`);
  };

  const handleAIAddTool = (toolData: any) => {
    onSaveTool(toolData);
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

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-2">
              {preferences.favorites.length > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <Star className="w-3 h-3" />
                  {preferences.favorites.length}
                </Badge>
              )}
              {preferences.recentlyViewed.length > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {preferences.recentlyViewed.length}
                </Badge>
              )}
            </div>

            {/* AI Chat Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAIChatOpen(true)}
              className="glass relative"
              title="Chat com IA"
            >
              <MessageSquare className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">IA</span>
            </Button>

            {/* Documentation Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDocumentationOpen(true)}
              className="glass"
              title="Documentação"
            >
              <BookOpen className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Docs</span>
            </Button>

            {/* Comparison Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenComparison}
              className="glass relative"
              title="Comparar ferramentas"
            >
              <BarChart3 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Comparar</span>
              {comparisonCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs">
                  {comparisonCount}
                </Badge>
              )}
            </Button>

            {/* Help Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenHelp}
              className="glass"
              title="Ajuda e atalhos (?)"
            >
              <HelpCircle className="w-4 h-4" />
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
              <input
                type="file"
                accept=".txt"
                onChange={onImportTXT}
                className="hidden"
                id="txt-import"
              />
              
              {/* Import Dropdown */}
              <div className="relative group">
                <Button
                  variant="secondary"
                  size="sm"
                  className="glass button-glow hidden sm:flex"
                  title="Importar"
                >
                  <Upload className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Importar</span>
                </Button>
                <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1 min-w-32">
                    <button
                      onClick={() => document.getElementById('csv-import')?.click()}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Importar CSV
                    </button>
                    <button
                      onClick={() => document.getElementById('txt-import')?.click()}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Importar TXT
                    </button>
                  </div>
                </div>
              </div>

              {/* Export Dropdown */}
              <div className="relative group">
                <Button
                  variant="secondary"
                  size="sm"
                  className="glass button-glow hidden sm:flex"
                  title="Exportar"
                >
                  <Download className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Exportar</span>
                </Button>
                <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1 min-w-32">
                    <button
                      onClick={onExportCSV}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Exportar CSV
                    </button>
                    <button
                      onClick={onExportTXT}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Exportar TXT
                    </button>
                  </div>
                </div>
              </div>
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
              preferences={preferences}
              onToggleFavorite={onToggleFavorite}
              onOpenNotes={onOpenNotes}
              onRating={onRating}
              onAddToComparison={onAddToComparison}
            />
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <ToolList
              tools={tools}
              onEdit={onEditTool}
              onDelete={onDeleteTool}
              onContent={handleContentAction}
              preferences={preferences}
              onToggleFavorite={onToggleFavorite}
              onOpenNotes={onOpenNotes}
              onRating={onRating}
              onAddToComparison={onAddToComparison}
            />
          </div>
        )}
      </div>

      {/* Modais */}
      <AIChat
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        onAddTool={handleAIAddTool}
      />

      <DocumentationModal
        isOpen={isDocumentationOpen}
        onClose={() => setIsDocumentationOpen(false)}
      />
    </main>
  );
};
