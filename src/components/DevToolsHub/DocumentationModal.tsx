
import { BookOpen, Search, FileText, Download, Upload, Keyboard, Star, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal = ({ isOpen, onClose }: DocumentationModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'getting-started',
      title: 'Primeiros Passos',
      icon: <BookOpen className="w-5 h-5" />,
      content: [
        {
          title: 'Bem-vindo ao DevTools Hub',
          content: 'O DevTools Hub é sua plataforma central para organizar e descobrir ferramentas de desenvolvimento. Aqui você pode adicionar, categorizar e avaliar suas ferramentas favoritas.'
        },
        {
          title: 'Adicionando sua primeira ferramenta',
          content: 'Clique no botão "Adicionar" no canto superior direito ou use o atalho Ctrl+N. Preencha o nome da ferramenta e clique em "Gerar" para que a IA complete automaticamente as informações.'
        },
        {
          title: 'Organizando com categorias e tags',
          content: 'Use categorias para agrupar ferramentas similares (ex: Frontend, Backend, DevOps) e tags para facilitar a busca (ex: javascript, api, testing).'
        }
      ]
    },
    {
      id: 'features',
      title: 'Funcionalidades',
      icon: <Star className="w-5 h-5" />,
      content: [
        {
          title: 'Sistema de Favoritos',
          content: 'Clique na estrela ao lado do nome da ferramenta para adicioná-la aos seus favoritos. Use o filtro "Apenas Favoritos" na barra lateral para visualizar rapidamente suas ferramentas preferidas.'
        },
        {
          title: 'Avaliações e Notas',
          content: 'Avalie ferramentas de 1 a 5 estrelas e adicione notas pessoais. Suas avaliações ajudam a lembrar da qualidade e utilidade de cada ferramenta.'
        },
        {
          title: 'Comparação de Ferramentas',
          content: 'Use o botão "+" para adicionar ferramentas à comparação (máximo 4). Compare características, links e descrições lado a lado.'
        },
        {
          title: 'Chat com IA',
          content: 'Use o assistente de IA para descobrir novas ferramentas. Descreva o que você precisa e receba sugestões personalizadas com a opção de adicionar diretamente ao seu hub.'
        }
      ]
    },
    {
      id: 'import-export',
      title: 'Importar/Exportar',
      icon: <FileText className="w-5 h-5" />,
      content: [
        {
          title: 'Formatos Suportados',
          content: 'O DevTools Hub suporta importação e exportação em formato CSV e TXT. Use CSV para dados estruturados e TXT para listas simples.'
        },
        {
          title: 'Importando do CSV',
          content: 'Formato: name,category,subcategory,link,description,tags\nCertifique-se que as colunas obrigatórias (name, category, link, description) estejam presentes.'
        },
        {
          title: 'Importando do TXT',
          content: 'Suporta dois formatos:\n1. Lista simples: uma ferramenta por linha\n2. Formato estruturado com numeração e propriedades (Categoria:, Link:, etc.)'
        },
        {
          title: 'Exemplo de TXT estruturado',
          content: '1. Nome da Ferramenta\n   Categoria: Frontend > React\n   Link: https://exemplo.com\n   Descrição: Descrição da ferramenta\n   Tags: react, javascript, frontend'
        }
      ]
    },
    {
      id: 'shortcuts',
      title: 'Atalhos de Teclado',
      icon: <Keyboard className="w-5 h-5" />,
      content: [
        {
          title: 'Atalhos Globais',
          content: 'Ctrl+N: Adicionar nova ferramenta\nCtrl+F: Focar na busca\nCtrl+E: Exportar ferramentas\nCtrl+/: Abrir ajuda\nCtrl+\\: Alternar barra lateral\nTab: Alternar visualização (grade/lista)'
        },
        {
          title: 'Navegação',
          content: 'Use Tab para navegar entre elementos\nEnter para confirmar ações\nEsc para fechar modais\nSetas para navegar em listas'
        }
      ]
    }
  ];

  const filteredSections = sections.map(section => ({
    ...section,
    content: section.content.filter(item => 
      searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.content.length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            Documentação e Guia de Uso
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar na documentação..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Content */}
          <Tabs defaultValue="getting-started" className="flex-1">
            <TabsList className="grid w-full grid-cols-4 bg-gray-700">
              {sections.map(section => (
                <TabsTrigger 
                  key={section.id} 
                  value={section.id}
                  className="flex items-center gap-2 text-sm data-[state=active]:bg-gray-600"
                >
                  {section.icon}
                  <span className="hidden sm:inline">{section.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {filteredSections.map(section => (
              <TabsContent key={section.id} value={section.id} className="flex-1">
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-4 pr-4">
                    {section.content.map((item, index) => (
                      <Card key={index} className="bg-gray-700 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-lg text-white">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                            {item.content}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {section.content.length === 0 && searchQuery && (
                      <div className="text-center py-8">
                        <p className="text-gray-400">Nenhum resultado encontrado para "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>

          {/* Quick Actions */}
          <div className="mt-4 pt-4 border-t border-gray-600">
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="gap-1">
                <Keyboard className="w-3 h-3" />
                Ctrl+N para adicionar
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Search className="w-3 h-3" />
                Ctrl+F para buscar
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Download className="w-3 h-3" />
                Ctrl+E para exportar
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <MessageSquare className="w-3 h-3" />
                Chat IA disponível
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
