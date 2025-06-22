
import { X, Keyboard, Star, Clock, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl/Cmd + K', description: 'Abrir busca' },
    { key: 'Ctrl/Cmd + N', description: 'Adicionar nova ferramenta' },
    { key: 'Ctrl/Cmd + G', description: 'Alternar visualização (grade/lista)' },
    { key: 'Ctrl/Cmd + B', description: 'Alternar sidebar' },
    { key: 'Ctrl/Cmd + E', description: 'Exportar ferramentas' },
    { key: '?', description: 'Mostrar esta ajuda' }
  ];

  const features = [
    {
      icon: Star,
      title: 'Favoritos',
      description: 'Marque ferramentas como favoritas para acesso rápido'
    },
    {
      icon: Clock,
      title: 'Histórico',
      description: 'Veja suas ferramentas visualizadas recentemente'
    },
    {
      icon: FileText,
      title: 'Notas Pessoais',
      description: 'Adicione anotações pessoais para cada ferramenta'
    },
    {
      icon: BarChart3,
      title: 'Comparação',
      description: 'Compare múltiplas ferramentas lado a lado'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Ajuda & Atalhos</h2>
            <p className="text-sm text-muted-foreground">Aprenda a usar todas as funcionalidades</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Keyboard Shortcuts */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Keyboard className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Atalhos de Teclado</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {shortcuts.map(shortcut => (
                <div key={shortcut.key} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">{shortcut.description}</span>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {shortcut.key}
                  </Badge>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Funcionalidades Principais</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {features.map(feature => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-medium">{feature.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Tips */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Dicas de Uso</h3>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm"><strong>💡 Dica:</strong> Use tags específicas para organizar melhor suas ferramentas e facilitar a busca.</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm"><strong>🎯 Produtividade:</strong> Marque suas ferramentas mais usadas como favoritas para acesso rápido.</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-sm"><strong>📝 Organização:</strong> Use as notas pessoais para lembrar configurações específicas ou casos de uso.</p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-sm"><strong>🔍 Comparação:</strong> Use a funcionalidade de comparação para avaliar alternativas antes de escolher uma ferramenta.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
