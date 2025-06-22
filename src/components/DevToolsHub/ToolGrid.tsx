
import { ExternalLink, Edit, Trash2, BookOpen } from 'lucide-react';
import { Tool } from '@/types/devtools';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ToolGridProps {
  tools: Tool[];
  onEdit: (tool: Tool) => void;
  onDelete: (id: string) => void;
  onContent: (id: string) => void;
}

export const ToolGrid = ({ tools, onEdit, onDelete, onContent }: ToolGridProps) => {
  const sortedTools = tools.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {sortedTools.map(tool => (
        <Card key={tool.id} className="bg-gray-800/80 border-gray-700/50 hover:border-indigo-500/80 transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-white">{tool.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-indigo-400"
                asChild
              >
                <a href={tool.link} target="_blank" rel="noopener noreferrer" title="Visitar site">
                  <ExternalLink className="w-5 h-5" />
                </a>
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="bg-indigo-500/20 text-indigo-300">
                {tool.category}
              </Badge>
              {tool.subcategory && (
                <Badge variant="secondary" className="bg-sky-500/20 text-sky-300">
                  {tool.subcategory}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-gray-400 text-sm line-clamp-4">{tool.description}</p>
            
            <div className="flex flex-wrap gap-1">
              {tool.tags?.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onContent(tool.id)}
                className="text-gray-400 hover:text-green-400"
              >
                <BookOpen className="w-4 h-4 mr-1" />
                Conteúdo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(tool)}
                className="text-gray-400 hover:text-blue-400"
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(tool.id)}
                className="text-gray-400 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
