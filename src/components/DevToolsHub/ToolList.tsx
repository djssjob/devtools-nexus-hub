
import { ExternalLink, Edit, Trash2, BookOpen } from 'lucide-react';
import { Tool } from '@/types/devtools';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ToolListProps {
  tools: Tool[];
  onEdit: (tool: Tool) => void;
  onDelete: (id: string) => void;
  onContent: (id: string) => void;
}

export const ToolList = ({ tools, onEdit, onDelete, onContent }: ToolListProps) => {
  const sortedTools = tools.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-gray-800/50 rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-700">
            <TableHead className="text-gray-400">Nome</TableHead>
            <TableHead className="text-gray-400">Categoria / Subcategoria</TableHead>
            <TableHead className="text-gray-400">Tags</TableHead>
            <TableHead className="text-gray-400">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTools.map(tool => (
            <TableRow key={tool.id} className="border-b border-gray-700 hover:bg-gray-700/50">
              <TableCell className="font-bold text-white">{tool.name}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-gray-300">{tool.category}</span>
                  {tool.subcategory && (
                    <span className="text-gray-500 text-sm">{tool.subcategory}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {tool.tags?.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onContent(tool.id)}
                    className="text-gray-300 hover:text-green-400"
                    title="Ver Conteúdo"
                  >
                    <BookOpen className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(tool)}
                    className="text-gray-300 hover:text-blue-400"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(tool.id)}
                    className="text-gray-300 hover:text-red-400"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="text-gray-300 hover:text-indigo-400"
                    title="Visitar site"
                  >
                    <a href={tool.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
