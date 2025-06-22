
import { useState } from 'react';
import { Tool } from '@/types/devtools';
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from '@/hooks/use-toast';

export const useToolOperations = (userId: string | null) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const { addTool, updateTool, deleteTool } = useFirestore();

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

  return {
    isModalOpen,
    setIsModalOpen,
    editingTool,
    handleAddTool,
    handleEditTool,
    handleDeleteTool,
    handleSaveTool
  };
};
