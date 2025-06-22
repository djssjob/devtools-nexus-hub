
import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Tool } from '@/types/devtools';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ToolNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool | null;
  currentNote: string;
  onSaveNote: (note: string) => void;
}

export const ToolNotesModal = ({
  isOpen,
  onClose,
  tool,
  currentNote,
  onSaveNote
}: ToolNotesModalProps) => {
  const [note, setNote] = useState(currentNote);

  useEffect(() => {
    setNote(currentNote);
  }, [currentNote]);

  if (!isOpen || !tool) return null;

  const handleSave = () => {
    onSaveNote(note);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">{tool.name}</h2>
            <p className="text-sm text-muted-foreground">Adicionar/editar notas</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="mb-4">
            <h3 className="font-medium mb-2">Sobre a ferramenta:</h3>
            <p className="text-sm text-muted-foreground mb-2">{tool.description}</p>
            <p className="text-xs text-muted-foreground">
              Categoria: {tool.category} {tool.subcategory && `• ${tool.subcategory}`}
            </p>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="font-medium">Suas notas:</span>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Adicione suas anotações pessoais sobre esta ferramenta..."
                rows={8}
                className="mt-2"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Nota
          </Button>
        </div>
      </div>
    </div>
  );
};
