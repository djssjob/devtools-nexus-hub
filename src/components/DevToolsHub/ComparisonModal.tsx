
import { useState } from 'react';
import { X, Plus, Minus, ExternalLink } from 'lucide-react';
import { Tool } from '@/types/devtools';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTools: Tool[];
  allTools: Tool[];
  onAddTool: (tool: Tool) => void;
  onRemoveTool: (toolId: string) => void;
}

export const ComparisonModal = ({
  isOpen,
  onClose,
  selectedTools,
  allTools,
  onAddTool,
  onRemoveTool
}: ComparisonModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const availableTools = allTools.filter(
    tool => !selectedTools.find(selected => selected.id === tool.id)
  );

  const filteredAvailableTools = availableTools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Comparar Ferramentas</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Tools Selection Sidebar */}
          <div className="w-80 border-r p-4 flex flex-col">
            <h3 className="font-semibold mb-4">Adicionar Ferramentas</h3>
            
            <input
              type="text"
              placeholder="Buscar ferramentas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />

            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredAvailableTools.map(tool => (
                <div
                  key={tool.id}
                  className="flex items-center justify-between p-2 border rounded hover:bg-muted cursor-pointer"
                  onClick={() => onAddTool(tool)}
                >
                  <div>
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-sm text-muted-foreground">{tool.category}</div>
                  </div>
                  <Plus className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedTools.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">Nenhuma ferramenta selecionada</h3>
                <p className="text-muted-foreground">Selecione ferramentas na barra lateral para comparar.</p>
              </div>
            ) : (
              <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedTools.length}, 1fr)` }}>
                {selectedTools.map(tool => (
                  <Card key={tool.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveTool(tool.id)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-1">Categoria</h4>
                        <p className="text-sm text-muted-foreground">{tool.category}</p>
                        {tool.subcategory && (
                          <p className="text-xs text-muted-foreground">{tool.subcategory}</p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium mb-1">Descrição</h4>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </div>

                      {tool.tags && tool.tags.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-1">
                            {tool.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button asChild className="w-full">
                        <a href={tool.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visitar Site
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
