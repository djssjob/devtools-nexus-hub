
import { Tool } from '@/types/devtools';
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from '@/hooks/use-toast';

export const useCSVOperations = (userId: string | null) => {
  const { addTool } = useFirestore();

  const handleExportCSV = (tools: Tool[]) => {
    if (tools.length === 0) {
      toast({
        title: "Aviso",
        description: "Nenhuma ferramenta para exportar.",
      });
      return;
    }

    const headers = ['name', 'category', 'subcategory', 'link', 'description', 'tags'];
    const escapeCSV = (str: string | undefined | null) => {
      if (!str) return '';
      const result = String(str);
      if (result.includes(',') || result.includes('"') || result.includes('\n')) {
        return '"' + result.replace(/"/g, '""') + '"';
      }
      return result;
    };

    let csvContent = headers.join(',') + '\n';
    tools.forEach(tool => {
      const tagsString = (tool.tags || []).join(';');
      const row = [
        escapeCSV(tool.name),
        escapeCSV(tool.category),
        escapeCSV(tool.subcategory),
        escapeCSV(tool.link),
        escapeCSV(tool.description),
        escapeCSV(tagsString)
      ].join(',');
      csvContent += row + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "devtools_backup.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Sucesso",
      description: "Exportação concluída!",
    });
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
        toast({
          title: "Erro",
          description: "Arquivo CSV vazio ou inválido.",
          variant: "destructive",
        });
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const requiredHeaders = ['name', 'category', 'link', 'description'];
      
      if (!requiredHeaders.every(h => headers.includes(h))) {
        toast({
          title: "Erro",
          description: "Cabeçalhos do CSV inválidos. Faltando colunas obrigatórias.",
          variant: "destructive",
        });
        return;
      }

      const toolsToImport: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const tool: any = {};
        headers.forEach((header, index) => {
          tool[header] = values[index] ? values[index].trim().replace(/^"|"$/g, '').replace(/""/g, '"') : '';
        });
        toolsToImport.push(tool);
      }

      if (window.confirm(`${toolsToImport.length} ferramentas encontradas. Deseja importá-las?`)) {
        let successCount = 0;
        for (const tool of toolsToImport) {
          try {
            const toolData = {
              name: tool.name || 'Sem nome',
              category: tool.category || 'Sem categoria',
              subcategory: tool.subcategory || '',
              link: tool.link || '',
              description: tool.description || '',
              tags: tool.tags ? tool.tags.split(';').map((t: string) => t.trim()).filter(Boolean) : [],
              createdBy: userId!,
              createdAt: new Date().toISOString(),
              lastUpdatedBy: userId!,
              lastUpdatedAt: new Date().toISOString()
            };
            await addTool(toolData);
            successCount++;
          } catch (err) {
            console.error("Erro ao importar ferramenta:", tool.name, err);
          }
        }
        toast({
          title: "Sucesso",
          description: `${successCount} de ${toolsToImport.length} ferramentas importadas!`,
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return {
    handleExportCSV,
    handleImportCSV
  };
};
