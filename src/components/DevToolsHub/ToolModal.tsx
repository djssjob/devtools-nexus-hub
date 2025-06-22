
import { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Tool } from '@/types/devtools';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tool: Omit<Tool, 'id' | 'createdAt' | 'createdBy' | 'lastUpdatedAt' | 'lastUpdatedBy'>) => void;
  tool?: Tool | null;
}

export const ToolModal = ({ isOpen, onClose, onSave, tool }: ToolModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    link: '',
    description: ''
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name,
        category: tool.category,
        subcategory: tool.subcategory || '',
        link: tool.link,
        description: tool.description
      });
      setTags(tool.tags || []);
    } else {
      setFormData({
        name: '',
        category: '',
        subcategory: '',
        link: '',
        description: ''
      });
      setTags([]);
    }
    setTagInput('');
  }, [tool, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags
    });
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
      setTagInput('');
    }
  };

  const generateAIData = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Insira o nome da ferramenta primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI response
      const mockData = {
        category: 'DevOps',
        subcategory: 'Containerização',
        link: `https://${formData.name.toLowerCase().replace(/\s+/g, '')}.com`,
        description: `${formData.name} é uma ferramenta poderosa para desenvolvimento e DevOps que oferece recursos avançados para aumentar a produtividade da equipe.`,
        tags: ['devops', 'automation', 'ci/cd', 'development']
      };

      setFormData(prev => ({
        ...prev,
        category: mockData.category,
        subcategory: mockData.subcategory,
        link: mockData.link,
        description: mockData.description
      }));
      setTags(mockData.tags);

      toast({
        title: "Sucesso",
        description: "Dados gerados com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao gerar dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            {tool ? 'Editar Ferramenta' : 'Adicionar Nova Ferramenta'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-300">Nome da Ferramenta</Label>
            <div className="flex gap-2">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Digite o nome e clique em 'Gerar Dados'"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
              <Button
                type="button"
                onClick={generateAIData}
                disabled={isGenerating}
                className="bg-teal-500 hover:bg-teal-600 flex-shrink-0"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isGenerating ? 'Gerando...' : 'Gerar'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-gray-300">Categoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Gerado por IA..."
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="subcategory" className="text-gray-300">Subcategoria</Label>
              <Input
                id="subcategory"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                placeholder="Gerado por IA..."
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tags" className="text-gray-300">Tags</Label>
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-2 flex items-center flex-wrap gap-2 focus-within:ring-2 focus-within:ring-indigo-500">
              {tags.map(tag => (
                <Badge key={tag} variant="default" className="bg-indigo-500 text-white">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:bg-indigo-400 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Adicione tags e tecle Enter..."
                className="border-none bg-transparent flex-1 focus:outline-none focus:ring-0 min-w-32"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="link" className="text-gray-300">Website / Link Oficial</Label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="Gerado por IA..."
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Gerado por IA..."
              className="bg-gray-700 border-gray-600 text-white min-h-24"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Salvar Ferramenta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
