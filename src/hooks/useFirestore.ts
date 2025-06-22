
import { useState, useEffect } from 'react';
import { Tool } from '@/types/devtools';

export const useFirestore = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockTools: Tool[] = [
      {
        id: '1',
        name: 'Docker',
        category: 'DevOps',
        subcategory: 'Containerização',
        link: 'https://docker.com',
        description: 'Plataforma de containerização que permite empacotar aplicações e suas dependências em containers leves e portáteis.',
        tags: ['containers', 'devops', 'deployment'],
        createdBy: 'user_1',
        createdAt: '2024-01-01T00:00:00Z',
        lastUpdatedBy: 'user_1',
        lastUpdatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'VS Code',
        category: 'Editor',
        subcategory: 'IDE',
        link: 'https://code.visualstudio.com',
        description: 'Editor de código-fonte gratuito e de código aberto desenvolvido pela Microsoft com suporte para debugging, controle Git integrado e extensões.',
        tags: ['editor', 'ide', 'microsoft', 'typescript'],
        createdBy: 'user_1',
        createdAt: '2024-01-01T00:00:00Z',
        lastUpdatedBy: 'user_1',
        lastUpdatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '3',
        name: 'Postman',
        category: 'API Testing',
        subcategory: 'HTTP Client',
        link: 'https://postman.com',
        description: 'Plataforma colaborativa para desenvolvimento de API que simplifica cada etapa do ciclo de vida da API e agiliza a colaboração.',
        tags: ['api', 'testing', 'http', 'client'],
        createdBy: 'user_1',
        createdAt: '2024-01-01T00:00:00Z',
        lastUpdatedBy: 'user_1',
        lastUpdatedAt: '2024-01-01T00:00:00Z'
      }
    ];

    setTimeout(() => {
      setTools(mockTools);
      setIsLoading(false);
    }, 500);
  }, []);

  const addTool = async (toolData: Omit<Tool, 'id'>) => {
    const newTool: Tool = {
      ...toolData,
      id: `tool_${Date.now()}`
    };
    setTools(prev => [...prev, newTool]);
  };

  const updateTool = async (id: string, updates: Partial<Tool>) => {
    setTools(prev => prev.map(tool => 
      tool.id === id ? { ...tool, ...updates } : tool
    ));
  };

  const deleteTool = async (id: string) => {
    setTools(prev => prev.filter(tool => tool.id !== id));
  };

  return {
    tools,
    isLoading,
    addTool,
    updateTool,
    deleteTool
  };
};
