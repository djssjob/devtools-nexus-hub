
import { Tool } from '@/types/devtools';
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from '@/hooks/use-toast';

export const useFileOperations = (userId: string | null) => {
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
      description: "Exportação CSV concluída!",
    });
  };

  const handleExportTXT = (tools: Tool[]) => {
    if (tools.length === 0) {
      toast({
        title: "Aviso",
        description: "Nenhuma ferramenta para exportar.",
      });
      return;
    }

    let txtContent = 'DEVTOOLS HUB - LISTA DE FERRAMENTAS\n';
    txtContent += '=====================================\n\n';
    
    tools.forEach((tool, index) => {
      txtContent += `${index + 1}. ${tool.name}\n`;
      txtContent += `   Categoria: ${tool.category}`;
      if (tool.subcategory) txtContent += ` > ${tool.subcategory}`;
      txtContent += '\n';
      txtContent += `   Link: ${tool.link}\n`;
      txtContent += `   Descrição: ${tool.description}\n`;
      if (tool.tags && tool.tags.length > 0) {
        txtContent += `   Tags: ${tool.tags.join(', ')}\n`;
      }
      txtContent += '\n';
    });

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "devtools_list.txt");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Sucesso",
      description: "Exportação TXT concluída!",
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

  const handleImportTXT = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length === 0) {
        toast({
          title: "Erro",
          description: "Arquivo TXT vazio.",
          variant: "destructive",
        });
        return;
      }

      const toolsToImport: any[] = [];
      let currentTool: any = {};
      
      // Parse do formato TXT simples
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip headers and empty lines
        if (!trimmedLine || trimmedLine.includes('===') || trimmedLine.startsWith('DEVTOOLS')) {
          continue;
        }
        
        // New tool entry (numbered)
        if (/^\d+\./.test(trimmedLine)) {
          // Save previous tool if exists
          if (currentTool.name) {
            toolsToImport.push({ ...currentTool });
          }
          
          // Start new tool
          currentTool = {
            name: trimmedLine.replace(/^\d+\.\s*/, '').trim(),
            category: 'Importado',
            subcategory: '',
            link: '',
            description: '',
            tags: []
          };
        }
        // Parse properties
        else if (trimmedLine.startsWith('Categoria:')) {
          const categoryLine = trimmedLine.replace('Categoria:', '').trim();
          const parts = categoryLine.split('>');
          currentTool.category = parts[0].trim();
          if (parts[1]) currentTool.subcategory = parts[1].trim();
        }
        else if (trimmedLine.startsWith('Link:')) {
          currentTool.link = trimmedLine.replace('Link:', '').trim();
        }
        else if (trimmedLine.startsWith('Descrição:')) {
          currentTool.description = trimmedLine.replace('Descrição:', '').trim();
        }
        else if (trimmedLine.startsWith('Tags:')) {
          const tagsString = trimmedLine.replace('Tags:', '').trim();
          currentTool.tags = tagsString.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
        // Handle simple list format (one tool per line)
        else if (!currentTool.name && trimmedLine.length > 0) {
          toolsToImport.push({
            name: trimmedLine,
            category: 'Importado',
            subcategory: '',
            link: '',
            description: `Ferramenta importada: ${trimmedLine}`,
            tags: []
          });
        }
      }
      
      // Add last tool if exists
      if (currentTool.name) {
        toolsToImport.push(currentTool);
      }

      if (toolsToImport.length === 0) {
        toast({
          title: "Erro",
          description: "Nenhuma ferramenta válida encontrada no arquivo TXT.",
          variant: "destructive",
        });
        return;
      }

      if (window.confirm(`${toolsToImport.length} ferramentas encontradas. Deseja importá-las?`)) {
        let successCount = 0;
        for (const tool of toolsToImport) {
          try {
            const toolData = {
              name: tool.name || 'Sem nome',
              category: tool.category || 'Importado',
              subcategory: tool.subcategory || '',
              link: tool.link || '',
              description: tool.description || `Ferramenta importada: ${tool.name}`,
              tags: tool.tags || [],
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
          description: `${successCount} de ${toolsToImport.length} ferramentas importadas do TXT!`,
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return {
    handleExportCSV,
    handleExportTXT,
    handleImportCSV,
    handleImportTXT
  };
};
