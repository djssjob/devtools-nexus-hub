
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

  const getCategoryColor = (category: string) => {
    const colors = {
      'Frontend': 'from-blue-500 to-cyan-500',
      'Backend': 'from-green-500 to-emerald-500', 
      'Database': 'from-purple-500 to-pink-500',
      'DevOps': 'from-orange-500 to-red-500',
      'Design': 'from-pink-500 to-rose-500',
      'Testing': 'from-yellow-500 to-amber-500',
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="responsive-grid">
      {sortedTools.map((tool, index) => (
        <Card 
          key={tool.id} 
          className="glass card-hover group animate-fade-in-scale border-0 overflow-hidden"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Header com gradiente da categoria */}
          <div className={`h-2 bg-gradient-to-r ${getCategoryColor(tool.category)}`} />
          
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-foreground group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent smooth-transition">
                {tool.name}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary hover:scale-110 smooth-transition"
                asChild
              >
                <a href={tool.link} target="_blank" rel="noopener noreferrer" title="Visitar site">
                  <ExternalLink className="w-5 h-5" />
                </a>
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="default" 
                className={`bg-gradient-to-r ${getCategoryColor(tool.category)} text-white border-0`}
              >
                {tool.category}
              </Badge>
              {tool.subcategory && (
                <Badge variant="secondary" className="glass">
                  {tool.subcategory}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm line-clamp-4 group-hover:text-foreground smooth-transition">
              {tool.description}
            </p>
            
            <div className="flex flex-wrap gap-1">
              {tool.tags?.slice(0, 4).map((tag, tagIndex) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs hover:scale-105 smooth-transition cursor-pointer animate-fade-in-scale"
                  style={{ animationDelay: `${(index * 0.1) + (tagIndex * 0.05)}s` }}
                >
                  #{tag}
                </Badge>
              ))}
              {tool.tags && tool.tags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{tool.tags.length - 4}
                </Badge>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onContent(tool.id)}
                className="text-muted-foreground hover:text-green-500 hover:scale-105 smooth-transition button-glow"
                title="Ver Conteúdo"
              >
                <BookOpen className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(tool)}
                className="text-muted-foreground hover:text-blue-500 hover:scale-105 smooth-transition button-glow"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(tool.id)}
                className="text-muted-foreground hover:text-red-500 hover:scale-105 smooth-transition button-glow"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
