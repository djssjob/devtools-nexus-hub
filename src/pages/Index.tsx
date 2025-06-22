import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/DevToolsHub/Sidebar';
import { MainContent } from '@/components/DevToolsHub/MainContent';
import { ToolModal } from '@/components/DevToolsHub/ToolModal';
import { useFirestore } from '@/hooks/useFirestore';
import { useAuth } from '@/hooks/useAuth';
import { Tool, FilterState } from '@/types/devtools';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return window.innerWidth < 768;
  });
  const [filters, setFilters] = useState<FilterState>({
    text: '',
    category: null,
    tags: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const { user, userId } = useAuth();
  const { addTool, updateTool, deleteTool, tools: firestoreTools } = useFirestore();

  useEffect(() => {
    if (firestoreTools) {
      setTools(firestoreTools);
      setIsLoading(false);
    }
  }, [firestoreTools]);

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

  const handleAddTool = () => {
    setEditingTool(null);
    setIsModalOpen(true);
  };

  const handleEditTool = (tool: Tool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  };

  const handleDeleteTool = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta ferramenta?')) {
      try {
        await deleteTool(id);
        toast({
          title: "Sucesso",
          description: "Ferramenta excluída com sucesso!",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir ferramenta.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveTool = async (toolData: Omit<Tool, 'id' | 'createdAt' | 'createdBy' | 'lastUpdatedAt' | 'lastUpdatedBy'>) => {
    try {
      if (editingTool) {
        await updateTool(editingTool.id, {
          ...toolData,
          lastUpdatedBy: userId!,
          lastUpdatedAt: new Date().toISOString()
        });
        toast({
          title: "Sucesso",
          description: "Ferramenta atualizada com sucesso!",
        });
      } else {
        await addTool({
          ...toolData,
          createdBy: userId!,
          createdAt: new Date().toISOString(),
          lastUpdatedBy: userId!,
          lastUpdatedAt: new Date().toISOString()
        });
        toast({
          title: "Sucesso",
          description: "Ferramenta adicionada com sucesso!",
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar ferramenta.",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    if (tools.length === 0) {
      toast({
        title: "Aviso",
        description: "Nenhuma ferramenta para exportar.",
      });
      return;
    }

    const headers = ['name', 'category', 'subcategory', 'link', 'description', 'tags'];
    const escapeCSV = (str: string | undefined | null) => {
      if (!str) return '';
      const result = String(str);
      if (result.includes(',') || result.includes('"') || result.includes('\n')) {
        return '"' + result.replace(/"/g, '""') + '"';
      }
      return result;
    };

    let csvContent = headers.join(',') + '\n';
    tools.forEach(tool => {
      const tagsString = (tool.tags || []).join(';');
      const row = [
        escapeCSV(tool.name),
        escapeCSV(tool.category),
        escapeCSV(tool.subcategory),
        escapeCSV(tool.link),
        escapeCSV(tool.description),
        escapeCSV(tagsString)
      ].join(',');
      csvContent += row + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "devtools_backup.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Sucesso",
      description: "Exportação concluída!",
    });
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
        toast({
          title: "Erro",
          description: "Arquivo CSV vazio ou inválido.",
          variant: "destructive",
        });
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const requiredHeaders = ['name', 'category', 'link', 'description'];
      
      if (!requiredHeaders.every(h => headers.includes(h))) {
        toast({
          title: "Erro",
          description: "Cabeçalhos do CSV inválidos. Faltando colunas obrigatórias.",
          variant: "destructive",
        });
        return;
      }

      const toolsToImport: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const tool: any = {};
        headers.forEach((header, index) => {
          tool[header] = values[index] ? values[index].trim().replace(/^"|"$/g, '').replace(/""/g, '"') : '';
        });
        toolsToImport.push(tool);
      }

      if (window.confirm(`${toolsToImport.length} ferramentas encontradas. Deseja importá-las?`)) {
        let successCount = 0;
        for (const tool of toolsToImport) {
          try {
            const toolData = {
              name: tool.name || 'Sem nome',
              category: tool.category || 'Sem categoria',
              subcategory: tool.subcategory || '',
              link: tool.link || '',
              description: tool.description || '',
              tags: tool.tags ? tool.tags.split(';').map((t: string) => t.trim()).filter(Boolean) : [],
              createdBy: userId!,
              createdAt: new Date().toISOString(),
              lastUpdatedBy: userId!,
              lastUpdatedAt: new Date().toISOString()
            };
            await addTool(toolData);
            successCount++;
          } catch (err) {
            console.error("Erro ao importar ferramenta:", tool.name, err);
          }
        }
        toast({
          title: "Sucesso",
          description: `${successCount} de ${toolsToImport.length} ferramentas importadas!`,
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
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
      />
      
      <MainContent
        tools={filteredTools}
        totalTools={tools.length}
        currentView={currentView}
        onViewChange={setCurrentView}
        onAddTool={handleAddTool}
        onEditTool={handleEditTool}
        onDeleteTool={handleDeleteTool}
        onExportCSV={handleExportCSV}
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
