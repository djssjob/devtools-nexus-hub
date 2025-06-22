
import { useState } from 'react';
import { MessageSquare, Send, Sparkles, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestedTools?: {
    name: string;
    category: string;
    subcategory?: string;
    link: string;
    description: string;
    tags: string[];
  }[];
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTool: (toolData: any) => void;
}

export const AIChat = ({ isOpen, onClose, onAddTool }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Olá! Sou seu assistente de IA para ferramentas de desenvolvimento. Posso ajudar você a encontrar e adicionar novas ferramentas ao seu hub. Experimente perguntar algo como:\n\n• "Preciso de uma ferramenta para testar APIs"\n• "Ferramentas para design de interfaces"\n• "Bibliotecas JavaScript para animações"\n• "Adicionar Docker"',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const mockAIResponse = async (userMessage: string): Promise<{ content: string; suggestedTools?: any[] }> => {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Respostas específicas baseadas em palavras-chave
    if (lowerMessage.includes('api') || lowerMessage.includes('teste')) {
      return {
        content: 'Encontrei algumas excelentes ferramentas para teste de APIs! Aqui estão as principais recomendações:',
        suggestedTools: [
          {
            name: 'Postman',
            category: 'API Testing',
            subcategory: 'HTTP Client',
            link: 'https://postman.com',
            description: 'Plataforma colaborativa para desenvolvimento de API que simplifica cada etapa do ciclo de vida da API.',
            tags: ['api', 'testing', 'http', 'client']
          },
          {
            name: 'Insomnia',
            category: 'API Testing',
            subcategory: 'REST Client',
            link: 'https://insomnia.rest',
            description: 'Cliente REST moderno e intuitivo com interface limpa para testar APIs.',
            tags: ['api', 'rest', 'testing', 'client']
          }
        ]
      };
    }
    
    if (lowerMessage.includes('design') || lowerMessage.includes('interface') || lowerMessage.includes('ui')) {
      return {
        content: 'Aqui estão algumas ferramentas incríveis para design de interfaces:',
        suggestedTools: [
          {
            name: 'Figma',
            category: 'Design',
            subcategory: 'UI/UX Design',
            link: 'https://figma.com',
            description: 'Ferramenta de design colaborativo baseada na web para criar interfaces e protótipos.',
            tags: ['design', 'ui', 'ux', 'prototyping', 'collaborative']
          },
          {
            name: 'Sketch',
            category: 'Design',
            subcategory: 'UI Design',
            link: 'https://sketch.com',
            description: 'Ferramenta de design vetorial focada em design de interfaces para Mac.',
            tags: ['design', 'ui', 'vector', 'mac']
          }
        ]
      };
    }
    
    if (lowerMessage.includes('docker')) {
      return {
        content: 'Docker é uma excelente escolha para containerização! Vou adicionar à sua lista:',
        suggestedTools: [
          {
            name: 'Docker',
            category: 'DevOps',
            subcategory: 'Containerização',
            link: 'https://docker.com',
            description: 'Plataforma de containerização que permite empacotar aplicações e suas dependências em containers leves.',
            tags: ['docker', 'containers', 'devops', 'deployment']
          }
        ]
      };
    }
    
    if (lowerMessage.includes('javascript') || lowerMessage.includes('js') || lowerMessage.includes('animação')) {
      return {
        content: 'Encontrei algumas bibliotecas JavaScript populares para animações:',
        suggestedTools: [
          {
            name: 'Framer Motion',
            category: 'Frontend',
            subcategory: 'Animation Library',
            link: 'https://framer.com/motion',
            description: 'Biblioteca de animação para React com API simples e poderosa.',
            tags: ['react', 'animation', 'javascript', 'motion']
          },
          {
            name: 'GSAP',
            category: 'Frontend',
            subcategory: 'Animation Library',
            link: 'https://greensock.com/gsap',
            description: 'Biblioteca de animação JavaScript de alta performance para web.',
            tags: ['javascript', 'animation', 'performance', 'web']
          }
        ]
      };
    }
    
    // Resposta genérica
    return {
      content: `Interessante pergunta sobre "${userMessage}"! Baseado no que você mencionou, posso sugerir algumas ferramentas relacionadas. Para resultados mais específicos, tente ser mais detalhado sobre o que você precisa. Por exemplo:\n\n• Que tipo de projeto você está desenvolvendo?\n• Qual linguagem ou framework você usa?\n• Que problema específico precisa resolver?`,
      suggestedTools: []
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await mockAIResponse(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.content,
        timestamp: new Date(),
        suggestedTools: response.suggestedTools
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuggestedTool = (tool: any) => {
    onAddTool(tool);
    toast({
      title: "Ferramenta Adicionada",
      description: `${tool.name} foi adicionada com sucesso!`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            Chat IA - Assistente de Ferramentas
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 bg-gray-900/50 rounded-lg mb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-100'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {/* Suggested Tools */}
                    {message.suggestedTools && message.suggestedTools.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {message.suggestedTools.map((tool, index) => (
                          <Card key={index} className="bg-gray-800 border-gray-600">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg text-white">{tool.name}</CardTitle>
                                  <p className="text-sm text-gray-400">
                                    {tool.category} {tool.subcategory && `> ${tool.subcategory}`}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleAddSuggestedTool(tool)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Adicionar
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <p className="text-sm text-gray-300 mb-2">{tool.description}</p>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {tool.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <a 
                                href={tool.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm"
                              >
                                {tool.link}
                              </a>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-100 rounded-lg p-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="ml-2">Pensando...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Descreva que tipo de ferramenta você precisa..."
              className="bg-gray-700 border-gray-600 text-white flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
