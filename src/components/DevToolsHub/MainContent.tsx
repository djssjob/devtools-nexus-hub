
import { useState } from 'react';
import { Plus, Grid3X3, List, ChevronLeft, ChevronRight, Upload, Download } from 'lucide-react';
import { Tool } from '@/types/devtools';
import { Button } from '@/components/ui/button';
import { ToolGrid } from './ToolGrid';
import { ToolList } from './ToolList';

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
  isSidebarCollapsed
}: MainContentProps) => {
  const handleContentAction = (id: string) => {
    // Placeholder for content action
    console.log(`Content action for tool: ${id}`);
  };

  return (
    <main className="flex-1 p-6 md:p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="bg-gray-800/50 hover:bg-gray-700/70"
            title={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
          <div>
            <h2 className="text-3xl font-bold">Base de Ferramentas</h2>
            <p className="text-gray-400">
              Mostrando {tools.length} de {totalTools} ferramentas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
            <Button
              variant={currentView === 'grid' ? "default" : "ghost"}
              size="icon"
              onClick={() => onViewChange('grid')}
              title="Visualização em Grade"
            >
              <Grid3X3 />
            </Button>
            <Button
              variant={currentView === 'list' ? "default" : "ghost"}
              size="icon"
              onClick={() => onViewChange('list')}
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
              onClick={() => document.getElementById('csv-import')?.click()}
              title="Importar de CSV"
            >
              <Upload className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              onClick={onExportCSV}
              title="Exportar para CSV"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>

          <Button onClick={onAddTool} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      {/* Content */}
      {tools.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl text-gray-500 mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
          <p className="text-gray-400">Tente ajustar seus filtros ou busca.</p>
        </div>
      ) : currentView === 'grid' ? (
        <ToolGrid
          tools={tools}
          onEdit={onEditTool}
          onDelete={onDeleteTool}
          onContent={handleContentAction}
        />
      ) : (
        <ToolList
          tools={tools}
          onEdit={onEditTool}
          onDelete={onDeleteTool}
          onContent={handleContentAction}
        />
      )}
    </main>
  );
};
